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
  return `gallery-${timestamp}-${randomString}.${extension}`;
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
      .from('gallery-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from('gallery-images')
      .getPublicUrl(fileName);
    return { success: true, url: publicUrl };
  } catch (error) {
    return { success: false, error: 'Failed to upload image' };
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
// GET - Get all gallery images or single image by ID
// ===================================================================
export async function GET(req: NextRequest) {
  
  try {
    // Require admin authentication
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    // Get single image by ID
    if (id) {
      
      const { data: image, error } = await adminClient
        .from("gallery_images")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !image) {
        return NextResponse.json(
          { success: false, error: "Image not found" },
          { status: 404 },
        );
      }


      // Transform to frontend format
      const transformedImage = {
        id: image.id,
        src: image.src || "",
        alt: image.alt || "",
        tags: image.tags || [],
        uploadedAt: image.uploaded_at || image.created_at,
      };

      return NextResponse.json({ 
        success: true, 
        data: transformedImage 
      });
    }

    // Get all images
    const { data: images, error } = await adminClient
      .from("gallery_images")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch gallery images" },
        { status: 400 },
      );
    }

    // Transform all images
    const transformedImages = (images || []).map((image) => ({
      id: image.id,
      src: image.src || "",
      alt: image.alt || "",
      tags: image.tags || [],
      uploadedAt: image.uploaded_at || image.created_at,
    }));

    return NextResponse.json({
      success: true,
      count: transformedImages.length,
      data: transformedImages,
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
      { success: false, error: error.message || "Failed to fetch gallery images" },
      { status: 500 },
    );
  }
}

