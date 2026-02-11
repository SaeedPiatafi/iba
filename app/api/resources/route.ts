// app/api/resources/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase clients with both anon and service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create both clients
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Define types matching your database
interface DatabaseResource {
  id: number;
  title: string;
  description: string | null;
  type: string;
  class: string;
  subject: string;
  url: string;
  tags: string[] | null;
  upload_date: string;
  updated_at: string;
  downloads: number;
  is_active: boolean;
  created_by: string | null;
}

interface FrontendResource {
  id: number;
  title: string;
  type: 'Book' | 'Video' | 'Article' | 'Practice' | 'Exam';
  link: string;
  description: string;
}

interface ResourcesData {
  classes: string[];
  subjectsByClass: Record<string, string[]>;
  resources: Record<string, Record<string, FrontendResource[]>>;
}

// Frontend class list (1-12)
const CLASSES = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

// Standardize database class values to frontend format
const standardizeClass = (dbClass: string): string => {
  // Remove any prefixes like 'class_', 'Class', etc.
  const cleaned = dbClass.replace(/^(class_|Class_|Class)/i, '').trim();
  
  // Convert to simple number string
  const match = cleaned.match(/\d+/);
  if (match) {
    const num = parseInt(match[0]);
    if (num >= 1 && num <= 12) {
      return num.toString();
    }
  }
  
  // Default fallback
  return "9";
};

// Standardize subject names
const standardizeSubject = (dbSubject: string): string => {
  const subjectMap: Record<string, string> = {
    'mathematics': 'math',
    'maths': 'math',
    'english language': 'english',
    'urdu language': 'urdu',
    'biology': 'bio',
    'chemistry': 'chemistry',
    'physics': 'physics',
    'pakistan studies': 'pakistan study',
    'islamiat': 'islamiyat',
    'computer': 'computer science',
    'comp science': 'computer science',
    'sindhi': 'sindhi',
    'economics': 'economics',
    'accounting': 'accounting',
    'commerce': 'commerce',
    'business studies': 'business',
  };
  
  const normalized = dbSubject.toLowerCase().trim();
  return subjectMap[normalized] || normalized;
};

// Get unique subjects from database for each class
async function getSubjectsFromDatabase(supabase: any): Promise<Record<string, string[]>> {
  try {
    const { data: resources, error } = await supabase
      .from('resources')
      .select('class, subject')
      .eq('is_active', true)
      .order('subject', { ascending: true });

    if (error) throw error;

    const subjectsByClass: Record<string, string[]> = {};

    // Initialize all classes
    CLASSES.forEach(className => {
      subjectsByClass[className] = [];
    });

    // Collect unique subjects for each class
    resources?.forEach(resource => {
      const frontendClass = standardizeClass(resource.class);
      const frontendSubject = standardizeSubject(resource.subject);
      
      if (CLASSES.includes(frontendClass) && 
          !subjectsByClass[frontendClass].includes(frontendSubject)) {
        subjectsByClass[frontendClass].push(frontendSubject);
      }
    });

    // Sort subjects alphabetically
    Object.keys(subjectsByClass).forEach(className => {
      subjectsByClass[className].sort();
    });

    return subjectsByClass;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    
    // Return default subjects if database fails
    const defaultSubjects: Record<string, string[]> = {};
    const commonSubjects = ["english", "math", "urdu", "sindhi", "bio", "chemistry", "physics", "pakistan study"];
    
    CLASSES.forEach(className => {
      defaultSubjects[className] = [...commonSubjects];
    });
    
    return defaultSubjects;
  }
}

// Map database type to frontend type
const mapDatabaseTypeToFrontend = (dbType: string): FrontendResource['type'] => {
  const typeMap: Record<string, FrontendResource['type']> = {
    'book': 'Book',
    'video': 'Video',
    'article': 'Article',
    'practice': 'Practice',
    'exam': 'Exam',
    'textbook': 'Book',
    'past paper': 'Exam',
    'worksheet': 'Practice',
    'notes': 'Article',
    'tutorial': 'Video'
  };
  
  const normalizedType = dbType?.trim()?.toLowerCase() || 'book';
  return typeMap[normalizedType] || 'Book';
};

