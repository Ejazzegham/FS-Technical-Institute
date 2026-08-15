"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { Loader2, Search, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { setAttendanceRecord, fetchTodayAttendance, todayIso, type AttendanceStatus } from "@/lib/studentAttendance";

type StudentRow = {
  uid: string;
  fullName?: string;
  enrollmentNumber?: string;
  course?: string;
  batch?: string;
};

export default function AdminAttendancePage() {
  const [date, setDate] = useState(todayIso());
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus | null>>({});
  const [search, setSearch] = useState("");
  const [busyUid, setBusyUid] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    setStudents(null);
    const snap = await getDocs(collection(db, "students"));
    const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as StudentRow);
    list.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
    setStudents(list);

    // Look up whether each student already has a record for the selected
    // date, so already-marked students show their current status.
    const entries = await Promise.all(
      list.map(async (s) => [s.uid, await fetchTodayAttendance(s.uid, date)] as const)
    );
    setMarks(Object.fromEntries(entries));
  }, [date]);

  useEffect(() => {
    (async () => {
      await loadStudents();
    })();
  }, [loadStudents]);

  async function mark(uid: string, status: AttendanceStatus) {
    setBusyUid(uid);
    try {
      await setAttendanceRecord(uid, date, status);
      setMarks((m) => ({ ...m, [uid]: status }));
    } catch (err) {
      console.error(err);
      alert("Couldn't save attendance. Check Firestore rules.");
    } finally {
      setBusyUid(null);
    }
  }

  const filtered = useMemo(() => {
    if (!students) return [];
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(q) ||
        s.enrollmentNumber?.toLowerCase().includes(q) ||
        s.course?.toLowerCase().includes(q) ||
        s.batch?.toLowerCase().includes(q)
    );
  }, [students, search]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy">Attendance</h1>
          <p className="text-sm text-navy/50 mt-1">Mark attendance for a batch. Changes are saved instantly, per student.</p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={todayIso()}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, enrollment #, course, or batch"
          className="w-full rounded-lg border border-black/10 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
        {students === null ? (
          <div className="flex items-center justify-center py-16 text-navy/40 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading students…
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-sm text-navy/40">No students match your search.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {filtered.map((s) => {
              const mark_ = marks[s.uid] ?? null;
              const busy = busyUid === s.uid;
              return (
                <div key={s.uid} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{s.fullName || "Unnamed Student"}</p>
                    <p className="text-xs text-navy/40 truncate">
                      {s.enrollmentNumber || "—"} · {s.course || "No course"} {s.batch ? `· ${s.batch}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => mark(s.uid, "Present")}
                      disabled={busy}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-60 ${
                        mark_ === "Present" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => mark(s.uid, "Absent")}
                      disabled={busy}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-60 ${
                        mark_ === "Absent" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      Absent
                    </button>
                    {busy && <Loader2 size={14} className="animate-spin text-navy/40" />}
                    <Link href={`/admin/students/${s.uid}`} className="p-1.5 rounded-md text-navy/40 hover:text-navy hover:bg-slate-100" aria-label="View student">
                      <ChevronRight size={14} />
                    </Link>
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
