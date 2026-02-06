// middleware.ts (at root of your project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect admin routes (excluding login and public API endpoints)
  if (
    pathname.startsWith('/web-admin') && 
    !pathname.includes('/login') &&
    !pathname.includes('/api/auth')
  ) {
    console.log(`[Middleware] Protecting route: ${pathname}`);
    
    try {
      // Get the access token from cookies
      const accessToken = request.cookies.get('sb-access-token')?.value;
      
      // If no access token, redirect to login
      if (!accessToken) {
        console.log('[Middleware] No access token found, redirecting to login');
        return redirectToLogin(request);
      }
      
      // Verify the token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      
      if (error || !user) {
        console.log('[Middleware] Invalid token or user not found:', error?.message);
        
        // Try to refresh the token
        const refreshToken = request.cookies.get('sb-refresh-token')?.value;
        
        if (refreshToken) {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
          });
          
          if (refreshError || !refreshData.session) {
            console.log('[Middleware] Session refresh failed');
            return redirectToLogin(request);
          }
          
          // Update cookies with new session
          const response = NextResponse.next();
          const isProduction = process.env.NODE_ENV === 'production';
          
          response.cookies.set({
            name: 'sb-access-token',
            value: refreshData.session.access_token,
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: refreshData.session.expires_in,
          });
          
          // Continue to check admin status
          const { data: { user: refreshedUser } } = await supabase.auth.getUser(refreshData.session.access_token);
          
          if (!refreshedUser) {
            return redirectToLogin(request);
          }
          
          // Check admin profile for refreshed user
          return await checkAdminProfile(refreshedUser.id, request);
        }
        
        return redirectToLogin(request);
      }
      
      // User is valid, check if they're an admin
      return await checkAdminProfile(user.id, request);
      
    } catch (error) {
      console.error('[Middleware] Error during authentication:', error);
      return redirectToLogin(request);
    }
  }
  
  // For all other routes, just continue
  return NextResponse.next();
}

// Helper function to check admin profile
async function checkAdminProfile(userId: string, request: NextRequest) {
  try {
    const { data: adminProfile, error } = await supabaseAdmin
      .from('admin_profiles')
      .select('id, is_active')
      .eq('user_id', userId)
      .single();
    
    if (error || !adminProfile) {
      console.log('[Middleware] User is not an admin:', error?.message);
      
      // Clear invalid cookies
      const response = redirectToLogin(request);
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
      
      return response;
    }
    
    if (!adminProfile.is_active) {
      console.log('[Middleware] Admin account is inactive');
      
      // Clear cookies for inactive accounts
      const response = redirectToLogin(request);
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
      
      return response;
    }
    
    // User is authenticated and is an active admin
    console.log('[Middleware] User authenticated as admin');
    return NextResponse.next();
    
  } catch (error) {
    console.error('[Middleware] Error checking admin profile:', error);
    return redirectToLogin(request);
  }
}

// Helper function to redirect to login
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/web-admin/login', request.url);
  
  // Add return URL if not already on login page
  if (!request.nextUrl.pathname.includes('/login')) {
    loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
  }
  
  return NextResponse.redirect(loginUrl);
}

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (auth endpoints)
     * 2. /web-admin/login (login page)
     * 3. _next/static (static files)
     * 4. _next/image (image optimization files)
     * 5. favicon.ico (favicon file)
     * 6. public files
     */
    '/web-admin/:path*',
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)',
  ],
};