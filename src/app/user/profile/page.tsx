'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
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
  savedContent?: string[];
  bookmarks?: Array<{ type: string; slug: string; savedAt: string }>;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'contributor';
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/auth?action=me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);

      // Fetch profile data
      const profileResponse = await fetch(`/api/users/${data.user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Not logged in</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Please log in to view your profile</p>
          <Link href="/login" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                  {user.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-blue-100">{user.email}</p>
                <p className="text-blue-100 text-sm mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bio</h2>
              {isEditing ? (
                <textarea
                  defaultValue={profile?.bio || user.bio || ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Write your bio..."
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {profile?.bio || user.bio || 'No bio added yet'}
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Social Links</h2>
              <div className="space-y-3">
                {profile?.social?.github && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">GitHub:</span>
                    <a
                      href={`https://github.com/${profile.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {profile.social.github}
                    </a>
                  </div>
                )}
                {profile?.social?.twitter && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">Twitter:</span>
                    <a
                      href={`https://twitter.com/${profile.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {profile.social.twitter}
                    </a>
                  </div>
                )}
                {profile?.social?.linkedin && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">LinkedIn:</span>
                    <a
                      href={`https://linkedin.com/in/${profile.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {profile.social.linkedin}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preferences</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={profile?.preferences?.newsletter ?? false}
                    disabled={!isEditing}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Subscribe to newsletter</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={profile?.preferences?.notifications ?? false}
                    disabled={!isEditing}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Enable notifications</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Content */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Saved Items</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  <span className="font-semibold">{profile?.savedContent?.length || 0}</span> saved articles
                </p>
                <p className="mb-2">
                  <span className="font-semibold">{profile?.bookmarks?.length || 0}</span> bookmarks
                </p>
              </div>
              {profile?.bookmarks && profile.bookmarks.length > 0 && (
                <div className="mt-4 space-y-2">
                  {profile.bookmarks.slice(0, 5).map((bookmark, idx) => (
                    <div key={idx} className="text-xs text-gray-500 dark:text-gray-500">
                      {bookmark.type}: {bookmark.slug}
                    </div>
                  ))}
                  {profile.bookmarks.length > 5 && (
                    <p className="text-xs text-gray-500">+{profile.bookmarks.length - 5} more</p>
                  )}
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Role</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Joined</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('auth-token');
                  router.push('/');
                }}
                className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
