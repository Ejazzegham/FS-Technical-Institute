import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, R2_PUBLIC_URL } from "@/lib/r2";
import { verifyAdminRequest } from "@/lib/verifyAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const FOLDERS = new Set(["gallery", "courses", "misc"]);

// Admin-only image upload -> Cloudflare R2. Returns the public URL.
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
        !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || !process.env.CLOUDFLARE_R2_BUCKET_NAME) {
      return NextResponse.json(
        { error: "Cloudflare R2 is not configured on the server (CLOUDFLARE_R2_* environment variables are missing)." },
        { status: 500 }
      );
    }
    if (!R2_PUBLIC_URL) {
      return NextResponse.json(
        { error: "CLOUDFLARE_R2_PUBLIC_URL is not set, so uploaded images would have no public link." },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") || "misc");
    const folder = FOLDERS.has(folderRaw) ? folderRaw : "misc";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Only JPG, PNG, WEBP or GIF images are allowed." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image is too large (max 5 MB)." }, { status: 400 });
    }

    const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "image";
    const key = `${folder}/${Date.now()}-${base}.${ext}`;
    const url = await uploadToR2(key, Buffer.from(await file.arrayBuffer()), file.type);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("admin upload error", err);
    return NextResponse.json(
      { error: `Upload failed: ${err instanceof Error ? err.message : "unknown error"}` },
      { status: 500 }
    );
  }
}
