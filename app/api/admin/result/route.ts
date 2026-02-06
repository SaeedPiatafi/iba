import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

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

async function ensureStorageBucket() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) return false;

    const resultsBucketExists = buckets?.some(bucket => bucket.name === 'results');
    if (!resultsBucketExists) {
      const { error: createError } = await supabase.storage.createBucket('results', {
        public: true,
        fileSizeLimit: 52428800,
        allowedMimeTypes: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv',
          'application/csv'
        ]
      });
      if (createError) return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

async function uploadFileToStorage(file: File): Promise<{ path: string; url: string }> {
  try {
    const bucketReady = await ensureStorageBucket();
    if (!bucketReady) throw new Error('Failed to ensure storage bucket exists');

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = `exam-results/${fileName}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { error } = await supabase.storage
      .from('results')
      .upload(filePath, buffer, {
        contentType: file.type || 'application/vnd.ms-excel',
        upsert: true,
        cacheControl: '3600'
      });

    if (error) throw new Error(`Storage upload failed: ${error.message}`);

    const { data: urlData } = await supabase.storage.from('results').getPublicUrl(filePath);
    return { path: filePath, url: urlData.publicUrl };
  } catch (error) {
    throw error;
  }
}

async function checkExistingFile() {
  try {
    const { data, error } = await supabase
      .from('upload_history')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') return null;
    return data || null;
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const responseErrors: any[] = [];

  try {
    const form = await req.formData();
    const file = form.get('file') as File;
    const academicYear = (form.get('academicYear') as string) || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'File is required' },
        { status: 400 }
      );
    }

    // Check if file already exists (only one file allowed)
    const existingFile = await checkExistingFile();
    if (existingFile) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'A file already exists. Please delete it first before uploading a new one.',
          data: {
            existingFile: {
              filename: existingFile.filename,
              uploadDate: existingFile.uploaded_at,
              recordCount: existingFile.total_records
            }
          }
        },
        { status: 400 }
      );
    }

    // Upload file to storage
    const { path: storagePath, url: storageUrl } = await uploadFileToStorage(file);

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(sheet);

    if (!rows.length) {
      await supabase.storage.from('results').remove([storagePath]);
      return NextResponse.json(
        { success: false, message: 'Excel file is empty' },
        { status: 400 }
      );
    }

    console.log(`Found ${rows.length} student records`);

    // Validate headers
    const headers = Object.keys(rows[0]);
    const requiredHeaders = ['Name', 'Father Name', 'Roll Number', 'Total Marks', 'Obtain Marks', 'Percentage', 'Status', 'Grade', 'Academic Year'];
    
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      await supabase.storage.from('results').remove([storagePath]);
      return NextResponse.json({
        success: false,
        message: 'Missing required headers',
        missingHeaders,
        requiredHeaders
      }, { status: 400 });
    }

    // Get subject headers (headers ending with *)
    const subjectHeaders = headers.filter(header => 
      header.trim().endsWith('*') && 
      !requiredHeaders.includes(header.replace('*', '').trim())
    );
    
    const subjectNames = subjectHeaders.map(header => header.replace('*', '').trim());
    
    // Validate subject headers
    const invalidSubjects = headers.filter(header => 
      !requiredHeaders.includes(header) && 
      !header.endsWith('*') &&
      !['Class', 'Section'].includes(header)
    );
    
    if (invalidSubjects.length > 0) {
      responseErrors.push({
        type: 'invalid_subjects',
        message: 'Subjects must end with *',
        invalidSubjects
      });
    }

    // Prepare data for insertion
    const prepared = rows.map((row, index) => {
      try {
        // Parse subjects
        const subjects: Record<string, any> = {};
        let totalMarks = 0;
        let obtainMarks = 0;
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
            obtainMarks += marks;
            maxTotalMarks += 100;
          }
        }

        // Parse numeric values
        const totalMarksValue = parseFloat(row['Total Marks']) || 0;
        const obtainMarksValue = parseFloat(row['Obtain Marks']) || obtainMarks;
        const percentageValue = parseFloat(row['Percentage']) || 0;
        
        // Validate and calculate
        totalMarks = totalMarksValue || maxTotalMarks;
        obtainMarks = obtainMarksValue || obtainMarks;
        const percentage = percentageValue || (maxTotalMarks > 0 ? (obtainMarks / maxTotalMarks) * 100 : 0);
        const grade = row['Grade'] || gradeFromPercentage(percentage);
        const status = row['Status'] || (percentage >= 33 ? 'PASS' : 'FAIL');

        // Create record
        const record = {
          name: row['Name']?.toString().trim() || `Student ${index + 1}`,
          father_name: row['Father Name']?.toString().trim() || '',
          roll_number: String(row['Roll Number']).trim(),
          academic_year: row['Academic Year'] || academicYear,
          subjects: subjects,
          total_marks: totalMarks,
          obtain_marks: obtainMarks,
          percentage: Number(percentage.toFixed(2)),
          grade: grade,
          status: status,
          uploaded_filename: file.name,
          storage_path: storagePath,
          uploaded_at: new Date().toISOString()
        };

        return record;

      } catch (err: any) {
        responseErrors.push({
          row: index + 1,
          roll_number: row['Roll Number'],
          error: err.message || 'Row processing failed'
        });
        return null;
      }
    });

    const validData = prepared.filter(Boolean);

    // Duplicate check
    const seen = new Set<string>();
    for (const r of validData as any[]) {
      const key = `${r.roll_number}-${r.academic_year}`;
      if (seen.has(key)) {
        responseErrors.push({
          roll_number: r.roll_number,
          error: 'Duplicate roll number in uploaded file'
        });
      }
      seen.add(key);
    }

    if (responseErrors.length > 0) {
      await supabase.storage.from('results').remove([storagePath]);
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: responseErrors
        },
        { status: 400 }
      );
    }

    // Insert in batches
    let inserted = 0;
    for (let i = 0; i < validData.length; i += BATCH_SIZE) {
      const chunk = validData.slice(i, i + BATCH_SIZE) as any[];
      const { error } = await supabase.from('exam_results').upsert(chunk, {
        onConflict: 'roll_number,academic_year'
      });

      if (error) {
        console.error('Batch insert error:', error);
        responseErrors.push({
          batch: `${i + 1} - ${i + chunk.length}`,
          error: error.message
        });
        break;
      }

      inserted += chunk.length;
    }

    if (responseErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database insert failed',
          inserted,
          errors: responseErrors
        },
        { status: 500 }
      );
    }

    // Save upload history
    const uploadHistoryData = {
      filename: file.name,
      file_size: file.size,
      academic_year: academicYear,
      total_records: inserted,
      storage_path: storagePath,
      uploaded_by: 'admin',
      uploaded_at: new Date().toISOString()
    };

    const { error: historyError } = await supabase
      .from('upload_history')
      .insert([uploadHistoryData]);

    if (historyError) {
      console.error('Error saving upload history:', historyError);
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: 'Upload completed successfully',
      data: {
        fileInfo: {
          filename: file.name,
          size: file.size,
          storagePath,
          storageUrl,
          academicYear
        },
        processingStats: {
          totalRecordsInFile: rows.length,
          successfullyInserted: inserted,
          failed: rows.length - inserted,
          totalSubjects: subjectNames.length,
          subjects: subjectNames
        },
        errors: responseErrors
      },
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Unexpected server error',
        error: err.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const { data, error } = await supabase
      .from('upload_history')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    // Get total students count
    const { count: totalResults } = await supabase
      .from('exam_results')
      .select('*', { count: 'exact', head: true });

    const currentYear = new Date().getFullYear();
    const currentAcademicYear = `${currentYear}-${currentYear + 1}`;

    return NextResponse.json({
      success: true,
      data: {
        uploads: data || [],
        statistics: {
          totalUploads: data?.length || 0,
          totalStudents: totalResults || 0
        },
        currentYear: currentAcademicYear
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching upload history:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching upload history',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if any file exists
    const { data: uploadRecord, error: fetchError } = await supabase
      .from('upload_history')
      .select('*')
      .limit(1)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      return NextResponse.json(
        { success: false, message: 'No file to delete' },
        { status: 404 }
      );
    }

    if (fetchError) {
      console.error('Error fetching upload record:', fetchError);
      throw new Error('Failed to fetch upload record');
    }

    // Delete file from storage if exists
    let deletedFilesCount = 0;
    if (uploadRecord?.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('results')
        .remove([uploadRecord.storage_path]);
      
      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
      } else {
        deletedFilesCount = 1;
      }
    }

    // Get count of exam results to be deleted
    const { count: examResultsCount, error: countError } = await supabase
      .from('exam_results')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting exam results:', countError);
    }

    // Delete all exam results
    const { error: deleteError } = await supabase
      .from('exam_results')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (deleteError) {
      console.error('Error deleting from exam_results:', deleteError);
      throw new Error(`Failed to delete results: ${deleteError.message}`);
    }

    // Delete from upload_history
    const { error: historyDeleteError } = await supabase
      .from('upload_history')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (historyDeleteError) {
      console.error('Error deleting from upload_history:', historyDeleteError);
    }

    console.log('Deletion completed');
    console.log(`Deleted ${examResultsCount || 0} exam results`);

    return NextResponse.json({
      success: true,
      message: 'Results deleted successfully',
      data: {
        deletedExamResults: examResultsCount || 0,
        deletedFiles: deletedFilesCount
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting results:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting results',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}