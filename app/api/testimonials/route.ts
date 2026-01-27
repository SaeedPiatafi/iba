import { NextResponse } from 'next/server';
import testimonialsData from '@/app/data/testimonials.json';

export async function GET() {
  try {
    // Simulate a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      success: true,
      data: testimonialsData.testimonials,
      count: testimonialsData.testimonials.length,
      message: "Testimonials fetched successfully"
    });
    
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch testimonials",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}