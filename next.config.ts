
import createMDX from '@next/mdx';
import type {NextConfig} from 'next';

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: [
        "https://6000-firebase-studio-1764267609947.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev",
        "https://9000-firebase-studio-1764267609947.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev"
    ]
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withMDX(nextConfig);
