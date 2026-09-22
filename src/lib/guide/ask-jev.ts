// The only network calls the guide and the finder make, and both go to this site's
// own routes, nowhere else. Back comes an id or a few ids; never any answer text.

async function post<T>(path: string, body: unknown, timeoutMs: number): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Which reviewed answer fits a question the keywords could not place, or null. */
export async function askJev(question: string, timeoutMs = 6000): Promise<string | null> {
  const data = await post<{ id?: unknown }>("/api/guide", { question }, timeoutMs);
  return data && typeof data.id === "string" ? data.id : null;
}

export type FinderAnswers = { dived?: "never" | "few" | "card"; card?: "ow" | "aow" | "pro"; want?: "try" | "cert"; days?: "1" | "3" | "7" };

/** The finder's taps, read out of a sentence. Only the confident ones come back. */
export async function askFinder(text: string, timeoutMs = 6000): Promise<FinderAnswers> {
  const data = await post<FinderAnswers>("/api/guide/finder", { text }, timeoutMs);
  const out: FinderAnswers = {};
  if (!data) return out;
  if (data.dived === "never" || data.dived === "few" || data.dived === "card") out.dived = data.dived;
  if (data.card === "ow" || data.card === "aow" || data.card === "pro") out.card = data.card;
  if (data.want === "try" || data.want === "cert") out.want = data.want;
  if (data.days === "1" || data.days === "3" || data.days === "7") out.days = data.days;
  return out;
}
