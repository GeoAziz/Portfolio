import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing configuration
};

const withMDX = createMDX({
  // Add MDX options if needed
});

export default withMDX(nextConfig);
