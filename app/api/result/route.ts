import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get('rollNumber');

    // Read the result.json file
    const filePath = path.join(process.cwd(), 'app', 'data', 'result.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    // If rollNumber is provided, filter results
    if (rollNumber) {
      const result = data.results.find((r: any) => 
        r.rollNumber.toLowerCase() === rollNumber.toLowerCase()
      );

      if (!result) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'No result found for this roll number',
            suggestions: data.results.slice(0, 3).map((r: any) => r.rollNumber)
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    }

    // Return all results if no roll number is provided
    return NextResponse.json({
      success: true,
      data: data.results,
      count: data.results.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching result data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST method for admin updates
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Read existing data
    const filePath = path.join(process.cwd(), 'app', 'data', 'result.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    // For demo purposes - just return success
    return NextResponse.json({
      success: true,
      message: 'Result updated successfully (demo)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error updating result',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}