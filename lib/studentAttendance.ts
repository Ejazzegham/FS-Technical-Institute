// Shared read/write helpers for the two fields the mobile app's Student
// Dashboard & Attendance screens display live:
//   - students/{uid}.courseProgress            (0-100)
//   - students/{uid}.attendancePercent/PresentDays/TotalDays (summary)
//   - students/{uid}/attendance/{YYYY-MM-DD}    (daily records subcollection)
//
// See the mobile app repo's ADMIN_INTEGRATION.md for the full schema
// writeup this was built from.

import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AttendanceStatus = "Present" | "Absent";
export type AttendanceRecord = { id: string /* YYYY-MM-DD */; status: AttendanceStatus };

export type StudentSummary = {
  courseProgress?: number;
  attendancePercent?: number;
  attendancePresentDays?: number;
  attendanceTotalDays?: number;
};

export async function fetchStudent(uid: string) {
  const snap = await getDoc(doc(db, "students", uid));
  return snap.exists() ? ({ uid, ...snap.data() } as Record<string, unknown> & StudentSummary) : null;
}

export async function fetchRecentAttendance(uid: string, max = 30): Promise<AttendanceRecord[]> {
  const q = query(collection(db, "students", uid, "attendance"), orderBy("__name__", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, status: (d.data().status as AttendanceStatus) ?? "Present" }));
}

export async function fetchTodayAttendance(uid: string, isoDate: string): Promise<AttendanceStatus | null> {
  const snap = await getDoc(doc(db, "students", uid, "attendance", isoDate));
  return snap.exists() ? ((snap.data().status as AttendanceStatus) ?? "Present") : null;
}

/** Recompute attendancePercent/PresentDays/TotalDays from every record in
 * the subcollection, and write the summary back onto the student doc.
 * Called after every add/edit/delete so the summary never drifts. */
export async function recomputeAttendanceSummary(uid: string) {
  const snap = await getDocs(collection(db, "students", uid, "attendance"));
  const total = snap.size;
  const present = snap.docs.filter((d) => d.data().status === "Present").length;
  const percent = total > 0 ? Math.round((present / total) * 100) : 0;
  await updateDoc(doc(db, "students", uid), {
    attendancePresentDays: present,
    attendanceTotalDays: total,
    attendancePercent: percent,
  });
  return { present, total, percent };
}

export async function setAttendanceRecord(uid: string, isoDate: string, status: AttendanceStatus) {
  await setDoc(doc(db, "students", uid, "attendance", isoDate), { status });
  return recomputeAttendanceSummary(uid);
}

export async function deleteAttendanceRecord(uid: string, isoDate: string) {
  await deleteDoc(doc(db, "students", uid, "attendance", isoDate));
  return recomputeAttendanceSummary(uid);
}

export async function updateCourseProgress(uid: string, progress: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));
  await updateDoc(doc(db, "students", uid), { courseProgress: clamped });
  return clamped;
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatIsoDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return { day: WEEKDAYS[dt.getDay()], label: dt.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) };
}
