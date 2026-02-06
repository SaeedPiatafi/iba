// app/api/admin/alumni/route.ts - UPDATED WITH FILE UPLOAD
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/auth-helper';

// Allowed image types and max file size (5MB)
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Type guard functions
const isFile = (value: any): value is File => {
  return value instanceof File;
};

const isString = (value: any): value is string => {
  return typeof value === 'string';
};

// Generate unique filename
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `alumni-${timestamp}-${randomString}.${extension}`;
};

// Validate file
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  return { isValid: true };
};

// Upload image to Supabase Storage
const uploadImageToStorage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const validation = validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const fileName = generateFileName(file.name);
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('alumni-images') // Different bucket for alumni
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Storage upload error:', uploadError);
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('alumni-images')
      .getPublicUrl(fileName);

    console.log('✅ Image uploaded successfully:', publicUrl);
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('🔥 Image upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};

// Helper to require admin authentication
async function requireAdminAuth() {
  const authResult = await checkAdminAuth();
  
  if (!authResult.isAdmin) {
    console.error('🔐 Admin auth required but not authenticated:', authResult.error);
    throw new Error(authResult.error || 'Admin access required');
  }
  
  console.log('🔓 Admin authenticated:', authResult.user?.email);
  return authResult.user;
}

// ===================================================================
// POST - Add new alumni (with file upload support)
// ===================================================================
export async function POST(request: NextRequest) {
  console.log('📤 POST /api/admin/alumni - Creating new alumni');
  
  try {
    // Require admin authentication
    await requireAdminAuth();

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file upload
      console.log('📁 Processing multipart/form-data');
      const formData = await request.formData();
      
      // Log all form data for debugging
      console.log('📋 FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (isFile(value)) {
          console.log(`  ${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
        } else if (isString(value)) {
          console.log(`  ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
        }
      }
      
      // Extract alumni data
      const name = formData.get('name') as string;
      const graduationYear = formData.get('graduationYear') as string;
      const profession = formData.get('profession') as string;
      const email = formData.get('email') as string;
      const bio = formData.get('bio') as string;
      const achievements = JSON.parse(formData.get('achievements') as string || '[]');
      const education = JSON.parse(formData.get('education') as string || '[]');
      const skills = JSON.parse(formData.get('skills') as string || '[]');
      
      console.log('📝 Parsed form data:', {
        name,
        graduationYear,
        profession,
        email,
        bioLength: bio?.length,
        achievementsCount: achievements.length,
        educationCount: education.length,
        skillsCount: skills.length
      });

      // Validate required fields
      if (!name?.trim() || !graduationYear?.trim() || !profession?.trim() || !email?.trim()) {
        console.error('❌ Missing required fields');
        return NextResponse.json(
          { 
            success: false, 
            error: "Missing required fields: name, graduationYear, profession, email" 
          },
          { status: 400 }
        );
      }

      // Validate graduation year
      const currentYear = new Date().getFullYear();
      const gradYear = parseInt(graduationYear);
      if (isNaN(gradYear) || gradYear < 1900 || gradYear > currentYear + 5) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Please enter a valid graduation year between 1900 and ${currentYear + 5}` 
          },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        console.error('❌ Invalid email format:', email);
        return NextResponse.json(
          { success: false, error: "Invalid email format" },
          { status: 400 }
        );
      }

      // Check if email already exists
      console.log(`🔍 Checking if email exists: ${email}`);
      const { data: existingAlumni } = await supabaseAdmin
        .from("alumni")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (existingAlumni) {
        console.error('❌ Email already exists:', email);
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 409 }
        );
      }

      // Handle image upload
      let imageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
      const imageField = formData.get('image');
      
      console.log('🖼️ Image handling:', {
        hasField: !!imageField,
        isFile: isFile(imageField),
        isString: isString(imageField),
        fileSize: isFile(imageField) ? imageField.size : 0,
        urlLength: isString(imageField) ? imageField.length : 0
      });

      if (isFile(imageField) && imageField.size > 0) {
        console.log('📤 Uploading image file...');
        const uploadResult = await uploadImageToStorage(imageField);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else if (uploadResult.error) {
          console.error('❌ Image upload failed:', uploadResult.error);
          return NextResponse.json(
            { success: false, error: uploadResult.error },
            { status: 400 }
          );
        }
      } else if (isString(imageField) && imageField.trim().length > 0) {
        imageUrl = imageField.trim();
        console.log('🔗 Using image URL:', imageUrl.substring(0, 50) + '...');
      }

      // Prepare alumni data for database
      const alumniData = {
        name: name.trim(),
        graduation_year: graduationYear.trim(),
        profession: profession.trim(),
        email: email.trim().toLowerCase(),
        image: imageUrl,
        bio: bio?.trim() || '',
        achievements: Array.isArray(achievements)
          ? achievements.filter((a: string) => a.trim() !== "")
          : [],
        education: Array.isArray(education)
          ? education.filter((e: string) => e.trim() !== "")
          : [],
        skills: Array.isArray(skills)
          ? skills.filter((s: string) => s.trim() !== "")
          : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('💾 Inserting alumni data into database...');
      console.log('📊 Alumni data:', {
        name: alumniData.name,
        email: alumniData.email,
        profession: alumniData.profession,
        graduationYear: alumniData.graduation_year,
        hasImage: !!alumniData.image && alumniData.image !== 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        imageUrl: alumniData.image?.substring(0, 50) + '...'
      });

      // Insert into database
      const { data: alumni, error: insertError } = await supabaseAdmin
        .from("alumni")
        .insert(alumniData)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        return NextResponse.json(
          { success: false, error: `Failed to create alumni: ${insertError.message}` },
          { status: 400 }
        );
      }

      console.log('✅ Alumni created successfully:', alumni.id);

      // Transform back to camelCase for response
      const transformedAlumni = {
        id: alumni.id,
        name: alumni.name,
        graduationYear: alumni.graduation_year,
        profession: alumni.profession,
        email: alumni.email,
        image: alumni.image,
        bio: alumni.bio || '',
        achievements: alumni.achievements || [],
        education: alumni.education || [],
        skills: alumni.skills || [],
        createdAt: alumni.created_at,
        updatedAt: alumni.updated_at,
      };

      return NextResponse.json({
        success: true,
        message: "Alumni added successfully",
        data: transformedAlumni,
      }, { status: 201 });

    } else {
      // Handle JSON data (for backward compatibility)
      console.log('📄 Processing JSON data');
      const body = await request.json();

      // Validate required fields
      if (!body.name || !body.graduationYear || !body.profession || !body.email) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Missing required fields: name, graduationYear, profession, email' 
          },
          { status: 400 }
        );
      }

      // Validate graduation year
      const currentYear = new Date().getFullYear();
      const gradYear = parseInt(body.graduationYear);
      if (isNaN(gradYear) || gradYear < 1900 || gradYear > currentYear + 5) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Please enter a valid graduation year between 1900 and ${currentYear + 5}` 
          },
          { status: 400 }
        );
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email.trim())) {
        return NextResponse.json(
          { success: false, error: "Invalid email format" },
          { status: 400 }
        );
      }

      // Check if email exists
      const { data: existingAlumni } = await supabaseAdmin
        .from("alumni")
        .select("id")
        .eq("email", body.email.trim().toLowerCase())
        .maybeSingle();

      if (existingAlumni) {
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 409 }
        );
      }

      const alumniData = {
        name: body.name.trim(),
        graduation_year: body.graduationYear.toString().trim(),
        profession: body.profession.trim(),
        email: body.email.trim().toLowerCase(),
        image: body.image?.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        bio: body.bio?.trim() || '',
        achievements: Array.isArray(body.achievements) 
          ? body.achievements.filter((a: string) => a.trim() !== "")
          : [],
        education: Array.isArray(body.education) 
          ? body.education.filter((e: string) => e.trim() !== "")
          : [],
        skills: Array.isArray(body.skills) 
          ? body.skills.filter((s: string) => s.trim() !== "")
          : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: alumni, error } = await supabaseAdmin
        .from("alumni")
        .insert(alumniData)
        .select()
        .single();

      if (error) {
        console.error("❌ Database insert error:", error);
        return NextResponse.json(
          { success: false, error: `Failed to create alumni: ${error.message}` },
          { status: 400 }
        );
      }

      const transformedAlumni = {
        id: alumni.id,
        name: alumni.name,
        graduationYear: alumni.graduation_year,
        profession: alumni.profession,
        email: alumni.email,
        image: alumni.image,
        bio: alumni.bio || '',
        achievements: alumni.achievements || [],
        education: alumni.education || [],
        skills: alumni.skills || [],
      };

      return NextResponse.json({
        success: true,
        message: "Alumni added successfully",
        data: transformedAlumni,
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('🔥 POST Error:', error);
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add alumni" },
      { status: 500 }
    );
  }
}

