import { promises as fs } from "node:fs";
import path from "node:path";
import { LIMITS } from "./types";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function sniff(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  return null;
}

export class PhotoError extends Error {}

export async function savePhoto(file: File, id: string): Promise<string> {
  if (file.size > LIMITS.photoBytes) throw new PhotoError("That photo is over 6 MB. A smaller one, please.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniff(bytes);
  if (!type || !TYPES[type]) throw new PhotoError("Photos need to be JPEG, PNG or WebP.");
  const key = `logbook/${id}.${TYPES[type]}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(key, Buffer.from(bytes), { access: "public", contentType: type, addRandomSuffix: false });
    return blob.url;
  }
  if (process.env.NODE_ENV === "production") throw new PhotoError("Photo storage is not set up yet.");

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(path.join(dir, "logbook"), { recursive: true });
  await fs.writeFile(path.join(dir, key), bytes);
  return `/uploads/${key}`;
}
