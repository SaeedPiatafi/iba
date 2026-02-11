// app/api/admission/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    console.log('Fetching admission data from Supabase...');
    
    // Get the first admission record from Supabase
    const { data: admissionData, error } = await supabase
      .from("admission")
      .select("*")
      .limit(1)
      .single();

    console.log('Supabase response:', { admissionData, error });

    if (error) {
      console.error('Supabase error:', error);
      
      // Return proper empty structure matching the frontend interface
      const emptyData = {
        admissionSteps: [
          { step: 1, title: "Application Submission", description: "Fill out the online application form with accurate information" },
          { step: 2, title: "Document Verification", description: "Submit required documents for verification process" },
          { step: 3, title: "Admission Test", description: "Appear for the admission test on scheduled date" },
          { step: 4, title: "Interview & Final Decision", description: "Attend interview and receive admission decision" }
        ],
        documentRequirements: [
          "Birth Certificate (Original + 2 copies)",
          "Previous School Transcripts/Report Card",
          "CNIC/B-Form of Student",
          "CNIC of Parents/Guardian",
          "8 Passport-sized Photographs",
          "Medical Fitness Certificate"
        ],
        importantDates: [
          { date: "January 15, 2024", event: "Admission Open" },
          { date: "March 30, 2024", event: "Last Date for Submission" },
          { date: "April 15-20, 2024", event: "Admission Tests" },
          { date: "April 25, 2024", event: "Result Announcement" },
          { date: "May 10, 2024", event: "Classes Commence" }
        ],
        eligibilityCriteria: [
          { class: "Playgroup - KG", requirement: "Age 3-5 years" },
          { class: "Class 1-5", requirement: "Minimum 60% in previous class" },
          { class: "Class 6-8", requirement: "Minimum 65% in previous class" },
          { class: "Class 9-10", requirement: "Minimum 70% in previous class" },
          { class: "Class 11-12", requirement: "Minimum 75% in relevant subjects" }
        ]
      };

      return NextResponse.json({
        success: true,
        data: emptyData,
        timestamp: new Date().toISOString(),
        message: "Using default data as no data found in database"
      });
    }

    // Debug: Log the raw data structure
    console.log('Raw admission data structure:', {
      hasAdmissionSteps: !!admissionData.admission_steps,
      admissionStepsType: typeof admissionData.admission_steps,
      admissionStepsValue: admissionData.admission_steps
    });

    // Parse JSONB fields if they are strings
    const parseJsonbField = (field: any) => {
      if (!field) return [];
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          console.error('Error parsing JSON field:', e);
          return [];
        }
      }
      return field;
    };

    // Transform data to match the frontend interface exactly
    const transformedData = {
      admissionSteps: parseJsonbField(admissionData.admission_steps) || [],
      documentRequirements: parseJsonbField(admissionData.document_requirements) || [],
      importantDates: parseJsonbField(admissionData.important_dates) || [],
      eligibilityCriteria: parseJsonbField(admissionData.eligibility_criteria) || []
    };

    console.log('Transformed data:', transformedData);

    return NextResponse.json({
      success: true,
      data: transformedData,
      timestamp: new Date().toISOString(),
      message: "Data loaded successfully from database"
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load admission data',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: null
      },
      { status: 500 }
    );
  }
}