// ===================================================================
// POST - Create new gallery image (with file upload support)
// ===================================================================
export async function POST(req: NextRequest) {
  
  try {
    // Require admin authentication
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file upload
      const formData = await req.formData();
      
      // Log all form data for debugging
      const formEntries: { [key: string]: string } = {};
      for (let [key, value] of formData.entries()) {
        if (isFile(value)) {
          formEntries[key] = `[File: ${value.name}]`;
        } else if (isString(value)) {
          formEntries[key] = value;
        }
      }
      
      // Extract image data
      const alt = formData.get('alt') as string;
      const tags = JSON.parse(formData.get('tags') as string || '[]');
      

      // Validate required fields
      if (!alt?.trim()) {
        return NextResponse.json(
          { success: false, error: "Missing required field: alt text" },
          { status: 400 },
        );
      }

      if (tags.length === 0) {
        return NextResponse.json(
          { success: false, error: "At least one tag is required" },
          { status: 400 },
        );
      }

      // Handle image upload
      let imageUrl = "";
      const imageField = formData.get('image');
      const imageUrlField = formData.get('imageUrl');
      

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
      } else if (isString(imageUrlField) && imageUrlField.trim().length > 0) {
        imageUrl = imageUrlField.trim();
      } else {
        return NextResponse.json(
          { success: false, error: "Image URL or file is required" },
          { status: 400 },
        );
      }

      // Prepare image data for database
      const imageData = {
        src: imageUrl,
        alt: alt.trim(),
        tags: Array.isArray(tags) ? tags : [],
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      // Insert into database
      const { data: image, error: insertError } = await adminClient
        .from("gallery_images")
        .insert(imageData)
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { success: false, error: `Failed to add image: ${insertError.message}` },
          { status: 400 },
        );
      }

      // Transform back for response
      const transformedImage = {
        id: image.id,
        src: image.src,
        alt: image.alt,
        tags: image.tags || [],
        uploadedAt: image.uploaded_at,
      };

      return NextResponse.json({
        success: true,
        message: "Image added successfully",
        data: transformedImage,
      });

    } else {
      // Handle JSON data (for backward compatibility)
      const body = await req.json();

      const requiredFields = ["src", "alt"];
      const missing = requiredFields.filter((f) => !body[f]?.trim());

      if (missing.length) {
        return NextResponse.json(
          { success: false, error: `Missing required fields: ${missing.join(", ")}` },
          { status: 400 },
        );
      }

      if (!body.tags || body.tags.length === 0) {
        return NextResponse.json(
          { success: false, error: "At least one tag is required" },
          { status: 400 },
        );
      }

      const imageData = {
        src: body.src.trim(),
        alt: body.alt.trim(),
        tags: Array.isArray(body.tags) ? body.tags : [],
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: image, error } = await adminClient
        .from("gallery_images")
        .insert(imageData)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to add image: ${error.message}` },
          { status: 400 },
        );
      }

      const transformedImage = {
        id: image.id,
        src: image.src,
        alt: image.alt,
        tags: image.tags || [],
        uploadedAt: image.uploaded_at,
      };

      return NextResponse.json({
        success: true,
        message: "Image added successfully",
        data: transformedImage,
      });
    }
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
      { success: false, error: error.message || "Failed to add image" },
      { status: 500 },
    );
  }
}

// ===================================================================
// PUT - Update existing gallery image
// ===================================================================
export async function PUT(req: NextRequest) {  
  try {
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      
      const id = formData.get('id') as string;
      const alt = formData.get('alt') as string;
      const tags = JSON.parse(formData.get('tags') as string || '[]');
      
      if (!id) {
        return NextResponse.json(
          { success: false, error: "Image ID required" },
          { status: 400 },
        );
      }

      const { data: existingImage } = await adminClient
        .from("gallery_images")
        .select("id, src")
        .eq("id", id)
        .single();

      if (!existingImage) {
        return NextResponse.json(
          { success: false, error: "Image not found" },
          { status: 404 },
        );
      }

      let imageUrl = existingImage.src;
      const imageField = formData.get('image');
      const imageUrlField = formData.get('imageUrl');

      // Handle image upload if a new file is provided
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
      } else if (isString(imageUrlField) && imageUrlField.trim().length > 0) {
        imageUrl = imageUrlField.trim();
      }

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (alt !== undefined && alt.trim() !== '') {
        updateData.alt = alt.trim();
      }
      
      if (tags !== undefined && tags.length > 0) {
        updateData.tags = Array.isArray(tags) ? tags : [];
      }
      
      if (imageUrl !== undefined && imageUrl !== existingImage.src) {
        updateData.src = imageUrl;
      }
      const { error } = await adminClient
        .from("gallery_images")
        .update(updateData)
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to update image: ${error.message}` },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Image updated successfully",
      });

    } else {
      const body = await req.json();
      const { id, ...updates } = body;

      if (!id) {
        return NextResponse.json(
          { success: false, error: "Image ID required" },
          { status: 400 },
        );
      }

      const { data: existingImage } = await adminClient
        .from("gallery_images")
        .select("id")
        .eq("id", id)
        .single();

      if (!existingImage) {
        return NextResponse.json(
          { success: false, error: "Image not found" },
          { status: 404 },
        );
      }

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.alt !== undefined) updateData.alt = updates.alt.trim();
      if (updates.tags !== undefined) updateData.tags = Array.isArray(updates.tags) ? updates.tags : [];
      if (updates.src !== undefined) updateData.src = updates.src;

      const { error } = await adminClient
        .from("gallery_images")
        .update(updateData)
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to update image: ${error.message}` },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Image updated successfully",
      });
    }
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
      { success: false, error: error.message || "Failed to update image" },
      { status: 500 },
    );
  }
}

// ===================================================================
// DELETE - Remove gallery image
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
        { success: false, error: "Image ID required" },
        { status: 400 },
      );
    }
    const { data: existingImage } = await adminClient
      .from("gallery_images")
      .select("id, src")
      .eq("id", id)
      .single();

    if (!existingImage) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 },
      );
    }

    // Delete image from storage if it's from Supabase
    if (existingImage.src && existingImage.src.includes('supabase.co')) {
      try {
        const urlParts = existingImage.src.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await adminClient.storage
          .from('gallery-images')
          .remove([fileName]);
      } catch (storageError) {
      }
    }

    const { error } = await adminClient
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: `Failed to delete image: ${error.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
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
      { success: false, error: error.message || "Failed to delete image" },
      { status: 500 },
    );
  }
}