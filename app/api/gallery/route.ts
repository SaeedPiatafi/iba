import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ===================================================================
// Helper function to get Supabase admin client with null check
// ===================================================================
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
  return supabaseAdmin;
}

// ===================================================================
// GET - Get all gallery images for public access
// ===================================================================
export async function GET(req: NextRequest) {
  try {
    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const limit = searchParams.get("limit");


    let query = adminClient
      .from("gallery_images")
      .select("*")
      .order("uploaded_at", { ascending: false });

    // Apply tag filter if provided
    if (tag) {
      query = query.contains("tags", [tag]);
    }

    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum);
      }
    }

    const { data: images, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch gallery images" },
        { status: 400 },
      );
    }

    // Transform images for public view
    const transformedImages = (images || []).map((image) => ({
      id: image.id,
      src: image.src || "",
      alt: image.alt || "",
      tags: image.tags || [],
      uploadedAt: image.uploaded_at || image.created_at,
    }));

    // Get all unique tags for filtering
    const allTags = Array.from(
      new Set(
        (images || [])
          .flatMap(img => img.tags || [])
          .filter(Boolean)
      )
    ).sort();

    // Get stats
    const stats = {
      totalImages: images?.length || 0,
      tags: allTags,
      latestUpdate: images && images.length > 0 
        ? new Date(images[0].updated_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        images: transformedImages,
      },
    });

  } catch (error: any) {
    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: "Server configuration error. Please contact administrator." },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery images" },
      { status: 500 },
    );
  }
}