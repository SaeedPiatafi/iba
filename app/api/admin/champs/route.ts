import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/auth-helper";

// Allowed image types and max file size (5MB)
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Type guard functions
const isFile = (value: any): value is File => {
  return value instanceof File;
};

const isString = (value: any): value is string => {
  return typeof value === 'string';
};

// Generate unique filename for champs
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `champ-${timestamp}-${randomString}.${extension}`;
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

// Helper function to get Supabase admin client with null check
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
  return supabaseAdmin;
}

// Upload image to Supabase Storage
const uploadImageToStorage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const validation = validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const fileName = generateFileName(file.name);
    const fileBuffer = await file.arrayBuffer();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();
    
    // Upload to Supabase Storage
    const { error: uploadError } = await adminClient.storage
      .from('champ-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from('champ-images')
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    return { success: false, error: 'Failed to upload image' };
  }
};

// Delete image from storage
const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  try {
    // Only delete if it's from our Supabase storage
    if (imageUrl && imageUrl.includes('supabase.co')) {
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      if (fileName) {
        // Get the Supabase admin client
        const adminClient = getSupabaseAdmin();
        
        await adminClient.storage
          .from('champ-images')
          .remove([fileName]);
      }
    }
  } catch (error) {
    // Silently fail - image deletion is not critical
  }
};

// Helper function to require admin authentication
async function requireAdminAuth() {
  const authResult = await checkAdminAuth();
  
  if (!authResult.isAdmin) {
    throw new Error(authResult.error || 'Admin access required');
  }
  
  return authResult.user;
}

// ===================================================================
// GET - Get all champs or single champ by ID
// ===================================================================
export async function GET(req: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const year = searchParams.get("year");
    const classFilter = searchParams.get("class");
    const minimal = searchParams.get("minimal");

    // Get single champ by ID
    if (id) {
      const { data: champ, error } = await adminClient
        .from("champs")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !champ) {
        return NextResponse.json(
          { success: false, error: "Champ not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ 
        success: true, 
        data: champ 
      });
    }

    // Get all champs with optional filters
    let query = adminClient
      .from("champs")
      .select("*");

    // Apply filters
    if (year) {
      query = query.eq("year", parseInt(year));
    }
    if (classFilter) {
      query = query.eq("class", classFilter);
    }

    // For minimal view
    if (minimal === "true") {
      query = query.select("id, name, percentage, image, year, class");
    }

    // Order by percentage and year
    query = query.order("percentage", { ascending: false })
                .order("year", { ascending: false });

    const { data: champs, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch champs" },
        { status: 400 },
      );
    }
    
    return NextResponse.json({
      success: true,
      count: champs?.length || 0,
      data: champs || [],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 },
      );
    }
    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch champs" },
      { status: 500 },
    );
  }
}

