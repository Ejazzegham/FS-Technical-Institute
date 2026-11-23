// Client-side helpers shared by the admin pages.

import { getFirebaseAuth } from "@/lib/firebase";

/** Turn a Firebase/network error into a message the admin can act on. */
export function describeError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code.includes("permission-denied")) {
    return "Permission denied by Firestore. Publish the rules from firestore.rules in Firebase Console → Firestore → Rules, and make sure you're signed in as fstechins@gmail.com.";
  }
  if (code.includes("unauthenticated")) return "You're signed out. Please log in again.";
  if (code.includes("unavailable") || code.includes("network")) return "Network problem reaching Firebase. Check your internet and try again.";
  if (code.includes("invalid-argument")) return "Some field has an invalid value (for example an empty or undefined field).";
  const msg = err instanceof Error ? err.message : String(err);
  return code ? `${code}: ${msg}` : msg;
}

async function authHeader(): Promise<Record<string, string>> {
  const token = await getFirebaseAuth().currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Rebuild the public site's cached pages so a just-saved change shows up
 * immediately. Never throws — the save itself already succeeded.
 */
export async function revalidateSite(): Promise<void> {
  try {
    await fetch("/api/admin/revalidate", { method: "POST", headers: await authHeader() });
  } catch (err) {
    console.warn("revalidateSite failed", err);
  }
}

/** Upload an image to R2 via the admin-only API route. Returns its public URL. */
export async function uploadImage(file: File, folder: "gallery" | "courses" | "misc"): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", headers: await authHeader(), body });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "Upload failed.");
  return data.url;
}
