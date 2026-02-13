/** @type {import('next').NextConfig} */
const nextConfig = {
  // All other config you might have goes here...
  
  experimental: {
    // This forces classic Webpack bundler instead of Turbopack
    turbopack: false,
  },
};

export default nextConfig;