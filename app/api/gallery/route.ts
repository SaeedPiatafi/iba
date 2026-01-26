import { NextResponse } from 'next/server';
import galleryData from '@/app/data/gallery.json';

let galleryCache = galleryData;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag') || '';
    const limit = searchParams.get('limit');
    const search = searchParams.get('search') || '';

    // Clone images
    let filteredImages = [...galleryCache.images];

    // Filter by tag
    if (tag) {
      filteredImages = filteredImages.filter(image => 
        image.tags.includes(tag)
      );
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredImages = filteredImages.filter(image =>
        image.alt.toLowerCase().includes(searchTerm) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = Number(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredImages = filteredImages.slice(0, limitNum);
      }
    }

    // Get tag counts for statistics
    const tagCounts = galleryCache.images.reduce((acc: {[key: string]: number}, image) => {
      image.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        ...galleryCache,
        images: filteredImages
      },
      count: filteredImages.length,
      total: galleryCache.images.length,
      tagCounts: tagCounts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Gallery API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load gallery data',
        data: null,
        count: 0,
        total: 0,
        tagCounts: {},
      },
      { status: 500 }
    );
  }
}