import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define interface for alumni data
interface AlumniData {
  id: number;
  name: string;
  graduation_year: string;
  profession: string;
  image: string;
  bio: string;
  achievements: string[];
  education: string[];
  email: string;
  skills: string[];
  created_at?: string;
  updated_at?: string;
}

// GET - Public access to read alumni data
export async function GET(request: Request) {
  try {
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id');
    
    
    // Build base query
    let query = supabase
      .from('alumni')
      .select('*')
      .order('graduation_year', { ascending: false });

    // If ID is provided, get specific alumni
    if (id) {
      console.log('🔍 Fetching alumni with ID:', id);
      
      // Parse ID to number
      const alumniId = parseInt(id);
      
      if (isNaN(alumniId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid alumni ID format',
          data: [],
          message: 'Please provide a valid alumni ID'
        }, { status: 400 });
      }
      
      query = query.eq('id', alumniId);
    }

    const { data: alumni, error } = await query;

    if (error) {
      console.error('❌ Supabase error:', error);
      
      // Check if table doesn't exist
      if (error.code === '42P01') { // PostgreSQL table doesn't exist error code
        return NextResponse.json({
          success: false,
          error: 'Alumni table does not exist in database',
          data: [],
          message: 'Database configuration error'
        }, { status: 500 });
      }
      
      throw error;
    }

    console.log(`✅ Found ${alumni?.length || 0} alumni records`);

    // If no alumni found, return empty array
    if (!alumni || alumni.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        total: 0,
        message: id ? 'Alumni not found' : 'No alumni records found',
        timestamp: new Date().toISOString(),
      });
    }

    // Apply search filter if provided (only when no specific ID)
    let filteredAlumni = alumni || [];
    if (search && !id) {
      console.log('🔍 Applying search filter:', search);
      const q = search.toLowerCase();
      filteredAlumni = filteredAlumni.filter(a =>
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.profession && a.profession.toLowerCase().includes(q)) ||
        (a.bio && a.bio.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q))
      );
    }

    // Transform data to match frontend format
    const transformedData = filteredAlumni.map((alumni: AlumniData) => ({
      id: alumni.id,
      name: alumni.name || 'Unknown Alumni',
      graduationYear: alumni.graduation_year || 'Not specified',
      profession: alumni.profession || 'Not specified',
      image: alumni.image || '/images/default-avatar.png',
      bio: alumni.bio || 'No biography available.',
      achievements: alumni.achievements || [],
      education: alumni.education || [],
      email: alumni.email || 'Not provided',
      skills: alumni.skills || [],
      createdAt: alumni.created_at,
      updatedAt: alumni.updated_at
    }));

    // Get total count for pagination info
    let totalCount = 0;
    try {
      const { count } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true });
      totalCount = count || 0;
    } catch (countError) {
      console.warn('⚠️ Could not get total count:', countError);
      totalCount = transformedData.length;
    }

    console.log(`📊 Response: ${transformedData.length} alumni records`);

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
      total: totalCount,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('🔥 API error:', error);
    
    // Return proper error response
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to load alumni data',
      data: [],
      count: 0,
      total: 0,
      message: 'Database connection error. Please try again later.',
    }, { status: 500 });
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}