// app/api/admin/resources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/auth-helper';

// Define types
type ResourceType = 'Book' | 'Video' | 'Article' | 'Practice' | 'Exam';

// Helper function to get Supabase admin client with null check
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
  return supabaseAdmin;
}

// Helper function to require admin authentication
async function requireAdminAuth() {
  try {
    const authResult = await checkAdminAuth();
    
    if (!authResult.isAdmin) {
      throw new Error(authResult.error || 'Admin access required');
    }

    return authResult.user;
  } catch (error) {
    throw error;
  }
}

// Helper function to check Supabase connection
async function checkSupabaseConnection() {
  try {
    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();
    
    // Test the connection
    const { error } = await adminClient.from('resources').select('count', { count: 'exact', head: true });
    
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    throw error;
  }
}

// ===================================================================
// GET - Get all resources or filtered resources
// ===================================================================
export async function GET(req: NextRequest) {

  
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    // Check Supabase connection
    await checkSupabaseConnection();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const classParam = searchParams.get('class');
    const subject = searchParams.get('subject');
    const type = searchParams.get('type');
    const search = searchParams.get('search');


    // Build query
    let query = adminClient
      .from('resources')
      .select('*')
      .eq('is_active', true);

    // Apply filters
    if (id) {
      const { data: resource, error } = await query
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { success: false, error: 'Resource not found' },
            { status: 404 }
          );
        }
        throw error;
      }

      if (!resource) {
        return NextResponse.json(
          { success: false, error: 'Resource not found' },
          { status: 404 }
        );
      }

      const transformedResource = {
        id: resource.id,
        title: resource.title,
        description: resource.description,
        type: resource.type as ResourceType,
        class: resource.class,
        subject: resource.subject,
        url: resource.url,
        tags: resource.tags || [],
        downloads: resource.downloads || 0,
        isActive: resource.is_active,
        createdAt: resource.upload_date,
        updatedAt: resource.updated_at
      };

      return NextResponse.json({
        success: true,
        data: transformedResource
      });
    }

    if (classParam && classParam !== 'All Classes') {
      query = query.eq('class', classParam);
    }

    if (subject && subject !== 'All Subjects') {
      query = query.eq('subject', subject);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Execute query
    const { data: resources, error } = await query.order('upload_date', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform data
    const transformedResources = (resources || []).map((resource: any) => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type as ResourceType,
      class: resource.class,
      subject: resource.subject,
      url: resource.url,
      tags: resource.tags || [],
      downloads: resource.downloads || 0,
      isActive: resource.is_active,
      createdAt: resource.upload_date,
      updatedAt: resource.updated_at
    }));

    // Get stats
    const stats = {
      total: transformedResources.length,
      byType: transformedResources.reduce((acc: any, resource) => {
        acc[resource.type] = (acc[resource.type] || 0) + 1;
        return acc;
      }, {}),
      byClass: transformedResources.reduce((acc: any, resource) => {
        acc[resource.class] = (acc[resource.class] || 0) + 1;
        return acc;
      }, {}),
      bySubject: transformedResources.reduce((acc: any, resource) => {
        acc[resource.subject] = (acc[resource.subject] || 0) + 1;
        return acc;
      }, {})
    };

    return NextResponse.json({
      success: true,
      data: transformedResources,
      stats: stats,
      count: transformedResources.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }
    
    if (error.message.includes('Database connection failed')) {
      return NextResponse.json(
        { success: false, error: 'Database connection error. Please try again later.' },
        { status: 500 }
      );
    }
    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// ===================================================================
// POST - Create new resource
// ===================================================================
export async function POST(req: NextRequest) {
  
  try {
    // Require admin authentication
    const user = await requireAdminAuth();
    
    // Check Supabase connection
    await checkSupabaseConnection();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['title', 'type', 'class', 'subject', 'url'];
    const missing = requiredFields.filter(field => !body[field]?.trim());
    
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Validate resource type
    const validTypes = ['Book', 'Video', 'Article', 'Practice', 'Exam'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid resource type' },
        { status: 400 }
      );
    }

    // Check if resource already exists`);
    const { data: existingResource, error: checkError } = await adminClient
      .from('resources')
      .select('id')
      .eq('title', body.title.trim())
      .eq('class', body.class)
      .eq('subject', body.subject)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingResource) {
      return NextResponse.json(
        { success: false, error: 'Resource with same title, class, and subject already exists' },
        { status: 409 }
      );
    }

    // Prepare resource data
    const resourceData = {
      title: body.title.trim(),
      description: body.description?.trim() || '',
      type: body.type,
      class: body.class,
      subject: body.subject,
      url: body.url.trim(),
      tags: Array.isArray(body.tags) ? body.tags : [],
      downloads: 0,
      is_active: true,
      upload_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user?.email || 'admin'
    };


    // Insert into database
    const { data: resource, error: insertError } = await adminClient
      .from('resources')
      .insert(resourceData)
      .select()
      .single();

    if (insertError) {

      
      // Handle specific errors
      if (insertError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Resource with this title, class, and subject already exists' },
          { status: 409 }
        );
      }
      
      if (insertError.code === '23514') {
        return NextResponse.json(
          { success: false, error: 'Invalid resource type. Allowed types: Book, Video, Article, Practice, Exam' },
          { status: 400 }
        );
      }
      
      throw insertError;
    }



    // Transform response
    const transformedResource = {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type as ResourceType,
      class: resource.class,
      subject: resource.subject,
      url: resource.url,
      tags: resource.tags || [],
      downloads: resource.downloads || 0,
      isActive: resource.is_active,
      createdAt: resource.upload_date,
      updatedAt: resource.updated_at
    };

    return NextResponse.json({
      success: true,
      message: 'Resource created successfully',
      data: transformedResource
    }, { status: 201 });

  } catch (error: any) {
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }
    
    if (error.message.includes('Database connection failed')) {
      return NextResponse.json(
        { success: false, error: 'Database connection error. Please try again later.' },
        { status: 500 }
      );
    }
    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create resource. Please try again.' },
      { status: 500 }
    );
  }
}

