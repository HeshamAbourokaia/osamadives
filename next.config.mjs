/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // The address people are given is /review. It serves the reviews page without
    // changing what the browser shows, so nobody ever sees /logbook in the bar.
    return [
      { source: "/review", destination: "/logbook" },
      { source: "/reviews", destination: "/logbook" },
      { source: "/admin", destination: "/logbook/admin" },
      // A single review's own page, so a printed or shared link never says /logbook either.
      { source: "/review/:id", destination: "/logbook/:id" },
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
