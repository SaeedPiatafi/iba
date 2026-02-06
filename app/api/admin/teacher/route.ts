import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/auth-helper";

// Allowed image types and max file size (5MB)
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
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
  return `teacher-${timestamp}-${randomString}.${extension}`;
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
      .from('teacher-images')
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
      .from('teacher-images')
      .getPublicUrl(fileName);

    console.log('✅ Image uploaded successfully:', publicUrl);
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('🔥 Image upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};

// ===================================================================
// Helper function to require admin authentication
// ===================================================================
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
// GET - Get all teachers or single teacher by ID
// ===================================================================
export async function GET(req: NextRequest) {
  console.log('📥 GET /api/admin/teacher');
  
  try {
    // Require admin authentication
    await requireAdminAuth();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const minimal = searchParams.get("minimal");

    console.log('Query params:', { id, minimal });

    // Get single teacher by ID
    if (id) {
      console.log(`🔍 Fetching teacher with ID: ${id}`);
      
      const { data: teacher, error } = await supabaseAdmin
        .from("teacher")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !teacher) {
        console.error('❌ Teacher not found:', error?.message);
        return NextResponse.json(
          { success: false, error: "Teacher not found" },
          { status: 404 },
        );
      }

      console.log('✅ Teacher found:', teacher.name);

      // Transform to camelCase for frontend
      const transformedTeacher = {
        id: teacher.id,
        name: teacher.name || "",
        subject: teacher.subject || "",
        email: teacher.email || "",
        classLevels: teacher.class_levels || [],
        image: teacher.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        education: teacher.education || [],
        experience: teacher.experience || "",
        teachingExperience: teacher.teaching_experience || [],
        bio: teacher.bio || "",
        achievements: teacher.achievements || [],
        teachingPhilosophy: teacher.teaching_philosophy || "",
        createdAt: teacher.created_at,
        updatedAt: teacher.updated_at,
      };

      return NextResponse.json({ 
        success: true, 
        data: transformedTeacher 
      });
    }

    // Get all teachers
    console.log('📋 Fetching all teachers');
    const selectFields = minimal === "true" ? "id, name, subject, image, email" : "*";

    const { data: teachers, error } = await supabaseAdmin
      .from("teacher")
      .select(selectFields)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('❌ Failed to fetch teachers:', error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch teachers" },
        { status: 400 },
      );
    }

    console.log(`✅ Found ${teachers?.length || 0} teachers`);

    // Transform all teachers
    const transformedTeachers = (teachers || []).map((teacher) => {
      if (minimal === "true") {
        // Minimal data for listing
        return {
          id: teacher.id,
          name: teacher.name || "",
          subject: teacher.subject || "",
          email: teacher.email || "",
          image: teacher.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        };
      } else {
        // Full data
        return {
          id: teacher.id,
          name: teacher.name || "",
          subject: teacher.subject || "",
          email: teacher.email || "",
          classLevels: teacher.class_levels || [],
          image: teacher.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          education: teacher.education || [],
          experience: teacher.experience || "",
          teachingExperience: teacher.teaching_experience || [],
          bio: teacher.bio || "",
          achievements: teacher.achievements || [],
          teachingPhilosophy: teacher.teaching_philosophy || "",
          createdAt: teacher.created_at,
          updatedAt: teacher.updated_at,
        };
      }
    });

    return NextResponse.json({
      success: true,
      count: transformedTeachers.length,
      data: transformedTeachers,
    });

  } catch (error: any) {
    console.error('🔥 GET Error:', error);
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch teachers" },
      { status: 500 },
    );
  }
}

