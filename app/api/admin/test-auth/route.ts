// app/api/admin/test-auth/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    
    console.log('Test API - Access Token:', accessToken ? `Yes (${accessToken.length} chars)` : 'No');
    
    if (!accessToken) {
      return NextResponse.json({
        success: false,
        message: 'No access token found in cookies',
        cookies: Array.from(cookieStore.getAll()).map(c => c.name)
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid access token',
        error: error?.message
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Auth is working!',
      user: {
        id: user.id,
        email: user.email
      },
      cookies: Array.from(cookieStore.getAll()).map(c => c.name)
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}