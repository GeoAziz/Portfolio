/**
 * Authentication utilities for user authentication and JWT handling
 * Supports both JWT and session-based authentication
 */

import { jwtVerify, SignJWT } from 'jose';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production-' + crypto.randomBytes(32).toString('hex')
);

const JWT_EXPIRATION = '7d';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'contributor';
  avatar?: string;
  bio?: string;
  // ISO timestamp of the user's last login — optional because older records may not have it
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

/**
 * Create JWT token for a user
 */
export async function createJWTToken(user: User): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token and extract user information
 */
export async function verifyJWTToken(token: string): Promise<AuthToken | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as unknown as AuthToken;
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header (Bearer scheme)
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }
  return parts[1];
}

/**
 * Extract token from cookies
 */
export function extractTokenFromCookies(cookies?: Record<string, string>): string | null {
  if (!cookies) return null;
  return cookies['auth-token'] || null;
}

/**
 * Hash password using PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, storedHash] = hash.split(':');
    const computedHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return computedHash === storedHash;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

/**
 * Generate a secure random token (for email verification, password reset, etc.)
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Create response with auth cookie
 */
export function createAuthCookie(token: string, expiresIn?: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (expiresIn || 7 * 24 * 60 * 60 * 1000)); // 7 days default

  return {
    name: 'auth-token',
    value: token,
    options: {
      expires: expires.toUTCString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
    },
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements: min 8 chars, at least one uppercase, one lowercase, one number
 */
export function isStrongPassword(password: string): {
  isStrong: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isStrong: errors.length === 0,
    errors,
  };
}
