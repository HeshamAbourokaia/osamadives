import { NextResponse } from "next/server";

/**
 * Dahab, right now: the sea and the sky over the shore Osama dives from, read from
 * Open-Meteo, a free public forecast service that needs no key. The site fetches it at
 * most every half hour and every visitor shares the answer, so nothing is asked of the
 * visitor's phone and nothing is paid for.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LAT = 28.49;
const LON = 34.52;
const ZONE = "Africa/Cairo";

export async function GET() {
  try {
    const [marine, sky] = await Promise.all([
      fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&current=wave_height,sea_surface_temperature&timezone=${encodeURIComponent(ZONE)}`, { next: { revalidate: 1800 } }).then((r) => r.json()),
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m,is_day&daily=sunrise,sunset&timezone=${encodeURIComponent(ZONE)}&forecast_days=1`, { next: { revalidate: 1800 } }).then((r) => r.json()),
    ]);
    const body = {
      ok: true,
      water: Math.round(Number(marine?.current?.sea_surface_temperature)),
      wave: Number(marine?.current?.wave_height),
      air: Math.round(Number(sky?.current?.temperature_2m)),
      wind: Math.round(Number(sky?.current?.wind_speed_10m)),
      isDay: Number(sky?.current?.is_day) === 1,
      sunrise: String(sky?.daily?.sunrise?.[0] ?? "").slice(11, 16),
      sunset: String(sky?.daily?.sunset?.[0] ?? "").slice(11, 16),
    };
    if (!Number.isFinite(body.water) || !Number.isFinite(body.wave)) throw new Error("no reading");
    return NextResponse.json(body, { headers: { "Cache-Control": "public, max-age=600, s-maxage=1800, stale-while-revalidate=3600" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
