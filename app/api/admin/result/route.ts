import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import { checkAdminAuth } from '@/lib/auth-helper';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper functions
function parseSubjectMark(value: any): number {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '-' || trimmed === '' || trimmed.toLowerCase() === 'na' || trimmed.toLowerCase() === 'n/a') {
      return 0;
    }
    const parsed = parseFloat(trimmed);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof value === 'number') {
    return value;
  }
  return 0;
}

function isSubjectOffered(value: any): boolean {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return !(trimmed === '-' || trimmed === '' || trimmed.toLowerCase() === 'na' || trimmed.toLowerCase() === 'n/a');
  }
  return value !== null && value !== undefined;
}

function gradeFromPercentage(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 33) return 'E';
  return 'F';
}

const BATCH_SIZE = 100;

// Check admin authentication
async function requireAdminAuth() {
  const authResult = await checkAdminAuth();
  
  if (!authResult.isAdmin) {
    throw new Error(authResult.error || 'Admin access required');
  }
  return authResult.user;
}

// Check if file already exists for the same class and academic year
async function checkExistingFile(academicYear: string, className: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('upload_history')
      .select('*')
      .eq('academic_year', academicYear)
      .eq('class_name', className)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return null;
    }
    
    return data || null;
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const form = await req.formData();
    const file = form.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'File is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Please upload Excel or CSV files only.' },
        { status: 400 }
      );
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size should be less than 50MB' },
        { status: 400 }
      );
    }

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(sheet);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Excel file is empty or has no data' },
        { status: 400 }
      );
    }

    // Validate headers
    const headers = Object.keys(rows[0]);
    const requiredHeaders = ['Name', 'Roll Number', 'Total Marks', 'Obtain Marks', 'Percentage', 'Status', 'Grade', 'Academic Year', 'Class'];
    
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Missing required headers in the file',
        missingHeaders,
        requiredHeaders
      }, { status: 400 });
    }

    // Extract academic year and class from the first row
    const firstRow = rows[0];
    const academicYear = firstRow['Academic Year']?.toString().trim();
    const className = firstRow['Class']?.toString().trim();

    if (!academicYear) {
      return NextResponse.json(
        { success: false, message: 'Academic Year is required in the CSV file (check first row)' },
        { status: 400 }
      );
    }

    if (!className) {
      return NextResponse.json(
        { success: false, message: 'Class is required in the CSV file (check first row)' },
        { status: 400 }
      );
    }

    // Validate that all rows have the same academic year and class
    const inconsistentRows: number[] = [];
    rows.forEach((row, index) => {
      const rowAcademicYear = row['Academic Year']?.toString().trim();
      const rowClassName = row['Class']?.toString().trim();
      
      if (rowAcademicYear !== academicYear) {
        inconsistentRows.push(index + 1);
      }
      if (rowClassName !== className) {
        inconsistentRows.push(index + 1);
      }
    });

    if (inconsistentRows.length > 0) {
      const uniqueRows = Array.from(new Set(inconsistentRows)).slice(0, 10);
      return NextResponse.json({
        success: false,
        message: `Inconsistent Academic Year or Class found in ${uniqueRows.length} rows`,
        errors: {
          inconsistentRows: uniqueRows,
          expectedAcademicYear: academicYear,
          expectedClassName: className
        }
      }, { status: 400 });
    }

    // Check if file already exists for this class and year
    const existingFile = await checkExistingFile(academicYear, className);
    
    if (existingFile) {
      return NextResponse.json(
        { 
          success: false, 
          message: `A file already exists for ${className} - ${academicYear}. Please delete it first before uploading a new one.`,
          data: {
            existingFile: {
              id: existingFile.id,
              filename: existingFile.filename,
              uploadDate: existingFile.uploaded_at,
              recordCount: existingFile.total_records,
              className: existingFile.class_name,
              academicYear: existingFile.academic_year
            }
          }
        },
        { status: 409 }
      );
    }

    // Prepare data for insertion
    const errors: any[] = [];
    const preparedData = rows.map((row, index) => {
      try {
        // Parse subjects (dynamic based on headers ending with *)
        const subjects: Record<string, any> = {};
        const subjectHeaders = headers.filter(header => 
          header.trim().endsWith('*') && 
          !requiredHeaders.includes(header.replace('*', '').trim())
        );

        let totalObtainMarks = 0;
        let maxTotalMarks = 0;

        for (const header of subjectHeaders) {
          const subjectName = header.replace('*', '').trim();
          const rawValue = row[header];
          const marks = parseSubjectMark(rawValue);
          const offered = isSubjectOffered(rawValue);
          
          subjects[subjectName] = {
            marks: marks,
            offered: offered,
            max_marks: 100
          };
          
          if (offered) {
            totalObtainMarks += marks;
            maxTotalMarks += 100;
          }
        }

        // Parse numeric values
        const totalMarksValue = parseFloat(row['Total Marks']) || maxTotalMarks;
        const obtainMarksValue = parseFloat(row['Obtain Marks']) || totalObtainMarks;
        const percentageValue = parseFloat(row['Percentage']) || 0;
        
        // Calculate percentage if not provided
        const percentage = percentageValue || (maxTotalMarks > 0 ? (obtainMarksValue / maxTotalMarks) * 100 : 0);
        const grade = row['Grade']?.toString().trim() || gradeFromPercentage(percentage);
        const status = row['Status']?.toString().trim().toUpperCase() || (percentage >= 33 ? 'PASS' : 'FAIL');

        // Validate roll number
        const rollNumber = String(row['Roll Number']).trim();
        if (!rollNumber) {
          throw new Error('Roll Number is required');
        }

        // Create record - MATCHING THE EXACT DATABASE SCHEMA
        const record: any = {
          name: row['Name']?.toString().trim() || `Student ${index + 1}`,
          father_name: row['Father Name']?.toString().trim() || '',
          roll_number: rollNumber,
          academic_year: academicYear,
          class_name: className, // Added
          subjects: Object.keys(subjects).length > 0 ? subjects : {},
          total_marks: totalMarksValue,
          obtain_marks: obtainMarksValue,
          percentage: Number(percentage.toFixed(2)),
          status: status,
          grade: grade,
          uploaded_filename: file.name,
          uploaded_at: new Date().toISOString(),
          created_at: new Date().toISOString(), // Added
          updated_at: new Date().toISOString() // Added
        };

        return record;

      } catch (err: any) {
        errors.push({
          row: index + 1,
          roll_number: row['Roll Number'] || 'N/A',
          error: err.message || 'Row processing failed',
          name: row['Name'] || 'Unknown'
        });
        return null;
      }
    }).filter(Boolean); // Remove null entries

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed with ${errors.length} errors`,
          errors: errors.slice(0, 50)
        },
        { status: 400 }
      );
    }

    // Duplicate check within the same file
    const seen = new Set<string>();
    const duplicates: any[] = [];
    
    preparedData.forEach((record: any) => {
      const key = `${record.roll_number}-${record.academic_year}-${record.class_name}`;
      if (seen.has(key)) {
        duplicates.push({
          roll_number: record.roll_number,
          error: 'Duplicate roll number in uploaded file'
        });
      }
      seen.add(key);
    });

    if (duplicates.length > 0) {
      errors.push(...duplicates);
      return NextResponse.json(
        {
          success: false,
          message: `Found ${duplicates.length} duplicate roll numbers in file`,
          errors: duplicates.slice(0, 50)
        },
        { status: 400 }
      );
    }

    // Check for duplicates in database
    const rollNumbers = preparedData.map((r: any) => r.roll_number);
    const { data: existingStudents } = await supabase
      .from('exam_results')
      .select('roll_number, name')
      .in('roll_number', rollNumbers)
      .eq('academic_year', academicYear)
      .eq('class_name', className);

    if (existingStudents && existingStudents.length > 0) {
      existingStudents.forEach(student => {
        errors.push({
          roll_number: student.roll_number,
          error: 'Roll number already exists in database for this class and year',
          existing_name: student.name
        });
      });
      
      return NextResponse.json(
        {
          success: false,
          message: `Found ${existingStudents.length} duplicate roll numbers in database`,
          errors: errors.slice(0, 50)
        },
        { status: 400 }
      );
    }

    // Insert in batches
    let inserted = 0;
    for (let i = 0; i < preparedData.length; i += BATCH_SIZE) {
      const chunk = preparedData.slice(i, i + BATCH_SIZE);      
      const { error } = await supabase
        .from('exam_results')
        .insert(chunk);
      if (error) {
        throw new Error(`Failed to insert batch ${i / BATCH_SIZE + 1}: ${error.message}`);
      }

      inserted += chunk.length;
    }

    // Save upload history
    const uploadHistoryData = {
      filename: file.name,
      file_size: file.size,
      academic_year: academicYear,
      class_name: className, // Added
      total_records: inserted,
      uploaded_by: 'admin',
      uploaded_at: new Date().toISOString(),
      created_at: new Date().toISOString() // Added
    };

    const { error: historyError } = await supabase
      .from('upload_history')
      .insert([uploadHistoryData]);

    if (historyError) {
    }

    // Count total students for this class and year
    const { count: totalStudents } = await supabase
      .from('exam_results')
      .select('*', { count: 'exact', head: true })
      .eq('academic_year', academicYear)
      .eq('class_name', className);


    // Success response
    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${inserted} student records for ${className} - ${academicYear}`,
      data: {
        fileInfo: {
          filename: file.name,
          size: file.size,
          academicYear,
          className
        },
        processingStats: {
          totalRecordsInFile: rows.length,
          successfullyInserted: inserted,
          failed: rows.length - inserted,
          verificationCount: inserted
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {    
    if (err.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Unexpected server error',
        error: err.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get upload history with class_name
    const { data: uploads, error } = await supabase
      .from('upload_history')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    // Get total students count
    const { count: totalStudents } = await supabase
      .from('exam_results')
      .select('*', { count: 'exact', head: true });

    const currentYear = new Date().getFullYear();
    const currentAcademicYear = `${currentYear}-${currentYear + 1}`;

    return NextResponse.json({
      success: true,
      data: {
        uploads: uploads || [],
        statistics: {
          totalUploads: uploads?.length || 0,
          totalStudents: totalStudents || 0
        },
        currentYear: currentAcademicYear
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching upload history',
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID is required for deletion' },
        { status: 400 }
      );
    }

    // First, get the upload record to know which academic year and class to delete
    const { data: uploadRecord, error: fetchError } = await supabase
      .from('upload_history')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }

    const { academic_year, class_name } = uploadRecord;

    // Get count of exam results to be deleted
    const { count: examResultsCount } = await supabase
      .from('exam_results')
      .select('*', { count: 'exact', head: true })
      .eq('academic_year', academic_year)
      .eq('class_name', class_name);

    // Delete exam results first
    const { error: deleteError } = await supabase
      .from('exam_results')
      .delete()
      .eq('academic_year', academic_year)
      .eq('class_name', class_name);

    if (deleteError) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to delete exam results: ${deleteError.message}` 
        },
        { status: 500 }
      );
    }

    // Now delete the upload history record
    const { error: historyDeleteError } = await supabase
      .from('upload_history')
      .delete()
      .eq('id', id);

    if (historyDeleteError) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to delete upload history: ${historyDeleteError.message}` 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${examResultsCount || 0} student records for ${class_name} - ${academic_year}`,
      data: {
        deletedExamResults: examResultsCount || 0,
        academicYear: academic_year,
        className: class_name,
        deletedUploadId: id
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting results',
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}