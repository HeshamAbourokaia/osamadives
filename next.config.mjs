/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // The share-card renderer reads these at runtime; make sure Vercel ships them.
    outputFileTracingIncludes: { "/api/logbook/[id]/card": ["./src/lib/logbook/fonts/*.ttf"] },
  },
};

export default nextConfig;
