// app/api/admin/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Logout request');
    
    // Get tokens from cookies
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const refreshToken = request.cookies.get('sb-refresh-token')?.value;
    
    // Sign out from Supabase if we have tokens
    if (accessToken && refreshToken) {
      try {
        await supabase.auth.signOut();
        console.log('✅ Supabase sign-out successful');
      } catch (authError: any) {
        console.log('⚠️ Supabase sign-out error (proceeding anyway):', authError.message);
      }
    }
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      redirectTo: '/web-admin/login',
    });
    
    // Clear ALL cookies
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      'admin-authenticated'
    ];
    
    cookieNames.forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 0, // Expire immediately
      });
    });
    
    console.log('✅ All cookies cleared');
    
    return response;
    
  } catch (error: any) {
    console.error('🔥 Logout error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Redirect POST requests or return method not allowed
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}