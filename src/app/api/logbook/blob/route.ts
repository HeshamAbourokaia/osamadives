import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { moderatorKey } from "@/lib/logbook/session";
import { LIMITS } from "@/lib/logbook/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Osama's phone sends the picture or the clip straight to storage. The file never
// passes through this function, so a long video is not squeezed through a request.
export async function POST(req: Request) {
  if (!moderatorKey()) return new Response("Not found", { status: 404 });
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
          "video/mp4", "video/quicktime", "video/webm",
        ],
        maximumSizeInBytes: LIMITS.mediaBytes,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        /* the moderator saves the address with the review */
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("blob upload failed", e);
    return NextResponse.json({ error: "That file could not be uploaded." }, { status: 400 });
  }
}
