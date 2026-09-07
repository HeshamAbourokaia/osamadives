import { WHATSAPP } from "@/lib/contact";

// On a phone the two things a visitor wants are always in reach at the bottom of the
// screen: a way to write to Osama, and the reviews. Hidden on a desk, where the top
// bar and the coastline carry them.
export default function MobileDock() {
  return (
    <nav className="dock" aria-label="Quick actions">
      <a className="dock__wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer">Message Osama</a>
      <a className="dock__more" href="/review">Reviews</a>
    </nav>
  );
}
