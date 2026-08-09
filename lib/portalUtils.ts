import type { Timestamp } from "firebase/firestore";

/** Formats a Firestore Timestamp (or plain Date/undefined) as "12 Jun 2026". */
export function formatTimestamp(ts: Timestamp | Date | null | undefined): string {
  if (!ts) return "—";
  const date = ts instanceof Date ? ts : ts.toDate();
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** First name only, for friendly greetings. */
export function firstName(fullName: string | undefined): string {
  if (!fullName) return "Student";
  return fullName.trim().split(/\s+/)[0];
}

/** Converts a Pakistani-style phone number into a wa.me link (best-effort). */
export function whatsappLink(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  // If it starts with a leading 0, assume Pakistan (+92) and drop the 0.
  const normalized = digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}
