import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth-helper";

export async function GET(req: NextRequest) {
  console.log('🔐 TEST AUTH ENDPOINT CALLED');
  
  try {
    // Get all headers for debugging
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    console.log('📨 Request headers:', {
      'user-agent': headers['user-agent'],
      'cookie': headers['cookie'] ? 'exists' : 'missing'
    });
    
    // Test auth check
    const authResult = await checkAdminAuth();
    
    console.log('🔍 Auth result:', {
      isAdmin: authResult.isAdmin,
      error: authResult.error,
      userEmail: authResult.user?.email
    });
    
    if (authResult.isAdmin) {
      return NextResponse.json({
        success: true,
        message: '✅ Authentication successful',
        user: {
          email: authResult.user?.email,
          id: authResult.user?.id
        },
        debug: {
          isAdmin: authResult.isAdmin,
          hasUser: !!authResult.user
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: authResult.error,
        message: '❌ Authentication failed',
        debug: {
          isAdmin: authResult.isAdmin,
          error: authResult.error
        }
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('🔥 Test auth error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: '🔥 Server error',
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}