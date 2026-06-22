/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reusable: dashboard can import packages directly from the monorepo
  // without needing to publish them to npm. Next.js compiles them in.
  transpilePackages: ["@rynk/core", "@rynk/layer3-generate"],
  experimental: {
    // Server components can read the filesystem (runs/ directory) for data
    // until we wire a real DB later.
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
