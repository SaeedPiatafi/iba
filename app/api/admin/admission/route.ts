"use server";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/auth-helper";

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
// GET - Get admission data
// ===================================================================
export async function GET(req: NextRequest) {
  try {
    // Public endpoint - no authentication required for viewing
    const { searchParams } = new URL(req.url);
    const adminView = searchParams.get("admin");

    if (adminView === "true") {
      // For admin view, require authentication
      try {
        await requireAdminAuth();
      } catch (authError: any) {
        if (authError.message.includes('Admin access required')) {
          return NextResponse.json(
            { success: false, error: "Unauthorized. Please log in as admin." },
            { status: 401 },
          );
        }
      }
    }

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();
    
    // Get the first admission record (there should be only one)
    const { data: admissionData, error } = await adminClient
      .from("admission")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      // If no data exists, return empty structure
      const emptyData = {
        admissionSteps: [],
        documentRequirements: [],
        importantDates: [],
        eligibilityCriteria: [],
        importantNotes: [],
        admissionTestDetails: [],
        feeInformation: [],
        contactInfo: {
          email: "admissions@school.edu.pk",
          phone: "021-111-222-333"
        }
      };

      return NextResponse.json({ 
        success: true, 
        data: emptyData,
        timestamp: new Date().toISOString()
      });
    }

    // Transform data to camelCase for frontend
    const transformedData = {
      admissionSteps: admissionData.admission_steps || [],
      documentRequirements: admissionData.document_requirements || [],
      importantDates: admissionData.important_dates || [],
      eligibilityCriteria: admissionData.eligibility_criteria || [],
      importantNotes: admissionData.important_notes || [],
      admissionTestDetails: admissionData.admission_test_details || [],
      feeInformation: admissionData.fee_information || [],
      contactInfo: admissionData.contact_info || {
        email: "admissions@school.edu.pk",
        phone: "021-111-222-333"
      }
    };

    return NextResponse.json({ 
      success: true, 
      data: transformedData,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to fetch admission data" 
      },
      { status: 500 },
    );
  }
}

// ===================================================================
// POST - Update admission data (admin only)
// ===================================================================
export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const body = await req.json();

    // Validate that we have at least one field to update
    const allowedFields = [
      'admissionSteps', 
      'documentRequirements', 
      'importantDates', 
      'eligibilityCriteria',
      'importantNotes',
      'admissionTestDetails',
      'feeInformation',
      'contactInfo'
    ];
    
    const hasValidField = allowedFields.some(field => field in body);
    
    if (!hasValidField) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 },
      );
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Map camelCase to snake_case for database
    if (body.admissionSteps !== undefined) {
      updateData.admission_steps = Array.isArray(body.admissionSteps) ? body.admissionSteps : [];
    }
    if (body.documentRequirements !== undefined) {
      updateData.document_requirements = Array.isArray(body.documentRequirements) ? body.documentRequirements : [];
    }
    if (body.importantDates !== undefined) {
      updateData.important_dates = Array.isArray(body.importantDates) ? body.importantDates : [];
    }
    if (body.eligibilityCriteria !== undefined) {
      updateData.eligibility_criteria = Array.isArray(body.eligibilityCriteria) ? body.eligibilityCriteria : [];
    }
    if (body.importantNotes !== undefined) {
      updateData.important_notes = Array.isArray(body.importantNotes) ? body.importantNotes : [];
    }
    if (body.admissionTestDetails !== undefined) {
      updateData.admission_test_details = Array.isArray(body.admissionTestDetails) ? body.admissionTestDetails : [];
    }
    if (body.feeInformation !== undefined) {
      updateData.fee_information = Array.isArray(body.feeInformation) ? body.feeInformation : [];
    }
    if (body.contactInfo !== undefined) {
      updateData.contact_info = {
        email: body.contactInfo.email || "",
        phone: body.contactInfo.phone || ""
      };
    }

    // Check if admission record exists
    const { data: existingData } = await adminClient
      .from("admission")
      .select("id")
      .limit(1)
      .single();

    let result;

    if (existingData) {
      // Update existing record
      const { data, error } = await adminClient
        .from("admission")
        .update(updateData)
        .eq("id", existingData.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to update admission data: ${error.message}` },
          { status: 400 },
        );
      }

      result = data;
    } else {
      // Create new record
      const { data, error } = await adminClient
        .from("admission")
        .insert(updateData)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to create admission data: ${error.message}` },
          { status: 400 },
        );
      }

      result = data;
    }

    // Transform back to camelCase for response
    const transformedData = {
      admissionSteps: result.admission_steps || [],
      documentRequirements: result.document_requirements || [],
      importantDates: result.important_dates || [],
      eligibilityCriteria: result.eligibility_criteria || [],
      importantNotes: result.important_notes || [],
      admissionTestDetails: result.admission_test_details || [],
      feeInformation: result.fee_information || [],
      contactInfo: result.contact_info || {
        email: "admissions@school.edu.pk",
        phone: "021-111-222-333"
      }
    };

    return NextResponse.json({
      success: true,
      message: "Admission data saved successfully",
      data: transformedData,
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
      { success: false, error: error.message || "Failed to save admission data" },
      { status: 500 },
    );
  }
}

