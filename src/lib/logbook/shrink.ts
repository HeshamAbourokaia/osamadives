// A phone photo is often bigger than Vercel lets a function receive (4.5 MB for the
// whole request), and a refused request never reaches our code to explain itself. So
// the form redraws the photo at a size the book can use before it is sent. The largest
// it is ever drawn is about 950 px wide, so 2048 on the long edge keeps plenty.
// Redrawing also drops the EXIF block, so a reviewer's GPS position never reaches the site.
export const PHOTO_EDGE = 2048;
const QUALITY = 0.85;

export function fitWithin(width: number, height: number, edge = PHOTO_EDGE): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= edge) return { width, height };
  const scale = edge / longest;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export function jpegName(name: string): string {
  const base = name.replace(/\.[^./]+$/, "");
  return `${base || "photo"}.jpg`;
}

// Browser only. Anything that cannot be redrawn goes as it was, and the size check
// that follows decides whether it can be sent at all.
export async function shrinkPhoto(file: File): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    // An <img> rather than createImageBitmap: every browser turns it upright from the
    // EXIF orientation, which Safari's createImageBitmap has not always done.
    const img = new Image();
    img.src = url;
    await img.decode();
    const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    // A see-through PNG would turn black as a JPEG; give it paper instead.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", QUALITY));
    if (!blob) return file;
    return new File([blob], jpegName(file.name), { type: "image/jpeg" });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}