// ===================================================================
// PUT - Update existing resource
// ===================================================================
export async function PUT(req: NextRequest) {  
  try {
    await requireAdminAuth();
    await checkSupabaseConnection();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const body = await req.json();
    

    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Resource ID is required' },
        { status: 400 }
      );
    }

    // Check if resource exists
    const { data: existingResource, error: checkError } = await adminClient
      .from('resources')
      .select('id')
      .eq('id', body.id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Resource not found' },
          { status: 404 }
        );
      }
      throw checkError;
    }

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Validate URL if provided
    if (body.url) {
      try {
        new URL(body.url);
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid URL format' },
          { status: 400 }
        );
      }
    }

    // Validate resource type if provided
    if (body.type) {
      const validTypes = ['Book', 'Video', 'Article', 'Practice', 'Exam'];
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid resource type' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description?.trim() || '';
    if (body.type !== undefined) updateData.type = body.type;
    if (body.class !== undefined) updateData.class = body.class;
    if (body.subject !== undefined) updateData.subject = body.subject;
    if (body.url !== undefined) updateData.url = body.url.trim();
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? body.tags : [];
    if (body.isActive !== undefined) updateData.is_active = body.isActive;

    // Update resource
    const { error: updateError } = await adminClient
      .from('resources')
      .update(updateData)
      .eq('id', body.id);

    if (updateError) {
      
      // Handle specific errors
      if (updateError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Another resource with this title, class, and subject already exists' },
          { status: 409 }
        );
      }
      
      if (updateError.code === '23514') {
        return NextResponse.json(
          { success: false, error: 'Invalid resource type. Allowed types: Book, Video, Article, Practice, Exam' },
          { status: 400 }
        );
      }
      
      throw updateError;
    }


    return NextResponse.json({
      success: true,
      message: 'Resource updated successfully'
    });

  } catch (error: any) {
    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }
    
    if (error.message.includes('Database connection failed')) {
      return NextResponse.json(
        { success: false, error: 'Database connection error. Please try again later.' },
        { status: 500 }
      );
    }
    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update resource. Please try again.' },
      { status: 500 }
    );
  }
}

// ===================================================================
// DELETE - Remove resource
// ===================================================================
export async function DELETE(req: NextRequest) {
  
  try {
    await requireAdminAuth();
    await checkSupabaseConnection();

    // Get the Supabase admin client
    const adminClient = getSupabaseAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Resource ID is required' },
        { status: 400 }
      );
    }

    // Check if resource exists
    const { data: existingResource, error: checkError } = await adminClient
      .from('resources')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Resource not found' },
          { status: 404 }
        );
      }
      throw checkError;
    }

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Soft delete (set is_active to false)
    const { error: deleteError } = await adminClient
      .from('resources')
      .update({ 
        is_active: false, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }
    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully'
    });

  } catch (error: any) {    
    if (error.message.includes('Admin access required')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }
    
    if (error.message.includes('Database connection failed')) {
      return NextResponse.json(
        { success: false, error: 'Database connection error. Please try again later.' },
        { status: 500 }
      );
    }
    
    if (error.message.includes('Supabase admin client not configured')) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete resource. Please try again.' },
      { status: 500 }
    );
  }
}