// ===================================================================
// PUT - Complete update (replace all data)
// ===================================================================
export async function PUT(req: NextRequest) {
  try {
    await requireAdminAuth();
    
    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const body = await req.json();

    // Validate required structure
    const requiredFields = {
      admissionSteps: body.admissionSteps || [],
      documentRequirements: body.documentRequirements || [],
      importantDates: body.importantDates || [],
      eligibilityCriteria: body.eligibilityCriteria || [],
      importantNotes: body.importantNotes || [],
      admissionTestDetails: body.admissionTestDetails || [],
      feeInformation: body.feeInformation || [],
      contactInfo: body.contactInfo || {
        email: "admissions@school.edu.pk",
        phone: "021-111-222-333"
      }
    };

    // Prepare complete data
    const completeData = {
      admission_steps: Array.isArray(requiredFields.admissionSteps) ? requiredFields.admissionSteps : [],
      document_requirements: Array.isArray(requiredFields.documentRequirements) ? requiredFields.documentRequirements : [],
      important_dates: Array.isArray(requiredFields.importantDates) ? requiredFields.importantDates : [],
      eligibility_criteria: Array.isArray(requiredFields.eligibilityCriteria) ? requiredFields.eligibilityCriteria : [],
      important_notes: Array.isArray(requiredFields.importantNotes) ? requiredFields.importantNotes : [],
      admission_test_details: Array.isArray(requiredFields.admissionTestDetails) ? requiredFields.admissionTestDetails : [],
      fee_information: Array.isArray(requiredFields.feeInformation) ? requiredFields.feeInformation : [],
      contact_info: {
        email: requiredFields.contactInfo.email || "",
        phone: requiredFields.contactInfo.phone || ""
      },
      updated_at: new Date().toISOString()
    };

    // Check if admission record exists
    const { data: existingData } = await adminClient
      .from("admission")
      .select("id")
      .limit(1)
      .single();

    let result;

    if (existingData) {
      // Update existing record
      const { data, error } = await adminClient
        .from("admission")
        .update(completeData)
        .eq("id", existingData.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to update admission data: ${error.message}` },
          { status: 400 },
        );
      }

      result = data;
    } else {
      // Create new record
      const { data, error } = await adminClient
        .from("admission")
        .insert(completeData)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to create admission data: ${error.message}` },
          { status: 400 },
        );
      }

      result = data;
    }

    // Transform back to camelCase for response
    const transformedData = {
      admissionSteps: result.admission_steps || [],
      documentRequirements: result.document_requirements || [],
      importantDates: result.important_dates || [],
      eligibilityCriteria: result.eligibility_criteria || [],
      importantNotes: result.important_notes || [],
      admissionTestDetails: result.admission_test_details || [],
      feeInformation: result.fee_information || [],
      contactInfo: result.contact_info || {
        email: "admissions@school.edu.pk",
        phone: "021-111-222-333"
      }
    };

    return NextResponse.json({
      success: true,
      message: "Admission data updated successfully",
      data: transformedData,
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
      { success: false, error: error.message || "Failed to update admission data" },
      { status: 500 },
    );
  }
}