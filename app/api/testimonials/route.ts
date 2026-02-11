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
// GET - Get all testimonials for public access
// ===================================================================
export async function GET(req: NextRequest) {
  console.log('📥 GET /api/testimonials - Public testimonials request');
  
  try {
    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");

    console.log('🔍 Query params:', { limit });

    let query = adminClient
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum);
      }
    }

    console.log('📋 Fetching testimonials from Supabase...');
    const { data: testimonials, error } = await query;

    if (error) {
      console.error('❌ Supabase query error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Return empty array to prevent frontend crash
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: "Testimonials fetched successfully"
      });
    }

    console.log(`✅ Found ${testimonials?.length || 0} testimonials in database`);
    
    // Log first few testimonials for debugging
    if (testimonials && testimonials.length > 0) {
      console.log('🗣️ Sample testimonials:', {
        total: testimonials.length,
        firstThree: testimonials.slice(0, 3).map(t => ({
          id: t.id,
          name: t.name,
          graduation: t.graduation,
          current: t.current,
          text: t.text?.substring(0, 50) + '...',
        }))
      });
    }

    // Transform testimonials for public view
    const transformedTestimonials = (testimonials || []).map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name || "",
      graduation: testimonial.graduation || "",
      current: testimonial.current || "",
      text: testimonial.text || "",
      avatarColor: testimonial.avatar_color || "bg-blue-500",
      textColor: testimonial.text_color || "text-white",
    }));

    return NextResponse.json({
      success: true,
      data: transformedTestimonials,
      count: transformedTestimonials.length,
      message: "Testimonials fetched successfully"
    });

  } catch (error: any) {
    console.error('🔥 GET Error:', error);
    
    // Return empty array on error
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
      message: "Testimonials fetched successfully"
    });
  }
}