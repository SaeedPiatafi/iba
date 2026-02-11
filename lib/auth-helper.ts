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
    // Get cookies exactly like middleware does
    const cookieStore = await cookies();
    
    // Check for sb-access-token (same as middleware)
    const accessToken = cookieStore.get('sb-access-token')?.value;
    
    if (!accessToken) {
      return { 
        isAdmin: false, 
        error: 'No authentication token found. Please log in.' 
      };
    }
    
    // Verify the token with Supabase (same as middleware)
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      
      // Try to refresh the token (same as middleware)
      const refreshToken = cookieStore.get('sb-refresh-token')?.value;
      
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });
        
        if (refreshError || !refreshData.session) {
          return { 
            isAdmin: false, 
            error: 'Session expired. Please log in again.' 
          };
        }
        
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
    
    // Check admin profile (same as middleware)
    return await checkAdminProfile(user.id);
    
  } catch (error: any) {
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
    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      return { 
        isAdmin: false, 
        error: 'Database connection error. Please try again.' 
      };
    }
    
    const { data: adminProfile, error } = await supabaseAdmin
      .from('admin_profiles')
      .select('id, email, name, role, is_active')
      .eq('user_id', userId)
      .single();
    
    if (error || !adminProfile) {
      
      // Debug: List what's in admin_profiles
      const { data: allAdmins } = await supabaseAdmin
        .from('admin_profiles')
        .select('email, user_id, is_active')
        .limit(5);
      
      return { 
        isAdmin: false, 
        error: 'User does not have admin privileges' 
      };
    }
    
    if (!adminProfile.is_active) {
      return { 
        isAdmin: false, 
        error: 'Admin account is inactive' 
      };
    }
    
    
    return {
      isAdmin: true,
      user: {
        id: userId,
        email: adminProfile.email || '',
        name: adminProfile.name
      }
    };
    
  } catch (error: any) {
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
    
    
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;
    
    return {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      cookies: allCookies.map(c => ({ name: c.name, hasValue: !!c.value }))
    };
  } catch (error) {
    return null;
  }
}