import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';

// Interface for Excel row data
interface ExcelRow {
  Name: string;
  'Father Name': string;
  'Roll Number': string;
  Mathematics: number | string;
  Science: number | string;
  English: number | string;
  Urdu: number | string;
  Islamiat: number | string;
  'Pakistan Studies': number | string;
  'Computer Science': number | string;
  Physics: number | string;
  'Total Marks': number;
  'Max Total Marks': number;
  Percentage: number;
  Status: string;
  Grade: string;
  'Academic Year': string;
}

// Interface for uploaded file info
interface UploadInfo {
  filename: string;
  size: number;
  year: string;
  uploadDate: string;
  totalStudents: number;
}

// Interface for upload history
interface UploadHistory {
  uploads: UploadInfo[];
}

// Helper function to parse subject marks with dash handling
function parseSubjectMark(value: number | string): number {
  if (typeof value === 'string') {
    // Handle dash (-) for subjects not offered
    if (value === '-' || value.trim() === '' || value.toLowerCase() === 'na') {
      return 0; // Return 0 but we'll exclude it from calculations
    }
    // Try to parse as number
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return value || 0;
}

// Helper function to check if a value is dash/not offered
function isSubjectOffered(value: number | string): boolean {
  if (typeof value === 'string') {
    return !(value === '-' || value.trim() === '' || value.toLowerCase() === 'na');
  }
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const academicYear = formData.get('academicYear') as string || '2024-2025';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        { success: false, message: 'Only Excel/CSV files are allowed' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Check if ANY file already exists (only one file allowed total)
    const historyPath = path.join(process.cwd(), 'app', 'data', 'upload-history.json');
    let history: UploadHistory = { uploads: [] };
    
    try {
      const historyContent = await fs.readFile(historyPath, 'utf8');
      history = JSON.parse(historyContent);
      
      if (history.uploads.length > 0) {
        const existingFile = history.uploads[0]; // Get the only file
        return NextResponse.json(
          { 
            success: false, 
            message: `A file already exists in the system (${existingFile.filename} - ${existingFile.year}). Please delete it first before uploading a new file.`
          },
          { status: 400 }
        );
      }
    } catch (error) {
      // History file doesn't exist yet, that's fine
    }

    // Read file buffer
    const buffer = await file.arrayBuffer();
    
    // Parse Excel/CSV file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No data found in file' },
        { status: 400 }
      );
    }

    // Convert Excel data to our JSON format with dash handling
    const results = data.map((row, index) => {
      // Parse marks with dash handling
      const mathMark = parseSubjectMark(row.Mathematics);
      const scienceMark = parseSubjectMark(row.Science);
      const englishMark = parseSubjectMark(row.English);
      const urduMark = parseSubjectMark(row.Urdu);
      const islamiatMark = parseSubjectMark(row.Islamiat);
      const pakStudiesMark = parseSubjectMark(row['Pakistan Studies']);
      const compScienceMark = parseSubjectMark(row['Computer Science']);
      const physicsMark = parseSubjectMark(row.Physics);

      // Check which subjects are offered
      const offeredSubjects = {
        Mathematics: isSubjectOffered(row.Mathematics),
        Science: isSubjectOffered(row.Science),
        English: isSubjectOffered(row.English),
        Urdu: isSubjectOffered(row.Urdu),
        Islamiat: isSubjectOffered(row.Islamiat),
        'Pakistan Studies': isSubjectOffered(row['Pakistan Studies']),
        'Computer Science': isSubjectOffered(row['Computer Science']),
        Physics: isSubjectOffered(row.Physics)
      };

      // Calculate total marks only from offered subjects
      const offeredMarks = [
        offeredSubjects.Mathematics ? mathMark : 0,
        offeredSubjects.Science ? scienceMark : 0,
        offeredSubjects.English ? englishMark : 0,
        offeredSubjects.Urdu ? urduMark : 0,
        offeredSubjects.Islamiat ? islamiatMark : 0,
        offeredSubjects['Pakistan Studies'] ? pakStudiesMark : 0,
        offeredSubjects['Computer Science'] ? compScienceMark : 0,
        offeredSubjects.Physics ? physicsMark : 0
      ];

      const totalOfferedSubjects = Object.values(offeredSubjects).filter(Boolean).length;
      const totalMarks = offeredMarks.reduce((sum, mark) => sum + mark, 0);
      const maxTotalMarks = row['Max Total Marks'] || 100 * totalOfferedSubjects;
      const percentage = (totalMarks / maxTotalMarks) * 100;

      return {
        id: (index + 1).toString(),
        name: row.Name || '',
        fatherName: row['Father Name'] || '',
        rollNumber: row['Roll Number'] || '',
        marks: {
          Mathematics: mathMark,
          Science: scienceMark,
          English: englishMark,
          Urdu: urduMark,
          Islamiat: islamiatMark,
          'Pakistan Studies': pakStudiesMark,
          'Computer Science': compScienceMark,
          Physics: physicsMark
        },
        offeredSubjects,
        totalMarks,
        maxTotalMarks,
        percentage: parseFloat(percentage.toFixed(2)),
        status: percentage >= 33 ? 'PASS' : 'FAIL',
        grade: getGrade(percentage),
        year: row['Academic Year'] || academicYear
      };
    });

    // Save to file (replace all existing data)
    const filePath = path.join(process.cwd(), 'app', 'data', 'result.json');
    
    // Create new data structure
    const newData = { results: results.map((item, index) => ({
      ...item,
      id: (index + 1).toString()
    })) };

    // Save to file (overwrites existing data)
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2));

    // Update upload history (only one file allowed)
    const uploadInfo: UploadInfo = {
      filename: file.name,
      size: file.size,
      year: academicYear,
      uploadDate: new Date().toISOString(),
      totalStudents: data.length
    };

    // Save only this file to history (replace all)
    const newHistory: UploadHistory = {
      uploads: [uploadInfo]
    };
    
    await fs.writeFile(historyPath, JSON.stringify(newHistory, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Results imported successfully',
      data: {
        totalImported: data.length,
        totalNow: results.length,
        duplicatesRemoved: 0,
        uploadInfo
      }
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing file',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get uploaded files history
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');
    
    if (filename) {
      // Get specific file info
      const historyPath = path.join(process.cwd(), 'app', 'data', 'upload-history.json');
      let history: UploadHistory = { uploads: [] };
      
      try {
        const historyContent = await fs.readFile(historyPath, 'utf8');
        history = JSON.parse(historyContent);
        const fileInfo = history.uploads.find(upload => upload.filename === filename);
        
        if (!fileInfo) {
          return NextResponse.json(
            { success: false, message: 'File not found in history' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: { upload: fileInfo }
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Error reading history' },
          { status: 500 }
        );
      }
    } else {
      // Get all history (will only have one file)
      const historyPath = path.join(process.cwd(), 'app', 'data', 'upload-history.json');
      let history: UploadHistory = { uploads: [] };
      
      try {
        const historyContent = await fs.readFile(historyPath, 'utf8');
        history = JSON.parse(historyContent);
      } catch (error) {
        // File doesn't exist yet
      }

      return NextResponse.json({
        success: true,
        data: history
      });
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching upload history',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Delete the file
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');
    const year = url.searchParams.get('year');

    if (!filename || !year) {
      return NextResponse.json(
        { success: false, message: 'Filename and year are required' },
        { status: 400 }
      );
    }

    // Read upload history
    const historyPath = path.join(process.cwd(), 'app', 'data', 'upload-history.json');
    let history: UploadHistory = { uploads: [] };
    
    try {
      const historyContent = await fs.readFile(historyPath, 'utf8');
      history = JSON.parse(historyContent);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'No upload history found' },
        { status: 404 }
      );
    }

    // Find the file
    const fileIndex = history.uploads.findIndex(
      upload => upload.filename === filename && upload.year === year
    );

    if (fileIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'File not found in history' },
        { status: 404 }
      );
    }

    // Remove the file from history
    const [deletedFile] = history.uploads.splice(fileIndex, 1);

    // Clear result.json (remove all data)
    const resultPath = path.join(process.cwd(), 'app', 'data', 'result.json');
    
    // Create empty result file
    const emptyData = { results: [] };
    await fs.writeFile(resultPath, JSON.stringify(emptyData, null, 2));

    // Save updated history (should be empty)
    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully. System is now empty and ready for a new upload.',
      data: {
        deletedFile,
        remainingFiles: history.uploads.length
      }
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error deleting file',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to get grade based on percentage
function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 33) return 'E';
  return 'F';
}