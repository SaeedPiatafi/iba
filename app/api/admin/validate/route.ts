import { NextResponse } from 'next/server';
import { validateAuthToken } from '@/app/lib/jwt-utils';

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

export async function GET() {
  try {
    const user = await validateAuthToken();
    
    const headers = new Headers();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Not authenticated',
        },
        { 
          status: 401,
          headers,
        }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        user: {
          id: user.userId,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { 
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error('Validation error:', error);
    
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
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: securityHeaders }
  );
}