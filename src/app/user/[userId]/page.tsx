/**
 * User Profile Page
 * Displays public user profile with bio, projects, and social links
 */

import { notFound } from 'next/navigation';
import { getUserById, getUserProfile } from '@/lib/user-storage';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: {
    userId: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const user = await getUserById(params.userId);
  if (!user) return {};

  return {
    title: `${user.name} - Portfolio`,
    description: user.bio || `View ${user.name}'s profile and work`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const user = await getUserById(params.userId);
  const profile = user ? await getUserProfile(params.userId) : null;

  if (!user || !profile || !profile.publicProfile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-8">
            {user.avatar && (
              <Image
                src={user.avatar}
                alt={user.name}
                width={120}
                height={120}
                className="w-30 h-30 rounded-full"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              {profile.location && (
                <p className="text-gray-600 dark:text-gray-300">{profile.location}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {profile.bio}
            </p>
          )}

          {/* Social Links */}
          <div className="flex flex-wrap gap-4">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Website
              </a>
            )}
            {profile.social?.github && (
              <a
                href={`https://github.com/${profile.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                GitHub
              </a>
            )}
            {profile.social?.twitter && (
              <a
                href={`https://twitter.com/${profile.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
              >
                Twitter
              </a>
            )}
            {profile.social?.linkedin && (
              <a
                href={`https://linkedin.com/in/${profile.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              >
                LinkedIn
              </a>
            )}
            {profile.displayEmail && (
              <a
                href={`mailto:${user.email}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Email
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest: string) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Last Login Info */}
        {profile.displayLastLogin && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last active: {new Date(user.lastLogin ?? user.updatedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
