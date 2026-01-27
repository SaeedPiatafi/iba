import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyPassword } from '@/app/lib/auth-utils';
import { generateToken, setAuthCookie } from '@/app/lib/jwt-utils';
import { loginRateLimiter, getClientIP } from '@/app/lib/rate-limit';

// Path to admin users file
const ADMIN_USERS_PATH = path.join(process.cwd(), 'app', 'data', 'admin-users.json');

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
};

interface AdminUser {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  failedLoginAttempts: number;
  lockedUntil: string | null;
}

interface AdminData {
  users: AdminUser[];
  settings: {
    maxFailedAttempts: number;
    lockoutDuration: number;
    sessionDuration: number;
  };
}

async function readAdminData(): Promise<AdminData> {
  try {
    const fileContent = await fs.readFile(ADMIN_USERS_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // Default structure if file doesn't exist
    return {
      users: [],
      settings: {
        maxFailedAttempts: 5,
        lockoutDuration: 15, // minutes
        sessionDuration: 24, // hours
      },
    };
  }
}

async function writeAdminData(data: AdminData): Promise<void> {
  await fs.writeFile(ADMIN_USERS_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    // Add security headers
    const headers = new Headers();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = loginRateLimiter.checkLimit(`login:${clientIP}`);
    
    if (!rateLimit.allowed) {
      headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString());
      
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers,
        }
      );
    }

    // Validate request
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content-Type must be application/json',
        },
        { 
          status: 400,
          headers,
        }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { email, password } = body;
    
    // ============ ADD DEBUG LOGS HERE ============
    console.log('=== LOGIN API DEBUG ===');
    console.log('Request received at:', new Date().toISOString());
    console.log('Email received:', `"${email}"`);
    console.log('Email length:', email?.length || 'undefined');
    console.log('Password received:', `"${password}"`);
    console.log('Password length:', password?.length || 'undefined');
    
    // Show character codes to check for hidden characters
    if (email) {
      console.log('Email char codes:', [...email].map((c: string) => c.charCodeAt(0)));
    }
    if (password) {
      console.log('Password char codes:', [...password].map((c: string) => c.charCodeAt(0)));
    }
    // ============ END DEBUG LOGS ============
    
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { 
          status: 400,
          headers,
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { 
          status: 400,
          headers,
        }
      );
    }

    // Read admin data
    const adminData = await readAdminData();
    console.log('Admin data file has users:', adminData.users.length);
    
    // Find user
    const user = adminData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    console.log('User found?', !!user);

    if (!user) {
      // More debugging
      console.log('Available users in DB:');
      adminData.users.forEach((u, i) => {
        console.log(`  ${i + 1}. Email: "${u.email}"`);
        console.log(`     DB email char codes:`, [...u.email].map((c: string) => c.charCodeAt(0)));
        console.log(`     Input email char codes:`, [...email].map((c: string) => c.charCodeAt(0)));
        console.log(`     Lowercase match:`, u.email.toLowerCase() === email.toLowerCase());
      });
      
      // Simulate password verification time to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { 
          status: 401,
          headers,
        }
      );
    }

    // User found - more debugging
    console.log('User details:');
    console.log('  Email from DB:', `"${user.email}"`);
    console.log('  Email from DB char codes:', [...user.email].map((c: string) => c.charCodeAt(0)));
    console.log('  Hash (first 30 chars):', user.passwordHash.substring(0, 30) + '...');
    console.log('  Hash length:', user.passwordHash.length);
    
    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const lockTime = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
      
      return NextResponse.json(
        {
          success: false,
          error: `Account is locked. Try again in ${lockTime} minutes.`,
          lockedUntil: user.lockedUntil,
        },
        { 
          status: 423,
          headers,
        }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account is disabled. Please contact administrator.',
        },
        { 
          status: 403,
          headers,
        }
      );
    }

    // Verify password with detailed logging
    console.log('\n=== PASSWORD VERIFICATION ===');
    console.log('Calling verifyPassword...');
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    console.log('verifyPassword returned:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Password verification failed!');
      console.log('Testing with bcrypt directly...');
      
      // Direct bcrypt test
      const bcrypt = require('bcryptjs');
      const directResult = await bcrypt.compare(password, user.passwordHash);
      console.log('Direct bcrypt.compare result:', directResult);
      
      // Test with trimmed password
      const trimmedResult = await bcrypt.compare(password.trim(), user.passwordHash);
      console.log('With trimmed password:', trimmedResult);
      
      // Test exact match
      console.log('Password exact match test:', password === 'saeed786');
      console.log('Password length match:', password.length === 8);
      console.log('Password char by char:');
      for (let i = 0; i < Math.max(password.length, 8); i++) {
        const pChar = password[i] || 'MISSING';
        const eChar = 'saeed786'[i] || 'MISSING';
        console.log(`  Pos ${i}: Form="${pChar}"(${pChar.charCodeAt(0)}) vs Expected="${eChar}"(${eChar.charCodeAt(0)}) - ${pChar === eChar ? 'MATCH' : 'DIFFERENT'}`);
      }
      
      // Update failed login attempts
      user.failedLoginAttempts++;
      
      // Check if account should be locked
      if (user.failedLoginAttempts >= adminData.settings.maxFailedAttempts) {
        const lockoutDuration = adminData.settings.lockoutDuration * 60000; // Convert to milliseconds
        user.lockedUntil = new Date(Date.now() + lockoutDuration).toISOString();
      }
      
      await writeAdminData(adminData);
      
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
          remainingAttempts: adminData.settings.maxFailedAttempts - user.failedLoginAttempts,
        },
        { 
          status: 401,
          headers,
        }
      );
    }

    // Successful login
    console.log('\n=== SUCCESSFUL LOGIN ===');
    console.log('Password verified successfully!');
    
    // Reset failed attempts and lock status
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLogin = new Date().toISOString();
    
    await writeAdminData(adminData);
    
    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    
    const token = generateToken(tokenPayload);
    
    // Set HTTP-only cookie
    console.log('Setting auth cookie...');
    await setAuthCookie(token);
    
    // Reset rate limit for successful login
    loginRateLimiter.resetLimit(`login:${clientIP}`);
    
    // Return success response
    console.log('Returning success response');
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { 
        status: 200,
        headers,
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { 
        status: 500,
        headers: securityHeaders,
      }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: securityHeaders }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: securityHeaders }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: securityHeaders }
  );
}