/**
 * Where a moderation tap came from, said in words.
 *
 * Vercel puts the country and the city of every request into its own headers, so the
 * site can record where a review was approved without ever storing an address or an IP.
 * It is kept coarse on purpose: a city, a country, and whether the tap came from a phone
 * or a computer. Nothing that identifies a person. In development the headers are not
 * there, so it falls back to the device alone, and to an empty string if even that is
 * missing.
 *
 * It exists because the approve button in the phone notification needs no passcode, so
 * anyone subscribed to that notification can put a review on the site. This line is the
 * only way to look back later and see whose phone it was.
 */
export function whereFrom(req: Request): string {
  const h = req.headers;
  const dec = (v: string | null) => {
    if (!v) return "";
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };

  const code = (h.get("x-vercel-ip-country") || "").trim().toUpperCase();
  const city = dec(h.get("x-vercel-ip-city")).trim();
  const ua = h.get("user-agent") || "";
  // Chrome states it outright; everything else has to be read off the agent string.
  const phone = h.get("sec-ch-ua-mobile") === "?1" || /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  const device = ua ? (phone ? "a phone" : "a computer") : "";

  let country = "";
  if (/^[A-Z]{2}$/.test(code)) {
    try {
      country = new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
    } catch {
      country = code;
    }
  }

  const place = [city, country].filter(Boolean).join(", ");
  if (place && device) return `${device} in ${place}`;
  if (place) return place;
  return device;
}
