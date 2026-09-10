import ShareCode from "./ShareCode";
import AddToHome from "./AddToHome";
import { WHATSAPP } from "@/lib/contact";

// The foot of every page: the way around the site, the show-a-friend code, the legal line.
export default function TailFoot() {
  return (
    <footer className="tail-foot">
      <span>OsamaDives · family on this shore since 1983 · Dahab, South Sinai, Egypt</span>
      <nav aria-label="Footer">
        <a href="/diving-with-osama">Diving with Osama</a>
        <a href="/dive-sites">Dive sites</a>
        <a href="/blog">Journal</a>
        <a href="/gallery">Gallery</a>
        <a href="/review">Reviews</a>
        <a href="/featured/chatgpt">Featured</a>
        <a href="https://facebook.com/sharkrest.official" target="_blank" rel="noopener noreferrer">Shark Restaurant</a>
        <a href="https://instagram.com/osama_mohamed_hassan" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </nav>
      <ShareCode caption="Point a camera at this and the same page opens on their phone, no typing." />
      <AddToHome />
      <p className="tail-legal">This website is a personal portfolio showing Osama&apos;s diving experience and credentials. All diving activities, courses and experiences are conducted through CDWS-registered dive centres in Dahab. For diving enquiries and arrangements contact Osama directly; this site is an informational resource and does not take bookings or payments.</p>
      <p className="tail-legal">&copy; 2026 OsamaDives.com · Dahab, South Sinai, Egypt · Pioneer family since 1983 · Shark Restaurant legacy · PADI Master Scuba Diver Trainer</p>
    </footer>
  );
}
