// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check environment variables in development
if (!supabaseUrl || !supabaseAnonKey) {
  
  // Only throw error in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing Supabase environment variables')
  }
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    }
  }
)

// Admin client for server-side operations
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null