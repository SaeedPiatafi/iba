import { NextRequest } from 'next/server';

// In-memory store for rate limiting (use Redis in production)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }>;
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  checkLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return {
        allowed: true,
        remaining: this.maxAttempts - 1,
        resetTime: now + this.windowMs,
      };
    }

    if (now > attempt.resetTime) {
      // Reset window
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return {
        allowed: true,
        remaining: this.maxAttempts - 1,
        resetTime: now + this.windowMs,
      };
    }

    if (attempt.count >= this.maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: attempt.resetTime,
      };
    }

    attempt.count++;
    this.attempts.set(key, attempt);
    
    return {
      allowed: true,
      remaining: this.maxAttempts - attempt.count,
      resetTime: attempt.resetTime,
    };
  }

  resetLimit(key: string): void {
    this.attempts.delete(key);
  }
}

// Create rate limiter instance (5 attempts per 15 minutes)
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

// Get client IP for rate limiting
export function getClientIP(request: NextRequest): string {
  // Try to get IP from different headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  // If x-forwarded-for exists, take the first IP (client IP)
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[0] || 'unknown';
  }
  
  // If x-real-ip exists, use it
  if (realIP) {
    return realIP;
  }
  
  // For local development or when headers are not available
  // In production, you should always have these headers set by your proxy/load balancer
  return 'localhost';
}