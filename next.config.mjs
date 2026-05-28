// Build ID = Vercel commit SHA on prod, timestamp in local dev.
// Embedded into NEXT_PUBLIC_BUILD_ID so client + /api/version both see the same string.
const BUILD_ID =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
  process.env.COMMIT_SHA?.slice(0, 7) ||
  `local-${Date.now()}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => BUILD_ID,
  env: { NEXT_PUBLIC_BUILD_ID: BUILD_ID },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
