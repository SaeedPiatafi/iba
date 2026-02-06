import { cookies } from 'next/headers';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export interface AuthResult {
  isAdmin: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  error?: string;
}

/**
 * Check if user is authenticated and has admin privileges
 * This should match exactly what your middleware does
 */
export async function checkAdminAuth(): Promise<AuthResult> {
  try {
    console.log('🛡️ [Auth-Helper] Starting admin auth check (matching middleware)...');
    
    // Get cookies exactly like middleware does
    const cookieStore = await cookies();
    
    // Check for sb-access-token (same as middleware)
    const accessToken = cookieStore.get('sb-access-token')?.value;
    console.log('🔍 [Auth-Helper] sb-access-token found?', !!accessToken);
    
    if (!accessToken) {
      console.log('❌ [Auth-Helper] No sb-access-token cookie found');
      return { 
        isAdmin: false, 
        error: 'No authentication token found. Please log in.' 
      };
    }
    
    // Verify the token with Supabase (same as middleware)
    console.log('🔐 [Auth-Helper] Verifying token with Supabase...');
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('❌ [Auth-Helper] Invalid token or user not found:', error?.message);
      
      // Try to refresh the token (same as middleware)
      const refreshToken = cookieStore.get('sb-refresh-token')?.value;
      console.log('🔄 [Auth-Helper] Attempting token refresh...');
      
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });
        
        if (refreshError || !refreshData.session) {
          console.log('❌ [Auth-Helper] Session refresh failed:', refreshError?.message);
          return { 
            isAdmin: false, 
            error: 'Session expired. Please log in again.' 
          };
        }
        
        console.log('✅ [Auth-Helper] Token refreshed successfully');
        // Get user from refreshed session
        const { data: { user: refreshedUser } } = await supabase.auth.getUser(refreshData.session.access_token);
        
        if (!refreshedUser) {
          return { 
            isAdmin: false, 
            error: 'Failed to get user after refresh' 
          };
        }
        
        // Check admin profile for refreshed user
        return await checkAdminProfile(refreshedUser.id);
      }
      
      return { 
        isAdmin: false, 
        error: 'Invalid or expired session. Please log in again.' 
      };
    }
    
    console.log('✅ [Auth-Helper] User verified:', user.email);
    
    // Check admin profile (same as middleware)
    return await checkAdminProfile(user.id);
    
  } catch (error: any) {
    console.error('🔥 [Auth-Helper] Exception:', error);
    return { 
      isAdmin: false, 
      error: `Authentication error: ${error.message}` 
    };
  }
}

/**
 * Check admin profile (same as middleware helper)
 */
async function checkAdminProfile(userId: string): Promise<AuthResult> {
  try {
    console.log('👤 [Auth-Helper] Checking admin profile for user ID:', userId);
    
    const { data: adminProfile, error } = await supabaseAdmin
      .from('admin_profiles')
      .select('id, email, name, role, is_active')
      .eq('user_id', userId)
      .single();
    
    if (error || !adminProfile) {
      console.log('❌ [Auth-Helper] No admin profile found:', error?.message);
      
      // Debug: List what's in admin_profiles
      const { data: allAdmins } = await supabaseAdmin
        .from('admin_profiles')
        .select('email, user_id, is_active')
        .limit(5);
      console.log('📋 [Auth-Helper] Current admin profiles:', allAdmins);
      
      return { 
        isAdmin: false, 
        error: 'User does not have admin privileges' 
      };
    }
    
    if (!adminProfile.is_active) {
      console.log('❌ [Auth-Helper] Admin account is inactive');
      return { 
        isAdmin: false, 
        error: 'Admin account is inactive' 
      };
    }
    
    console.log('✅ [Auth-Helper] Admin profile confirmed:', {
      email: adminProfile.email,
      role: adminProfile.role,
      is_active: adminProfile.is_active
    });
    
    return {
      isAdmin: true,
      user: {
        id: userId,
        email: adminProfile.email || '',
        name: adminProfile.name
      }
    };
    
  } catch (error: any) {
    console.error('🔥 [Auth-Helper] Error checking admin profile:', error);
    return { 
      isAdmin: false, 
      error: `Database error: ${error.message}` 
    };
  }
}

/**
 * Quick check - just verify if user has a valid session (no admin check)
 */
export async function checkUserSession() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    
    if (!accessToken) {
      return null;
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Session check error:', error);
    return null;
  }
}

/**
 * Get current session for debugging
 */
export async function getSessionDebug() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    console.log('🔍 [Session Debug] All cookies:', allCookies.map(c => c.name));
    
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;
    
    return {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      cookies: allCookies.map(c => ({ name: c.name, hasValue: !!c.value }))
    };
  } catch (error) {
    console.error('Session debug error:', error);
    return null;
  }
}