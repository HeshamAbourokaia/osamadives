"use client";

import { useState } from "react";

const REPLIES = [
  {
    id: "welcome",
    label: "Welcome before meeting",
    ar: "أهلًا [الاسم]، مبسوط إنك جاي/جاية دهب. لما نتقابل هنبدأ بهدوء ونمشي خطوة خطوة. لو عندك أي سؤال اكتبهولي هنا.",
    en: "Welcome [name]. I am happy you are coming to Dahab. We will start calmly and take it one step at a time. Send me any question here.",
  },
  {
    id: "meeting",
    label: "Confirm time and place",
    ar: "أهلًا [الاسم]، مستنيك/مستنياك يوم [اليوم] الساعة [الوقت] عند [المكان]. ابعتلي لو حصل أي تغيير في الوصول.",
    en: "Hi [name]. I will meet you on [day] at [time] by [place]. Please message me if your arrival changes.",
  },
  {
    id: "calm",
    label: "Reassure a beginner",
    ar: "مفيش استعجال يا [الاسم]. هنشرح كل حاجة على مهل، وهنقف عند أي نقطة تحب تسأل عنها. المهم تكون مرتاح/مرتاحة.",
    en: "There is no rush, [name]. We will go through everything slowly and stop for any question. The important thing is that you feel comfortable.",
  },
  {
    id: "change",
    label: "Arrival changed",
    ar: "يا [الاسم]، لو وقت وصولك اتغير ابعتلي الوقت الجديد. هأكد لك المكان والخطة قبل ما نبدأ.",
    en: "If your arrival time changes, [name], send me the new time. I will confirm the meeting place and plan before we start.",
  },
  {
    id: "followup",
    label: "After the dive",
    ar: "شكرًا يا [الاسم] على غوص النهارده. خُد وقتك وافتكر أهم نقطة اتعلمناها. لو فيه سؤال ابعتهولي وأنا أرد عليك.",
    en: "Thank you for today’s dive, [name]. Take your time and remember the main thing we practised. Send me any question and I will reply.",
  },
  {
    id: "next",
    label: "Next learning step",
    ar: "الخطوة الجاية يا [الاسم] هي [الخطوة]. لما تكون جاهز/جاهزة ابعتلي ونرتبها حسب وقتك ومستواك.",
    en: "Your next step, [name], is [next step]. When you are ready, message me and we will arrange it around your time and experience.",
  },
] as const;

export default function QuickReplies() {
  const [selected, setSelected] = useState<(typeof REPLIES)[number]["id"]>("welcome");
  const [message, setMessage] = useState<string>(REPLIES[0].ar);
  const [feedback, setFeedback] = useState("");
  const reply = REPLIES.find((item) => item.id === selected) ?? REPLIES[0];

  function choose(id: (typeof REPLIES)[number]["id"]) {
    const next = REPLIES.find((item) => item.id === id) ?? REPLIES[0];
    setSelected(next.id);
    setMessage(next.ar);
    setFeedback("");
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.trim());
      setFeedback("Copied. Review it, then paste it into WhatsApp.");
    } catch {
      setFeedback("Select the message above, then copy and paste it into WhatsApp.");
    }
  }

  return (
    <section className="lb-admin-replies" aria-labelledby="quick-replies-heading">
      <div className="lb-admin-replies__head">
        <div>
          <span className="lb-mono">Quick replies · وقت أقل على الهاتف</span>
          <h2 id="quick-replies-heading">Choose, check, copy.</h2>
          <p className="lb-stand">ردود عربية جاهزة للمواقف المتكررة. غيّر الكلمات بين [قوسين] فقط.</p>
        </div>
        <span className="lb-admin-replies__badge" lang="ar" dir="rtl">ردود جاهزة</span>
      </div>
      <div className="lb-admin-replies__choices" role="group" aria-label="Ready-made messages">
        {REPLIES.map((item) => (
          <button key={item.id} type="button" className={item.id === selected ? "is-selected" : ""} aria-pressed={item.id === selected} onClick={() => choose(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <label className="lb-field lb-admin-replies__field" lang="ar" dir="rtl">
        <span className="lb-mono" dir="ltr">Arabic message · edit only what you need</span>
        <textarea value={message} rows={4} maxLength={700} onChange={(event) => { setMessage(event.target.value); setFeedback(""); }} />
      </label>
      <p className="lb-admin-replies__translation" lang="en">English meaning: {reply.en}</p>
      <div className="lb-admin__actions">
        <button type="button" className="lb-btn" onClick={copyMessage}>Copy Arabic reply</button>
        <span className="lb-admin-replies__hint" role="status">{feedback || "Nothing is sent from this button."}</span>
      </div>
    </section>
  );
}
