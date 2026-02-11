// middleware.ts (at root of your project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for middleware
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client for middleware
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  
  // Only protect admin routes
  if (pathname.startsWith('/web-admin') && !pathname.includes('/login')) {
    
    try {
      // Get the access token from cookies
      const accessToken = request.cookies.get('sb-access-token')?.value;

      
      // If no access token, redirect to login
      if (!accessToken) {
        return redirectToLogin(request);
      }
      
      // Verify the token with Supabase
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
      
      if (error) {
        
        // Try to refresh the token
        const refreshToken = request.cookies.get('sb-refresh-token')?.value;
        
        if (refreshToken) {
          
          // Use admin client to refresh session
          const { data: refreshData, error: refreshError } = await supabaseAdmin.auth.refreshSession({
            refresh_token: refreshToken,
          });
          
          if (refreshError || !refreshData.session) {
            return redirectToLogin(request);
          }
          
          // Create response with new tokens
          const response = NextResponse.next();
          const isProduction = process.env.NODE_ENV === 'production';
          
          // Set new cookies
          response.cookies.set({
            name: 'sb-access-token',
            value: refreshData.session.access_token,
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: refreshData.session.expires_in,
          });
          
          response.cookies.set({
            name: 'sb-refresh-token',
            value: refreshData.session.refresh_token,
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
          
          // Check admin profile with refreshed user
          const refreshedUser = refreshData.user;
          if (!refreshedUser) {
            return redirectToLogin(request);
          }
          
          return await checkAdminProfile(refreshedUser.id, request);
        }
        
        return redirectToLogin(request);
      }
      
      if (!user) {
        return redirectToLogin(request);
      }
      
      // User is valid, check if they're an admin
      return await checkAdminProfile(user.id, request);
      
    } catch (error: any) {
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
      .select('id, is_active, name, role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      
      // Clear invalid cookies
      const response = redirectToLogin(request);
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
      response.cookies.delete('admin-authenticated');
      
      return response;
    }
    
    if (!adminProfile) {
      
      const response = redirectToLogin(request);
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
      response.cookies.delete('admin-authenticated');
      
      return response;
    }
    
    if (!adminProfile.is_active) {
      
      const response = redirectToLogin(request);
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
      response.cookies.delete('admin-authenticated');
      
      return response;
    }
    
    // User is authenticated and is an active admin
    return NextResponse.next();
    
  } catch (error: any) {
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
    '/web-admin/:path*',
  ],
};