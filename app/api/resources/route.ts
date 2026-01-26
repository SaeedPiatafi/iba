// app/api/resources/route.ts
import { NextResponse } from 'next/server';
import resources from '@/app/data/resources.json';

let resourcesCache = resources;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classParam = searchParams.get('class');
    const subject = searchParams.get('subject');
    const type = searchParams.get('type');

    // Create a fresh response data object
    let responseData = JSON.parse(JSON.stringify(resourcesCache));

    // If class parameter is provided, filter resources by class
    if (classParam) {
      const resourcesObj = resourcesCache.resources as Record<string, any>;
      const classResources = resourcesObj[classParam];
      
      if (classResources) {
        // Create a filtered resources object
        const filteredResources: Record<string, any> = {};
        filteredResources[classParam] = classResources;
        
        // If subject is also provided, filter further
        if (subject && classResources[subject]) {
          filteredResources[classParam] = {
            [subject]: classResources[subject]
          };
          
          // If type is also provided, filter by type
          if (type) {
            const filteredByType = classResources[subject].filter(
              (resource: any) => resource.type.toLowerCase() === type.toLowerCase()
            );
            filteredResources[classParam][subject] = filteredByType;
          }
        }
        
        // Update the response data
        responseData.resources = filteredResources;
      } else {
        // Class not found
        return NextResponse.json({
          success: false,
          error: `Class '${classParam}' not found`,
          data: null,
        }, { status: 404 });
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in resources API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load resources data',
        data: null,
      },
      { status: 500 }
    );
  }
}