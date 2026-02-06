import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');

    // Build the query
    let query = supabase
      .from('teacher')
      .select('*')
      .order('created_at', { ascending: false });

    // Get single teacher by ID
    if (id) {
      const { data, error } = await query.eq('id', id).single();
      
      if (error) {
        return NextResponse.json(
          { success: false, error: 'Teacher not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: transformTeacherData(data),
      });
    }

    // Get all teachers
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }

    // Transform data to camelCase
    const teachers = (data || []).map(transformTeacherData);

    // Apply search filter
    let filteredTeachers = teachers;
    if (search) {
      const q = search.toLowerCase();
      filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q) ||
        t.classLevels?.some(l => l.toLowerCase().includes(q)) ||
        t.education?.some(e => e.toLowerCase().includes(q))
      );
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredTeachers = filteredTeachers.slice(0, limitNum);
      }
    }

    // Simulate a small delay for better loading experience
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: filteredTeachers,
      count: filteredTeachers.length,
      total: teachers.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in teachers API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load teachers',
        data: [],
        count: 0,
        total: 0,
      },
      { status: 500 }
    );
  }
}

// Helper function to transform Supabase snake_case to camelCase
function transformTeacherData(teacher: any) {
  return {
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    email: teacher.email,
    classLevels: teacher.class_levels || [],
    image: teacher.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    education: teacher.education || [],
    experience: teacher.experience || '',
    teachingExperience: teacher.teaching_experience || [],
    bio: teacher.bio || '',
    achievements: teacher.achievements || [],
    teachingPhilosophy: teacher.teaching_philosophy || '',
    createdAt: teacher.created_at,
    updatedAt: teacher.updated_at,
  };
}