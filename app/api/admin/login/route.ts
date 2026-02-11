// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// Helper function to get Supabase admin client with null check
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
  return supabaseAdmin;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Admin login attempt');
    
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('🔑 Attempting Supabase sign-in for:', email.toLowerCase().trim());
    
    // Supabase sign-in
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim(),
      });

    if (authError) {
      console.log('❌ Supabase auth error:', authError.message);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!authData.user || !authData.session) {
      console.log('❌ No user or session returned');
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = authData.user;
    const session = authData.session;

    console.log('✅ User authenticated:', user.id);
    console.log('📝 Session expires in:', session.expires_in);

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();
    
    // Check admin profile
    const { data: adminProfile, error: profileError } = await adminClient
      .from('admin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.log('❌ Profile error:', profileError.message);
      // Don't sign out here, just return error
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    if (!adminProfile) {
      console.log('❌ No admin profile found for user:', user.id);
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    if (!adminProfile.is_active) {
      console.log('❌ Admin account disabled:', user.id);
      return NextResponse.json(
        { success: false, error: 'Account is disabled' },
        { status: 403 }
      );
    }

    console.log('✅ Admin profile found:', adminProfile.name, '- Role:', adminProfile.role);

    // Update last login
    await adminClient
      .from('admin_profiles')
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', adminProfile.id);

    // Set cookies - FIXED: Create headers object first
    const isProduction = process.env.NODE_ENV === 'production';
    
    console.log('🍪 Setting cookies...');
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: adminProfile.name,
        role: adminProfile.role,
      },
    });

    // Set cookies with proper attributes
    response.cookies.set({
      name: 'sb-access-token',
      value: session.access_token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: session.expires_in,
    });

    response.cookies.set({
      name: 'sb-refresh-token',
      value: session.refresh_token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Also set a client-readable cookie for checking auth status
    response.cookies.set({
      name: 'admin-authenticated',
      value: 'true',
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: session.expires_in,
    });

    console.log('✅ Login successful, cookies set');
    return response;

  } catch (error: any) {
    console.error('🔥 Login error:', error.message);
    
    // Handle specific errors
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}