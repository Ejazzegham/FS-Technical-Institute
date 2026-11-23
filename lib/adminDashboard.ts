// Data loaders for the admin dashboard charts. Everything is derived from the
// same Firestore collections the rest of the admin panel already uses.

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { listFeePayments } from "@/lib/feePayments";
import { fetchRecentAttendance } from "@/lib/studentAttendance";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type MonthPoint = { key: string; label: string };

/** The last `n` calendar months (oldest first), as { key: "YYYY-MM", label: "Nov" }. */
export function lastMonths(n: number): MonthPoint[] {
  const now = new Date();
  const out: MonthPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: MONTHS[d.getMonth()],
    });
  }
  return out;
}

export type AdmissionsData = {
  monthly: { month: string; admissions: number }[];
  byStatus: { status: string; value: number }[];
  total: number;
};

export async function loadAdmissions(months = 6): Promise<AdmissionsData> {
  const snap = await getDocs(collection(db, "admissions"));
  const range = lastMonths(months);
  const counts: Record<string, number> = Object.fromEntries(range.map((m) => [m.key, 0]));
  const status: Record<string, number> = {};

  snap.docs.forEach((d) => {
    const data = d.data() as { createdAt?: { toDate?: () => Date }; status?: string };
    const date = data.createdAt?.toDate?.();
    if (date) {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (key in counts) counts[key] += 1;
    }
    const s = data.status || "New";
    status[s] = (status[s] ?? 0) + 1;
  });

  return {
    monthly: range.map((m) => ({ month: m.label, admissions: counts[m.key] })),
    byStatus: Object.entries(status).map(([s, value]) => ({ status: s, value })),
    total: snap.size,
  };
}

export type FeesData = {
  monthly: { month: string; collected: number }[];
  thisMonth: number;
  total: number;
  byMethod: { method: string; value: number }[];
};

export async function loadFees(months = 6): Promise<FeesData> {
  const payments = await listFeePayments(2000);
  const range = lastMonths(months);
  const sums: Record<string, number> = Object.fromEntries(range.map((m) => [m.key, 0]));
  const methods: Record<string, number> = {};
  let total = 0;

  payments.forEach((p) => {
    const amount = Number(p.amount) || 0;
    total += amount;
    const key = (p.paidOn || "").slice(0, 7);
    if (key in sums) sums[key] += amount;
    methods[p.method] = (methods[p.method] ?? 0) + amount;
  });

  const nowKey = range[range.length - 1].key;
  return {
    monthly: range.map((m) => ({ month: m.label, collected: sums[m.key] })),
    thisMonth: sums[nowKey] ?? 0,
    total,
    byMethod: Object.entries(methods).map(([method, value]) => ({ method, value })),
  };
}

export type AttendanceData = {
  daily: { day: string; present: number; absent: number }[];
  presentPct: number;
  marked: number;
};

/** Present/absent head-count for each of the last `days` days, across all students. */
export async function loadAttendance(days = 7): Promise<AttendanceData> {
  const students = await getDocs(collection(db, "students"));
  const uids = students.docs.slice(0, 300).map((d) => d.id);

  // Same date convention the attendance page writes with (todayIso → UTC date).
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10));
  }
  const tally: Record<string, { present: number; absent: number }> = Object.fromEntries(
    dates.map((d) => [d, { present: 0, absent: 0 }])
  );

  const results = await Promise.allSettled(uids.map((uid) => fetchRecentAttendance(uid, days + 7)));
  results.forEach((r) => {
    if (r.status !== "fulfilled") return;
    r.value.forEach((rec) => {
      const t = tally[rec.id];
      if (!t) return;
      if (rec.status === "Present") t.present += 1;
      else t.absent += 1;
    });
  });

  const daily = dates.map((d) => {
    const dt = new Date(d + "T00:00:00");
    return {
      day: dt.toLocaleDateString("en-US", { weekday: "short" }),
      present: tally[d].present,
      absent: tally[d].absent,
    };
  });
  const present = daily.reduce((s, d) => s + d.present, 0);
  const absent = daily.reduce((s, d) => s + d.absent, 0);
  return {
    daily,
    presentPct: present + absent > 0 ? Math.round((present / (present + absent)) * 100) : 0,
    marked: present + absent,
  };
}