// Function to get resources using a specific Supabase client
async function getResourcesFromDatabase(supabase: any, clientType: string): Promise<ResourcesData> {
  try {
    console.log(`🔍 Fetching resources from database using ${clientType} client...`);
    
    // Fetch all active resources from database
    const { data: resources, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .order('title', { ascending: true });

    if (error) {
      console.error(`Database error (${clientType}):`, error);
      throw error;
    }

    console.log(`✅ Found ${resources?.length || 0} active resources in database (${clientType})`);
    
    // Get subjects from database
    const subjectsByClass = await getSubjectsFromDatabase(supabase);
    
    // Initialize the response structure
    const responseData: ResourcesData = {
      classes: CLASSES,
      subjectsByClass: subjectsByClass,
      resources: {}
    };

    // Initialize resources structure for all classes
    CLASSES.forEach(className => {
      responseData.resources[className] = {};
      // Initialize subject arrays based on database subjects
      subjectsByClass[className]?.forEach(subject => {
        responseData.resources[className][subject] = [];
      });
    });

    // Process each resource from database
    if (resources && resources.length > 0) {
      let processedCount = 0;
      
      resources.forEach((resource: DatabaseResource) => {
        try {
          // Map database class to frontend class name
          const frontendClass = standardizeClass(resource.class);
          
          // Get and clean the subject name
          const frontendSubject = standardizeSubject(resource.subject);
          
          // Map database type to frontend type
          const frontendType = mapDatabaseTypeToFrontend(resource.type);
          
          // Ensure the class exists in our structure
          if (!responseData.resources[frontendClass]) {
            responseData.resources[frontendClass] = {};
          }
          
          // Ensure the subject array exists for this class
          if (!responseData.resources[frontendClass][frontendSubject]) {
            responseData.resources[frontendClass][frontendSubject] = [];
          }
          
          // Create resource object matching frontend interface
          const frontendResource: FrontendResource = {
            id: resource.id,
            title: resource.title,
            type: frontendType,
            link: resource.url,
            description: resource.description || 'No description available'
          };
          
          // Add to the resources structure
          responseData.resources[frontendClass][frontendSubject].push(frontendResource);
          processedCount++;
          
        } catch (resourceError) {
          console.error('Error processing resource:', resourceError, resource);
        }
      });
      
      console.log(`🔄 Processed ${processedCount} resources successfully (${clientType})`);
      
      // Log summary by class
      CLASSES.forEach(className => {
        const classResources = responseData.resources[className];
        const totalResources = Object.values(classResources).reduce(
          (sum, subjectResources) => sum + subjectResources.length, 0
        );
        if (totalResources > 0) {
          console.log(`📚 Class ${className}: ${totalResources} resources (${clientType})`);
        }
      });
    } else {
      console.log(`⚠️ No active resources found in database (${clientType})`);
    }

    return responseData;
  } catch (error) {
    console.error(`❌ Error fetching resources (${clientType}):`, error);
    
    // Return empty structure on error
    const errorData: ResourcesData = {
      classes: CLASSES,
      subjectsByClass: {},
      resources: {}
    };
    
    // Initialize empty resources
    CLASSES.forEach(className => {
      errorData.subjectsByClass[className] = [];
      errorData.resources[className] = {};
    });
    
    return errorData;
  }
}

export async function GET(request: Request) {
  try {
    console.log('🚀 API Route: GET /api/resources');
    
    let data: ResourcesData;
    let source = 'unknown';
    
    // Try with service role first (bypasses RLS)
    if (supabaseService) {
      try {
        data = await getResourcesFromDatabase(supabaseService, 'service_role');
        source = 'service_role';
        console.log('✅ Using service role data');
      } catch (serviceError) {
        console.log('⚠️ Service role failed, trying anon:', serviceError);
        // Fall back to anon
        data = await getResourcesFromDatabase(supabaseAnon, 'anon');
        source = 'anon_fallback';
      }
    } else {
      // Only anon available
      data = await getResourcesFromDatabase(supabaseAnon, 'anon');
      source = 'anon_only';
    }
    
    console.log(`✅ Resources data prepared (source: ${source})`);
    
    return NextResponse.json({
      success: true,
      data: data,
      source: source,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('🔥 API error:', error);
    
    // Return empty data on error
    const emptyData: ResourcesData = {
      classes: CLASSES,
      subjectsByClass: {},
      resources: {}
    };
    
    CLASSES.forEach(className => {
      emptyData.subjectsByClass[className] = [];
      emptyData.resources[className] = {};
    });
    
    return NextResponse.json({
      success: false,
      error: 'Failed to load resources data from database',
      data: emptyData,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Disable write methods
export async function POST(request: Request) {
  return NextResponse.json(
    { 
      success: false, 
      error: "Method not allowed. Use admin interface for adding resources." 
    },
    { status: 405 }
  );
}

export async function PUT(request: Request) {
  return NextResponse.json(
    { 
      success: false, 
      error: "Method not allowed. Use admin interface for updating resources." 
    },
    { status: 405 }
  );
}

export async function DELETE(request: Request) {
  return NextResponse.json(
    { 
      success: false, 
      error: "Method not allowed. Use admin interface for deleting resources." 
    },
    { status: 405 }
  );
}