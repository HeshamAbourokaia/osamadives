"use client";
import { useState } from "react";

const COPY = {
  en: {
    label: "Before you arrive", title: "Less to organise. More time by the sea.",
    intro: "Use this checklist before meeting Osama. Your centre and instructor will confirm the details for your own course or dives.",
    steps: [
      ["Confirm the meeting point", "Ask Osama for the date, time, meeting point and name of the dive centre arranging your activity."],
      ["Tell him about your experience", "First time, tried it before, or already certified? Share your certification and recent diving experience so he can suggest the right starting point."],
      ["Have your course details ready", "If you are taking a course, ask the centre which official learning materials and forms to complete before arrival. Bring your certification and logbook if you have them."],
      ["Pack for the shore", "Swimwear, a towel, a change of clothes, sun protection and drinking water. Ask what equipment is included before packing your own."],
      ["Make room for questions", "Write down anything you want to talk through. You can ask in English or Arabic. You do not have to arrive knowing all the answers."],
    ],
    done: "ready", note: "These ticks stay on this page while it is open. They are not sent to Osama.",
    more: "The learning happens with your instructor", detail: "This is an arrival checklist, not a dive briefing or certification course. Ask your centre for the official materials that belong to your course.",
  },
  ar: {
    label: "قبل ما توصل", title: "ترتيب أقل… ووقت أكتر جنب البحر.",
    intro: "راجع القائمة دي قبل ما تقابل أسامة. مركز الغوص والمدرب هيأكدوا معاك التفاصيل المناسبة للكورس أو الغطسات بتاعتك.",
    steps: [
      ["أكد مكان المقابلة", "اسأل أسامة عن اليوم والساعة ومكان المقابلة واسم مركز الغوص المسؤول عن الترتيبات."],
      ["احكي له عن خبرتك", "دي أول مرة، جربت قبل كده، ولا معاك شهادة؟ شارك مستوى شهادتك وآخر خبرة ليك في الغوص علشان يختار معاك بداية مناسبة."],
      ["جهّز تفاصيل الكورس", "لو هتعمل كورس، اسأل المركز عن المواد التعليمية الرسمية والاستمارات المطلوبة قبل الوصول. هات شهادتك وسجل الغطسات لو عندك."],
      ["جهّز حاجتك للشاطئ", "لبس بحر، فوطة، غيار، وسيلة حماية من الشمس ومياه للشرب. اسأل عن المعدات المتوفرة قبل ما تجيب معداتك."],
      ["جهّز أسئلتك", "اكتب أي حاجة حابب تسأل عنها. تقدر تتكلم بالعربي أو بالإنجليزي، ومش مطلوب منك تيجي عارف كل الإجابات."],
    ],
    done: "جاهز", note: "علامات الاختيار بتفضل في الصفحة طول ما هي مفتوحة، ومش بتتبعت لأسامة.",
    more: "التعلّم بيكون مع مدربك", detail: "دي قائمة للاستعداد للوصول، مش إحاطة غوص أو كورس شهادة. اطلب من مركزك المواد الرسمية الخاصة بالكورس بتاعك.",
  },
};
export default function ArrivalChecklist() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [checked, setChecked] = useState<number[]>([]);
  const copy = COPY[lang];
  return <div className="arrival-checklist">
    <div className="arrival-languages" role="group" aria-label="Checklist language">
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>English</button>
      <button type="button" lang="ar" aria-pressed={lang === "ar"} onClick={() => setLang("ar")}>العربية</button>
    </div>
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <span className="microcopy">{copy.label}</span>
      <h1>{copy.title}</h1><p>{copy.intro}</p>
      <p aria-live="polite">{checked.length} / {copy.steps.length} {copy.done}</p>
      <ul className="arrival-steps">{copy.steps.map(([title, text], i) => <li key={i}>
        <label><input type="checkbox" checked={checked.includes(i)} onChange={() => setChecked((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])} /><span><strong>{title}</strong><span>{text}</span></span></label>
      </li>)}</ul>
      <p className="arrival-note">{copy.note}</p>
      <h2>{copy.more}</h2><p>{copy.detail}</p>
    </div>
  </div>;
}
