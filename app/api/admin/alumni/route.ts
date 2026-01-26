import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Alumni {
  id: number;
  name: string;
  graduationYear: string;
  profession: string;
  image: string;
  bio: string;
  achievements: string[];
  education: string[];
  location: string;
  email: string;
  skills: string[];
  createdAt?: string;
  updatedAt?: string;
}

const getDataPath = () => {
  return join(process.cwd(), 'app', 'data', 'alumni.json');
};

// Helper to read alumni data
const readAlumni = (): Alumni[] => {
  try {
    const dataPath = getDataPath();
    const fileContents = readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    const err = error as any;
    if (err.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// Helper to write alumni data
const writeAlumni = (alumni: Alumni[]) => {
  const dataPath = getDataPath();
  writeFileSync(dataPath, JSON.stringify(alumni, null, 2), 'utf8');
};

// DELETE: Remove an alumni
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alumni ID is required'
        },
        { status: 400 }
      );
    }
    
    // Read existing alumni
    const alumni = readAlumni();
    
    // Convert ID to number for comparison
    const alumniId = Number(id);
    
    // Find and remove alumni
    const alumniIndex = alumni.findIndex(a => a.id === alumniId);
    
    if (alumniIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: `Alumni not found with ID: ${id}`
        },
        { status: 404 }
      );
    }
    
    // Remove alumni
    const removedAlumni = alumni.splice(alumniIndex, 1);
    
    // Save updated data
    writeAlumni(alumni);
    
    return NextResponse.json({
      success: true,
      message: `Alumni "${removedAlumni[0]?.name}" deleted successfully`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin Alumni DELETE Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete alumni',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST: Add a new alumni
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'graduationYear', 'profession', 'email', 'image'];
    const missingFields = requiredFields.filter(field => !body[field] || body[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }
    
    // Read existing alumni
    const alumni = readAlumni();
    
    // Generate new ID
    const newId = alumni.length > 0 
      ? Math.max(...alumni.map(a => a.id)) + 1 
      : 1;
    
    // Create new alumni
    const newAlumni: Alumni = {
      id: newId,
      name: body.name.toString().trim(),
      graduationYear: body.graduationYear.toString().trim(),
      profession: body.profession.toString().trim(),
      image: body.image.toString().trim(),
      bio: body.bio?.toString().trim() || '',
      achievements: Array.isArray(body.achievements)
        ? body.achievements.map((ach: any) => ach.toString().trim()).filter((ach: string) => ach !== '')
        : [],
      education: Array.isArray(body.education)
        ? body.education.map((edu: any) => edu.toString().trim()).filter((edu: string) => edu !== '')
        : [],
      location: body.location?.toString().trim() || '',
      email: body.email.toString().trim(),
      skills: Array.isArray(body.skills)
        ? body.skills.map((skill: any) => skill.toString().trim()).filter((skill: string) => skill !== '')
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add and save
    alumni.push(newAlumni);
    writeAlumni(alumni);
    
    return NextResponse.json({
      success: true,
      message: 'Alumni added successfully',
      data: newAlumni,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin Alumni POST Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add alumni',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET: Get all alumni (admin view)
export async function GET() {
  try {
    const alumni = readAlumni();
    
    return NextResponse.json({
      success: true,
      data: alumni,
      count: alumni.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin Alumni GET Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load alumni data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}