// Server-only helper: confirms a request comes from the signed-in admin.
//
// Uses the Firebase Admin SDK when its service-account env vars are set, and
// otherwise falls back to Google's public "accounts:lookup" REST endpoint
// (needs only NEXT_PUBLIC_FIREBASE_API_KEY). That means uploads and cache
// refresh still work even if the Admin SDK was never configured.

import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { ADMIN_EMAIL } from "@/lib/adminAuth";

export async function verifyAdminRequest(req: NextRequest): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return { ok: false, status: 401, error: "Not signed in. Please log in again." };

  let email: string | undefined;

  const adminConfigured =
    !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL && !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (adminConfigured) {
    try {
      const decoded = await adminAuth().verifyIdToken(token);
      email = decoded.email;
    } catch (err) {
      console.error("verifyAdminRequest: admin SDK verify failed", err);
    }
  }

  if (!email) {
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        }
      );
      if (res.ok) {
        const data = (await res.json()) as { users?: { email?: string }[] };
        email = data.users?.[0]?.email;
      }
    } catch (err) {
      console.error("verifyAdminRequest: REST verify failed", err);
    }
  }

  if (!email) return { ok: false, status: 401, error: "Session expired. Please log in again." };
  if (email.trim().toLowerCase() !== ADMIN_EMAIL) return { ok: false, status: 403, error: "Not authorized." };
  return { ok: true };
}
