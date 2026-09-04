import { revalidatePath } from "next/cache";
import { siteUrl } from "@/lib/logbook/config";
import { isValidId } from "@/lib/logbook/ids";
import { getStore } from "@/lib/logbook/store";
import { verifyToken } from "@/lib/logbook/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

function page(title: string, body: string, status: number): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#061420;color:#EDF4F2;font:500 18px/1.5 system-ui,-apple-system,sans-serif}main{max-width:32rem;padding:2rem}h1{font:800 clamp(2rem,7vw,3rem)/1 system-ui,sans-serif;text-transform:uppercase;letter-spacing:-.02em;margin:0 0 1rem}p{color:#93ABA8;margin:0 0 1.5rem}a{display:inline-block;margin:.25rem .5rem .25rem 0;padding:.8rem 1.3rem;border-radius:4px;background:#3FD1BE;color:#04121A;font-weight:700;text-decoration:none}a.quiet{background:transparent;color:#93ABA8;border:1px solid rgba(147,171,168,.4)}small{display:block;margin-top:2rem;font:500 11px/1.5 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:#3FD1BE}</style></head>
<body><main><h1>${esc(title)}</h1>${body}<small>OsamaDives · reviews</small></main></body></html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const action = url.searchParams.get("action");
  const t = url.searchParams.get("t");

  if (!isValidId(id) || (action !== "approve" && action !== "hide") || !verifyToken("moderate", id, t)) {
    return page("This link is not valid.", "<p>It may have expired (links last 30 days), or it was changed. Open the newest message for this entry and try again.</p>", 403);
  }

  const store = getStore();
  const entry = await store.setStatus(id, action === "approve" ? "approved" : "hidden", new Date().toISOString(), "link");
  if (!entry) return page("No such entry.", "<p>It may have been removed.</p>", 404);

  revalidatePath("/logbook");
  revalidatePath(`/logbook/${id}`);
  revalidatePath("/");

  const base = siteUrl();
  const undo = `${base}/api/logbook/moderate?id=${id}&action=${action === "approve" ? "hide" : "approve"}&t=${t}`;
  if (action === "approve") {
    return page(
      `Approved. ${entry.name}'s page is in the book.`,
      `<p>It is live now. Tap Hide if you change your mind, nobody is told.</p><a href="${base}/logbook/${id}">See the page</a><a class="quiet" href="${undo}">Hide it instead</a>`,
      200,
    );
  }
  return page(
    `Hidden. ${entry.name}'s page will not show.`,
    `<p>Nobody saw it. It stays in the archive in case you want it back.</p><a href="${undo}">Approve it instead</a><a class="quiet" href="${base}/logbook">Open the logbook</a>`,
    200,
  );
}
