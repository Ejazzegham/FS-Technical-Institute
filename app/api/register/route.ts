import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { getNextEnrollmentNumber } from "@/lib/enrollment";

// NOTE: This route intentionally does NOT write to Firestore. Firestore
// security rules require `request.auth.uid == uid` to create a student
// profile, and that auth context only exists in the browser (where the
// user just signed in) — a server route using the client SDK has no
// attached ID token, so a Firestore write here would always be rejected
// with `permission-denied`. Instead, this route only handles the file
// uploads (which need server-side R2 credentials) and hands back the
// resulting URLs + enrollment number; the client performs the actual
// `setDoc` while still authenticated. See components/RegisterForm.tsx.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const uid = formData.get("uid") as string | null;
    const photo = formData.get("photo") as File | null;
    const document = formData.get("document") as File | null;

    if (!uid) {
      return NextResponse.json({ error: "Missing user id." }, { status: 400 });
    }

    // Sequential FSTI-<year>-0001 style number, atomically issued.
    const enrollmentNumber = await getNextEnrollmentNumber();
    let photoUrl: string | null = null;
    let documentUrl: string | null = null;

    if (photo && photo.size > 0) {
      const bytes = Buffer.from(await photo.arrayBuffer());
      photoUrl = await uploadToR2(
        `students/${uid}/photo-${photo.name}`,
        bytes,
        photo.type || "image/jpeg"
      );
    }

    if (document && document.size > 0) {
      const bytes = Buffer.from(await document.arrayBuffer());
      documentUrl = await uploadToR2(
        `students/${uid}/document-${document.name}`,
        bytes,
        document.type || "application/octet-stream"
      );
    }

    return NextResponse.json({ success: true, enrollmentNumber, photoUrl, documentUrl });
  } catch (err) {
    console.error("register upload error", err);
    return NextResponse.json({ error: "Could not upload registration files." }, { status: 500 });
  }
}
