import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '24h';
const AUTH_COOKIE_NAME = 'auth-token'; // Consistent cookie name

export interface UserPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

// Generate JWT token
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): UserPayload | null {
  try {
    if (!token) {
      console.log('No token provided to verifyToken');
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    console.log('Token verified successfully:', { userId: decoded.userId, email: decoded.email });
    return decoded;
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// Set authentication cookie
export async function setAuthCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    console.log('Auth cookie set successfully with name:', AUTH_COOKIE_NAME);
  } catch (error) {
    console.error('Error setting auth cookie:', error);
  }
}

// Get authentication cookie
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
    console.log('Auth token retrieved:', token ? 'Yes' : 'No');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// Clear authentication cookie
export async function clearAuthCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    console.log('Auth cookie cleared');
  } catch (error) {
    console.error('Error clearing auth cookie:', error);
  }
}

// Validate token from request
export async function validateAuthToken(): Promise<UserPayload | null> {
  try {
    console.log('Starting validateAuthToken...');
    const token = await getAuthToken();
    
    if (!token) {
      console.log('No token found in cookies');
      return null;
    }
    
    console.log('Token found, verifying...');
    const user = verifyToken(token);
    
    if (!user) {
      console.log('Token verification returned null');
      return null;
    }
    
    console.log('User authenticated successfully:', { userId: user.userId, email: user.email });
    return user;
  } catch (error) {
    console.error('Error in validateAuthToken:', error);
    return null;
  }
}