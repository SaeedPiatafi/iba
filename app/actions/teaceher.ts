// app/actions/teacher.ts
'use server';

import { checkAdminAuth } from '@/lib/auth-helper';

export async function addTeacher(formData: FormData) {
  try {
    const authResult = await checkAdminAuth();
    
    if (!authResult.isAdmin) {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    // Forward the request to your API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/teacher`, {
      method: 'POST',
      body: formData,
      // No need for credentials here since it's a server-to-server call
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to add teacher');
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error('Server action error:', error);
    return { success: false, error: error.message };
  }
}