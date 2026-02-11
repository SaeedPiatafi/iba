// app/api/admin/login/route.ts - UPDATED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Admin login attempt');
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔗 Supabase URL exists:', !!supabaseUrl);
    console.log('🔑 Supabase Key exists:', !!supabaseAnonKey);
    
    const { email, password } = await request.json();
    console.log('📧 Login attempt for:', email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('🔑 Attempting Supabase sign-in...');
    
    // Supabase sign-in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password.trim(),
    });

    if (authError) {
      console.log('❌ Auth error:', authError.message);
      
      // More specific error messages
      if (authError.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      if (authError.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { success: false, error: 'Please confirm your email first' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 401 }
      );
    }

    if (!authData.user || !authData.session) {
      console.log('❌ No user or session');
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', authData.user.id);
    console.log('📝 Session token:', authData.session.access_token.substring(0, 20) + '...');

    // Check admin profile
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError || !adminProfile) {
      console.log('❌ Admin profile error:', profileError?.message);
      return NextResponse.json(
        { success: false, error: 'Unauthorized access - Not an admin' },
        { status: 403 }
      );
    }

    if (!adminProfile.is_active) {
      return NextResponse.json(
        { success: false, error: 'Account is disabled' },
        { status: 403 }
      );
    }

    console.log('✅ Admin authorized:', adminProfile.name);

    // Update last login
    await supabaseAdmin
      .from('admin_profiles')
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', adminProfile.id);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: adminProfile.name,
        role: adminProfile.role,
      },
    });

    // Get domain for cookies
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction ? '.iba-steel.vercel.app' : 'localhost';
    
    console.log('🍪 Setting cookies for domain:', domain);
    console.log('🔒 Production mode:', isProduction);

    // Set cookies with proper domain
    response.cookies.set({
      name: 'sb-access-token',
      value: authData.session.access_token,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: authData.session.expires_in,
      domain: isProduction ? domain : undefined,
    });

    response.cookies.set({
      name: 'sb-refresh-token',
      value: authData.session.refresh_token,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      domain: isProduction ? domain : undefined,
    });

    // Client-readable cookie
    response.cookies.set({
      name: 'admin-authenticated',
      value: 'true',
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: authData.session.expires_in,
      domain: isProduction ? domain : undefined,
    });

    console.log('✅ Login completed successfully');
    return response;

  } catch (error: any) {
    console.error('🔥 Login error:', error.message);
    console.error('🔥 Full error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}