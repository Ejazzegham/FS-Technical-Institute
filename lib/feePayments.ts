// Fee payment records — one document per payment in the `fee_payments`
// collection. Written by the admin panel (app/admin/fees/collection) when a
// student pays, and listed/printed/deleted from app/admin/fees/records.
//
// Each payment gets a sequential receipt number (FSR-2026-0001, ...) issued
// atomically from a counter document, the same way enrollment numbers work
// (see lib/enrollment.ts), so two payments saved at the same moment can
// never share a receipt number.

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit as fsLimit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type FeeType = "admission" | "monthly" | "exam" | "certificate" | "other";
export type PaymentMethod = "cash" | "bank" | "easypaisa" | "jazzcash" | "other";

export const feeTypeLabels: Record<FeeType, string> = {
  admission: "Admission Fee",
  monthly: "Monthly Fee",
  exam: "Exam Fee",
  certificate: "Certificate Fee",
  other: "Other",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  bank: "Bank Transfer",
  easypaisa: "Easypaisa",
  jazzcash: "JazzCash",
  other: "Other",
};

export type FeePayment = {
  id: string;
  receiptNo: string;
  studentUid: string;
  studentName: string;
  enrollmentNumber: string;
  course: string;
  feeType: FeeType;
  /** "YYYY-MM" — which month a monthly fee covers. Empty for other fee types. */
  forMonth: string;
  amount: number;
  method: PaymentMethod;
  /** "YYYY-MM-DD" — the day the money was received. */
  paidOn: string;
  note: string;
  createdAt?: { toDate: () => Date } | null;
};

export type NewFeePayment = Omit<FeePayment, "id" | "receiptNo" | "createdAt">;

/** Today's date as YYYY-MM-DD in the admin's local timezone (not UTC). */
export function localIsoDate(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function currentMonth(): string {
  return localIsoDate().slice(0, 7);
}

/** "Rs. 3,500" -> 3500. Returns 0 when there's no number in the text. */
export function parseFeeAmount(text: string | undefined | null): number {
  const digits = (text ?? "").replace(/[^0-9.]/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

export function formatPKR(n: number): string {
  return `Rs. ${Math.round(n).toLocaleString("en-US")}`;
}

export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

/** Human description of what a payment was for, e.g. "Monthly Fee (Nov 2026)". */
export function describePayment(p: Pick<FeePayment, "feeType" | "forMonth">): string {
  const base = feeTypeLabels[p.feeType] ?? p.feeType;
  return p.feeType === "monthly" && p.forMonth ? `${base} (${formatMonth(p.forMonth)})` : base;
}

/** Saves a payment and issues its receipt number in one atomic transaction. */
export async function addFeePayment(input: NewFeePayment): Promise<FeePayment> {
  const year = new Date().getFullYear();
  const counterRef = doc(db, "counters", `receipt-${year}`);
  const paymentRef = doc(collection(db, "fee_payments"));

  const receiptNo = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? ((snap.data().count as number) ?? 0) : 0;
    const next = current + 1;
    const no = `FSR-${year}-${String(next).padStart(4, "0")}`;
    tx.set(counterRef, { year, count: next, updatedAt: new Date().toISOString() }, { merge: true });
    tx.set(paymentRef, { ...input, receiptNo: no, createdAt: serverTimestamp() });
    return no;
  });

  return { ...input, id: paymentRef.id, receiptNo, createdAt: null };
}

function toPayment(id: string, data: Record<string, unknown>): FeePayment {
  return { id, ...(data as Omit<FeePayment, "id">) };
}

/** Most recent payments first (by the date the money was received). */
export async function listFeePayments(max = 1000): Promise<FeePayment[]> {
  const q = query(collection(db, "fee_payments"), orderBy("paidOn", "desc"), fsLimit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toPayment(d.id, d.data()));
}

/** Every payment for one student, newest first. */
export async function listStudentPayments(studentUid: string): Promise<FeePayment[]> {
  const q = query(collection(db, "fee_payments"), where("studentUid", "==", studentUid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => toPayment(d.id, d.data()))
    .sort((a, b) => b.paidOn.localeCompare(a.paidOn) || b.receiptNo.localeCompare(a.receiptNo));
}

export async function deleteFeePayment(id: string) {
  await deleteDoc(doc(db, "fee_payments", id));
}

function esc(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Opens a print-ready receipt in a new window. */
export function printReceipt(p: FeePayment) {
  const w = window.open("", "_blank", "width=720,height=900");
  if (!w) {
    alert("Your browser blocked the receipt window. Allow pop-ups for this site and try again.");
    return;
  }
  const row = (label: string, value: string) =>
    `<tr><td class="l">${esc(label)}</td><td class="v">${esc(value || "—")}</td></tr>`;

  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${esc(p.receiptNo)}</title>
<style>
  *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;color:#0f1e3d;margin:0;padding:32px}
  .card{max-width:600px;margin:0 auto;border:2px solid #0f1e3d;border-radius:10px;padding:28px}
  h1{margin:0;font-size:20px;text-align:center;letter-spacing:.5px} .sub{text-align:center;font-size:12px;color:#64708a;margin:2px 0 18px}
  .head{display:flex;justify-content:space-between;font-size:13px;border-top:1px solid #d9dde6;border-bottom:1px solid #d9dde6;padding:10px 0;margin-bottom:14px}
  table{width:100%;border-collapse:collapse;font-size:14px} td{padding:8px 0;border-bottom:1px solid #eef0f4}
  td.l{color:#64708a;width:38%} td.v{font-weight:600}
  .amount{margin:18px 0;padding:14px;background:#fff6e5;border:1px solid #f0a93b;border-radius:8px;text-align:center}
  .amount span{display:block;font-size:12px;color:#64708a} .amount strong{font-size:26px}
  .sign{display:flex;justify-content:space-between;margin-top:46px;font-size:12px;color:#64708a}
  .sign div{border-top:1px solid #0f1e3d;padding-top:6px;width:42%;text-align:center}
  .foot{text-align:center;font-size:11px;color:#8a93a6;margin-top:22px}
  @media print{body{padding:0} .card{border-width:1px}}
</style></head><body><div class="card">
  <h1>FURQAN SAEED TECHNICAL INSTITUTE</h1>
  <p class="sub">Fee Receipt</p>
  <div class="head"><span><b>Receipt No:</b> ${esc(p.receiptNo)}</span><span><b>Date:</b> ${esc(formatDate(p.paidOn))}</span></div>
  <table>
    ${row("Student", p.studentName)}
    ${row("Enrollment No", p.enrollmentNumber)}
    ${row("Course", p.course)}
    ${row("Fee for", describePayment(p))}
    ${row("Payment method", paymentMethodLabels[p.method] ?? p.method)}
    ${p.note ? row("Note", p.note) : ""}
  </table>
  <div class="amount"><span>Amount received</span><strong>${esc(formatPKR(p.amount))}</strong></div>
  <div class="sign"><div>Received by</div><div>Student / Guardian</div></div>
  <p class="foot">This is a computer-generated receipt. Please keep it for your records.</p>
</div><script>window.onload=function(){window.print()}</script></body></html>`);
  w.document.close();
}
