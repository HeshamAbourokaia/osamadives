import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { moderatorKey } from "@/lib/logbook/session";
import { LIMITS } from "@/lib/logbook/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A phone sends the picture or the clip straight to storage. The file never passes
// through this function, so a long video is not squeezed through a request. Osama's
// phone may send anything; a reviewer's may send one clip, into its own folder, a
// minute's worth, and it only shows once Osama has read the page.
export async function POST(req: Request) {
  const osama = Boolean(moderatorKey());
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (osama) {
          return {
            allowedContentTypes: [
              "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
              "video/mp4", "video/quicktime", "video/webm",
            ],
            maximumSizeInBytes: LIMITS.mediaBytes,
            addRandomSuffix: true,
          };
        }
        if (!pathname.startsWith("logbook/clips/")) throw new Error("A reviewer's clip goes in the clips folder.");
        return {
          allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm"],
          maximumSizeInBytes: LIMITS.clipBytes,
          addRandomSuffix: true,
        };
      },
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
