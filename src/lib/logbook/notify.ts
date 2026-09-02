import type { LogbookEntry } from "./types";
import { siteInfo } from "./sites";
import { stampInfo } from "./stamps";

export interface ModerationLinks {
  approve: string;
  hide: string;
  view: string;
}

function summary(e: LogbookEntry): string {
  const site = siteInfo(e.site);
  const bits = [e.name, e.country, site.label, e.divedOn, e.course].filter(Boolean).join(" · ");
  const flags = e.flags.length ? `\nFlags: ${e.flags.join(", ")}` : "";
  return `New logbook entry\n${bits}\nStamp: ${stampInfo(e.stamp).label}${flags}\n\n${e.note}`;
}

async function telegram(e: LogbookEntry, links: ModerationLinks): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = (process.env.TELEGRAM_CHAT_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || chats.length === 0) return false;

  const text = summary(e);
  const reply_markup = {
    inline_keyboard: [
      [{ text: "Approve", url: links.approve }, { text: "Hide", url: links.hide }],
      [{ text: "Open on the site", url: links.view }],
    ],
  };
  let sent = false;
  for (const chat_id of chats) {
    const usePhoto = Boolean(e.photoUrl && /^https:\/\//.test(e.photoUrl));
    const method = usePhoto ? "sendPhoto" : "sendMessage";
    const body = usePhoto
      ? { chat_id, photo: e.photoUrl, caption: text.slice(0, 1000), reply_markup }
      : { chat_id, text: text.slice(0, 4000), reply_markup };
    let res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
    });
    if (!res.ok && usePhoto) {
      res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id, text: `${text}\n\nPhoto: ${e.photoUrl}`, reply_markup }),
      });
    }
    sent = sent || res.ok;
    if (!res.ok) console.error("telegram notify failed", res.status, await res.text().catch(() => ""));
  }
  return sent;
}

async function email(e: LogbookEntry, links: ModerationLinks): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.LOGBOOK_NOTIFY_EMAILS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || to.length === 0) return false;
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
  const html = `<pre style="font:15px/1.5 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${esc(summary(e))}</pre>
${e.photoUrl ? `<p><img src="${esc(e.photoUrl)}" style="max-width:480px;border-radius:6px"></p>` : ""}
<p><a href="${links.approve}" style="background:#0d9488;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:700">Approve</a>
&nbsp;&nbsp;<a href="${links.hide}" style="background:#444;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:700">Hide</a></p>
<p><a href="${links.view}">Open on the site</a></p>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.LOGBOOK_FROM_EMAIL || "OsamaDives Logbook <onboarding@resend.dev>",
      to, subject: `Logbook: ${e.name}${e.country ? ` from ${e.country}` : ""}`, html,
    }),
  });
  if (!res.ok) console.error("email notify failed", res.status, await res.text().catch(() => ""));
  return res.ok;
}

// Never throws: a failed notification must not lose the student's entry.
export async function notifyNewEntry(e: LogbookEntry, links: ModerationLinks): Promise<void> {
  const results = await Promise.allSettled([telegram(e, links), email(e, links)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value);
  if (!delivered) {
    console.log(`[logbook] new entry ${e.id} (no notification channel configured)\n${summary(e)}\nApprove: ${links.approve}\nHide: ${links.hide}`);
  }
}
