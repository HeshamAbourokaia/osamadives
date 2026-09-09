// WhatsApp is the only way to reach Osama from the site.
const NUMBER = "201090208050";

/**
 * WhatsApp gives no way to attach anything hidden to a message. What Osama receives is
 * an ordinary message from an ordinary number, and the sender can rewrite the words we
 * put in before they send. So the only honest way to tell him where somebody came from
 * is to say it in the message itself, in words a person is happy to send unchanged.
 * Naming the page does that and tells him what they were reading, which is worth more
 * than knowing only that it was the site.
 */
export function whatsapp(about?: string) {
  const text = about
    ? `Hi Osama! I was reading about ${about} on osamadives.com and I would love to chat about diving in Dahab.`
    : "Hi Osama! I found you on osamadives.com and I would love to chat about diving in Dahab.";
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`;
}

/** "Blue Hole" needs a "the" in a sentence; "The Canyon" already has one. */
export function theName(name: string) {
  return /^the\s/i.test(name) ? name : `the ${name}`;
}

export const WHATSAPP = whatsapp();
