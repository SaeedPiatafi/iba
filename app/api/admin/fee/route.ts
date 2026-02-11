import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper functions
const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

// GET - Fetch all fee structures OR single fee by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    

    
    // If ID is provided, fetch single fee
    if (id) {
      const feeId = parseInt(id);
      
      if (isNaN(feeId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid fee ID' },
          { status: 400 }
        );
      }
      
      const { data: feeData, error } = await supabase
        .from('fee')
        .select('*')
        .eq('id', feeId)
        .single();
      
      if (error) {
  
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { success: false, error: 'Fee structure not found' },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { success: false, error: 'Failed to fetch fee data from database' },
          { status: 500 }
        );
      }
      
      if (!feeData) {
        return NextResponse.json(
          { success: false, error: 'Fee structure not found' },
          { status: 404 }
        );
      }
      
      // Transform single fee
      const admissionFee = Number(feeData.admission_fee) || 0;
      const monthlyFee = Number(feeData.monthly_fee) || 0;
      const otherCharges = Number(feeData.other_charges) || 0;
      const annualFee = monthlyFee * 12;
      const totalAnnual = admissionFee + annualFee + otherCharges;
      
      const formattedFee = {
        id: feeData.id,
        className: feeData.class_name,
        category: feeData.category,
        admissionFee: formatCurrency(admissionFee),
        monthlyFee: formatCurrency(monthlyFee),
        annualFee: formatCurrency(annualFee),
        otherCharges: formatCurrency(otherCharges),
        totalAnnual: formatCurrency(totalAnnual),
        description: feeData.description || '',
        createdAt: feeData.created_at,
        updatedAt: feeData.updated_at
      };
      
      return NextResponse.json({
        success: true,
        data: formattedFee
      });
    }
    
    // Fetch all fees

    const { data: feeData, error } = await supabase
      .from('fee')
      .select('*')
      .order('id', { ascending: true });

    if (error) {

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch fee data from database'
        },
        { status: 500 }
      );
    }

    
    // Transform data
    const transformedData = (feeData || []).map(fee => {
      const admissionFee = Number(fee.admission_fee) || 0;
      const monthlyFee = Number(fee.monthly_fee) || 0;
      const otherCharges = Number(fee.other_charges) || 0;
      const annualFee = monthlyFee * 12;
      const totalAnnual = admissionFee + annualFee + otherCharges;

      return {
        id: fee.id,
        className: fee.class_name,
        category: fee.category,
        admissionFee: formatCurrency(admissionFee),
        monthlyFee: formatCurrency(monthlyFee),
        annualFee: formatCurrency(annualFee),
        otherCharges: formatCurrency(otherCharges),
        totalAnnual: formatCurrency(totalAnnual),
        description: fee.description || '',
        createdAt: fee.created_at,
        updatedAt: fee.updated_at
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        feeStructure: transformedData,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error: any) {

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new fee structure
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    
    // Validate required fields
    if (!body.className || !body.category || !body.monthlyFee) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse numeric values
    const admissionFee = Number(body.admissionFee) || 0;
    const monthlyFee = Number(body.monthlyFee) || 0;
    const otherCharges = Number(body.otherCharges) || 0;

    // Check for duplicate
    const { data: existingFee, error: checkError } = await supabase
      .from('fee')
      .select('id')
      .eq('class_name', body.className)
      .maybeSingle();

    if (checkError) {

      return NextResponse.json(
        { success: false, error: 'Failed to check existing fees' },
        { status: 500 }
      );
    }

    if (existingFee) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fee structure for this class already exists',
          duplicate: true
        },
        { status: 409 }
      );
    }

    // Insert new fee
    const { data: newFee, error: insertError } = await supabase
      .from('fee')
      .insert({
        class_name: body.className,
        category: body.category,
        admission_fee: admissionFee,
        monthly_fee: monthlyFee,
        other_charges: otherCharges,
        description: body.description || '',
        academic_year: '2025-2026'
      })
      .select()
      .single();

    if (insertError) {

      return NextResponse.json(
        { success: false, error: 'Failed to create fee structure' },
        { status: 500 }
      );
    }

    // Format response
    const annualFee = monthlyFee * 12;
    const totalAnnual = admissionFee + annualFee + otherCharges;

    const formattedFee = {
      id: newFee.id,
      className: newFee.class_name,
      category: newFee.category,
      admissionFee: formatCurrency(admissionFee),
      monthlyFee: formatCurrency(monthlyFee),
      annualFee: formatCurrency(annualFee),
      otherCharges: formatCurrency(otherCharges),
      totalAnnual: formatCurrency(totalAnnual),
      description: newFee.description || '',
      createdAt: newFee.created_at,
      updatedAt: newFee.updated_at
    };

    return NextResponse.json({
      success: true,
      message: 'Fee structure added successfully',
      data: formattedFee
    }, { status: 201 });

  } catch (error: any) {
 
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save fee data'
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing fee structure
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Fee ID is required' },
        { status: 400 }
      );
    }
    
    if (!body.className || !body.category || !body.monthlyFee) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const feeId = parseInt(body.id);
    if (isNaN(feeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid fee ID' },
        { status: 400 }
      );
    }

    // Parse numeric values
    const admissionFee = Number(body.admissionFee) || 0;
    const monthlyFee = Number(body.monthlyFee) || 0;
    const otherCharges = Number(body.otherCharges) || 0;

    // Check if fee exists
    const { data: existingFee, error: checkError } = await supabase
      .from('fee')
      .select('*')
      .eq('id', feeId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Fee structure not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Failed to find fee structure' },
        { status: 500 }
      );
    }

    // Check for duplicate class name (excluding current fee)
    const { data: duplicateFee, error: duplicateError } = await supabase
      .from('fee')
      .select('id')
      .eq('class_name', body.className)
      .neq('id', feeId)
      .maybeSingle();

    if (duplicateError) {
     
    }

    if (duplicateFee) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Another fee structure with this class name already exists',
          duplicate: true
        },
        { status: 409 }
      );
    }

    // Update fee in database
    const { data: updatedFee, error: updateError } = await supabase
      .from('fee')
      .update({
        class_name: body.className,
        category: body.category,
        admission_fee: admissionFee,
        monthly_fee: monthlyFee,
        other_charges: otherCharges,
        description: body.description || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', feeId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: 'Failed to update fee structure' },
        { status: 500 }
      );
    }

    // Format response
    const annualFee = monthlyFee * 12;
    const totalAnnual = admissionFee + annualFee + otherCharges;

    const formattedFee = {
      id: updatedFee.id,
      className: updatedFee.class_name,
      category: updatedFee.category,
      admissionFee: formatCurrency(admissionFee),
      monthlyFee: formatCurrency(monthlyFee),
      annualFee: formatCurrency(annualFee),
      otherCharges: formatCurrency(otherCharges),
      totalAnnual: formatCurrency(totalAnnual),
      description: updatedFee.description || '',
      createdAt: updatedFee.created_at,
      updatedAt: updatedFee.updated_at
    };

    return NextResponse.json({
      success: true,
      message: 'Fee structure updated successfully',
      data: formattedFee
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update fee data'
      },
      { status: 500 }
    );
  }
}

