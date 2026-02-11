import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/auth-helper";

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
// Helper function to require admin authentication
// ===================================================================
async function requireAdminAuth() {
  const authResult = await checkAdminAuth();
  
  if (!authResult.isAdmin) {
    throw new Error(authResult.error || 'Admin access required');
  }
  
  return authResult.user;
}

// Available avatar colors
const AVAILABLE_AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-gray-500'
];

const AVAILABLE_TEXT_COLORS = [
  'text-white',
  'text-black'
];

// ===================================================================
// GET - Get all testimonials or single testimonial by ID
// ===================================================================
export async function GET(req: NextRequest) {  
  try {
    // Require admin authentication
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");


    // Get single testimonial by ID
    if (id) {
      
      const { data: testimonial, error } = await adminClient
        .from("testimonials")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !testimonial) {
        return NextResponse.json(
          { success: false, error: "Testimonial not found" },
          { status: 404 },
        );
      }

      // Transform to frontend format
      const transformedTestimonial = {
        id: testimonial.id,
        name: testimonial.name || "",
        graduation: testimonial.graduation || "",
        current: testimonial.current || "",
        text: testimonial.text || "",
        avatarColor: testimonial.avatar_color || "bg-blue-500",
        textColor: testimonial.text_color || "text-white",
        isActive: testimonial.is_active || true,
        createdAt: testimonial.created_at,
        updatedAt: testimonial.updated_at,
      };

      return NextResponse.json({ 
        success: true, 
        data: transformedTestimonial 
      });
    }

    // Get all testimonials
    const { data: testimonials, error } = await adminClient
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch testimonials" },
        { status: 400 },
      );
    }

    // Transform all testimonials
    const transformedTestimonials = (testimonials || []).map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name || "",
      graduation: testimonial.graduation || "",
      current: testimonial.current || "",
      text: testimonial.text || "",
      avatarColor: testimonial.avatar_color || "bg-blue-500",
      textColor: testimonial.text_color || "text-white",
      isActive: testimonial.is_active || true,
      createdAt: testimonial.created_at,
      updatedAt: testimonial.updated_at,
    }));

    return NextResponse.json({
      success: true,
      count: transformedTestimonials.length,
      data: transformedTestimonials,
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
        { success: false, error: "Server configuration error. Please contact administrator." },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}

// ===================================================================
// POST - Create new testimonial
// ===================================================================
export async function POST(req: NextRequest) {
  
  try {
    // Require admin authentication
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const body = await req.json();
    

    // Validate required fields
    const requiredFields = ["name", "graduation", "current", "text"];
    const missing = requiredFields.filter((f) => !body[f]?.trim());

    if (missing.length) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    // Validate avatar color
    if (body.avatarColor && !AVAILABLE_AVATAR_COLORS.includes(body.avatarColor)) {
      return NextResponse.json(
        { success: false, error: `Invalid avatar color. Available colors: ${AVAILABLE_AVATAR_COLORS.join(", ")}` },
        { status: 400 },
      );
    }

    // Validate text color
    if (body.textColor && !AVAILABLE_TEXT_COLORS.includes(body.textColor)) {
      return NextResponse.json(
        { success: false, error: `Invalid text color. Available colors: ${AVAILABLE_TEXT_COLORS.join(", ")}` },
        { status: 400 },
      );
    }

    // Prepare testimonial data for database
    const testimonialData = {
      name: body.name.trim(),
      graduation: body.graduation.trim(),
      current: body.current.trim(),
      text: body.text.trim(),
      avatar_color: body.avatarColor || AVAILABLE_AVATAR_COLORS[0],
      text_color: body.textColor || AVAILABLE_TEXT_COLORS[0],
      is_active: body.isActive !== undefined ? body.isActive : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };


    // Insert into database
    const { data: testimonial, error: insertError } = await adminClient
      .from("testimonials")
      .insert(testimonialData)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { success: false, error: `Failed to add testimonial: ${insertError.message}` },
        { status: 400 },
      );
    }

    // Transform back for response
    const transformedTestimonial = {
      id: testimonial.id,
      name: testimonial.name,
      graduation: testimonial.graduation,
      current: testimonial.current,
      text: testimonial.text,
      avatarColor: testimonial.avatar_color,
      textColor: testimonial.text_color,
      isActive: testimonial.is_active,
      createdAt: testimonial.created_at,
      updatedAt: testimonial.updated_at,
    };

    return NextResponse.json({
      success: true,
      message: "Testimonial added successfully",
      data: transformedTestimonial,
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
        { success: false, error: "Server configuration error. Please contact administrator." },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add testimonial" },
      { status: 500 },
    );
  }
}

// ===================================================================
// PUT - Update existing testimonial
// ===================================================================
export async function PUT(req: NextRequest) {  
  try {
    await requireAdminAuth();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Testimonial ID required" },
        { status: 400 },
      );
    }

    const { data: existingTestimonial } = await adminClient
      .from("testimonials")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 },
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Update fields if provided
    if (updates.name !== undefined) updateData.name = updates.name.trim();
    if (updates.graduation !== undefined) updateData.graduation = updates.graduation.trim();
    if (updates.current !== undefined) updateData.current = updates.current.trim();
    if (updates.text !== undefined) updateData.text = updates.text.trim();
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    
    // Validate and update avatar color
    if (updates.avatarColor !== undefined) {
      if (!AVAILABLE_AVATAR_COLORS.includes(updates.avatarColor)) {
        return NextResponse.json(
          { success: false, error: `Invalid avatar color. Available colors: ${AVAILABLE_AVATAR_COLORS.join(", ")}` },
          { status: 400 },
        );
      }
      updateData.avatar_color = updates.avatarColor;
    }
    
    // Validate and update text color
    if (updates.textColor !== undefined) {
      if (!AVAILABLE_TEXT_COLORS.includes(updates.textColor)) {
        return NextResponse.json(
          { success: false, error: `Invalid text color. Available colors: ${AVAILABLE_TEXT_COLORS.join(", ")}` },
          { status: 400 },
        );
      }
      updateData.text_color = updates.textColor;
    }

    const { error } = await adminClient
      .from("testimonials")
      .update(updateData)
      .eq("id", id);

    if (error) {

      return NextResponse.json(
        { success: false, error: `Failed to update testimonial: ${error.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully",
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
        { success: false, error: "Server configuration error. Please contact administrator." },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update testimonial" },
      { status: 500 },
    );
  }
}

// ===================================================================
// DELETE - Remove testimonial
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
        { success: false, error: "Testimonial ID required" },
        { status: 400 },
      );
    }
    const { data: existingTestimonial } = await adminClient
      .from("testimonials")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 },
      );
    }


    const { error } = await adminClient
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {

      return NextResponse.json(
        { success: false, error: `Failed to delete testimonial: ${error.message}` },
        { status: 400 },
      );
    }


    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
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
        { success: false, error: "Server configuration error. Please contact administrator." },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete testimonial" },
      { status: 500 },
    );
  }
}