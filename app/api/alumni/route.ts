import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Public access to read alumni data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id');
    
    let query = supabase
      .from('alumni')
      .select('*')
      .order('graduation_year', { ascending: false });

    // If ID is provided, get specific alumni
    if (id && !isNaN(Number(id))) {
      query = query.eq('id', Number(id));
    }

    const { data: alumni, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Apply search filter if provided
    let filteredAlumni = alumni || [];
    if (search) {
      const q = search.toLowerCase();
      filteredAlumni = filteredAlumni.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.profession.toLowerCase().includes(q) ||
        (a.bio && a.bio.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q))
      );
    }

    // Transform data to match your format
    const transformedData = filteredAlumni.map(alumni => ({
      id: alumni.id,
      name: alumni.name,
      graduationYear: alumni.graduation_year,
      profession: alumni.profession,
      image: alumni.image,
      bio: alumni.bio,
      achievements: alumni.achievements || [],
      education: alumni.education || [],
      email: alumni.email,
      skills: alumni.skills || [],
      createdAt: alumni.created_at,
      updatedAt: alumni.updated_at
    }));

    // Get total count
    const { count: totalCount } = await supabase
      .from('alumni')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
      total: totalCount || transformedData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Alumni API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load alumni data',
        data: [],
        count: 0,
        total: 0,
      },
      { status: 500 }
    );
  }
}