// ===================================================================
// POST - Create new teacher (with file upload support)
// ===================================================================
export async function POST(req: NextRequest) {
  console.log('📤 POST /api/admin/teacher - Creating new teacher');
  
  try {
    // Require admin authentication
    await requireAdminAuth();

    const contentType = req.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file upload
      console.log('📁 Processing multipart/form-data');
      const formData = await req.formData();
      
      // Log all form data for debugging
      console.log('📋 FormData entries:');
      const formEntries: { [key: string]: string } = {};
      for (let [key, value] of formData.entries()) {
        if (isFile(value)) {
          console.log(`  ${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
          formEntries[key] = `[File: ${value.name}]`;
        } else if (isString(value)) {
          console.log(`  ${key}: ${value}`);
          formEntries[key] = value;
        }
      }
      
      // Extract teacher data
      const name = formData.get('name') as string;
      const subject = formData.get('subject') as string;
      const email = formData.get('email') as string;
      const classLevels = JSON.parse(formData.get('classLevels') as string || '[]');
      const experience = formData.get('experience') as string;
      const education = JSON.parse(formData.get('education') as string || '[]');
      const teachingExperience = JSON.parse(formData.get('teachingExperience') as string || '[]');
      const bio = formData.get('bio') as string;
      const achievements = JSON.parse(formData.get('achievements') as string || '[]');
      const teachingPhilosophy = formData.get('teachingPhilosophy') as string;
      
      console.log('📝 Parsed form data:', {
        name: name?.substring(0, 20) + '...',
        subject,
        email,
        classLevelsCount: classLevels.length,
        experience,
        educationCount: education.length,
        teachingExperienceCount: teachingExperience.length,
        bioLength: bio?.length,
        achievementsCount: achievements.length,
        teachingPhilosophyLength: teachingPhilosophy?.length
      });

      // Validate required fields
      if (!name?.trim() || !subject?.trim() || !email?.trim()) {
        console.error('❌ Missing required fields');
        return NextResponse.json(
          { success: false, error: "Missing required fields: name, subject, email" },
          { status: 400 },
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        console.error('❌ Invalid email format:', email);
        return NextResponse.json(
          { success: false, error: "Invalid email format" },
          { status: 400 },
        );
      }

      // Check if email already exists
      console.log(`🔍 Checking if email exists: ${email}`);
      const { data: existingTeacher } = await supabaseAdmin
        .from("teacher")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (existingTeacher) {
        console.error('❌ Email already exists:', email);
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 409 },
        );
      }

      // Handle image upload - FIXED VERSION
      let imageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d";
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

      // Prepare teacher data for database
      const teacherData = {
        name: name.trim(),
        subject: subject.trim(),
        email: email.trim().toLowerCase(),
        class_levels: Array.isArray(classLevels) ? classLevels : [],
        image: imageUrl,
        education: Array.isArray(education)
          ? education.filter((e: string) => e.trim() !== "")
          : [],
        experience: experience || "",
        teaching_experience: Array.isArray(teachingExperience)
          ? teachingExperience.filter((e: string) => e.trim() !== "")
          : [],
        bio: bio || "",
        achievements: Array.isArray(achievements)
          ? achievements.filter((a: string) => a.trim() !== "")
          : [],
        teaching_philosophy: teachingPhilosophy || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('💾 Inserting teacher data into database...');
      console.log('📊 Teacher data:', {
        name: teacherData.name,
        email: teacherData.email,
        subject: teacherData.subject,
        classLevels: teacherData.class_levels.length,
        hasImage: !!teacherData.image && teacherData.image !== 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        imageUrl: teacherData.image?.substring(0, 50) + '...'
      });

      // Insert into database
      const { data: teacher, error: insertError } = await supabaseAdmin
        .from("teacher")
        .insert(teacherData)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        return NextResponse.json(
          { success: false, error: `Failed to create teacher: ${insertError.message}` },
          { status: 400 },
        );
      }

      console.log('✅ Teacher created successfully:', teacher.id);

      // Transform back to camelCase for response
      const transformedTeacher = {
        id: teacher.id,
        name: teacher.name,
        subject: teacher.subject,
        email: teacher.email,
        classLevels: teacher.class_levels || [],
        image: teacher.image,
        education: teacher.education || [],
        experience: teacher.experience || "",
        teachingExperience: teacher.teaching_experience || [],
        bio: teacher.bio || "",
        achievements: teacher.achievements || [],
        teachingPhilosophy: teacher.teaching_philosophy || "",
      };

      return NextResponse.json({
        success: true,
        message: "Teacher added successfully",
        data: transformedTeacher,
      });

    } else {
      // Handle JSON data (for backward compatibility)
      console.log('📄 Processing JSON data');
      const body = await req.json();

      const requiredFields = ["name", "subject", "email"];
      const missing = requiredFields.filter((f) => !body[f]?.trim());

      if (missing.length) {
        return NextResponse.json(
          { success: false, error: `Missing required fields: ${missing.join(", ")}` },
          { status: 400 },
        );
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email.trim())) {
        return NextResponse.json(
          { success: false, error: "Invalid email format" },
          { status: 400 },
        );
      }

      // Check if email exists
      const { data: existingTeacher } = await supabaseAdmin
        .from("teacher")
        .select("id")
        .eq("email", body.email.trim().toLowerCase())
        .maybeSingle();

      if (existingTeacher) {
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 409 },
        );
      }

      const teacherData = {
        name: body.name.trim(),
        subject: body.subject.trim(),
        email: body.email.trim().toLowerCase(),
        class_levels: Array.isArray(body.classLevels) ? body.classLevels : [],
        image: body.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        education: Array.isArray(body.education)
          ? body.education.filter((e: string) => e.trim() !== "")
          : [],
        experience: body.experience || "",
        teaching_experience: Array.isArray(body.teachingExperience)
          ? body.teachingExperience.filter((e: string) => e.trim() !== "")
          : [],
        bio: body.bio || "",
        achievements: Array.isArray(body.achievements)
          ? body.achievements.filter((a: string) => a.trim() !== "")
          : [],
        teaching_philosophy: body.teachingPhilosophy || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: teacher, error } = await supabaseAdmin
        .from("teacher")
        .insert(teacherData)
        .select()
        .single();

      if (error) {
        console.error("❌ Database insert error:", error);
        return NextResponse.json(
          { success: false, error: `Failed to create teacher: ${error.message}` },
          { status: 400 },
        );
      }

      const transformedTeacher = {
        id: teacher.id,
        name: teacher.name,
        subject: teacher.subject,
        email: teacher.email,
        classLevels: teacher.class_levels || [],
        image: teacher.image,
        education: teacher.education || [],
        experience: teacher.experience || "",
        teachingExperience: teacher.teaching_experience || [],
        bio: teacher.bio || "",
        achievements: teacher.achievements || [],
        teachingPhilosophy: teacher.teaching_philosophy || "",
      };

      return NextResponse.json({
        success: true,
        message: "Teacher added successfully",
        data: transformedTeacher,
      });
    }
  } catch (error: any) {
    console.error('🔥 POST Error:', error);
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add teacher" },
      { status: 500 },
    );
  }
}

// ===================================================================
// PUT - Update existing teacher
// ===================================================================
export async function PUT(req: NextRequest) {
  console.log('✏️ PUT /api/admin/teacher - Updating teacher');
  
  try {
    await requireAdminAuth();

    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      
      const id = formData.get('id') as string;
      const name = formData.get('name') as string;
      const subject = formData.get('subject') as string;
      const email = formData.get('email') as string;
      const classLevels = JSON.parse(formData.get('classLevels') as string || '[]');
      const experience = formData.get('experience') as string;
      const education = JSON.parse(formData.get('education') as string || '[]');
      const teachingExperience = JSON.parse(formData.get('teachingExperience') as string || '[]');
      const bio = formData.get('bio') as string;
      const achievements = JSON.parse(formData.get('achievements') as string || '[]');
      const teachingPhilosophy = formData.get('teachingPhilosophy') as string;
      
      if (!id) {
        return NextResponse.json(
          { success: false, error: "Teacher ID required" },
          { status: 400 },
        );
      }

      console.log(`🔍 Checking if teacher exists: ${id}`);
      const { data: existingTeacher } = await supabaseAdmin
        .from("teacher")
        .select("id, image")
        .eq("id", id)
        .single();

      if (!existingTeacher) {
        return NextResponse.json(
          { success: false, error: "Teacher not found" },
          { status: 404 },
        );
      }

      let imageUrl = existingTeacher.image;
      const imageField = formData.get('image');

      // Handle image upload - FIXED VERSION
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

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (name !== undefined) updateData.name = name.trim();
      if (subject !== undefined) updateData.subject = subject.trim();
      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return NextResponse.json(
            { success: false, error: "Invalid email format" },
            { status: 400 },
          );
        }
        updateData.email = email.trim().toLowerCase();
      }
      if (classLevels !== undefined) updateData.class_levels = Array.isArray(classLevels) ? classLevels : [];
      if (imageUrl !== undefined) updateData.image = imageUrl;
      if (education !== undefined) updateData.education = Array.isArray(education) ? education.filter((e: string) => e.trim() !== "") : [];
      if (experience !== undefined) updateData.experience = experience;
      if (teachingExperience !== undefined) updateData.teaching_experience = Array.isArray(teachingExperience) ? teachingExperience.filter((e: string) => e.trim() !== "") : [];
      if (bio !== undefined) updateData.bio = bio;
      if (achievements !== undefined) updateData.achievements = Array.isArray(achievements) ? achievements.filter((a: string) => a.trim() !== "") : [];
      if (teachingPhilosophy !== undefined) updateData.teaching_philosophy = teachingPhilosophy;

      console.log(`💾 Updating teacher ${id}...`);
      const { error } = await supabaseAdmin
        .from("teacher")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error('❌ Update error:', error);
        return NextResponse.json(
          { success: false, error: `Failed to update teacher: ${error.message}` },
          { status: 400 },
        );
      }

      console.log('✅ Teacher updated successfully');
      return NextResponse.json({
        success: true,
        message: "Teacher updated successfully",
      });

    } else {
      const body = await req.json();
      const { id, ...updates } = body;

      if (!id) {
        return NextResponse.json(
          { success: false, error: "Teacher ID required" },
          { status: 400 },
        );
      }

      const { data: existingTeacher } = await supabaseAdmin
        .from("teacher")
        .select("id")
        .eq("id", id)
        .single();

      if (!existingTeacher) {
        return NextResponse.json(
          { success: false, error: "Teacher not found" },
          { status: 404 },
        );
      }

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name !== undefined) updateData.name = updates.name.trim();
      if (updates.subject !== undefined) updateData.subject = updates.subject.trim();
      if (updates.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email.trim())) {
          return NextResponse.json(
            { success: false, error: "Invalid email format" },
            { status: 400 },
          );
        }
        updateData.email = updates.email.trim().toLowerCase();
      }
      if (updates.classLevels !== undefined) updateData.class_levels = Array.isArray(updates.classLevels) ? updates.classLevels : [];
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.education !== undefined) updateData.education = Array.isArray(updates.education) ? updates.education.filter((e: string) => e.trim() !== "") : [];
      if (updates.experience !== undefined) updateData.experience = updates.experience;
      if (updates.teachingExperience !== undefined) updateData.teaching_experience = Array.isArray(updates.teachingExperience) ? updates.teachingExperience.filter((e: string) => e.trim() !== "") : [];
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.achievements !== undefined) updateData.achievements = Array.isArray(updates.achievements) ? updates.achievements.filter((a: string) => a.trim() !== "") : [];
      if (updates.teachingPhilosophy !== undefined) updateData.teaching_philosophy = updates.teachingPhilosophy;

      const { error } = await supabaseAdmin
        .from("teacher")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("❌ Update error:", error);
        return NextResponse.json(
          { success: false, error: `Failed to update teacher: ${error.message}` },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Teacher updated successfully",
      });
    }
  } catch (error: any) {
    console.error('🔥 PUT Error:', error);
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update teacher" },
      { status: 500 },
    );
  }
}

// ===================================================================
// DELETE - Remove teacher
// ===================================================================
export async function DELETE(req: NextRequest) {
  console.log('🗑️ DELETE /api/admin/teacher');
  
  try {
    await requireAdminAuth();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Teacher ID required" },
        { status: 400 },
      );
    }

    console.log(`🔍 Checking teacher ${id} before deletion...`);
    const { data: existingTeacher } = await supabaseAdmin
      .from("teacher")
      .select("id, image")
      .eq("id", id)
      .single();

    if (!existingTeacher) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 },
      );
    }

    // Delete image from storage if it's from Supabase
    if (existingTeacher.image && existingTeacher.image.includes('supabase.co')) {
      try {
        const urlParts = existingTeacher.image.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        console.log(`🗑️ Deleting image from storage: ${fileName}`);
        await supabaseAdmin.storage
          .from('teacher-images')
          .remove([fileName]);
      } catch (storageError) {
        console.warn('⚠️ Failed to delete image from storage:', storageError);
      }
    }

    console.log(`🗑️ Deleting teacher ${id} from database...`);
    const { error } = await supabaseAdmin
      .from("teacher")
      .delete()
      .eq("id", id);

    if (error) {
      console.error('❌ Delete error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to delete teacher: ${error.message}` },
        { status: 400 },
      );
    }

    console.log('✅ Teacher deleted successfully');
    return NextResponse.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error: any) {
    console.error('🔥 DELETE Error:', error);
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete teacher" },
      { status: 500 },
    );
  }
}