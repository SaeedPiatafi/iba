// app/api/champs/route.ts
import { NextResponse } from 'next/server';
import champs from '@/app/data/champs.json';

let champsCache = champs;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id');
    const year = searchParams.get('year');
    const classFilter = searchParams.get('class');
    const minPercentage = searchParams.get('minPercentage');
    const maxPercentage = searchParams.get('maxPercentage');
    const sortBy = searchParams.get('sortBy') || 'percentage';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let filteredChamps = [...champsCache];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      filteredChamps = filteredChamps.filter(student =>
        student.name.toLowerCase().includes(q) ||
        student.class.toLowerCase().includes(q)
      );
    }

    // ID filter
    if (id) {
      filteredChamps = filteredChamps.filter(
        student => student.id === Number(id)
      );
    }

    // Year filter
    if (year) {
      filteredChamps = filteredChamps.filter(
        student => student.year === Number(year)
      );
    }

    // Class filter
    if (classFilter) {
      filteredChamps = filteredChamps.filter(
        student => student.class.toLowerCase().includes(classFilter.toLowerCase())
      );
    }

    // Percentage range filter
    if (minPercentage) {
      filteredChamps = filteredChamps.filter(
        student => student.percentage >= Number(minPercentage)
      );
    }

    if (maxPercentage) {
      filteredChamps = filteredChamps.filter(
        student => student.percentage <= Number(maxPercentage)
      );
    }

    // Sorting
    filteredChamps.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'class':
          aValue = a.class.toLowerCase();
          bValue = b.class.toLowerCase();
          break;
        case 'percentage':
        default:
          aValue = a.percentage;
          bValue = b.percentage;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return NextResponse.json({
      success: true,
      data: filteredChamps,
      count: filteredChamps.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load champs data',
        data: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}