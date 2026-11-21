"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Check, Plus, Trash2, CalendarCheck } from "lucide-react";
import {
  fetchStudent,
  fetchRecentAttendance,
  setAttendanceRecord,
  deleteAttendanceRecord,
  updateCourseProgress,
  todayIso,
  formatIsoDate,
  type AttendanceRecord,
  type AttendanceStatus,
  type StudentSummary,
} from "@/lib/studentAttendance";

type Student = { uid: string; fullName?: string; enrollmentNumber?: string; course?: string; batch?: string; status?: string } & StudentSummary;

export default function AdminStudentDetailPage() {
  const params = useParams<{ id: string }>();
  const uid = params.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [progressInput, setProgressInput] = useState(0);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);

  const [newDate, setNewDate] = useState(todayIso());
  const [newStatus, setNewStatus] = useState<AttendanceStatus>("Present");
  const [addingRecord, setAddingRecord] = useState(false);
  const [busyDate, setBusyDate] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [s, r] = await Promise.all([fetchStudent(uid), fetchRecentAttendance(uid)]);
    setStudent(s as Student | null);
    setRecords(r);
    setProgressInput((s as Student | null)?.courseProgress ?? 0);
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  async function handleSaveProgress() {
    setSavingProgress(true);
    try {
      await updateCourseProgress(uid, progressInput);
      setProgressSaved(true);
      setTimeout(() => setProgressSaved(false), 1800);
    } catch (err) {
      console.error(err);
      alert("Couldn't save progress. Check Firestore rules.");
    } finally {
      setSavingProgress(false);
    }
  }

  async function handleAddRecord(e: React.FormEvent) {
    e.preventDefault();
    setAddingRecord(true);
    try {
      await setAttendanceRecord(uid, newDate, newStatus);
      await load();
    } catch (err) {
      console.error(err);
      alert("Couldn't save attendance. Check Firestore rules — see ADMIN_INTEGRATION.md in the mobile app repo.");
    } finally {
      setAddingRecord(false);
    }
  }

  async function handleToggle(recordId: string, status: AttendanceStatus) {
    setBusyDate(recordId);
    try {
      await setAttendanceRecord(uid, recordId, status);
      await load();
    } catch (err) {
      console.error(err);
      alert("Couldn't update. Check Firestore rules.");
    } finally {
      setBusyDate(null);
    }
  }

  async function handleDelete(recordId: string) {
    if (!confirm(`Delete the attendance record for ${recordId}?`)) return;
    setBusyDate(recordId);
    try {
      await deleteAttendanceRecord(uid, recordId);
      await load();
    } catch (err) {
      console.error(err);
      alert("Couldn't delete. Check Firestore rules.");
    } finally {
      setBusyDate(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-navy/40 py-24">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <Link href="/admin/students" className="inline-flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy mb-6">
          <ArrowLeft size={14} /> Back to Students
        </Link>
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">Student not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/students" className="inline-flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy mb-6">
        <ArrowLeft size={14} /> Back to Students
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy">{student.fullName || "Unnamed Student"}</h1>
          <p className="text-sm text-navy/50 mt-1">
            {student.enrollmentNumber || "—"} · {student.course || "No course on file"} {student.batch ? `· ${student.batch}` : ""}
          </p>
        </div>
        {student.status && (
          <span className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-navy/5 text-navy/70">{student.status}</span>
        )}
      </div>

      {/* Course progress */}
      <div className="bg-white rounded-xl border border-black/5 p-6 mb-6">
        <h2 className="font-semibold text-navy mb-1">Course Progress</h2>
        <p className="text-xs text-navy/45 mb-4">Shown as a progress bar on the student&apos;s course card in the mobile app.</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            value={progressInput}
            onChange={(e) => setProgressInput(Number(e.target.value))}
            className="flex-1 accent-gold"
          />
          <input
            type="number"
            min={0}
            max={100}
            value={progressInput}
            onChange={(e) => setProgressInput(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
            className="w-20 rounded-lg border border-black/10 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <span className="text-sm text-navy/50">%</span>
          <button
            onClick={handleSaveProgress}
            disabled={savingProgress}
            className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark disabled:opacity-60 text-navy font-semibold text-sm px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            {savingProgress ? <Loader2 size={14} className="animate-spin" /> : progressSaved ? <Check size={14} /> : <Save size={14} />}
            {progressSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Attendance summary (read-only, computed from records below) */}
      <div className="bg-white rounded-xl border border-black/5 p-6 mb-6">
        <h2 className="font-semibold text-navy mb-1">Attendance Summary</h2>
        <p className="text-xs text-navy/45 mb-4">
          Recalculated automatically from the daily records below — this is what powers the % ring in the mobile app.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-navy/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-navy">{student.attendancePercent ?? 0}%</p>
            <p className="text-xs text-navy/45 mt-1">Attendance</p>
          </div>
          <div className="bg-navy/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-navy">{student.attendancePresentDays ?? 0}</p>
            <p className="text-xs text-navy/45 mt-1">Present Days</p>
          </div>
          <div className="bg-navy/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-navy">{student.attendanceTotalDays ?? 0}</p>
            <p className="text-xs text-navy/45 mt-1">Total Days</p>
          </div>
        </div>
      </div>

      {/* Daily attendance records */}
      <div className="bg-white rounded-xl border border-black/5 p-6">
        <h2 className="font-semibold text-navy mb-1">Daily Attendance</h2>
        <p className="text-xs text-navy/45 mb-4">Mark or edit attendance for a specific day. Most recent 30 shown.</p>

        <form onSubmit={handleAddRecord} className="flex items-end gap-3 mb-6 flex-wrap">
          <div>
            <label className="block text-xs font-semibold text-navy/60 mb-1.5">Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              max={todayIso()}
              required
              className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/60 mb-1.5">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
              className="select-compact"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={addingRecord}
            className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark disabled:opacity-60 text-navy font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            {addingRecord ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Save Day
          </button>
        </form>

        {records.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-navy/35">
            <CalendarCheck size={26} />
            <p className="text-sm mt-3">No attendance records yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {records.map((r) => {
              const { day, label } = formatIsoDate(r.id);
              const busy = busyDate === r.id;
              return (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-navy">{label}</p>
                    <p className="text-xs text-navy/40">{day}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(r.id, r.status === "Present" ? "Absent" : "Present")}
                      disabled={busy}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-60 ${
                        r.status === "Present" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {busy ? <Loader2 size={12} className="animate-spin inline" /> : r.status}
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={busy}
                      className="p-1.5 rounded-md text-red-500/70 hover:text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
