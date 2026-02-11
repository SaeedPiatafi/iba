// app/api/admission/route.ts - Updated with RLS debugging
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking RLS and data access...');
    
    // Test 1: Try with anon key
    console.log('🔑 Testing with ANON key...');
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('admission')
      .select('*')
      .limit(1)
      .maybeSingle();

    console.log('📊 ANON key result:', {
      hasData: !!anonData,
      error: anonError?.message,
      rowCount: anonData ? 1 : 0
    });

    // Test 2: Try with service key if available
    let serviceData = null;
    let serviceError = null;
    
    if (supabaseService) {
      console.log('🔑 Testing with SERVICE ROLE key...');
      const { data, error } = await supabaseService
        .from('admission')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      serviceData = data;
      serviceError = error;
      
      console.log('📊 SERVICE ROLE key result:', {
        hasData: !!data,
        error: error?.message,
        rowCount: data ? 1 : 0
      });
    }

    // If service role can access data but anon can't, it's definitely RLS
    if (serviceData && !anonData) {
      console.log('🚨 RLS ISSUE DETECTED: Service role can access data but anon cannot');
    }

    // Use whichever data is available (prefer service role)
    const dataToUse = serviceData || anonData;
    
    if (dataToUse) {
      console.log('✅ Found data, transforming...');
      
      const transformedData = {
        admissionSteps: dataToUse.admission_steps || [],
        documentRequirements: dataToUse.document_requirements || [],
        importantDates: dataToUse.important_dates || [],
        eligibilityCriteria: dataToUse.eligibility_criteria || [],
        importantNotes: dataToUse.important_notes || [],
        admissionTestDetails: dataToUse.admission_test_details || [],
        feeInformation: dataToUse.fee_information || [],
        contactInfo: dataToUse.contact_info || {
          email: "admissions@school.edu.pk",
          phone: "021-111-222-333"
        }
      };

      return NextResponse.json({ 
        success: true, 
        data: transformedData,
        timestamp: new Date().toISOString(),
        source: serviceData ? 'service_role' : 'anon'
      });
    }

    // No data found with either key
    console.log('⚠️ No data found with any key');
    
    const emptyData = {
      admissionSteps: [],
      documentRequirements: [],
      importantDates: [],
      eligibilityCriteria: [],
      importantNotes: [],
      admissionTestDetails: [],
      feeInformation: [],
      contactInfo: {
        email: "admissions@school.edu.pk",
        phone: "021-111-222-333"
      }
    };

    return NextResponse.json({
      success: true,
      data: emptyData,
      timestamp: new Date().toISOString(),
      message: 'No admission data found',
      debug: {
        anonError: anonError?.message,
        serviceError: serviceError?.message,
        hasServiceKey: !!supabaseServiceKey
      }
    });

  } catch (error: any) {
    console.error('🔥 API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      data: {
        admissionSteps: [],
        documentRequirements: [],
        importantDates: [],
        eligibilityCriteria: [],
        importantNotes: [],
        admissionTestDetails: [],
        feeInformation: [],
        contactInfo: {
          email: "admissions@school.edu.pk",
          phone: "021-111-222-333"
        }
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}