// ===================================================================
// PUT - Update existing alumni
// ===================================================================
export async function PUT(request: NextRequest) {
  console.log('✏️ PUT /api/admin/alumni - Updating alumni');
  
  try {
    await requireAdminAuth();

    const contentType = request.headers.get('content-type') || '';
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Alumni ID is required" },
        { status: 400 }
      );
    }
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      const name = formData.get('name') as string;
      const graduationYear = formData.get('graduationYear') as string;
      const profession = formData.get('profession') as string;
      const email = formData.get('email') as string;
      const bio = formData.get('bio') as string;
      const achievements = JSON.parse(formData.get('achievements') as string || '[]');
      const education = JSON.parse(formData.get('education') as string || '[]');
      const skills = JSON.parse(formData.get('skills') as string || '[]');
      
      console.log(`🔍 Checking if alumni exists: ${id}`);
      const { data: existingAlumni } = await supabaseAdmin
        .from("alumni")
        .select("id, image")
        .eq("id", id)
        .single();

      if (!existingAlumni) {
        return NextResponse.json(
          { success: false, error: "Alumni not found" },
          { status: 404 }
        );
      }

      let imageUrl = existingAlumni.image;
      const imageField = formData.get('image');

      // Handle image upload
      if (isFile(imageField) && imageField.size > 0) {
        console.log('📤 Uploading new image...');
        const uploadResult = await uploadImageToStorage(imageField);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else if (uploadResult.error) {
          return NextResponse.json(
            { success: false, error: uploadResult.error },
            { status: 400 }
          );
        }
      } else if (isString(imageField) && imageField.trim().length > 0) {
        imageUrl = imageField.trim();
      }

      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (name !== undefined) updateData.name = name.trim();
      if (graduationYear !== undefined) {
        // Validate graduation year
        const currentYear = new Date().getFullYear();
        const gradYear = parseInt(graduationYear);
        if (isNaN(gradYear) || gradYear < 1900 || gradYear > currentYear + 5) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Please enter a valid graduation year between 1900 and ${currentYear + 5}` 
            },
            { status: 400 }
          );
        }
        updateData.graduation_year = graduationYear.trim();
      }
      if (profession !== undefined) updateData.profession = profession.trim();
      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return NextResponse.json(
            { success: false, error: "Invalid email format" },
            { status: 400 }
          );
        }
        updateData.email = email.trim().toLowerCase();
      }
      if (imageUrl !== undefined) updateData.image = imageUrl;
      if (bio !== undefined) updateData.bio = bio?.trim() || '';
      if (achievements !== undefined) {
        updateData.achievements = Array.isArray(achievements) 
          ? achievements.filter((a: string) => a.trim() !== "")
          : [];
      }
      if (education !== undefined) {
        updateData.education = Array.isArray(education) 
          ? education.filter((e: string) => e.trim() !== "")
          : [];
      }
      if (skills !== undefined) {
        updateData.skills = Array.isArray(skills) 
          ? skills.filter((s: string) => s.trim() !== "")
          : [];
      }

      console.log(`💾 Updating alumni ${id}...`);
      const { data, error } = await supabaseAdmin
        .from("alumni")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error('❌ Update error:', error);
        return NextResponse.json(
          { success: false, error: `Failed to update alumni: ${error.message}` },
          { status: 400 }
        );
      }

      console.log('✅ Alumni updated successfully');

      // Transform response
      const responseData = {
        id: data.id,
        name: data.name,
        graduationYear: data.graduation_year,
        profession: data.profession,
        image: data.image,
        bio: data.bio,
        email: data.email,
        achievements: data.achievements || [],
        education: data.education || [],
        skills: data.skills || [],
        updatedAt: data.updated_at,
      };

      return NextResponse.json({
        success: true,
        data: responseData,
        message: 'Alumni updated successfully'
      });

    } else {
      // JSON request handling (backward compatibility)
      const body = await request.json();

      // Check if alumni exists
      const { data: existingAlumni, error: checkError } = await supabaseAdmin
        .from("alumni")
        .select("id")
        .eq("id", id)
        .single();

      if (checkError || !existingAlumni) {
        return NextResponse.json(
          { success: false, error: 'Alumni not found' },
          { status: 404 }
        );
      }

      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Add fields if provided
      if (body.name !== undefined) updateData.name = body.name.trim();
      if (body.graduationYear !== undefined) {
        // Validate graduation year
        const currentYear = new Date().getFullYear();
        const gradYear = parseInt(body.graduationYear);
        if (isNaN(gradYear) || gradYear < 1900 || gradYear > currentYear + 5) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Please enter a valid graduation year between 1900 and ${currentYear + 5}` 
            },
            { status: 400 }
          );
        }
        updateData.graduation_year = body.graduationYear.toString().trim();
      }
      if (body.profession !== undefined) updateData.profession = body.profession.trim();
      if (body.image !== undefined) updateData.image = body.image?.trim() || null;
      if (body.bio !== undefined) updateData.bio = body.bio?.trim() || null;
      if (body.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email.trim())) {
          return NextResponse.json(
            { success: false, error: 'Invalid email format' },
            { status: 400 }
          );
        }
        updateData.email = body.email?.trim() || null;
      }
      
      if (body.achievements !== undefined) {
        updateData.achievements = Array.isArray(body.achievements) 
          ? body.achievements.map((a: string) => a.trim()).filter((a: string) => a !== "")
          : [];
      }
      if (body.education !== undefined) {
        updateData.education = Array.isArray(body.education) 
          ? body.education.map((e: string) => e.trim()).filter((e: string) => e !== "")
          : [];
      }
      if (body.skills !== undefined) {
        updateData.skills = Array.isArray(body.skills) 
          ? body.skills.map((s: string) => s.trim()).filter((s: string) => s !== "")
          : [];
      }

      // Update in Supabase
      const { data, error } = await supabaseAdmin
        .from("alumni")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error('❌ Update error:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: error.message || 'Failed to update alumni' 
          },
          { status: 500 }
        );
      }

      // Transform response
      const responseData = {
        id: data.id,
        name: data.name,
        graduationYear: data.graduation_year,
        profession: data.profession,
        image: data.image,
        bio: data.bio,
        email: data.email,
        achievements: data.achievements || [],
        education: data.education || [],
        skills: data.skills || [],
        updatedAt: data.updated_at,
      };

      return NextResponse.json({
        success: true,
        data: responseData,
        message: 'Alumni updated successfully'
      });
    }
  } catch (error: any) {
    console.error('🔥 PUT Error:', error);
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update alumni" },
      { status: 500 }
    );
  }
}

