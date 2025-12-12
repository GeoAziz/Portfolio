/**
 * User storage and profile management
 * Handles user creation, updates, retrieval, and deletion
 */

import { promises as fs } from 'fs';
import path from 'path';
import { User, hashPassword } from './auth';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROFILES_FILE = path.join(DATA_DIR, 'user-profiles.json');

interface UserWithPassword extends User {
  password: string;
}

interface UserProfile extends Record<string, any> {
  userId: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    locale?: string;
    newsletter?: boolean;
    notifications?: boolean;
  };
  savedContent?: string[]; // array of content slugs
  bookmarks?: Array<{ type: string; slug: string; savedAt: string }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Ensure data directory exists
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Load users from file
 */
async function loadUsers(): Promise<UserWithPassword[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Load user profiles from file
 */
async function loadProfiles(): Promise<UserProfile[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(PROFILES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save users to file
 */
async function saveUsers(users: UserWithPassword[]) {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

/**
 * Save user profiles to file
 */
async function saveProfiles(profiles: UserProfile[]) {
  await ensureDataDir();
  await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  name: string,
  password: string,
  role: 'user' | 'admin' | 'contributor' = 'user'
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const users = await loadUsers();

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return { success: false, error: 'User with this email already exists' };
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = hashPassword(password);
    const now = new Date().toISOString();

    const newUser: UserWithPassword = {
      id: userId,
      email,
      name,
      role,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);
    await saveUsers(users);

    // Create empty profile for new user
    const profiles = await loadProfiles();
    profiles.push({
      userId,
      createdAt: now,
      updatedAt: now,
    });
    await saveProfiles(profiles);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword as User };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(
  email: string
): Promise<User | null> {
  try {
    const users = await loadUsers();
    const user = users.find((u) => u.email === email);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const users = await loadUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Get user with password for authentication
 */
export async function getUserWithPassword(
  email: string
): Promise<UserWithPassword | null> {
  try {
    const users = await loadUsers();
    return users.find((u) => u.email === email) || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const profiles = await loadProfiles();
    const profileIndex = profiles.findIndex((p) => p.userId === userId);

    if (profileIndex === -1) {
      return { success: false, error: 'User profile not found' };
    }

    const updated: UserProfile = {
      ...profiles[profileIndex],
      ...updates,
      userId,
      updatedAt: new Date().toISOString(),
    };

    profiles[profileIndex] = updated;
    await saveProfiles(profiles);

    return { success: true, profile: updated };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const profiles = await loadProfiles();
    return profiles.find((p) => p.userId === userId) || null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Add bookmark to user profile
 */
export async function addBookmark(
  userId: string,
  type: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    if (!profile.bookmarks) {
      profile.bookmarks = [];
    }

    // Check if already bookmarked
    if (profile.bookmarks.some((b) => b.slug === slug && b.type === type)) {
      return { success: false, error: 'Already bookmarked' };
    }

    profile.bookmarks.push({
      type,
      slug,
      savedAt: new Date().toISOString(),
    });

    await updateUserProfile(userId, profile);
    return { success: true };
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return { success: false, error: 'Failed to add bookmark' };
  }
}

/**
 * Remove bookmark from user profile
 */
export async function removeBookmark(
  userId: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    if (profile.bookmarks) {
      profile.bookmarks = profile.bookmarks.filter((b) => b.slug !== slug);
      await updateUserProfile(userId, profile);
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return { success: false, error: 'Failed to remove bookmark' };
  }
}

/**
 * Update user info (name, avatar, etc.)
 */
export async function updateUser(
  userId: string,
  updates: Partial<User>
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const users = await loadUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const updated = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    users[userIndex] = updated;
    await saveUsers(users);

    const { password: _, ...userWithoutPassword } = updated;
    return { success: true, user: userWithoutPassword as User };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user' };
  }
}

/**
 * Delete user and associated profile
 */
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const users = await loadUsers();
    const profiles = await loadProfiles();

    const filteredUsers = users.filter((u) => u.id !== userId);
    const filteredProfiles = profiles.filter((p) => p.userId !== userId);

    await saveUsers(filteredUsers);
    await saveProfiles(filteredProfiles);

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

/**
 * List all users (admin only)
 */
export async function listUsers(): Promise<User[]> {
  try {
    const users = await loadUsers();
    return users.map(({ password: _, ...user }) => user as User);
  } catch (error) {
    console.error('Error listing users:', error);
    return [];
  }
}
