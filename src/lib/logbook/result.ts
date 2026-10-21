export interface SubmitResult {
  ok: boolean;
  error?: string;
  id?: string;
  cardUrl?: string;
}

// Our own route always answers in JSON, but the platform in front of it does not: a
// request over 4.5 MB comes back as plain text, a timeout as an HTML page. Calling
// res.json() on those makes Safari show "The string did not match the expected
// pattern", which means nothing to a diver. Read the text first, then decide.
export async function readResult(res: Response): Promise<SubmitResult> {
  const text = await res.text().catch(() => "");
  try {
    const data = JSON.parse(text) as SubmitResult;
    if (data && typeof data === "object" && typeof data.ok === "boolean") return data;
  } catch {
    /* not ours; explained below */
  }
  if (res.status === 413) {
    return { ok: false, error: "That photo is too big to send. Try a smaller one, or send it to Osama on WhatsApp after." };
  }
  return { ok: false, error: "Your page did not reach Osama. Wait a minute and press Submit review again." };
}
