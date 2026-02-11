// app/api/debug-resources/route.ts - Create this file
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    console.log('=== DEBUG API START ===');
    
    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from('resources')
      .select('count', { count: 'exact', head: true });
    
    console.log('Database connection test:', testError ? testError.message : 'Success');
    
    // Get ALL data from database
    const { data: rawResources, error } = await supabase
      .from('resources')
      .select('*')
      .order('id', { ascending: true });
    
    console.log('Raw database query:', {
      error: error?.message,
      count: rawResources?.length || 0
    });
    
    if (rawResources && rawResources.length > 0) {
      // Show first 5 records
      console.log('First 5 records:');
      rawResources.slice(0, 5).forEach((record, i) => {
        console.log(`${i + 1}. ID: ${record.id}, Title: ${record.title}, Class: ${record.class}, Subject: ${record.subject}, Type: ${record.type}`);
      });
      
      // Group by class
      const classes = new Set(rawResources.map(r => r.class));
      console.log('Unique classes in DB:', Array.from(classes));
      
      // Group by subject
      const subjects = new Set(rawResources.map(r => r.subject));
      console.log('Unique subjects in DB (first 10):', Array.from(subjects).slice(0, 10));
      
      // Show count by is_active
      const activeCount = rawResources.filter(r => r.is_active).length;
      console.log(`Active resources: ${activeCount}/${rawResources.length}`);
    }
    
    console.log('=== DEBUG API END ===');
    
    return NextResponse.json({
      success: true,
      data: {
        rawCount: rawResources?.length || 0,
        sampleData: rawResources?.slice(0, 3) || [],
        classes: Array.from(new Set(rawResources?.map(r => r.class) || [])),
        subjects: Array.from(new Set(rawResources?.map(r => r.subject) || [])).slice(0, 10)
      }
    });
    
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}