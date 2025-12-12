/**
 * User profile API endpoint
 * GET /api/users/[userId] - Get user profile
 * PUT /api/users/[userId] - Update user profile
 * POST /api/users/[userId]/bookmarks - Add bookmark
 * DELETE /api/users/[userId]/bookmarks/[slug] - Remove bookmark
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWTToken, extractTokenFromHeader } from '@/lib/auth';
import {
  getUserProfile,
  updateUserProfile,
  addBookmark,
  removeBookmark,
  updateUser,
} from '@/lib/user-storage';

/**
 * Verify user has permission to access this profile
 */
async function verifyUserAccess(
  request: NextRequest,
  userId: string
): Promise<{ authorized: boolean; currentUserId?: string }> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return { authorized: false };
  }

  const token = authHeader.split(' ')[1];
  const decoded = await verifyJWTToken(token);

  if (!decoded) {
    return { authorized: false };
  }

  // User can only access their own profile unless they're admin
  const isAdmin = decoded.role === 'admin';
  const isOwner = decoded.userId === userId;

  return {
    authorized: isAdmin || isOwner,
    currentUserId: decoded.userId,
  };
}

/**
 * GET /api/users/[userId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Verify access
    const access = await verifyUserAccess(request, userId);
    if (!access.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = await getUserProfile(userId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[userId]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Verify access
    const access = await verifyUserAccess(request, userId);
    if (!access.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Update user profile
    const result = await updateUserProfile(userId, body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, profile: result.profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users/[userId]/bookmarks
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const url = new URL(request.url);

    // Verify access
    const access = await verifyUserAccess(request, userId);
    if (!access.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (url.pathname.includes('/bookmarks')) {
      // Add bookmark
      const body = await request.json();
      const { type, slug } = body;

      if (!type || !slug) {
        return NextResponse.json(
          { success: false, error: 'Type and slug are required' },
          { status: 400 }
        );
      }

      const result = await addBookmark(userId, type, slug);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, message: 'Bookmark added' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add bookmark' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[userId]/bookmarks/[slug]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; slug?: string } }
) {
  try {
    const { userId, slug } = params;

    // Verify access
    const access = await verifyUserAccess(request, userId);
    if (!access.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    const result = await removeBookmark(userId, slug);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}
