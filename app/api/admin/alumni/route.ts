// app/api/admin/alumni/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/auth-helper';

// Helper function for admin authentication
async function requireAdminAuth() {
  const authResult = await checkAdminAuth();
  
  if (!authResult.isAdmin) {
    throw new Error(authResult.error || 'Admin access required');
  }
  
  return authResult.user;
}

// GET - Get all alumni (for admin panel)
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const graduationYear = searchParams.get('graduationYear');
    
    const offset = (page - 1) * limit;

    let query = supabase
      .from('alumni')
      .select('*', { count: 'exact' })
      .order('graduation_year', { ascending: false })
      .order('name', { ascending: true });

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,profession.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply graduation year filter
    if (graduationYear) {
      query = query.eq('graduation_year', graduationYear);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: alumni, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch alumni: ${error.message}`);
    }

    // Transform data to camelCase for frontend
    const transformedData = alumni?.map(alum => ({
      id: alum.id,
      name: alum.name,
      graduationYear: alum.graduation_year,
      profession: alum.profession,
      image: alum.image,
      bio: alum.bio,
      email: alum.email,
      achievements: alum.achievements || [],
      education: alum.education || [],
      skills: alum.skills || [],
      createdAt: alum.created_at,
      updatedAt: alum.updated_at
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('API Error:', error);

    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized. Please log in as admin.' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch alumni data',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

// POST - Create new alumni (with optional image upload)
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    // Handle FormData (for file upload) or JSON
    const contentType = request.headers.get('content-type') || '';
    
    let alumniData: any = {};
    let imageBuffer: Buffer | null = null;
    let imageFileName: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      
      // Extract text fields
      alumniData = {
        name: formData.get('name'),
        graduationYear: formData.get('graduationYear'),
        profession: formData.get('profession'),
        bio: formData.get('bio'),
        email: formData.get('email')
      };

      // Parse array fields
      const achievements = formData.get('achievements');
      const education = formData.get('education');
      const skills = formData.get('skills');

      if (achievements && typeof achievements === 'string') {
        alumniData.achievements = JSON.parse(achievements);
      }
      if (education && typeof education === 'string') {
        alumniData.education = JSON.parse(education);
      }
      if (skills && typeof skills === 'string') {
        alumniData.skills = JSON.parse(skills);
      }

      // Handle image upload
      const imageFile = formData.get('image') as File | null;
      if (imageFile && imageFile.size > 0) {
        imageFileName = `${Date.now()}-${imageFile.name}`;
        const bytes = await imageFile.arrayBuffer();
        imageBuffer = Buffer.from(bytes);
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('alumni-images')
          .upload(imageFileName, imageBuffer, {
            contentType: imageFile.type,
            upsert: false
          });

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          // Continue without image if upload fails
        } else {
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('alumni-images')
            .getPublicUrl(imageFileName);
          
          alumniData.image = publicUrl;
        }
      } else {
        // Use URL from form data
        alumniData.image = formData.get('image') as string || '';
      }
    } else {
      // Handle JSON request
      alumniData = await request.json();
    }

    // Validate required fields
    if (!alumniData.name || !alumniData.graduationYear || !alumniData.profession) {
      return NextResponse.json(
        { success: false, error: 'Name, graduation year, and profession are required' },
        { status: 400 }
      );
    }

    // Prepare data for Supabase (convert camelCase to snake_case)
    const supabaseData = {
      name: alumniData.name.trim(),
      graduation_year: alumniData.graduationYear.toString().trim(),
      profession: alumniData.profession.trim(),
      image: alumniData.image || null,
      bio: alumniData.bio || '',
      email: alumniData.email || null,
      achievements: alumniData.achievements || [],
      education: alumniData.education || [],
      skills: alumniData.skills || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert into database
    const { data: newAlumni, error } = await supabase
      .from('alumni')
      .insert([supabaseData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // Clean up uploaded image if insertion failed
      if (imageFileName) {
        await supabase.storage
          .from('alumni-images')
          .remove([imageFileName]);
      }
      
      throw new Error(`Failed to create alumni: ${error.message}`);
    }

    // Transform response to camelCase
    const responseData = {
      id: newAlumni.id,
      name: newAlumni.name,
      graduationYear: newAlumni.graduation_year,
      profession: newAlumni.profession,
      image: newAlumni.image,
      bio: newAlumni.bio,
      email: newAlumni.email,
      achievements: newAlumni.achievements || [],
      education: newAlumni.education || [],
      skills: newAlumni.skills || [],
      createdAt: newAlumni.created_at,
      updatedAt: newAlumni.updated_at
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Alumni created successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('API Error:', error);

    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized. Please log in as admin.' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create alumni',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Update alumni
export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Alumni ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const contentType = request.headers.get('content-type') || '';
    let alumniData: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Extract text fields
      alumniData = {
        name: formData.get('name'),
        graduationYear: formData.get('graduationYear'),
        profession: formData.get('profession'),
        bio: formData.get('bio'),
        email: formData.get('email')
      };

      // Parse array fields
      const achievements = formData.get('achievements');
      const education = formData.get('education');
      const skills = formData.get('skills');

      if (achievements && typeof achievements === 'string') {
        alumniData.achievements = JSON.parse(achievements);
      }
      if (education && typeof education === 'string') {
        alumniData.education = JSON.parse(education);
      }
      if (skills && typeof skills === 'string') {
        alumniData.skills = JSON.parse(skills);
      }

      // Handle image upload if provided
      const imageFile = formData.get('image') as File | null;
      if (imageFile && imageFile.size > 0) {
        const imageFileName = `${Date.now()}-${imageFile.name}`;
        const bytes = await imageFile.arrayBuffer();
        const imageBuffer = Buffer.from(bytes);
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('alumni-images')
          .upload(imageFileName, imageBuffer, {
            contentType: imageFile.type,
            upsert: false
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('alumni-images')
            .getPublicUrl(imageFileName);
          
          alumniData.image = publicUrl;
        }
      } else {
        // Use URL from form data if no file
        alumniData.image = formData.get('image') as string || undefined;
      }
    } else {
      alumniData = await request.json();
    }

    // Prepare update data
    const updateData: any = {
      name: alumniData.name?.trim(),
      graduation_year: alumniData.graduationYear?.toString().trim(),
      profession: alumniData.profession?.trim(),
      bio: alumniData.bio,
      email: alumniData.email,
      updated_at: new Date().toISOString()
    };

    // Only include fields that are provided
    if (alumniData.image !== undefined) {
      updateData.image = alumniData.image;
    }
    if (alumniData.achievements !== undefined) {
      updateData.achievements = alumniData.achievements;
    }
    if (alumniData.education !== undefined) {
      updateData.education = alumniData.education;
    }
    if (alumniData.skills !== undefined) {
      updateData.skills = alumniData.skills;
    }

    // Update in database
    const { data: updatedAlumni, error } = await supabase
      .from('alumni')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to update alumni: ${error.message}`);
    }

    if (!updatedAlumni) {
      return NextResponse.json(
        { success: false, error: 'Alumni not found' },
        { status: 404 }
      );
    }

    // Transform response to camelCase
    const responseData = {
      id: updatedAlumni.id,
      name: updatedAlumni.name,
      graduationYear: updatedAlumni.graduation_year,
      profession: updatedAlumni.profession,
      image: updatedAlumni.image,
      bio: updatedAlumni.bio,
      email: updatedAlumni.email,
      achievements: updatedAlumni.achievements || [],
      education: updatedAlumni.education || [],
      skills: updatedAlumni.skills || [],
      createdAt: updatedAlumni.created_at,
      updatedAt: updatedAlumni.updated_at
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Alumni updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('API Error:', error);

    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized. Please log in as admin.' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update alumni',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete alumni
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Alumni ID is required' },
        { status: 400 }
      );
    }

    // First, get the alumni to get image info for cleanup
    const { data: alumni, error: fetchError } = await supabase
      .from('alumni')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: 'Alumni not found' },
        { status: 404 }
      );
    }

    // Delete from database
    const { error } = await supabase
      .from('alumni')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      throw new Error(`Failed to delete alumni: ${error.message}`);
    }

    // Try to delete associated image from storage if it's from our storage
    if (alumni.image && alumni.image.includes('supabase.co/storage/v1/object/public/alumni-images/')) {
      try {
        const imageName = alumni.image.split('/').pop();
        if (imageName) {
          await supabase.storage
            .from('alumni-images')
            .remove([imageName]);
        }
      } catch (storageError) {
        console.error('Failed to delete image from storage:', storageError);
        // Continue even if image deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Alumni deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('API Error:', error);

    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized. Please log in as admin.' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete alumni',
        details: error.message
      },
      { status: 500 }
    );
  }
}