// script/test.js
require('dotenv').config({ path: '.env' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for server-side
// OR for anon access: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing connection to:', supabaseUrl);
console.log('Key length:', supabaseKey ? supabaseKey.length : 'No key found');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Attempting to connect...');
  
  try {
    // Try a simple query
    const { data, error } = await supabase
      .from('_tables') // or use a table that exists in your project
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Query error:', error.message);
    } else {
      console.log('✅ Connection successful!');
      console.log('Data sample:', data);
    }
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

testConnection();