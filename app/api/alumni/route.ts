import { NextResponse } from 'next/server';
import alumni from '@/app/data/alumni.json';

let alumniCache = alumni;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id');
    const year = searchParams.get('year');
    const profession = searchParams.get('profession');
    const limit = searchParams.get('limit');

    let filteredAlumni = [...alumniCache];

    if (search) {
      const q = search.toLowerCase();
      filteredAlumni = filteredAlumni.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.profession.toLowerCase().includes(q) ||
        a.education.some(e => e.toLowerCase().includes(q)) ||
        (a.bio && a.bio.toLowerCase().includes(q)) ||
        a.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (id) {
      const alumniId = Number(id);
      if (!isNaN(alumniId)) {
        filteredAlumni = filteredAlumni.filter(a => a.id === alumniId);
      }
    }

    if (year) {
      filteredAlumni = filteredAlumni.filter(a => a.graduationYear === year);
    }

    if (profession) {
      const prof = profession.toLowerCase();
      filteredAlumni = filteredAlumni.filter(a => 
        a.profession.toLowerCase().includes(prof)
      );
    }

    if (limit) {
      const limitNum = Number(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredAlumni = filteredAlumni.slice(0, limitNum);
      }
    }

    // Sort by graduation year (newest first)
    filteredAlumni.sort((a, b) => Number(b.graduationYear) - Number(a.graduationYear));

    return NextResponse.json({
      success: true,
      data: filteredAlumni,
      count: filteredAlumni.length,
      total: alumniCache.length,
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