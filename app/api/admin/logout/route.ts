import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/app/lib/jwt-utils';

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

export async function POST() {
  try {
    // Clear authentication cookie
    await clearAuthCookie();
    
    const headers = new Headers();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { 
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { 
        status: 500,
        headers: securityHeaders,
      }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: securityHeaders }
  );
}