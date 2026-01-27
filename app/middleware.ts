// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // For Edge compatibility

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  console.log(`[Middleware] Path: ${path}`);
  
  // Public paths
  const publicPaths = ['/web-admin/login', '/api/admin/login', '/api/admin/validate'];
  
  // If trying to access protected admin path
  if (path.startsWith('/web-admin/') && !publicPaths.some(p => path === p)) {
    const token = request.cookies.get('auth-token')?.value;
    
    console.log(`[Middleware] Checking auth for ${path}, Token exists: ${!!token}`);
    
    if (!token) {
      console.log(`[Middleware] No auth token, redirecting to login`);
      return NextResponse.redirect(new URL('/web-admin/login', request.url));
    }
    
    // Verify token (optional - you can skip if validation happens in layout)
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      if (payload.role !== 'admin') {
        console.log(`[Middleware] User is not admin`);
        const response = NextResponse.redirect(new URL('/web-admin/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }
    } catch (error) {
      console.log(`[Middleware] Invalid token:`, error);
      const response = NextResponse.redirect(new URL('/web-admin/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }
  
  // If trying to access login page with valid token, redirect to admin
  if (path === '/web-admin/login') {
    const token = request.cookies.get('auth-token')?.value;
    
    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        if (payload.role === 'admin') {
          console.log(`[Middleware] Already logged in as admin, redirecting`);
          return NextResponse.redirect(new URL('/web-admin/fee', request.url));
        }
      } catch (error) {
        // Invalid token, allow login
        console.log(`[Middleware] Invalid token on login page`);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/web-admin/:path*',
};