// DELETE - COMPLETELY DELETE fee structure (hard delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Fee ID is required' },
        { status: 400 }
      );
    }

    const feeId = parseInt(id);
    
    if (isNaN(feeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid fee ID' },
        { status: 400 }
      );
    }

    // Check if fee exists first to return details in response
    const { data: existingFee, error: checkError } = await supabase
      .from('fee')
      .select('*')
      .eq('id', feeId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Fee structure not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Failed to find fee structure' },
        { status: 500 }
      );
    }

    // HARD DELETE - completely remove from database
    const { error: deleteError } = await supabase
      .from('fee')
      .delete()
      .eq('id', feeId);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete fee structure' },
        { status: 500 }
      );
    }

    // Format the deleted fee for response
    const admissionFee = Number(existingFee.admission_fee) || 0;
    const monthlyFee = Number(existingFee.monthly_fee) || 0;
    const otherCharges = Number(existingFee.other_charges) || 0;
    const annualFee = monthlyFee * 12;
    const totalAnnual = admissionFee + annualFee + otherCharges;

    const deletedFee = {
      id: existingFee.id,
      className: existingFee.class_name,
      category: existingFee.category,
      admissionFee: formatCurrency(admissionFee),
      monthlyFee: formatCurrency(monthlyFee),
      annualFee: formatCurrency(annualFee),
      otherCharges: formatCurrency(otherCharges),
      totalAnnual: formatCurrency(totalAnnual),
      description: existingFee.description || '',
      createdAt: existingFee.created_at,
      updatedAt: existingFee.updated_at
    };


    return NextResponse.json({
      success: true,
      message: 'Fee structure permanently deleted',
      data: deletedFee
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete fee data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}