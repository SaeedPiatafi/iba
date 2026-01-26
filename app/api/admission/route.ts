// app/api/admission/route.ts
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Construct the absolute path to your JSON file
    const dataPath = join(process.cwd(), 'app', 'data', 'admission.json');
    
    // Read and parse the JSON file
    const fileContents = readFileSync(dataPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admission API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load admission data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}