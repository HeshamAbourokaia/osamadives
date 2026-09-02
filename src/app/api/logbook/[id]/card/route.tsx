import { ImageResponse } from "next/og";
import { promises as fs } from "node:fs";
import path from "node:path";
import { siteUrl } from "@/lib/logbook/config";
import { formatDivedOn } from "@/lib/logbook/format";
import { isValidId } from "@/lib/logbook/ids";
import { siteInfo } from "@/lib/logbook/sites";
import { stampInfo } from "@/lib/logbook/stamps";
import { getStore } from "@/lib/logbook/store";
import { verifyToken } from "@/lib/logbook/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FONTS = path.join(process.cwd(), "src", "lib", "logbook", "fonts");
let fontsPromise: Promise<{ display: Buffer; text: Buffer; mono: Buffer }> | null = null;
const loadFonts = () =>
  (fontsPromise ||= Promise.all([
    fs.readFile(path.join(FONTS, "archivo-800.ttf")),
    fs.readFile(path.join(FONTS, "archivo-500.ttf")),
    fs.readFile(path.join(FONTS, "plexmono-500.ttf")),
  ]).then(([display, text, mono]) => ({ display, text, mono })));

const ABYSS = "#061420", BONE = "#F2EDE2", INK = "#171208", SOFT = "#6E6350", REEF = "#0B6B60", GLOW = "#3FD1BE";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!isValidId(id)) return new Response("Not found", { status: 404 });
  const entry = await getStore().get(id);
  if (!entry) return new Response("Not found", { status: 404 });
  const token = new URL(req.url).searchParams.get("t");
  if (entry.status !== "approved" && !verifyToken("share", id, token)) return new Response("Not found", { status: 404 });

  const fonts = await loadFonts();
  const site = siteInfo(entry.site);
  const stamp = stampInfo(entry.stamp);
  // Satori fetches images itself, so a dev-only relative upload path must become absolute.
  const photo = entry.photoUrl ? (entry.photoUrl.startsWith("/") ? `${siteUrl()}${entry.photoUrl}` : entry.photoUrl) : null;
  const maxNote = photo ? 300 : 560;
  const note = entry.note.length > maxNote ? `${entry.note.slice(0, maxNote - 1).trimEnd()}…` : entry.note;
  const when = formatDivedOn(entry.divedOn) || new Date(entry.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const mono = { fontFamily: "Plex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase" as const };

  return new ImageResponse(
    (
      <div style={{ width: 1080, height: 1920, display: "flex", flexDirection: "column", background: ABYSS, padding: 72, fontFamily: "Archivo" }}>
        <div style={{ ...mono, color: GLOW, display: "flex", justifyContent: "space-between" }}>
          <span>Dive log · Dahab</span>
          <span>Kept since 1983</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginTop: 40, background: BONE, borderRadius: 10, padding: 64, color: INK }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ ...mono, color: SOFT }}>Entry · {when}</span>
              <span style={{ fontSize: 88, fontWeight: 800, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: -2, marginTop: 28, maxWidth: 640 }}>{entry.name}</span>
              {entry.country ? <span style={{ ...mono, color: SOFT, marginTop: 20 }}>from {entry.country}</span> : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 230, height: 230, borderRadius: 115, border: `7px solid ${REEF}`, color: REEF, transform: "rotate(-9deg)", textAlign: "center", padding: 24 }}>
              <span style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.05, textTransform: "uppercase" }}>{stamp.label}</span>
            </div>
          </div>
          {photo ? (
            <img src={photo} alt="" style={{ width: 952, height: 640, objectFit: "cover", borderRadius: 6, marginTop: 44 }} />
          ) : null}
          <span style={{ ...mono, color: REEF, marginTop: 44 }}>{site.label}{site.depth ? ` · ${site.depth}` : ""}</span>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, marginTop: 28, position: "relative" }}>
            <span style={{ fontSize: photo ? 38 : 50, fontWeight: 500, lineHeight: 1.35 }}>{note}</span>
            {!photo ? (
              <div style={{ display: "flex", flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
                <span style={{ fontFamily: "Plex", fontSize: 200, fontWeight: 500, lineHeight: 1, color: "rgba(11, 107, 96, 0.13)", letterSpacing: -6 }}>
                  {site.depth ? site.depth.replace(" m", "") : "1983"}
                </span>
              </div>
            ) : null}
          </div>
          <div style={{ ...mono, color: SOFT, display: "flex", borderTop: `2px solid ${INK}22`, paddingTop: 28 }}>
            <span>{entry.course ? `${entry.course} · ` : ""}Stamped by Osama · Dahab</span>
          </div>
        </div>
        <div style={{ ...mono, color: "#93ABA8", display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <span>Sign my logbook</span>
          <span>osamadives.com/logbook</span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
      fonts: [
        { name: "Archivo", data: fonts.display, weight: 800, style: "normal" },
        { name: "Archivo", data: fonts.text, weight: 500, style: "normal" },
        { name: "Plex", data: fonts.mono, weight: 500, style: "normal" },
      ],
      headers: { "cache-control": entry.status === "approved" ? "public, max-age=86400" : "no-store" },
    },
  );
}
