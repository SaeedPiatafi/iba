import { NextRequest, NextResponse } from 'next/server';
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
  email: string;
}

const getDataPath = () => {
  const path = join(process.cwd(), 'app', 'data', 'teachers.json');
  return path;
};

// Helper to read teachers data
const readTeachers = (): Teacher[] => {
  try {
    const dataPath = getDataPath();
    const fileContents = readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading teachers file:', error);
    return [];
  }
};

// Helper to write teachers data
const writeTeachers = (teachers: Teacher[]) => {
  try {
    const dataPath = getDataPath();
    writeFileSync(dataPath, JSON.stringify(teachers, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing teachers file:', error);
    throw error;
  }
};

// PUT: Update a teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacherId = parseInt(id);
    
    console.log('Admin API: Updating teacher ID:', teacherId);
    console.log('URL ID parameter:', id);
    
    if (!teacherId || isNaN(teacherId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid Teacher ID is required',
          receivedId: id
        },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log('Update data received:', body);
    
    // Validate required fields
    const requiredFields = ['name', 'subject', 'email'];
    const missingFields = requiredFields.filter(field => !body[field] || body[field].trim() === '');
    
    if (missingFields.length > 0) {
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
    console.log('Total teachers in system:', teachers.length);
    
    // Find teacher to update
    const teacherIndex = teachers.findIndex(t => t.id === teacherId);
    
    if (teacherIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: `Teacher not found with ID: ${teacherId}`,
          availableIds: teachers.map(t => t.id)
        },
        { status: 404 }
      );
    }
    
    console.log('Found teacher at index:', teacherIndex);
    console.log('Current teacher data:', teachers[teacherIndex]);
    
    // Create updated teacher object
    const updatedTeacher: Teacher = {
      ...teachers[teacherIndex], // Keep existing id
      name: body.name.trim(),
      subject: body.subject.trim(),
      classLevels: Array.isArray(body.classLevels) 
        ? body.classLevels.map((level: string) => level.trim()).filter((level: string) => level !== '')
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
      email: body.email.trim()
    };
    
    console.log('Updated teacher data:', updatedTeacher);
    
    // Update in array
    teachers[teacherIndex] = updatedTeacher;
    
    // Save updated data
    writeTeachers(teachers);
    
    return NextResponse.json({
      success: true,
      message: 'Teacher updated successfully',
      data: updatedTeacher,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin Teachers PUT Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update teacher',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET: Get single teacher by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacherId = parseInt(id);
    
    console.log('GET Teacher by ID:', teacherId);
    console.log('URL ID parameter:', id);
    
    if (!teacherId || isNaN(teacherId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid Teacher ID is required',
          receivedId: id
        },
        { status: 400 }
      );
    }
    
    const teachers = readTeachers();
    const teacher = teachers.find(t => t.id === teacherId);
    
    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          error: `Teacher not found with ID: ${teacherId}`,
          availableIds: teachers.map(t => t.id)
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: teacher,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin Teachers GET by ID Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load teacher',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}