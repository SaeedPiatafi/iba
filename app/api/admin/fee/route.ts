import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to your JSON file
const FEE_FILE_PATH = path.join(process.cwd(), 'app', 'data', 'fee.json');

// Helper function to read fee data
async function readFeeData() {
  try {
    const fileContent = await fs.readFile(FEE_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist or is corrupted, create basic structure
    return {
      academicYear: "2025-2026",
      lastUpdated: new Date().toISOString().split('T')[0],
      currency: "PKR",
      schoolName: "The Educators",
      feeStructure: []
    };
  }
}

// Helper function to write fee data
async function writeFeeData(data: any) {
  // Update last updated date
  data.lastUpdated = new Date().toISOString().split('T')[0];
  await fs.writeFile(FEE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Parse currency to number
const parseCurrency = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  // Remove currency symbols, commas, and spaces
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
};

// Format number to currency string
const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toLocaleString()}`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['className', 'category', 'admissionFee', 'monthlyFee', 'otherCharges', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Read existing fee data
    const feeData = await readFeeData();

    // Check for duplicate class name
    const classExists = feeData.feeStructure.some((fee: any) => 
      fee.className.toLowerCase() === body.className.toLowerCase()
    );

    if (classExists) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fee structure for this class already exists',
          duplicate: true
        },
        { status: 409 }
      );
    }

    // Generate new ID
    const newId = feeData.feeStructure.length > 0 
      ? Math.max(...feeData.feeStructure.map((fee: any) => fee.id)) + 1 
      : 1;

    // Parse currency values
    const admissionNum = parseCurrency(body.admissionFee);
    const monthlyNum = parseCurrency(body.monthlyFee);
    const otherNum = parseCurrency(body.otherCharges);
    const annualNum = monthlyNum * 12;
    const totalNum = admissionNum + annualNum + otherNum;

    // Create new fee entry with formatted currency
    const newFee = {
      id: newId,
      className: body.className,
      category: body.category,
      admissionFee: formatCurrency(admissionNum),
      monthlyFee: formatCurrency(monthlyNum),
      annualFee: formatCurrency(annualNum),
      otherCharges: formatCurrency(otherNum),
      totalAnnual: formatCurrency(totalNum),
      description: body.description,
      isActive: true, // Always active now
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add new fee to structure
    feeData.feeStructure.push(newFee);
    
    // Write back to file
    await writeFeeData(feeData);

    return NextResponse.json({
      success: true,
      message: 'Fee structure added successfully',
      data: newFee
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving fee data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save fee data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const feeData = await readFeeData();
    return NextResponse.json({ success: true, data: feeData });
  } catch (error) {
    console.error('Error reading fee data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read fee data' },
      { status: 500 }
    );
  }
}

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
    
    // Read existing fee data
    const feeData = await readFeeData();
    
    // Find the fee to delete
    const feeIndex = feeData.feeStructure.findIndex((fee: any) => fee.id === feeId);
    
    if (feeIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Fee structure not found' },
        { status: 404 }
      );
    }

    // Remove the fee from the array
    const deletedFee = feeData.feeStructure.splice(feeIndex, 1)[0];
    
    // Write updated data back to file
    await writeFeeData(feeData);

    return NextResponse.json({
      success: true,
      message: 'Fee structure deleted successfully',
      data: deletedFee
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting fee data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete fee data' },
      { status: 500 }
    );
  }
}