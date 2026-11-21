"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Loader2, Trash2, Send, Bell } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  createNotification,
  listNotifications,
  deleteNotification,
  notificationTypeLabels,
  type NotificationType,
  type NotificationDoc,
} from "@/lib/notifications";

type StudentOption = { uid: string; fullName?: string; enrollmentNumber?: string };
type StudentDocData = Omit<StudentOption, "uid">;

const typeOrder: NotificationType[] = ["announcement", "fee", "exam", "holiday", "new_batch", "course_update"];

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationDoc[] | null>(null);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [type, setType] = useState<NotificationType>("announcement");
  const [audience, setAudience] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const load = useCallback(async () => {
    setItems(await listNotifications());
  }, []);

  useEffect(() => {
    (async () => {
      await load();
      const snap = await getDocs(collection(db, "students"));
      setStudents(
        snap.docs
          .map((d) => ({ uid: d.id, ...(d.data() as StudentDocData) }))
          .sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""))
      );
    })();
  }, [load]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    try {
      await createNotification({ audience, type, title: title.trim(), body: body.trim() });
      setTitle("");
      setBody("");
      await load();
    } catch (err) {
      console.error(err);
      alert("Couldn't send notification. Check Firestore rules.");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this notification?")) return;
    setDeletingId(id);
    try {
      await deleteNotification(id);
      await load();
    } catch (err) {
      console.error(err);
      alert("Couldn't delete. Check Firestore rules.");
    } finally {
      setDeletingId(null);
    }
  }

  function audienceLabel(a: string) {
    if (a === "all") return "All Students";
    const s = students.find((s) => s.uid === a);
    return s ? `${s.fullName || "Unnamed"} (${s.enrollmentNumber || a.slice(0, 6)})` : a.slice(0, 8);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Notifications</h1>
      <p className="text-sm text-navy/50 mb-6">
        Send announcements, fee reminders, exam schedules, holiday notices, or new-batch alerts. Broadcasts (&quot;All
        Students&quot;) show up for everyone; picking a student sends it to them only. Absence notifications are
        created automatically when you mark a student absent in Attendance.
      </p>

      <form onSubmit={handleSend} className="bg-white rounded-xl border border-black/5 p-6 mb-8 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy/60 mb-1.5">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as NotificationType)} className="select-compact w-full">
              {typeOrder.map((t) => (
                <option key={t} value={t}>
                  {notificationTypeLabels[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/60 mb-1.5">Audience</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="select-compact w-full">
              <option value="all">All Students</option>
              {students.map((s) => (
                <option key={s.uid} value={s.uid}>
                  {s.fullName || "Unnamed"} — {s.enrollmentNumber || s.uid.slice(0, 6)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy/60 mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Midterm Exam Schedule"
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy/60 mb-1.5">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={3}
            placeholder="e.g. Midterm exams will be held on 25 May 2026. Please check the portal for your schedule."
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark disabled:opacity-60 text-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Send Notification
        </button>
      </form>

      <h2 className="font-semibold text-navy mb-3">Recent Notifications</h2>
      <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
        {items === null ? (
          <div className="flex items-center justify-center gap-2 text-sm text-navy/40 py-12">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-navy/35">
            <Bell size={24} />
            <p className="text-sm mt-3">No notifications sent yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {items.map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-navy bg-navy/5 px-2 py-0.5 rounded-full">
                      {notificationTypeLabels[n.type] || n.type}
                    </span>
                    <span className="text-[11px] text-navy/40">{audienceLabel(n.audience)}</span>
                  </div>
                  <p className="text-sm font-medium text-navy">{n.title}</p>
                  <p className="text-xs text-navy/50 mt-0.5 line-clamp-2">{n.body}</p>
                </div>
                <button
                  onClick={() => handleDelete(n.id)}
                  disabled={deletingId === n.id}
                  className="p-1.5 rounded-md text-red-500/70 hover:text-red-600 hover:bg-red-50 shrink-0"
                  aria-label="Delete"
                >
                  {deletingId === n.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
