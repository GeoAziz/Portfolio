/**
 * Authentication API endpoint
 * POST /api/auth/login - Login with email and password
 * POST /api/auth/signup - Create new user account
 * POST /api/auth/logout - Logout user
 * GET /api/auth/me - Get current user info
 * POST /api/auth/refresh - Refresh JWT token
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createJWTToken,
  verifyJWTToken,
  extractTokenFromHeader,
  isValidEmail,
  isStrongPassword,
  verifyPassword,
} from '@/lib/auth';
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserWithPassword,
} from '@/lib/user-storage';

// Validation schemas
const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required'),
});

const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const RefreshSchema = z.object({
  token: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'login') {
      return await handleLogin(request);
    } else if (action === 'signup') {
      return await handleSignup(request);
    } else if (action === 'logout') {
      return handleLogout();
    } else if (action === 'refresh') {
      return await handleRefresh(request);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyJWTToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleLogin(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Get user with password
    const userWithPassword = await getUserWithPassword(email);
    if (!userWithPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    if (!verifyPassword(password, userWithPassword.password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createJWTToken({
      id: userWithPassword.id,
      email: userWithPassword.email,
      name: userWithPassword.name,
      role: userWithPassword.role,
      createdAt: userWithPassword.createdAt,
      updatedAt: userWithPassword.updatedAt,
    });

    // Get user without password
    const user = await getUserByEmail(email);

    const response = NextResponse.json(
      {
        success: true,
        user,
        token,
        expiresIn: '7d',
      },
      { status: 200 }
    );

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

async function handleSignup(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validation = SignupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, name, password } = validation.data;

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.isStrong) {
      return NextResponse.json(
        { success: false, error: passwordValidation.errors[0] },
        { status: 400 }
      );
    }

    // Create user
    const result = await createUser(email, name, password, 'user');

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 409 }
      );
    }

    // Create JWT token
    const token = await createJWTToken(result.user!);

    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
        token,
        expiresIn: '7d',
      },
      { status: 201 }
    );

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Signup failed' },
      { status: 500 }
    );
  }
}

function handleLogout(): NextResponse {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.delete('auth-token');

  return response;
}

async function handleRefresh(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validation = RefreshSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 400 }
      );
    }

    const decoded = await verifyJWTToken(validation.data.token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const user = await getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const newToken = await createJWTToken(user);

    const response = NextResponse.json(
      {
        success: true,
        token: newToken,
        expiresIn: '7d',
      },
      { status: 200 }
    );

    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Token refresh failed' },
      { status: 500 }
    );
  }
}
