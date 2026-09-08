import qrcode from "qrcode-generator";

/**
 * One code, drawn one way. The dark modules of a QR come back as a single SVG path,
 * with the two module quiet zone a scanner needs around them, so the code in the foot
 * and the code the triple tap raises cannot drift apart. Runs of dark modules become
 * one rectangle each instead of one per module, which keeps the path short.
 */
export function qrPath(text: string) {
  const qr = qrcode(0, "H");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const runs: string[] = [];
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (qr.isDark(r, c)) {
        const start = c;
        while (c < n && qr.isDark(r, c)) c++;
        runs.push(`M${start + 2} ${r + 2}h${c - start}v1h-${c - start}z`);
      } else c++;
    }
  }
  return { size: n + 4, d: runs.join("") };
}
