// app/api/admin/teacher/route.ts
import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  classLevels: string[];
  image: string;
  education: string[];
  experience: string;
  teachingExperience: string[];
  bio: string;
  achievements: string[];
  teachingPhilosophy: string;
  officeHours: string;
  roomNumber: string;
  email: string;
}

const getDataPath = () => {
  const path = join(process.cwd(), 'app', 'data', 'teachers.json');
  console.log('Data path:', path);
  return path;
};

// Helper to read teachers data
const readTeachers = (): Teacher[] => {
  try {
    const dataPath = getDataPath();
    console.log('Reading teachers from:', dataPath);
    
    if (!readFileSync) {
      console.error('readFileSync is not available');
      return [];
    }
    
    const fileContents = readFileSync(dataPath, 'utf8');
    console.log('File contents length:', fileContents.length);
    
    const teachers = JSON.parse(fileContents);
    console.log('Parsed teachers:', teachers.length);
    
    return teachers;
  } catch (error) {
    console.error('Error reading teachers file:', error);
    
    // Check if error has a code property
    const err = error as any;
    if (err.code === 'ENOENT') {
      console.log('Teachers file does not exist, returning empty array');
      return [];
    }
    
    console.error('Unexpected error:', error);
    throw error;
  }
};

// Helper to write teachers data
const writeTeachers = (teachers: Teacher[]) => {
  try {
    const dataPath = getDataPath();
    console.log('Writing teachers to:', dataPath);
    console.log('Teachers to write:', teachers.length);
    
    writeFileSync(dataPath, JSON.stringify(teachers, null, 2), 'utf8');
    console.log('Teachers saved successfully');
  } catch (error) {
    console.error('Error writing teachers file:', error);
    throw error;
  }
};

// DELETE: Remove a teacher
export async function DELETE(request: Request) {
  try {
    console.log('Admin API: Deleting teacher...');
    const body = await request.json();
    const { id } = body;
    
    console.log('Received ID:', id, 'Type:', typeof id);
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Teacher ID is required'
        },
        { status: 400 }
      );
    }
    
    // Read existing teachers
    const teachers = readTeachers();
    console.log('Current teachers count:', teachers.length);
    
    // Convert ID to number for comparison
    const teacherId = Number(id);
    console.log('Looking for teacher with ID (as number):', teacherId);
    
    // Find and remove teacher - compare as numbers
    const teacherIndex = teachers.findIndex(t => t.id === teacherId);
    
    console.log('Teacher index found:', teacherIndex);
    
    if (teacherIndex === -1) {
      console.error('Teacher not found with ID:', teacherId);
      return NextResponse.json(
        {
          success: false,
          error: `Teacher not found with ID: ${id}`
        },
        { status: 404 }
      );
    }
    
    // Remove teacher
    const removedTeacher = teachers.splice(teacherIndex, 1);
    console.log('Removed teacher:', removedTeacher[0]?.name);
    
    // Save updated data
    writeTeachers(teachers);
    console.log('Teachers after deletion:', teachers.length);
    
    return NextResponse.json({
      success: true,
      message: `Teacher "${removedTeacher[0]?.name}" deleted successfully`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin Teachers DELETE Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete teacher',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST: Add a new teacher
export async function POST(request: Request) {
  try {
    console.log('Admin POST API called');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    // Validate required fields
    const requiredFields = ['name', 'subject', 'email'];
    const missingFields = requiredFields.filter(field => !body[field] || body[field].trim() === '');
    
    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }
    
    // Read existing teachers
    const teachers = readTeachers();
    console.log('Current teachers before add:', teachers.length);
    
    // Generate new ID
    const newId = teachers.length > 0 
      ? Math.max(...teachers.map(t => t.id)) + 1 
      : 1;
    
    console.log('Generated new ID:', newId);
    
    // Create new teacher
    const newTeacher: Teacher = {
      id: newId,
      name: body.name.trim(),
      subject: body.subject.trim(),
      classLevels: Array.isArray(body.classLevels) 
        ? body.classLevels.map((level: string) => level.trim())
        : [],
      image: body.image?.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      education: Array.isArray(body.education) 
        ? body.education.map((edu: string) => edu.trim()).filter((edu: string) => edu !== '')
        : [],
      experience: body.experience?.trim() || '',
      teachingExperience: Array.isArray(body.teachingExperience)
        ? body.teachingExperience.map((exp: string) => exp.trim()).filter((exp: string) => exp !== '')
        : [],
      bio: body.bio?.trim() || '',
      achievements: Array.isArray(body.achievements)
        ? body.achievements.map((ach: string) => ach.trim()).filter((ach: string) => ach !== '')
        : [],
      teachingPhilosophy: body.teachingPhilosophy?.trim() || '',
      officeHours: body.officeHours?.trim() || 'Monday-Friday: 9:00 AM - 4:00 PM',
      roomNumber: body.roomNumber?.trim() || 'To be assigned',
      email: body.email.trim()
    };
    
    console.log('New teacher created:', newTeacher);
    
    // Add and save
    teachers.push(newTeacher);
    writeTeachers(teachers);
    console.log('Teachers after addition:', teachers.length);
    
    return NextResponse.json({
      success: true,
      message: 'Teacher added successfully',
      data: newTeacher,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin Teachers POST Error:', error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add teacher',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET: Get all teachers (admin view)
export async function GET() {
  try {
    console.log('Admin GET API called');
    const teachers = readTeachers();
    console.log('Returning teachers:', teachers.length);
    
    return NextResponse.json({
      success: true,
      data: teachers,
      count: teachers.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin Teachers GET Error:', error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load teachers data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}