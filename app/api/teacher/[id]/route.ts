import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Type for Supabase teacher data
interface SupabaseTeacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  class_levels: string[];
  image: string;
  education: string[];
  experience: string;
  teaching_experience: any[] | string[];
  bio: string;
  achievements: string[];
  teaching_philosophy: string;
  created_at: string;
  updated_at: string;
}

// Type for transformed teacher data
interface TransformedTeacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  classLevels: string[];
  image: string;
  education: string[];
  experience: string;
  teachingExperience: any[] | string[];
  bio: string;
  achievements: string[];
  teachingPhilosophy: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params;
    
    console.log('Fetching teacher with ID:', id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Teacher ID is required',
          data: null,
        },
        { status: 400 }
      );
    }

    // Fetch single teacher from Supabase
    const { data, error } = await supabase
      .from('teacher')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      
      // Handle different error types
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json(
          {
            success: false,
            error: 'Teacher not found',
            data: null,
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        {
          success: false,
          error: `Failed to load teacher: ${error.message}`,
          data: null,
        },
        { status: 500 }
      );
    }

    // Check if data exists
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Teacher not found',
          data: null,
        },
        { status: 404 }
      );
    }

    // Transform snake_case to camelCase
    const teacherData = data as SupabaseTeacher;
    const transformedTeacher: TransformedTeacher = {
      id: teacherData.id,
      name: teacherData.name,
      subject: teacherData.subject,
      email: teacherData.email,
      classLevels: teacherData.class_levels || [],
      image: teacherData.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      education: teacherData.education || [],
      experience: teacherData.experience || '',
      teachingExperience: teacherData.teaching_experience || [],
      bio: teacherData.bio || '',
      achievements: teacherData.achievements || [],
      teachingPhilosophy: teacherData.teaching_philosophy || '',
      createdAt: teacherData.created_at,
      updatedAt: teacherData.updated_at,
    };

    console.log('Teacher found:', transformedTeacher.name);

    return NextResponse.json({
      success: true,
      data: transformedTeacher,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in teacher API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        data: null,
      },
      { status: 500 }
    );
  }
}