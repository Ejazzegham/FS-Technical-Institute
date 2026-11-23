"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Search, Printer, Trash2, Download, Plus } from "lucide-react";
import FeeTabs from "@/components/admin/FeeTabs";
import { describeError } from "@/lib/adminClient";
import {
  currentMonth,
  deleteFeePayment,
  describePayment,
  feeTypeLabels,
  formatDate,
  formatPKR,
  listFeePayments,
  paymentMethodLabels,
  printReceipt,
  type FeePayment,
  type FeeType,
} from "@/lib/feePayments";

const inputCls =
  "rounded-md border border-black/10 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold";

export default function AdminFeeRecordsPage() {
  const [payments, setPayments] = useState<FeePayment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(""); // "" = all time; otherwise YYYY-MM of the payment date
  const [type, setType] = useState<FeeType | "all">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setPayments(await listFeePayments());
      } catch (err) {
        console.error(err);
        setPayments([]);
        setError(`Couldn't load fee records.\n${describeError(err)}`);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!payments) return [];
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (month && !p.paidOn.startsWith(month)) return false;
      if (type !== "all" && p.feeType !== type) return false;
      if (!q) return true;
      return [p.studentName, p.enrollmentNumber, p.receiptNo, p.course].some((v) => (v || "").toLowerCase().includes(q));
    });
  }, [payments, search, month, type]);

  const total = filtered.reduce((sum, p) => sum + p.amount, 0);
  const thisMonthKey = currentMonth();
  const thisMonthTotal = (payments ?? [])
    .filter((p) => p.paidOn.startsWith(thisMonthKey))
    .reduce((sum, p) => sum + p.amount, 0);
  const allTotal = (payments ?? []).reduce((sum, p) => sum + p.amount, 0);

  async function handleDelete(p: FeePayment) {
    if (!confirm(`Delete receipt ${p.receiptNo} (${formatPKR(p.amount)} from ${p.studentName || "student"})?\n\nThis can't be undone.`)) return;
    setDeletingId(p.id);
    try {
      await deleteFeePayment(p.id);
      setPayments((list) => (list ?? []).filter((x) => x.id !== p.id));
    } catch (err) {
      console.error(err);
      alert(`Couldn't delete.\n\n${describeError(err)}`);
    } finally {
      setDeletingId(null);
    }
  }

  function exportCsv() {
    const cell = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = ["Receipt No", "Date", "Student", "Enrollment No", "Course", "Fee Type", "For Month", "Amount", "Method", "Note"];
    const rows = filtered.map((p) => [
      p.receiptNo,
      p.paidOn,
      p.studentName,
      p.enrollmentNumber,
      p.course,
      feeTypeLabels[p.feeType] ?? p.feeType,
      p.forMonth,
      p.amount,
      paymentMethodLabels[p.method] ?? p.method,
      p.note,
    ]);
    const csv = [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fee-records-${month || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy mb-1">Fee Management</h1>
          <p className="text-sm text-navy/50">Every fee payment recorded for students.</p>
        </div>
        <Link
          href="/admin/fees/collection"
          className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-navy font-semibold text-sm px-4 py-2.5 rounded-md transition-colors"
        >
          <Plus size={14} /> Record a payment
        </Link>
      </div>
      <FeeTabs />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Collected this month" value={payments ? formatPKR(thisMonthTotal) : "…"} />
        <Stat label="Collected all time" value={payments ? formatPKR(allTotal) : "…"} />
        <Stat label="Payments recorded" value={payments ? String(payments.length) : "…"} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, enrollment no., receipt no. or course"
            className={`${inputCls} w-full pl-10`}
          />
        </div>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={inputCls} aria-label="Filter by month received" />
        {month && (
          <button onClick={() => setMonth("")} className="text-xs font-semibold text-navy/50 hover:text-navy">
            All time
          </button>
        )}
        <select value={type} onChange={(e) => setType(e.target.value as FeeType | "all")} className={inputCls}>
          <option value="all">All fee types</option>
          {(Object.keys(feeTypeLabels) as FeeType[]).map((t) => (
            <option key={t} value={t}>
              {feeTypeLabels[t]}
            </option>
          ))}
        </select>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-1.5 border border-black/10 bg-white hover:bg-slate-50 disabled:opacity-50 text-navy font-semibold text-sm px-3.5 py-2 rounded-md"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {error && <p className="text-sm text-red-600 whitespace-pre-line mb-3">{error}</p>}

      <div className="bg-white rounded-md border border-black/5 overflow-x-auto">
        {payments === null ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-navy/40">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-sm text-navy/40">
            {payments.length === 0 ? "No payments recorded yet." : "No payments match these filters."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-navy/40 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 font-semibold">Receipt</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Fee</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-black/5 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 text-navy/60 whitespace-nowrap">{p.receiptNo}</td>
                  <td className="px-4 py-3 text-navy/60 whitespace-nowrap">{formatDate(p.paidOn)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/students/${p.studentUid}`} className="font-semibold text-navy hover:underline">
                      {p.studentName || "—"}
                    </Link>
                    <p className="text-xs text-navy/40">{[p.enrollmentNumber, p.course].filter(Boolean).join(" · ")}</p>
                  </td>
                  <td className="px-4 py-3 text-navy/70">
                    {describePayment(p)}
                    {p.note && <p className="text-xs text-navy/40 max-w-[220px] truncate" title={p.note}>{p.note}</p>}
                  </td>
                  <td className="px-4 py-3 text-navy/60 whitespace-nowrap">{paymentMethodLabels[p.method] ?? p.method}</td>
                  <td className="px-4 py-3 font-semibold text-navy text-right whitespace-nowrap">{formatPKR(p.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => printReceipt(p)}
                        className="p-1.5 text-navy/40 hover:text-navy"
                        aria-label={`Print receipt ${p.receiptNo}`}
                      >
                        <Printer size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deletingId === p.id}
                        className="p-1.5 text-navy/40 hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete receipt ${p.receiptNo}`}
                      >
                        {deletingId === p.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-black/5">
                <td colSpan={5} className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase tracking-wide">
                  Total ({filtered.length} payment{filtered.length === 1 ? "" : "s"})
                </td>
                <td className="px-4 py-3 font-bold text-navy text-right whitespace-nowrap">{formatPKR(total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-md border border-black/5 px-5 py-4">
      <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide">{label}</p>
      <p className="font-display font-bold text-navy text-xl mt-1">{value}</p>
    </div>
  );
}
