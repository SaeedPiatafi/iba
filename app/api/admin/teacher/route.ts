// app/api/admin/teacher/route.ts
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

// GET: Get all teachers (admin view) or single teacher by ID
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    const teachers = readTeachers();
    
    // If ID is provided, return single teacher
    if (id) {
      const teacherId = Number(id);
      const teacher = teachers.find(t => t.id === teacherId);
      
      if (!teacher) {
        return NextResponse.json(
          {
            success: false,
            error: `Teacher not found with ID: ${id}`
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: teacher,
        timestamp: new Date().toISOString()
      });
    }
    
    // Otherwise return all teachers
    return NextResponse.json({
      success: true,
      data: teachers,
      count: teachers.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin Teachers GET Error:', error);
    
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

// PUT: Update a teacher
export async function PUT(request: Request) {
  try {
    console.log('Admin PUT API called');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Teacher ID is required'
        },
        { status: 400 }
      );
    }
    
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
    
    // Find teacher to update
    const teacherIndex = teachers.findIndex(t => t.id === body.id);
    
    if (teacherIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: `Teacher not found with ID: ${body.id}`
        },
        { status: 404 }
      );
    }
    
    // Update teacher data
    const updatedTeacher: Teacher = {
      ...teachers[teacherIndex],
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
      email: body.email.trim()
    };
    
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