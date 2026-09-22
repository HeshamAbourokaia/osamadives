import { WHATSAPP } from "@/lib/contact";
import { DAN_SCREENING } from "./links";
import type { GuideProfile, GuideTopic } from "./types";

const home = "/";
const teaching = "/diving-with-osama";
const sites = "/dive-sites";
export const CDWS = "arranged through CDWS registered dive centres in Dahab";

function topic(id: string, phrases: string[], text: string, href = teaching, label = "Diving with Osama", suggestions?: string[]): GuideTopic {
  return { id, phrases, text, sources: [{ label, href }], suggestions };
}

/**
 * Every answer here was checked against the site's own pages. It is a guide to what
 * the site already says, not a calendar, a price list or a certification register,
 * and it never puts Osama forward as a dive centre: everything runs through CDWS
 * registered centres, and the answers say so.
 */
export const guideProfile: GuideProfile = {
  title: "Ask about diving",
  subtitle: "A little help before the water",
  welcome: "Hello! I am the website's guide, not Osama himself. Ask about his story, the courses, Dahab's dive sites or the trips. For anything to arrange, I will point you to him on WhatsApp.",
  reviewed: "22 September 2026",
  suggestions: ["I have never dived before", "Meet Osama", "Explore the dive sites", "Trips and safaris"],
  contact: { label: "Message Osama on WhatsApp", href: WHATSAPP },
  fallback: "I do not have a checked answer to that. I can help with Osama's courses, the dive sites, the trips and his story. For anything else, message him directly; I will not guess.",
  topics: [
    topic("about", ["meet osama", "who is osama", "about osama", "his story", "experience", "qualified", "credentials", "instructor", "how long has he"], "Osama Mohamed Hassan is a PADI Master Scuba Diver Trainer in Dahab, South Sinai. He has taught since 2011, and his family has lived on this shore since 1983. He teaches patiently, in small groups of two to four.", home, "Meet Osama", ["Which organisations?", "What courses are there?"]),
    topic("heritage", ["shark restaurant", "family", "1983", "history", "father", "heritage", "pioneer"], "Osama's family settled in Dahab in 1983, the fourth family to do so, and opened Shark Restaurant on the beachfront that same year. The site tells that story with the family's own photographs.", "/#peak-act", "The family story"),
    topic("courses", ["what courses", "courses offered", "course list", "learn to dive", "diving courses", "courses", "course", "what does he teach", "teach"], `He teaches Intro Dive, Open Water, Advanced, Rescue Diver, Divemaster and specialties, all ${CDWS}. Which one interests you?`, "/#school-act", "Courses", ["I have never dived before", "Open Water course", "Advanced course", "Specialty courses"]),
    topic("intro", ["never dived", "never dove", "first dive", "first time", "beginner", "beginners", "intro dive", "try diving", "discover scuba", "no experience", "nervous", "anxious", "scared"], `An intro dive at the Lighthouse is a real first breath under water, with no certification needed and Osama beside you the whole time. He is patient with nerves; tell him what worries you. Like every dive, it is ${CDWS}.`, teaching, "Starting with Osama", ["Open Water course", "What should I bring?"]),
    topic("open-water", ["open water", "openwater", "get certified", "first certification", "certification course"], `Open Water is the first certification, usually 3 to 4 days, ${CDWS}. Osama confirms what you need and your schedule.`, "/#school-act", "Open Water", ["What should I bring?", "Advanced course"]),
    topic("advanced", ["advanced", "aow", "adventure dives"], `Advanced runs about two days with five adventure dives, including deep and navigation. The other three are chosen with Osama, ${CDWS}.`, "/#school-act", "Advanced course", ["Specialty courses", "Explore the dive sites"]),
    topic("rescue", ["rescue diver", "rescue course", "rescue"], `Rescue Diver is listed as 3 to 4 days, ${CDWS}. Ask Osama to confirm the entry requirements.`, teaching, "Rescue Diver"),
    topic("divemaster", ["divemaster", "dive master", "professional", "career", "work as a diver"], `Divemaster is listed as two weeks to a month, ${CDWS}. Confirm the prerequisites and timing with Osama.`, "/#school-act", "Divemaster"),
    topic("specialties", ["specialty", "specialties", "nitrox", "buoyancy", "deep course", "boat course"], `Listed specialties include deep, nitrox, night, buoyancy and boat diving, ${CDWS}. Ask which fits your training.`, teaching, "Specialties"),
    topic("language", ["language", "languages", "arabic", "english", "german", "russian", "speak", "العربية", "عربي"], "Osama teaches in English and Arabic, and gets by in a little German and Russian. This guide answers in English; you can message him in either language.", teaching, "Teaching languages"),
    topic("organisations", ["organisation", "organisations", "organization", "organizations", "padi", "cdws", "ssi", "cmas", "sdi", "tdi", "dive centre", "dive center", "agency", "agencies", "which organisations"], "His qualification is PADI Master Scuba Diver Trainer. Dives and courses are arranged through CDWS registered dive centres in Dahab; Osama does not run a dive centre of his own. Ask him which centre will organise your activity.", teaching, "How diving is arranged"),
    topic("sites", ["explore the dive sites", "explore dive sites", "which sites", "what sites", "dive sites", "diving sites", "where can we dive", "reefs"], "His guides cover Lighthouse Reef, the Blue Hole, the Canyon, Eel Garden and Three Pools. Each has its own character and its own level. Osama and the centre choose a site to suit your experience and the day's conditions.", sites, "Dive site guides", ["Lighthouse Reef", "Blue Hole", "The Canyon", "Eel Garden", "Three Pools"]),
    topic("lighthouse", ["lighthouse", "house reef", "night dive", "night diving", "refresher"], "Lighthouse Reef is the town's shore-entry site, where Osama runs training, refreshers, night dives and close-up photography. Ask him what suits your certification and recent experience.", `${sites}/lighthouse-reef-dahab`, "Lighthouse Reef guide"),
    topic("blue-hole", ["blue hole", "bluehole"], "The Blue Hole is Dahab's famous deep sinkhole, with reef and wall diving around it. A site's depth is not a visitor's permitted depth: your instructor chooses a route within your qualification. This guide does not plan dives or confirm eligibility.", `${sites}/blue-hole-dahab`, "Blue Hole guide"),
    topic("canyon", ["canyon"], "The Canyon is known for its rock formations, shafts of light and glassfish. Osama's guide describes it for Advanced divers and above. Its enclosed parts need an in-person briefing; this is not a route recommendation.", `${sites}/the-canyon-dahab`, "The Canyon guide"),
    topic("eel-garden", ["eel garden", "eels", "rays"], "Eel Garden is a sandy slope with colonies of garden eels and reef life nearby. His guide lists Open Water or higher. The instructor and centre confirm the conditions and the dive on the day.", `${sites}/eel-garden-dahab`, "Eel Garden guide"),
    topic("three-pools", ["three pools", "3 pools"], "Three Pools is a run of shallow coral-fringed pools beside a reef, listed for Open Water or higher. Ask Osama about a guided visit; this guide does not give directions.", `${sites}/three-pools-dahab`, "Three Pools guide"),
    topic("trips", ["trips and safaris", "trips", "trip", "safari", "safaris", "ras abu galum", "ras abu gallum", "camel", "snorkelling", "snorkeling", "excursion"], `Listed trips include a half-day Blue Hole visit and a full-day Ras Abu Galum camel safari, and snorkellers are welcome. All are ${CDWS}; confirm the details with Osama.`, teaching, "Trips with Osama"),
    topic("arrival", ["what should i bring", "bring", "pack", "equipment", "gear", "meeting point", "where do we meet", "arrive", "arrival", "checklist"], "Before you arrive, confirm the meeting point, the time and the organising centre with Osama. Bring your certification card and logbook if you have them, swimwear, a towel, dry clothes, sun protection and water. Ask what equipment is included.", "/before-you-arrive", "Before you arrive"),
    topic("children", ["children", "child", "kids", "kid", "son", "daughter", "minimum age", "years old"], "Osama teaches children too; the site lists Seal Team and Bubblemaker for younger divers. The centre confirms ages and suitability for each programme; this guide cannot approve a child for diving.", teaching, "Children and diving"),
    topic("reviews", ["review", "reviews", "logbook", "testimonial", "testimonials", "what do students say", "write a review"], "Students write Osama a page in his logbook after diving with him. You can read them, or write your own, on the reviews page.", "/logbook", "Reviews"),
    topic("contact", ["contact", "whatsapp", "phone", "message", "talk to osama", "human", "person", "speak to him", "number"], "Use the button below to open WhatsApp with Osama. It opens with a short greeting you can change before sending. Nothing you type in this chat is forwarded.", home, "Osama's site"),
  ],
};

export const MEDICAL_SOURCE = { label: "DAN: medical screening", href: DAN_SCREENING };
