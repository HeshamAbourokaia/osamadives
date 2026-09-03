/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // The printed cards say osamadives.com/review; the page lives at /logbook.
    return [
      { source: "/review", destination: "/logbook#sign", permanent: false },
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
