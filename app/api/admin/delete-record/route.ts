import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { deleteFromR2 } from "@/lib/r2";
import { ADMIN_EMAIL } from "@/lib/adminAuth";
import { releaseEnrollmentNumberIfLatest } from "@/lib/enrollmentAdmin";

// This route does the "full" delete that the plain client-side deleteDoc()
// couldn't: it also removes the linked Firebase Auth account (so the same
// email/CNIC can be reused on a new application) and any uploaded files in
// R2, not just the Firestore document. Only the admin panel calls this.
//
// Which collections this route is allowed to touch, and — for each — where
// to find the Firebase Auth uid that should be deleted alongside the doc.
const ALLOWED_COLLECTIONS: Record<string, "docId" | "uidField" | "none"> = {
  // students/{uid} — the document id IS the auth uid.
  students: "docId",
  // admissions/{autoId} — the auth uid is stored in a "uid" field.
  admissions: "uidField",
  // These never have a linked Auth account.
  contact_requests: "none",
  newsletter_subscribers: "none",
};

function keyFromR2Url(url: string | null | undefined): string | null {
  if (!url) return null;
  const publicBase = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  if (publicBase && url.startsWith(publicBase)) {
    return url.slice(publicBase.length).replace(/^\/+/, "");
  }
  // If no public URL is configured, uploadToR2() returns the bare key —
  // in that case the stored value already IS the key.
  return url.includes("://") ? null : url;
}

export async function POST(req: NextRequest) {
  try {
    // --- Only the signed-in admin may call this ---
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }
    const decoded = await adminAuth().verifyIdToken(token);
    if ((decoded.email || "").toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const body = (await req.json()) as { collection?: string; id?: string };
    const collectionName = body.collection;
    const id = body.id;
    if (!collectionName || !id || !(collectionName in ALLOWED_COLLECTIONS)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const mode = ALLOWED_COLLECTIONS[collectionName];
    const db = adminDb();
    const ref = db.collection(collectionName).doc(id);
    const snap = await ref.get();
    const data = snap.data() as Record<string, unknown> | undefined;

    // 1. Delete the linked Firebase Auth account, if any — this is what
    //    frees the email up so it can be used again on a new application.
    const uid = mode === "docId" ? id : mode === "uidField" ? (data?.uid as string | undefined) : null;
    if (uid) {
      try {
        await adminAuth().deleteUser(uid);
      } catch (err) {
        const code = (err as { code?: string })?.code;
        if (code !== "auth/user-not-found") {
          console.error("delete-record: auth delete failed", err);
        }
      }
    }

    // 2. Best-effort cleanup of any uploaded photo/document in R2.
    for (const field of ["photoUrl", "documentUrl"]) {
      const key = keyFromR2Url(data?.[field] as string | undefined);
      if (key) {
        try {
          await deleteFromR2(key);
        } catch (err) {
          console.error("delete-record: r2 delete failed", err);
        }
      }
    }

    // 3. If this record's enrollment number was the most recently issued
    //    one for its year, roll the counter back so it gets reused by the
    //    next application instead of staying a permanent gap. (Safely a
    //    no-op for older numbers, or collections that don't have one.)
    try {
      await releaseEnrollmentNumberIfLatest(data?.enrollmentNumber as string | undefined);
    } catch (err) {
      console.error("delete-record: enrollment number release failed", err);
    }

    // 4. Finally, delete the Firestore document itself.
    await ref.delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("delete-record error", err);
    return NextResponse.json({ error: "Could not delete record." }, { status: 500 });
  }
}
