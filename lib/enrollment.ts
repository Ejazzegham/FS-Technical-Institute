// Sequential enrollment / serial number generator.
//
// Numbers look like FSTI-2026-0001, FSTI-2026-0002, ... and reset back to
// 0001 at the start of every calendar year. A single counter document per
// year (in the `counters` collection) tracks the last number issued, and
// `getNextEnrollmentNumber` increments it atomically inside a Firestore
// transaction so two students submitting at the same time can never end up
// with the same number.
//
// `previewNextEnrollmentNumber` is a read-only peek at what the *next*
// number will be — used to show a live "Application No." on the
// registration/admission forms before the student has submitted anything.
// It does not reserve or increment the counter, so the number shown is a
// best-effort preview, not a hard reservation.

import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";

function counterRef(year: number) {
  return doc(db, "counters", `enrollment-${year}`);
}

function format(year: number, count: number) {
  return `FSTI-${year}-${String(count).padStart(4, "0")}`;
}

/** Atomically reserves and returns the next enrollment number. Call this on final submit. */
export async function getNextEnrollmentNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const ref = counterRef(year);

  const nextCount = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists() ? ((snap.data().count as number) ?? 0) : 0;
    const updated = current + 1;
    tx.set(ref, { year, count: updated, updatedAt: new Date().toISOString() }, { merge: true });
    return updated;
  });

  return format(year, nextCount);
}

/** Read-only preview of the next enrollment number, for display before submission. */
export async function previewNextEnrollmentNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const snap = await getDoc(counterRef(year));
  const current = snap.exists() ? ((snap.data().count as number) ?? 0) : 0;
  return format(year, current + 1);
}
