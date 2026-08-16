// Real, Firestore-backed notifications — replaces the mobile app's old
// hardcoded sample feed. A single top-level `notifications` collection
// covers both broadcast messages (Holiday, New Batch, general
// Announcements — audience: "all") and personal ones (Fee Reminder, Exam,
// Absent — audience: the student's uid).
//
// There's no per-user "read" flag stored per notification (that would mean
// a write for every student on every broadcast). Instead the mobile app
// tracks a single `notificationsLastSeenAt` timestamp on the student's own
// profile document and treats anything newer than that as unread — see
// the app's lib/notifications.ts.

import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, limit as fsLimit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NotificationType = "announcement" | "fee" | "exam" | "holiday" | "new_batch" | "absent" | "course_update";

export type NotificationDoc = {
  id: string;
  audience: string; // "all" or a student uid
  type: NotificationType;
  title: string;
  body: string;
  createdAt?: { toDate: () => Date } | null;
};

export const notificationTypeLabels: Record<NotificationType, string> = {
  announcement: "Announcement",
  fee: "Fee Reminder",
  exam: "Exam",
  holiday: "Holiday Notice",
  new_batch: "New Batch",
  absent: "Absence",
  course_update: "Course Update",
};

export async function createNotification(input: {
  audience: string; // "all" or a student uid
  type: NotificationType;
  title: string;
  body: string;
}) {
  await addDoc(collection(db, "notifications"), {
    audience: input.audience,
    type: input.type,
    title: input.title,
    body: input.body,
    createdAt: serverTimestamp(),
  });
}

export async function listNotifications(max = 100): Promise<NotificationDoc[]> {
  const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"), fsLimit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NotificationDoc, "id">) }));
}

export async function deleteNotification(id: string) {
  await deleteDoc(doc(db, "notifications", id));
}
