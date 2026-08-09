"use client";

import { useState } from "react";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  User,
  BookOpen,
  Clock,
  Users2,
  Award,
  CalendarCheck,
  Hash,
  Loader2,
} from "lucide-react";

type VerificationResult = {
  serialNumber: string;
  studentName: string | null;
  fatherName: string | null;
  course: string | null;
  duration: string | null;
  batch: string | null;
  status: string;
  marksObtained: number | null;
  totalMarks: number | null;
  grade: string | null;
  startDate: string | null;
  completionDate: string | null;
  certificateNumber: string | null;
};

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Enrolled: "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Discontinued: "bg-red-50 text-red-700 border-red-200",
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-black/5 last:border-b-0">
      <span className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-navy" />
      </span>
      <div>
        <p className="text-xs text-navy/45 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-navy">{value}</p>
      </div>
    </div>
  );
}

export default function VerificationForm() {
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!serial.trim()) return;

    setStatus("loading");
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch(`/api/verify?serial=${encodeURIComponent(serial.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No record found for this serial number.");
      }

      setResult(data);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const marksLine =
    result?.marksObtained != null && result?.totalMarks != null
      ? `${result.marksObtained} / ${result.totalMarks}${
          result.grade ? `  ·  Grade ${result.grade}` : ""
        }`
      : result?.grade
      ? `Grade ${result.grade}`
      : "Not yet available";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-7">
        <h2 className="font-display font-bold text-navy text-xl mb-1">Enter Serial Number</h2>
        <p className="text-sm text-navy/50 mb-6">
          You&apos;ll find this on your enrollment card or certificate — e.g.{" "}
          <span className="font-medium text-navy/70">FSTI-2026-000123</span>.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="Enter student serial / enrollment number"
            className="input flex-1"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60 shrink-0"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Checking...
              </>
            ) : (
              <>
                <Search size={16} /> Verify
              </>
            )}
          </button>
        </form>

        {status === "error" && (
          <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-lg px-4 py-3 text-sm">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}
      </div>

      {status === "done" && result && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm mt-6 overflow-hidden">
          <div className="bg-navy px-6 md:px-7 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-gold" />
              </span>
              <div>
                <p className="text-white font-display font-bold">Record Verified</p>
                <p className="text-white/50 text-xs">Serial No. {result.serialNumber}</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold tracking-wide px-3 py-1.5 rounded-full border ${
                statusStyles[result.status] || "bg-white/10 text-white border-white/20"
              }`}
            >
              {result.status}
            </span>
          </div>

          <div className="px-6 md:px-7 py-2">
            <DetailRow icon={User} label="Student Name" value={result.studentName || "—"} />
            {result.fatherName && (
              <DetailRow icon={User} label="Father's Name" value={result.fatherName} />
            )}
            <DetailRow icon={BookOpen} label="Diploma / Course" value={result.course || "—"} />
            <DetailRow icon={Clock} label="Duration" value={result.duration || "—"} />
            {result.batch && <DetailRow icon={Users2} label="Batch" value={result.batch} />}
            <DetailRow icon={Award} label="Marks / Grade" value={marksLine} />
            {result.startDate && (
              <DetailRow icon={CalendarCheck} label="Start Date" value={result.startDate} />
            )}
            {result.completionDate && (
              <DetailRow
                icon={CalendarCheck}
                label="Completion Date"
                value={result.completionDate}
              />
            )}
            {result.certificateNumber && (
              <DetailRow icon={Hash} label="Certificate Number" value={result.certificateNumber} />
            )}
          </div>

          <div className="bg-navy/[0.03] px-6 md:px-7 py-4">
            <p className="text-xs text-navy/45">
              This record was issued by Furqan Saeed Technical Institute. For any discrepancy,
              please contact our administration office.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
