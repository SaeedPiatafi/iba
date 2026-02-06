// app/api/admin/validate/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get the access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    
    if (!accessToken) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'No session found',
      });
    }

    // Get user from Supabase using the token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      // Try to refresh the token
      const refreshToken = cookieStore.get('sb-refresh-token')?.value;
      
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });
        
        if (refreshError || !refreshData.session) {
          return NextResponse.json({
            success: false,
            authenticated: false,
            error: 'Session expired',
          });
        }
        
        // Update cookies with new session
        cookieStore.set({
          name: 'sb-access-token',
          value: refreshData.session.access_token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: refreshData.session.expires_in,
        });
        
        // Get user info again
        const { data: { user: refreshedUser } } = await supabase.auth.getUser(refreshData.session.access_token);
        
        if (!refreshedUser) {
          return NextResponse.json({
            success: false,
            authenticated: false,
            error: 'Invalid session',
          });
        }
        
        // Check if user is admin
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('role, name')
          .eq('user_id', refreshedUser.id)
          .single();
        
        if (!adminProfile) {
          return NextResponse.json({
            success: false,
            authenticated: false,
            error: 'Not an admin user',
          });
        }
        
        return NextResponse.json({
          success: true,
          authenticated: true,
          user: {
            id: refreshedUser.id,
            email: refreshedUser.email,
            name: adminProfile.name,
            role: adminProfile.role,
          },
        });
      }
      
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Session expired',
      });
    }

    // Check if user is admin
    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('role, name')
      .eq('user_id', user.id)
      .single();
    
    if (!adminProfile) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Not an admin user',
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: adminProfile.name,
        role: adminProfile.role,
      },
    });

  } catch (error) {
    console.error('Validate error:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
      error: 'Validation failed',
    }, { status: 500 });
  }
}