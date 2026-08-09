"use client";

import { useEffect, useState, useCallback } from "react";
import {
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
  RefreshCcw,
  FileSearch,
} from "lucide-react";
import { usePortal } from "@/components/portal/PortalContext";

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
  Certified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Enrolled: "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Discontinued: "bg-red-50 text-red-700 border-red-200",
};

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
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

export default function PortalCertificatePage() {
  const { student } = usePortal();
  const [status, setStatus] = useState<"loading" | "done" | "not-found" | "error">("loading");
  const [result, setResult] = useState<VerificationResult | null>(null);

  const lookup = useCallback(async () => {
    if (!student) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/verify?serial=${encodeURIComponent(student.enrollmentNumber)}`);
      const data = await res.json();
      if (res.status === 404) {
        setStatus("not-found");
        return;
      }
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }, [student]);

  useEffect(() => {
    if (!student) return;
    let cancelled = false;

    async function run() {
      setStatus("loading");
      try {
        const res = await fetch(`/api/verify?serial=${encodeURIComponent(student!.enrollmentNumber)}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 404) {
          setStatus("not-found");
          return;
        }
        if (!res.ok) throw new Error(data.error);
        setResult(data);
        setStatus("done");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [student]);

  const marksLine =
    result?.marksObtained != null && result?.totalMarks != null
      ? `${result.marksObtained} / ${result.totalMarks}${result.grade ? `  ·  Grade ${result.grade}` : ""}`
      : result?.grade
      ? `Grade ${result.grade}`
      : "Not yet available";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-gold-dark text-xs font-bold tracking-widest mb-1.5">CERTIFICATION STATUS</p>
        <h1 className="font-display font-bold text-navy text-2xl">Your Certificate</h1>
        <p className="text-sm text-navy/50 mt-1">
          Looked up automatically using your enrollment number, {student?.enrollmentNumber}.
        </p>
      </div>

      {status === "loading" && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-10 flex flex-col items-center gap-3 text-center">
          <Loader2 size={22} className="text-navy/40 animate-spin" />
          <p className="text-sm text-navy/50">Checking your certificate record…</p>
        </div>
      )}

      {status === "not-found" && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-8 text-center">
          <span className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileSearch size={20} className="text-navy/30" />
          </span>
          <h3 className="font-display font-bold text-navy text-lg mb-2">Not Issued Yet</h3>
          <p className="text-sm text-navy/55 max-w-sm mx-auto mb-5">
            We don&apos;t have a certificate record for your enrollment number yet. This is normal
            while your course is still in progress — it will appear here once the admin office
            issues it.
          </p>
          <button
            onClick={lookup}
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <RefreshCcw size={14} /> Check Again
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4 text-sm">
          <ShieldAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="mb-2">Something went wrong while checking your certificate record.</p>
            <button onClick={lookup} className="font-semibold underline">
              Try again
            </button>
          </div>
        </div>
      )}

      {status === "done" && result && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="bg-navy px-6 md:px-7 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-gold" />
              </span>
              <div>
                <p className="text-white font-display font-bold">Record Found</p>
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
            <DetailRow icon={BookOpen} label="Diploma / Course" value={result.course || "—"} />
            <DetailRow icon={Clock} label="Duration" value={result.duration || "—"} />
            {result.batch && <DetailRow icon={Users2} label="Batch" value={result.batch} />}
            <DetailRow icon={Award} label="Marks / Grade" value={marksLine} />
            {result.startDate && <DetailRow icon={CalendarCheck} label="Start Date" value={result.startDate} />}
            {result.completionDate && (
              <DetailRow icon={CalendarCheck} label="Completion Date" value={result.completionDate} />
            )}
            {result.certificateNumber && (
              <DetailRow icon={Hash} label="Certificate Number" value={result.certificateNumber} />
            )}
          </div>

          <div className="bg-navy/[0.03] px-6 md:px-7 py-4">
            <p className="text-xs text-navy/45">
              For any discrepancy in your record, please contact our administration office.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
