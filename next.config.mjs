/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // /review is a real page (it carries the link-preview tags); only the plural redirects.
    return [
      { source: "/reviews", destination: "/logbook", permanent: false },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // The share-card renderer reads these at runtime; make sure Vercel ships them.
    outputFileTracingIncludes: { "/api/logbook/[id]/card": ["./src/lib/logbook/fonts/*.ttf"] },
  },
};

export default nextConfig;
