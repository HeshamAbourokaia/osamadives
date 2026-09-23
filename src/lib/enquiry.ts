import type { EnquiryNote } from "@/lib/guide/ask-jev";
import { answerQuestion } from "@/lib/guide/engine";
import { DAN_SCREENING } from "@/lib/guide/links";
import { guideProfile } from "@/lib/guide/profile";

/**
 * When a visitor describes themselves in a sentence, the first WhatsApp message can
 * carry that sentence, so Osama reads their situation in their own words before he
 * replies, plus one plain line for anything Jev noticed that he should ask about.
 * A health mention is the exception: the site never repeats medical details, so the
 * message only says there is a health question and the sentence stays out of it.
 * The visitor sees and can change every word in WhatsApp before sending.
 */
const LINES: Record<EnquiryNote, string> = {
  medical: "I also have a health question to ask you before we plan anything.",
  nerves: "I would like to talk about nerves in the water.",
  children: "I would like to ask about diving with children.",
};

/** The guide's own medical keywords, as a backstop for when Jev is away or unsure. It only
    keeps a sentence out of the message. "Flying" is dropped first: in the guide it means
    flying after diving, but here it is nearly always someone saying when they arrive. */
export const mentionsHealth = (text: string) => ["medical", "emergency"].includes(answerQuestion(guideProfile, text.replace(/\b(fly|flying|flight)\b/gi, " ")).id);

export function enquiryMessage(ask: string, story: string, notes: EnquiryNote[] = []): string {
  const words = story.replace(/\s+/g, " ").trim().slice(0, 600);
  const own = words && !notes.includes("medical") && !mentionsHealth(words) ? `\n\nIn my own words: "${words}"` : "";
  const extra = notes.map((n) => LINES[n]).join(" ");
  return `Hi Osama! I found you on osamadives.com. ${ask}${own}${extra ? `\n\n${extra}` : ""}`;
}

/** What the finder shows under "I read", in words the site already uses elsewhere. */
export const NOTE_TEXT: Record<EnquiryNote, { text: string; link?: { label: string; href: string } }> = {
  medical: {
    text: "You mentioned something about your health. This site cannot assess fitness to dive, symptoms or medication. Talk to a dive-medicine doctor and complete the centre's official screening form. Your message to Osama will say you have a health question, without the details.",
    link: { label: "DAN: medical screening", href: DAN_SCREENING },
  },
  nerves: { text: "Osama is patient with nerves; tell him what worries you." },
  children: { text: "Osama teaches children too; the site lists Seal Team and Bubblemaker for younger divers. The centre confirms ages and suitability for each programme." },
};
