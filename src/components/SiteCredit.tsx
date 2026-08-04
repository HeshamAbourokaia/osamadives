/**
 * Small build credit, rendered once from the root layout so it sits below
 * whichever footer the page already has.
 */
export default function SiteCredit() {
  return (
    <div id="site-credit" className="bg-gray-900 border-t border-gray-800 px-4 py-5">
      <p className="max-w-6xl mx-auto text-center text-xs text-gray-500">
        Site designed and built by{" "}
        <a
          href="https://heshamabourokaia.github.io"
          target="_blank"
          rel="noopener"
          className="text-gray-400 underline underline-offset-2 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60 rounded"
        >
          Hesham Abourokaia
        </a>
      </p>
    </div>
  );
}
