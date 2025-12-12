'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  locale?: string;
  newsletter?: boolean;
  notifications?: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    locale: 'en',
    newsletter: true,
    notifications: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  async function fetchPreferences() {
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
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      const userId = data.user.id;

      const profileResponse = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setPreferences(profileData.profile?.preferences || {});
      }
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSavePreferences() {
    try {
      setIsSaving(true);
      setMessage(null);

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const authResponse = await fetch('/api/auth?action=me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!authResponse.ok) {
        throw new Error('Failed to get user ID');
      }

      const authData = await authResponse.json();
      const userId = authData.user.id;

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save preferences',
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your preferences and account settings</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Theme Settings */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                <div className="flex gap-4">
                  {(['light', 'dark', 'system'] as const).map((theme) => (
                    <label key={theme} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={preferences.theme === theme}
                        onChange={(e) =>
                          setPreferences({ ...preferences, theme: e.target.value as any })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{theme}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Locale Settings */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Language</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Preferred Language
              </label>
              <select
                value={preferences.locale || 'en'}
                onChange={(e) =>
                  setPreferences({ ...preferences, locale: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">🇬🇧 English</option>
                <option value="ar">🇸🇦 العربية</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications ?? true}
                  onChange={(e) =>
                    setPreferences({ ...preferences, notifications: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 dark:text-gray-300">Enable all notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.newsletter ?? true}
                  onChange={(e) =>
                    setPreferences({ ...preferences, newsletter: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 dark:text-gray-300">Subscribe to newsletter</span>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Privacy & Data</h2>
            <div className="space-y-3">
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Download my data
              </button>
              <button className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Delete my account
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
            <Link
              href="/user/profile"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