// ===================================================================
// POST - Create new champ (with file upload support)
// ===================================================================
export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const formData = await req.formData();
    
    // Extract champ data
    const name = formData.get('name') as string;
    const percentage = formData.get('percentage') as string;
    const year = formData.get('year') as string;
    const classValue = formData.get('class') as string;
    const description = formData.get('description') as string;
    const rank_position = formData.get('rank_position') as string;
    const achievements = formData.get('achievements') as string;
    const exam_board = formData.get('exam_board') as string;

    // Validate required fields
    if (!name?.trim() || !percentage || !year || !classValue) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, percentage, year, class" },
        { status: 400 },
      );
    }

    // Validate percentage
    const percentageNum = parseFloat(percentage);
    if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
      return NextResponse.json(
        { success: false, error: "Percentage must be between 0 and 100" },
        { status: 400 },
      );
    }

    // Validate year
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear + 1) {
      return NextResponse.json(
        { success: false, error: `Year must be between 2000 and ${currentYear + 1}` },
        { status: 400 },
      );
    }

    // Handle image upload
    let imageUrl = null;
    const imageField = formData.get('image');

    if (isFile(imageField) && imageField.size > 0) {
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

    // Prepare champ data for database
    const champData = {
      name: name.trim(),
      percentage: percentageNum,
      year: yearNum,
      class: classValue,
      description: description?.trim() || '',
      rank_position: rank_position ? parseInt(rank_position) : null,
      achievements: achievements?.trim() || '',
      exam_board: exam_board?.trim() || 'FBISE',
      image: imageUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert into database
    const { data: champ, error: insertError } = await adminClient
      .from("champs")
      .insert(champData)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { success: false, error: `Failed to create champ: ${insertError.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Champ created successfully",
      data: champ,
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error: any) {
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 },
      );
    }
    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add champ" },
      { status: 500 },
    );
  }
}

// ===================================================================
// PUT - Update existing champ
// ===================================================================
export async function PUT(req: NextRequest) {
  try {
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const formData = await req.formData();
    
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const percentage = formData.get('percentage') as string;
    const year = formData.get('year') as string;
    const classValue = formData.get('class') as string;
    const description = formData.get('description') as string;
    const rank_position = formData.get('rank_position') as string;
    const achievements = formData.get('achievements') as string;
    const exam_board = formData.get('exam_board') as string;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Champ ID required" },
        { status: 400 },
      );
    }

    const { data: existingChamp } = await adminClient
      .from("champs")
      .select("*")
      .eq("id", id)
      .single();

    if (!existingChamp) {
      return NextResponse.json(
        { success: false, error: "Champ not found" },
        { status: 404 },
      );
    }

    let imageUrl = existingChamp.image;
    const imageField = formData.get('image');
    const oldImageUrl = existingChamp.image;

    // Handle image upload or URL
    if (isFile(imageField) && imageField.size > 0) {
      const uploadResult = await uploadImageToStorage(imageField);
      if (uploadResult.success && uploadResult.url) {
        imageUrl = uploadResult.url;
        // Delete old image from storage if it exists
        if (oldImageUrl) {
          await deleteImageFromStorage(oldImageUrl);
        }
      } else if (uploadResult.error) {
        return NextResponse.json(
          { success: false, error: uploadResult.error },
          { status: 400 }
        );
      }
    } else if (isString(imageField)) {
      if (imageField.trim().length > 0) {
        imageUrl = imageField.trim();
        // If new URL is different from old URL and old URL was from our storage, delete it
        if (oldImageUrl && oldImageUrl !== imageUrl && oldImageUrl.includes('supabase.co')) {
          await deleteImageFromStorage(oldImageUrl);
        }
      } else {
        // Empty image field means remove image
        imageUrl = null;
        // Delete old image from storage if it exists
        if (oldImageUrl) {
          await deleteImageFromStorage(oldImageUrl);
        }
      }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined && name.trim() !== '') updateData.name = name.trim();
    if (percentage !== undefined && percentage.trim() !== '') {
      const percentageNum = parseFloat(percentage);
      if (!isNaN(percentageNum) && percentageNum >= 0 && percentageNum <= 100) {
        updateData.percentage = percentageNum;
      }
    }
    if (year !== undefined && year.trim() !== '') {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) {
        updateData.year = yearNum;
      }
    }
    if (classValue !== undefined && classValue.trim() !== '') updateData.class = classValue.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (rank_position !== undefined) {
      updateData.rank_position = rank_position.trim() !== '' ? parseInt(rank_position) : null;
    }
    if (achievements !== undefined) updateData.achievements = achievements.trim();
    if (exam_board !== undefined && exam_board.trim() !== '') updateData.exam_board = exam_board.trim();
    if (imageUrl !== undefined) updateData.image = imageUrl;

    const { data: updatedChamp, error: updateError } = await adminClient
      .from("champs")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: `Failed to update champ: ${updateError.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Champ updated successfully",
      data: updatedChamp,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 },
      );
    }
    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update champ" },
      { status: 500 },
    );
  }
}

// ===================================================================
// DELETE - Remove champ
// ===================================================================
export async function DELETE(req: NextRequest) {
  try {
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Champ ID required" },
        { status: 400 },
      );
    }

    const { data: existingChamp } = await adminClient
      .from("champs")
      .select("*")
      .eq("id", id)
      .single();

    if (!existingChamp) {
      return NextResponse.json(
        { success: false, error: "Champ not found" },
        { status: 404 },
      );
    }

    // Delete image from storage if it exists and is from our Supabase storage
    if (existingChamp.image) {
      await deleteImageFromStorage(existingChamp.image);
    }

    const { error } = await adminClient
      .from("champs")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: `Failed to delete champ: ${error.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Champ deleted successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 },
      );
    }
    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete champ" },
      { status: 500 },
    );
  }
}