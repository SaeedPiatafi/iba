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

// School configuration
const SCHOOL_CONFIG = {
  schoolName: "iba-iphss",
  currency: "PKR",
};

export async function GET(request: NextRequest) {
  try {
    // Fetch fee data from Supabase
    const { data: feeData, error } = await supabase
      .from('fee')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch fee data from database' },
        { status: 500 }
      );
    }

    if (!feeData || feeData.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          ...SCHOOL_CONFIG,
          feeStructure: []
        },
        count: 0,
        total: 0,
        timestamp: new Date().toISOString()
      });
    }

    // Transform data to match your expected format
    const transformedData = feeData.map(fee => {
      const admissionFee = Number(fee.admission_fee) || 0;
      const monthlyFee = Number(fee.monthly_fee) || 0;
      const otherCharges = Number(fee.other_charges) || 0;
      const annualFee = monthlyFee * 12;
      const totalAnnual = admissionFee + annualFee + otherCharges;

      return {
        id: fee.id,
        className: fee.class_name,
        category: fee.category,
        admissionFee: admissionFee,
        monthlyFee: monthlyFee,
        otherCharges: otherCharges,
        description: fee.description || '',
        annualFee: annualFee,
        totalAnnual: totalAnnual,
        isActive: fee.is_active,
        createdAt: fee.created_at,
        updatedAt: fee.updated_at,
        formattedAdmissionFee: formatCurrency(admissionFee, SCHOOL_CONFIG.currency),
        formattedMonthlyFee: formatCurrency(monthlyFee, SCHOOL_CONFIG.currency),
        formattedAnnualFee: formatCurrency(annualFee, SCHOOL_CONFIG.currency),
        formattedOtherCharges: formatCurrency(otherCharges, SCHOOL_CONFIG.currency),
        formattedTotalAnnual: formatCurrency(totalAnnual, SCHOOL_CONFIG.currency)
      };
    });

    const totalSum = transformedData.reduce((sum, fee) => sum + fee.totalAnnual, 0);

    return NextResponse.json({
      success: true,
      data: {
        ...SCHOOL_CONFIG,
        feeStructure: transformedData
      },
      count: transformedData.length,
      total: totalSum,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  }
  return `${currency} ${amount.toLocaleString('en-PK')}`;
}