// ===================================================================
// DELETE - Remove alumni
// ===================================================================
export async function DELETE(request: NextRequest) {
  console.log('🗑️ DELETE /api/admin/alumni');
  
  try {
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Alumni ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking alumni ${id} before deletion...`);
    const { data: existingAlumni } = await supabaseAdmin
      .from("alumni")
      .select("id, image")
      .eq("id", id)
      .single();

    if (!existingAlumni) {
      return NextResponse.json(
        { success: false, error: 'Alumni not found' },
        { status: 404 }
      );
    }

    // Delete image from storage if it's from Supabase
    if (existingAlumni.image && existingAlumni.image.includes('supabase.co')) {
      try {
        const urlParts = existingAlumni.image.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        console.log(`🗑️ Deleting image from storage: ${fileName}`);
        await supabaseAdmin.storage
          .from('alumni-images')
          .remove([fileName]);
      } catch (storageError) {
        console.warn('⚠️ Failed to delete image from storage:', storageError);
      }
    }

    console.log(`🗑️ Deleting alumni ${id} from database...`);
    const { error } = await supabaseAdmin
      .from("alumni")
      .delete()
      .eq("id", id);

    if (error) {
      console.error('❌ Delete error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to delete alumni' 
        },
        { status: 500 }
      );
    }

    console.log('✅ Alumni deleted successfully');
    return NextResponse.json({
      success: true,
      message: `Alumni deleted successfully`,
      deletedId: id,
    });
  } catch (error: any) {
    console.error('🔥 DELETE Error:', error);
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete alumni" },
      { status: 500 }
    );
  }
}

// ===================================================================
// GET - Get all alumni or single alumni by ID
// ===================================================================
export async function GET(request: NextRequest) {
  console.log('📥 GET /api/admin/alumni');
  
  try {
    // Require admin authentication
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const minimal = searchParams.get('minimal');
    
    console.log('Query params:', { id, minimal });

    // Build query
    let query = supabaseAdmin
      .from('alumni')
      .select(minimal === "true" ? "id, name, graduation_year, profession, image, email" : "*")
      .order('created_at', { ascending: false });

    // Get specific alumni by ID
    if (id) {
      console.log(`🔍 Fetching alumni with ID: ${id}`);
      query = query.eq('id', id);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase GET error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch alumni data',
          details: error.message 
        },
        { status: 500 }
      );
    }

    // Transform data to match frontend format
    if (id) {
      // Single alumni
      if (!data || data.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Alumni not found' },
          { status: 404 }
        );
      }
      
      const alumni = data[0];
      const transformedData = {
        id: alumni.id,
        name: alumni.name || 'Unknown Alumni',
        graduationYear: alumni.graduation_year?.toString() || 'Unknown',
        profession: alumni.profession || 'Not specified',
        image: alumni.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        bio: alumni.bio || '',
        email: alumni.email || '',
        achievements: Array.isArray(alumni.achievements) ? alumni.achievements : [],
        education: Array.isArray(alumni.education) ? alumni.education : [],
        skills: Array.isArray(alumni.skills) ? alumni.skills : [],
        createdAt: alumni.created_at,
        updatedAt: alumni.updated_at,
      };

      return NextResponse.json({
        success: true,
        data: transformedData,
      });
    } else {
      // All alumni
      const transformedData = (data || []).map(alum => {
        if (minimal === "true") {
          // Minimal data for listing
          return {
            id: alum.id,
            name: alum.name || 'Unknown Alumni',
            graduationYear: alum.graduation_year?.toString() || 'Unknown',
            profession: alum.profession || 'Not specified',
            image: alum.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            email: alum.email || '',
          };
        } else {
          // Full data
          return {
            id: alum.id,
            name: alum.name || 'Unknown Alumni',
            graduationYear: alum.graduation_year?.toString() || 'Unknown',
            profession: alum.profession || 'Not specified',
            image: alum.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            bio: alum.bio || '',
            email: alum.email || '',
            achievements: Array.isArray(alum.achievements) ? alum.achievements : [],
            education: Array.isArray(alum.education) ? alum.education : [],
            skills: Array.isArray(alum.skills) ? alum.skills : [],
            createdAt: alum.created_at,
            updatedAt: alum.updated_at,
          };
        }
      });

      return NextResponse.json({
        success: true,
        data: transformedData,
        count: transformedData.length,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    console.error('🔥 GET Error:', error);
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized. Please log in as admin.",
          message: 'Please login as admin to access this resource.'
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}