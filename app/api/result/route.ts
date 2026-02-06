import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Cache configuration
const CACHE_TTL = 60 * 5; // 5 minutes in seconds

// GET handler for fetching results
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const rollNumber = url.searchParams.get('rollNumber');
    
    // Validate required parameters
    if (!rollNumber) {
      return NextResponse.json(
        {
          success: false,
          message: 'Roll number is required',
          code: 'MISSING_ROLL_NUMBER'
        },
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const sanitizedRollNumber = rollNumber.trim().toUpperCase().replace(/\s+/g, '');
    
    if (sanitizedRollNumber.length < 3 || sanitizedRollNumber.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid roll number format',
          code: 'INVALID_ROLL_NUMBER'
        },
        { status: 400 }
      );
    }
    
    // Build query - always get the most recent result for the roll number
    const { data: results, error } = await supabase
      .from('exam_results')
      .select('*')
      .eq('roll_number', sanitizedRollNumber)
      .order('academic_year', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Database error occurred',
          code: 'DATABASE_ERROR'
        },
        { status: 500 }
      );
    }
    
    // Check if result exists
    if (!results || results.length === 0) {
      // Try case-insensitive search as fallback
      const { data: fallbackResults } = await supabase
        .from('exam_results')
        .select('*')
        .ilike('roll_number', sanitizedRollNumber)
        .order('academic_year', { ascending: false })
        .limit(1);
      
      if (!fallbackResults || fallbackResults.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'No result found for the provided roll number',
            code: 'RESULT_NOT_FOUND'
          },
          { status: 404 }
        );
      }
      
      // Use fallback results
      const result = fallbackResults[0];
      return formatResultResponse(result);
    }
    
    // Use the found result
    const result = results[0];
    return formatResultResponse(result);
    
  } catch (error: any) {
    console.error('Unexpected error in result API:', error);
    
    // Ensure we always return JSON, not HTML
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

// Helper function to format result response
function formatResultResponse(result: any) {
  try {
    // Transform subjects from database format to expected format
    const transformedSubjects: Record<string, { marks: number; max_marks: number }> = {};
    
    if (result.subjects && typeof result.subjects === 'object') {
      Object.entries(result.subjects).forEach(([subject, data]: [string, any]) => {
        if (data && typeof data === 'object' && data.offered !== false) {
          transformedSubjects[subject] = {
            marks: data.marks || 0,
            max_marks: data.max_marks || 100
          };
        }
      });
    }
    
    // Construct response data
    const responseData = {
      studentInfo: {
        name: result.name || '',
        fatherName: result.father_name || '',
        rollNumber: result.roll_number || '',
        academicYear: result.academic_year || ''
      },
      marks: transformedSubjects,
      summary: {
        totalMarks: result.total_marks || 0,
        obtainMarks: result.obtain_marks || 0,
        percentage: result.percentage || 0,
        grade: result.grade || '',
        status: result.status || 'Unknown'
      }
    };
    
    // Validate response data
    if (!responseData.studentInfo.name || !responseData.studentInfo.rollNumber) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid result data format',
          code: 'INVALID_RESULT_DATA'
        },
        { status: 500 }
      );
    }
    
    // Add cache headers
    const headers = {
      'Cache-Control': `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`,
      'X-Result-Year': responseData.studentInfo.academicYear
    };
    
    return NextResponse.json(
      {
        success: true,
        message: 'Result fetched successfully',
        data: responseData,
        meta: {
          fetchedAt: new Date().toISOString(),
          academicYear: responseData.studentInfo.academicYear,
          cacheExpiresIn: CACHE_TTL
        }
      },
      { 
        status: 200,
        headers 
      }
    );
  } catch (error: any) {
    console.error('Error formatting result:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing result data',
        code: 'RESULT_PROCESSING_ERROR'
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}