import { NextResponse } from 'next/server';
import teachers from '@/app/data/teachers.json';

let teachersCache = teachers;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');

    let filteredTeachers = [...teachersCache];

    if (search) {
      const q = search.toLowerCase();
      filteredTeachers = filteredTeachers.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.classLevels.some(l => l.toLowerCase().includes(q))
      );
    }

    if (id) {
      filteredTeachers = filteredTeachers.filter(
        t => t.id === Number(id)
      );
    }

    // Apply limit if specified and valid
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
      total: teachersCache.length,
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