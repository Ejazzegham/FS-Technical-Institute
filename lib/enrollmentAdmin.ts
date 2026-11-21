// Server-side (Firebase Admin SDK) counterpart to lib/enrollment.ts.
//
// Called when deleting a student/admission record: if the number that
// person held was the most recently issued one for its year, roll the
// counter back so the very next application reuses it — instead of that
// number staying permanently "spent" with nobody holding it.
//
// If the deleted person's number was NOT the latest one (e.g. you delete
// FSTI-2026-0002 out of four applicants, 0001-0004), the counter is left
// alone. Rolling it back in that case would mean the next new applicant
// gets assigned 0002 again — colliding with the *existing* 0003/0004
// records that already came after it. Only the most-recent number can ever
// be safely reclaimed; everything before it either has to stay a gap or be
// renumbered by hand.

import { adminDb } from "@/lib/firebaseAdmin";

const ENROLLMENT_NUMBER_PATTERN = /^FSTI-(\d{4})-(\d+)$/;

export async function releaseEnrollmentNumberIfLatest(
  enrollmentNumber: string | null | undefined
): Promise<void> {
  if (!enrollmentNumber) return;
  const match = ENROLLMENT_NUMBER_PATTERN.exec(enrollmentNumber);
  if (!match) return;

  const year = Number(match[1]);
  const count = Number(match[2]);
  const db = adminDb();
  const ref = db.collection("counters").doc(`enrollment-${year}`);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists ? ((snap.data()?.count as number) ?? 0) : 0;
    // Only roll back if this really was the last number handed out.
    if (current === count) {
      tx.set(
        ref,
        { year, count: Math.max(0, current - 1), updatedAt: new Date().toISOString() },
        { merge: true }
      );
    }
  });
}
