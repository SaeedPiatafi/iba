import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const FEE_FILE_PATH = path.join(process.cwd(), 'app', 'data', 'fee.json');

export async function GET(request: NextRequest) {
  try {
    const fileContent = await fs.readFile(FEE_FILE_PATH, 'utf-8');
    const feeData = JSON.parse(fileContent);
    
    // Format the data for the frontend
    const formattedData = {
      academicYear: feeData.academicYear,
      lastUpdated: feeData.lastUpdated,
      formattedDate: formatDate(feeData.lastUpdated),
      currency: feeData.currency,
      schoolName: feeData.schoolName,
      feeStructure: feeData.feeStructure.map((fee: any) => ({
        ...fee,
        annualFee: fee.monthlyFee * 12,
        totalAnnual: fee.admissionFee + (fee.monthlyFee * 12) + fee.otherCharges,
        formattedAdmissionFee: formatCurrency(fee.admissionFee, feeData.currency),
        formattedMonthlyFee: formatCurrency(fee.monthlyFee, feeData.currency),
        formattedAnnualFee: formatCurrency(fee.monthlyFee * 12, feeData.currency),
        formattedOtherCharges: formatCurrency(fee.otherCharges, feeData.currency),
        formattedTotalAnnual: formatCurrency(
          fee.admissionFee + (fee.monthlyFee * 12) + fee.otherCharges,
          feeData.currency
        )
      }))
    };

    return NextResponse.json({
      success: true,
      data: formattedData,
      count: feeData.feeStructure.length,
      total: feeData.feeStructure.reduce((sum: number, fee: any) => 
        sum + fee.admissionFee + (fee.monthlyFee * 12) + fee.otherCharges, 0
      ),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error reading fee data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read fee data' },
      { status: 500 }
    );
  }
}

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-PK')}`;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}