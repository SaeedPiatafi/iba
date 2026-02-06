// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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

    // Supabase sign-in
    console.log('Attempting login for:', email);
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim(),
      });

    if (authError || !authData.user || !authData.session) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = authData.user;
    const session = authData.session;

    console.log('Login successful for user:', user.email);
    console.log('Session expires in:', session.expires_in);

    // Check admin profile
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !adminProfile) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    if (!adminProfile.is_active) {
      await supabase.auth.signOut();
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

    // Set cookies - IMPORTANT: Create a response and set cookies on it
    const isProduction = process.env.NODE_ENV === 'production';
    
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

    // Set cookies on the response
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
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log('Cookies set on response');
    return response;

  } catch (error) {
    console.error('Admin login error:', error);
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