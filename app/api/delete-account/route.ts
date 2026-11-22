import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { deleteFromR2 } from "@/lib/r2";
import { isAdminEmail } from "@/lib/adminAuth";

// Lets a signed-in student delete THEIR OWN account from the mobile app.
// The app sends its Firebase ID token in the Authorization header; the uid is
// always taken from the verified token, never from the request body, so a
// student can only ever delete themselves.
//
// Deletes: the Firebase Auth login, the students/{uid} profile (and its
// attendance subcollection), any admission applications linked to this uid,
// and the uploaded photo / document files in R2.
//
// Deliberately NOT deleted: issued certificates and fee/accounting records,
// which the privacy policy says may be kept for legal and verification
// purposes.

function keyFromR2Url(url: string | null | undefined): string | null {
  if (!url) return null;
  const publicBase = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  if (publicBase && url.startsWith(publicBase)) {
    return url.slice(publicBase.length).replace(/^\/+/, "");
  }
  return url.includes("://") ? null : url;
}

async function removeFiles(data: Record<string, unknown> | undefined) {
  for (const field of ["photoUrl", "documentUrl"]) {
    const key = keyFromR2Url(data?.[field] as string | undefined);
    if (key) {
      try {
        await deleteFromR2(key);
      } catch (err) {
        console.error("delete-account: r2 delete failed", err);
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    // checkRevoked = true, and the token must have been issued recently
    // (the app re-checks the password and requests a fresh token first).
    const decoded = await adminAuth().verifyIdToken(token, true);
    const ageSeconds = Math.floor(Date.now() / 1000) - decoded.iat;
    if (ageSeconds > 10 * 60) {
      return NextResponse.json({ error: "Please sign in again and retry." }, { status: 401 });
    }
    if (isAdminEmail(decoded.email)) {
      return NextResponse.json({ error: "Admin accounts can't be deleted here." }, { status: 403 });
    }

    const uid = decoded.uid;
    const db = adminDb();

    // 1. Student profile: remove its files, then the doc + subcollections.
    const studentRef = db.collection("students").doc(uid);
    const studentSnap = await studentRef.get();
    await removeFiles(studentSnap.data() as Record<string, unknown> | undefined);
    await db.recursiveDelete(studentRef);

    // 2. Any admission applications submitted with this account.
    const admissions = await db.collection("admissions").where("uid", "==", uid).get();
    for (const doc of admissions.docs) {
      await removeFiles(doc.data() as Record<string, unknown>);
      await doc.ref.delete();
    }

    // 3. Finally the login itself.
    try {
      await adminAuth().deleteUser(uid);
    } catch (err) {
      if ((err as { code?: string })?.code !== "auth/user-not-found") throw err;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("delete-account error", err);
    return NextResponse.json({ error: "Could not delete your account. Please try again." }, { status: 500 });
  }
}
