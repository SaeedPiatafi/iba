// app/api/admin/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // This should be protected in production
    // For now, we'll allow it for setup
    
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // 1. Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password: password.trim(),
      options: {
        data: {
          name: name.trim(),
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/web-admin/login`,
      },
    });

    if (authError) {
      console.error('Signup auth error:', authError);
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'User creation failed' },
        { status: 500 }
      );
    }

    // 2. Create admin profile
    const { error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .insert({
        user_id: authData.user.id,
        email: authData.user.email,
        name: name.trim(),
        role: 'admin',
        is_active: true,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Try to delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { success: false, error: 'Failed to create admin profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully. Please check your email to confirm your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
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