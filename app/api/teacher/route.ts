import { NextResponse } from 'next/server';
import teachers from '@/app/data/teachers.json';

let teachersCache = teachers;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id');

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

    return NextResponse.json({
      success: true,
      data: filteredTeachers,
      count: filteredTeachers.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load teachers',
        data: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}
