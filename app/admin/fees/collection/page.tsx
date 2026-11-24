"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Loader2, Search, Check, X, Printer, AlertTriangle, UserRound } from "lucide-react";
import FeeTabs from "@/components/admin/FeeTabs";
import { describeError } from "@/lib/adminClient";
import { db } from "@/lib/firebase";
import type { Course } from "@/lib/types";
import { createNotification } from "@/lib/notifications";
import {
  addFeePayment,
  currentMonth,
  describePayment,
  feeTypeLabels,
  formatDate,
  formatPKR,
  listFeePayments,
  listStudentPayments,
  localIsoDate,
  parseFeeAmount,
  paymentMethodLabels,
  printReceipt,
  type FeePayment,
  type FeeType,
  type PaymentMethod,
} from "@/lib/feePayments";

type StudentRow = {
  uid: string;
  fullName?: string;
  enrollmentNumber?: string;
  mobile?: string;
  course?: string;
  batch?: string;
};

const inputCls =
  "w-full rounded-md border border-black/10 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold";
const labelCls = "block text-xs font-semibold text-navy/60 mb-1.5";

export default function AdminFeeCollectionPage() {
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [courseFees, setCourseFees] = useState<Record<string, number>>({});
  const [admissionFee, setAdmissionFee] = useState(0);
  const [recent, setRecent] = useState<FeePayment[] | null>(null);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<StudentRow | null>(null);
  const [history, setHistory] = useState<FeePayment[] | null>(null);

  const [feeType, setFeeType] = useState<FeeType>("monthly");
  const [forMonth, setForMonth] = useState(currentMonth());
  const [amount, setAmount] = useState("");
  const [amountTouched, setAmountTouched] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [paidOn, setPaidOn] = useState(localIsoDate());
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<FeePayment | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "students"));
        const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as StudentRow);
        list.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
        setStudents(list);
      } catch (err) {
        console.error(err);
        setStudents([]);
        setError(`Couldn't load students.\n${describeError(err)}`);
      }
    })();

    // Course monthly fees, straight from the admin-managed courses.
    (async () => {
      const fees: Record<string, number> = {};
      try {
        const snap = await getDocs(collection(db, "site_courses"));
        snap.docs.forEach((d) => {
          const c = d.data() as Course;
          if (c.title) fees[c.title] = parseFeeAmount(c.monthlyFee);
        });
      } catch {
        /* leave fees empty */
      }
      setCourseFees(fees);
    })();

    (async () => {
      try {
        const snap = await getDoc(doc(db, "site_settings", "fees"));
        if (snap.exists()) setAdmissionFee(parseFeeAmount((snap.data() as { admissionFee?: string }).admissionFee));
      } catch {
        /* keep default */
      }
    })();

    (async () => {
      try {
        setRecent(await listFeePayments(8));
      } catch (err) {
        console.error(err);
        setRecent([]);
      }
    })();
  }, []);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || !students) return [];
    return students
      .filter((s) =>
        [s.fullName, s.enrollmentNumber, s.mobile].some((v) => (v || "").toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [search, students]);

  // Suggested amount comes from the fee settings / the student's course, and
  // is only used until the admin types their own figure.
  const suggested =
    feeType === "admission"
      ? admissionFee
      : feeType === "monthly" && selected?.course
        ? (courseFees[selected.course] ?? 0)
        : 0;
  const amountValue = amountTouched ? amount : suggested ? String(suggested) : "";

  const duplicate =
    history &&
    (feeType === "monthly"
      ? history.find((p) => p.feeType === "monthly" && p.forMonth === forMonth)
      : feeType === "admission"
        ? history.find((p) => p.feeType === "admission")
        : undefined);

  const totalPaid = history ? history.reduce((sum, p) => sum + p.amount, 0) : 0;

  async function pickStudent(s: StudentRow) {
    setSelected(s);
    setSearch("");
    setAmountTouched(false);
    setAmount("");
    setLastSaved(null);
    setError(null);
    setHistory(null);
    try {
      setHistory(await listStudentPayments(s.uid));
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  }

  function clearStudent() {
    setSelected(null);
    setHistory(null);
    setLastSaved(null);
    setError(null);
  }

  async function handleSave() {
    if (!selected) return;
    const n = Number(amountValue.replace(/,/g, ""));
    if (!Number.isFinite(n) || n <= 0) {
      setError("Enter the amount received (a number greater than 0).");
      return;
    }
    if (feeType === "monthly" && !forMonth) {
      setError("Choose which month this fee is for.");
      return;
    }
    if (!paidOn) {
      setError("Choose the date the fee was received.");
      return;
    }
    if (duplicate) {
      const ok = confirm(
        `${selected.fullName || "This student"} already has a ${describePayment(duplicate)} payment recorded (${duplicate.receiptNo}).\n\nRecord another payment anyway? (Use this for a part-payment or a second instalment.)`
      );
      if (!ok) return;
    }

    setSaving(true);
    setError(null);
    try {
      const saved = await addFeePayment({
        studentUid: selected.uid,
        studentName: selected.fullName || "",
        enrollmentNumber: selected.enrollmentNumber || "",
        course: selected.course || "",
        feeType,
        forMonth: feeType === "monthly" ? forMonth : "",
        amount: n,
        method,
        paidOn,
        note: note.trim(),
      });

      if (notify) {
        await createNotification({
          audience: selected.uid,
          type: "fee",
          title: "Fee Received",
          body: `We received ${formatPKR(n)} for ${describePayment(saved)} on ${formatDate(paidOn)}. Receipt no. ${saved.receiptNo}. Thank you!`,
        }).catch((err) => console.error("Couldn't create fee notification", err));
      }

      setLastSaved(saved);
      setHistory((h) => [saved, ...(h ?? [])]);
      setRecent((r) => [saved, ...(r ?? [])].slice(0, 8));
      setNote("");
      setAmount("");
      setAmountTouched(false);
    } catch (err) {
      console.error(err);
      setError(`Couldn't save the payment.\n${describeError(err)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Fee Management</h1>
      <p className="text-sm text-navy/50 mb-5">
        When a student pays, find them below and record the payment. A receipt number is issued
        automatically.
      </p>
      <FeeTabs />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ---------- Left: the form ---------- */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-md border border-black/5 p-5">
            <label className={labelCls}>1. Student</label>
            {selected ? (
              <div className="flex items-center justify-between gap-3 rounded-md bg-navy/5 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center shrink-0">
                    <UserRound size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-navy text-sm truncate">{selected.fullName || "Unnamed student"}</p>
                    <p className="text-xs text-navy/50 truncate">
                      {[selected.enrollmentNumber, selected.course, selected.batch].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearStudent}
                  className="text-navy/40 hover:text-navy p-1 shrink-0"
                  aria-label="Change student"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={students === null ? "Loading students…" : "Search by name, enrollment no. or mobile"}
                  disabled={students === null}
                  className={`${inputCls} pl-10`}
                />
                {search.trim() && (
                  <div className="absolute z-10 left-0 right-0 mt-1 bg-white rounded-md border border-black/10 shadow-lg overflow-hidden">
                    {matches.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-navy/40">No student found.</p>
                    ) : (
                      matches.map((s) => (
                        <button
                          key={s.uid}
                          onClick={() => pickStudent(s)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-black/5 last:border-0"
                        >
                          <p className="text-sm font-semibold text-navy">{s.fullName || "Unnamed student"}</p>
                          <p className="text-xs text-navy/50">
                            {[s.enrollmentNumber, s.course, s.mobile].filter(Boolean).join(" · ")}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`bg-white rounded-md border border-black/5 p-5 space-y-4 ${selected ? "" : "opacity-50 pointer-events-none"}`}>
            <p className={labelCls + " mb-0"}>2. Payment details</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Fee type</label>
                <select
                  value={feeType}
                  onChange={(e) => {
                    setFeeType(e.target.value as FeeType);
                    setAmountTouched(false);
                  }}
                  className={inputCls}
                >
                  {(Object.keys(feeTypeLabels) as FeeType[]).map((t) => (
                    <option key={t} value={t}>
                      {feeTypeLabels[t]}
                    </option>
                  ))}
                </select>
              </div>
              {feeType === "monthly" && (
                <div>
                  <label className={labelCls}>Fee for month</label>
                  <input type="month" value={forMonth} onChange={(e) => setForMonth(e.target.value)} className={inputCls} />
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Amount received (Rs.)</label>
                <input
                  value={amountValue}
                  inputMode="numeric"
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setAmountTouched(true);
                  }}
                  placeholder="e.g. 3500"
                  className={inputCls}
                />
                {!amountTouched && suggested > 0 && (
                  <p className="text-[11px] text-navy/40 mt-1">
                    Filled in from the {feeType === "admission" ? "admission fee" : "course monthly fee"}. Change it for a part-payment or discount.
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls}>Date received</label>
                <input type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Payment method</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(paymentMethodLabels) as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`px-3.5 py-2 rounded-md text-sm font-semibold border transition-colors ${
                      method === m
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-navy/60 border-black/10 hover:border-navy/30"
                    }`}
                  >
                    {paymentMethodLabels[m]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Note (optional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Part payment, balance Rs. 1,500 due next week"
                className={inputCls}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-navy/70 cursor-pointer">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="accent-[#f0a93b]" />
              Send the student a &ldquo;Fee Received&rdquo; notification
            </label>

            {duplicate && (
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-md px-4 py-3 text-sm">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>
                  A {describePayment(duplicate)} payment is already recorded for this student (
                  {formatPKR(duplicate.amount)}, {duplicate.receiptNo}). You&apos;ll be asked to confirm before adding another.
                </p>
              </div>
            )}

            {error && <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving || !selected}
              className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark disabled:opacity-60 text-navy font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Record Payment
            </button>
          </div>

          {lastSaved && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-green-50 border border-green-100 text-green-800 rounded-md px-5 py-4 text-sm">
              <p>
                <b>Saved.</b> {formatPKR(lastSaved.amount)} from {lastSaved.studentName || "student"} &middot; receipt{" "}
                <b>{lastSaved.receiptNo}</b>
              </p>
              <button
                onClick={() => printReceipt(lastSaved)}
                className="inline-flex items-center gap-1.5 bg-white border border-green-200 hover:bg-green-100 text-green-800 font-semibold px-3.5 py-2 rounded-md"
              >
                <Printer size={14} /> Print receipt
              </button>
            </div>
          )}
        </div>

        {/* ---------- Right: history ---------- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md border border-black/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5">
              <h2 className="font-semibold text-navy text-sm">
                {selected ? `${selected.fullName || "Student"} — payment history` : "Recent payments"}
              </h2>
              {selected && history && history.length > 0 && (
                <p className="text-xs text-navy/50 mt-0.5">
                  {history.length} payment{history.length === 1 ? "" : "s"} · {formatPKR(totalPaid)} total
                </p>
              )}
            </div>
            <HistoryList items={selected ? history : recent} showStudent={!selected} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryList({ items, showStudent }: { items: FeePayment[] | null; showStudent: boolean }) {
  if (items === null) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-navy/40">
        <Loader2 size={14} className="animate-spin" /> Loading…
      </div>
    );
  }
  if (items.length === 0) {
    return <p className="text-center py-10 text-sm text-navy/40">No payments recorded yet.</p>;
  }
  return (
    <ul>
      {items.map((p) => (
        <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3 border-b border-black/5 last:border-0">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy truncate">
              {showStudent ? p.studentName || "Student" : describePayment(p)}
            </p>
            <p className="text-xs text-navy/50 truncate">
              {showStudent ? `${describePayment(p)} · ` : ""}
              {formatDate(p.paidOn)} · {p.receiptNo}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-navy text-sm">{formatPKR(p.amount)}</span>
            <button
              onClick={() => printReceipt(p)}
              className="text-navy/30 hover:text-navy p-1"
              aria-label={`Print receipt ${p.receiptNo}`}
            >
              <Printer size={14} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
