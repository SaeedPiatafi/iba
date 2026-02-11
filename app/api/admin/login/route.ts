import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
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
    
    const { email, password } = await request.json();
    console.log('📧 Login attempt for:', email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Supabase sign-in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password.trim(),
    });

    if (authError) {
      console.log('❌ Auth error:', authError.message);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
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

    // Get environment
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = process.env.VERCEL_ENV === 'production';
    
    // IMPORTANT: For Vercel deployments, we need to handle domains differently
    const requestOrigin = request.headers.get('origin') || '';
    const isVercelDeployment = requestOrigin.includes('vercel.app');
    
    console.log('🌍 Environment:', {
      isProduction,
      isVercel,
      requestOrigin,
      isVercelDeployment
    });

    // Set cookies - VERCEL SPECIFIC FIX
    const cookieOptions: any = {
      httpOnly: true,
      secure: true, // Always secure in production
      sameSite: 'lax',
      path: '/',
      maxAge: authData.session.expires_in,
    };

    // For Vercel deployments, don't set domain
    if (isVercelDeployment) {
      // Vercel doesn't allow .vercel.app domain cookies
      cookieOptions.domain = undefined;
    } else if (isProduction) {
      // For custom domains in production
      cookieOptions.domain = `.${new URL(requestOrigin).hostname}`;
    }

    // Set access token cookie
    response.cookies.set({
      name: 'sb-access-token',
      value: authData.session.access_token,
      ...cookieOptions
    });

    // Set refresh token cookie
    response.cookies.set({
      name: 'sb-refresh-token',
      value: authData.session.refresh_token,
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Client-readable cookie
    response.cookies.set({
      name: 'admin-authenticated',
      value: 'true',
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: authData.session.expires_in,
      domain: isVercelDeployment ? undefined : (isProduction ? `.${new URL(requestOrigin).hostname}` : undefined),
    });

    console.log('✅ Login completed successfully');
    return response;

  } catch (error: any) {
    console.error('🔥 Login error:', error.message);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}