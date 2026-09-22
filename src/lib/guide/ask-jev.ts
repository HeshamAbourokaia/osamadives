// The one network call the guide makes, and only when its own matching drew a blank:
// the question goes to this site's own route, which asks Jev which reviewed answer
// fits. Back comes an id or null. No answer text ever comes over the wire.
export async function askJev(question: string, timeoutMs = 6000): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch("/api/guide", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: unknown };
    return typeof data.id === "string" ? data.id : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
