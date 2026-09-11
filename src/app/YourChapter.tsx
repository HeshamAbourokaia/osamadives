"use client";

import { useState } from "react";
import { WHATSAPP } from "@/lib/contact";
import styles from "./YourChapter.module.css";

const chapters = [
  {
    id: "first",
    label: "My first time",
    title: "Every story starts somewhere.",
    copy: "Curious about the water? Tell Osama what you are looking forward to, and anything you would like to talk through first.",
    image: "/images/osama-brand-hero.webp",
    alt: "Osama explaining something to a student in the shallows of Dahab",
    caption: "A student, an instructor, and time to explain.",
    prompt: "What would you like Osama to know?",
    placeholder: "I have never dived before. I would love to see the reef, but I have a few questions…",
    message: "I am thinking about my first diving experience in Dahab.",
  },
  {
    id: "family",
    label: "A family memory",
    title: "Some days stay in the family.",
    copy: "A shared first experience, a birthday, or simply time together. Tell him who is coming and what you would like to remember. He can talk through what is possible for everyone.",
    image: "/descent/peak-2012.webp",
    alt: "Osama helping his son Abdullah into a scuba tank in the courtyard in May 2012",
    caption: "Osama and Abdullah · a tank bigger than his son · 2012",
    prompt: "Who is coming, and what is the occasion?",
    placeholder: "We are coming as a family. Some of us dive and some don't…",
    message: "I would love to talk about a family visit or special occasion in Dahab.",
  },
  {
    id: "return",
    label: "Coming back",
    title: "A familiar shore. A new chapter.",
    copy: "Been here before? Tell Osama when, what you remember, and what has changed since your last dive. Start the conversation from there.",
    image: "/descent/peak-1987.webp",
    alt: "The family archive photograph from August 1987, showing visitors beside a truck on the Dahab shore",
    caption: "The family's shore, long before this website · August 1987",
    prompt: "What brings you back to Dahab?",
    placeholder: "I last visited a few years ago. I remember…",
    message: "I am thinking about returning to Dahab and diving with you.",
  },
] as const;

export default function YourChapter() {
  const [selected, setSelected] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const chapter = chapters[selected];
  const note = notes[chapter.id] || "";
  const draft = new URL(WHATSAPP);
  draft.searchParams.set("text", `Hi Osama! I found Your Dahab Chapter on osamadives.com. ${chapter.message}${note.trim() ? `\n\n${note.trim()}` : ""}`);

  return (
    <section className={styles.section} id="your-chapter" aria-labelledby="chapter-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <span className={styles.kicker}>His family&apos;s shore. Your own story.</span>
          <h2 id="chapter-heading">Your Dahab<br /><em>chapter.</em></h2>
          <p>Sun on the shore. A place at the table. A memory in the water. What brings you here matters as much as where you dive.</p>
          <a className={styles.archiveLink} href="#peak-act">Step into his family&apos;s story <span aria-hidden="true">↗</span></a>
        </div>

        <div className={styles.story}>
          <div className={styles.choices} role="group" aria-label="What brings you to Dahab?">
            {chapters.map((item, index) => (
              <button key={item.id} type="button" aria-pressed={selected === index} aria-controls="chapter-story" onClick={() => setSelected(index)}>{item.label}</button>
            ))}
          </div>
          <figure className={styles.photo}>
            {/* Preserve the complete photograph, including both people, at every width. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chapter.image} alt={chapter.alt} loading="lazy" />
            <figcaption>{chapter.caption}</figcaption>
          </figure>
          <div id="chapter-story" className={styles.detail} aria-live="polite" aria-atomic="true">
            <h3>{chapter.title}</h3>
            <p>{chapter.copy}</p>
          </div>
          <div className={styles.note}>
            <label htmlFor="chapter-note">{chapter.prompt} <span>Optional</span></label>
            <textarea id="chapter-note" value={note} maxLength={500} rows={3} placeholder={chapter.placeholder} onChange={(event) => setNotes({ ...notes, [chapter.id]: event.target.value })} />
            <a className={styles.contact} href={draft.toString()} target="_blank" rel="noopener noreferrer">Talk to Osama about your chapter <span aria-hidden="true">↗</span></a>
            <p className={styles.hint}>Your note opens in WhatsApp. Review it there and send when you&apos;re ready.</p>
          </div>
          <p className={styles.arrangements}>Osama confirms what is possible for your experience and training. Diving arrangements are made through CDWS-registered dive centres.</p>
        </div>
      </div>
    </section>
  );
}
