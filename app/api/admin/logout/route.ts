// app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear cookies
    cookieStore.set({
      name: 'sb-access-token',
      value: '',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    cookieStore.set({
      name: 'sb-refresh-token',
      value: '',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      redirectTo: '/web-admin/login',
    });
  } catch (error) {
    console.error('Logout error:', error);
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