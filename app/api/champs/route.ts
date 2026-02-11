// app/api/champs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Helper function to get Supabase admin client with null check
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
  return supabaseAdmin;
}

// Helper functions for null safety
const safeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

// ===================================================================
// GET - Public endpoint to get champs data
// ===================================================================
export async function GET(req: NextRequest) {
  try {
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

      // Ensure all string fields are safe
      const safeChamp = {
        ...champ,
        name: safeString(champ.name),
        image: safeString(champ.image),
        class: safeString(champ.class),
        description: safeString(champ.description),
        achievements: safeString(champ.achievements),
        exam_board: safeString(champ.exam_board)
      };

      return NextResponse.json({ 
        success: true, 
        data: safeChamp 
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

    // For minimal view (what the component expects)
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

    // Make all champs data safe
    const safeChamps = (champs || []).map(champ => ({
      ...champ,
      name: safeString(champ.name),
      image: safeString(champ.image),
      class: safeString(champ.class),
      description: safeString(champ.description),
      achievements: safeString(champ.achievements),
      exam_board: safeString(champ.exam_board)
    }));
    
    return NextResponse.json({
      success: true,
      count: safeChamps.length,
      data: safeChamps,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: "Server configuration error. Please contact administrator." },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch champs" },
      { status: 500 },
    );
  }
}

// IMPORTANT: Keep POST, PUT, DELETE endpoints protected (admin only)
// Those should remain with admin authentication