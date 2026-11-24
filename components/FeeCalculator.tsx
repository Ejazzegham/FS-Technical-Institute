"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Printer, Check } from "lucide-react";
import type { Course } from "@/lib/types";

const num = (t?: string) => Number((t ?? "").replace(/[^0-9.]/g, "")) || 0;
const months = (d: string) => {
  const n = parseInt(d, 10) || 0;
  return /year/i.test(d) ? n * 12 : n;
};
const pkr = (n: number) => "Rs. " + Math.round(n).toLocaleString("en-PK");

export default function FeeCalculator({ courses, admissionFee }: { courses: Course[]; admissionFee: string }) {
  const [picked, setPicked] = useState<string[]>([]);
  const admission = num(admissionFee);

  const rows = useMemo(
    () =>
      courses
        .filter((c) => picked.includes(c.slug))
        .map((c) => ({ course: c, monthly: num(c.monthlyFee), months: months(c.duration) })),
    [courses, picked]
  );
  const monthlyTotal = rows.reduce((s, r) => s + r.monthly, 0);
  const courseTotal = rows.reduce((s, r) => s + r.monthly * r.months, 0);
  const grand = courseTotal + (rows.length ? admission : 0);

  function toggle(slug: string) {
    setPicked((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 print:hidden">
        <h2 className="font-display font-bold text-navy text-lg mb-4">1. Choose your course(s)</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {courses.map((c) => {
            const on = picked.includes(c.slug);
            return (
              <button
                key={c.slug}
                onClick={() => toggle(c.slug)}
                aria-pressed={on}
                className={`text-left rounded-xl border px-4 py-3.5 transition-colors ${
                  on ? "border-gold bg-gold/10" : "border-navy/10 bg-white hover:border-navy/30"
                }`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-navy">{c.title}</span>
                  {on && <Check size={15} className="text-gold-dark shrink-0 mt-0.5" />}
                </span>
                <span className="block text-xs text-navy/55 mt-1">
                  {c.duration} · {c.monthlyFee || "Fee on request"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="lg:col-span-2">
        <div className="bg-navy rounded-2xl p-6 text-white sticky top-28 print:bg-white print:text-black print:border print:border-black/20">
          <h2 className="font-display font-bold text-lg mb-4">Your fee estimate</h2>
          {rows.length === 0 ? (
            <p className="text-sm text-white/60 print:text-black/60">Select a course to see the breakdown.</p>
          ) : (
            <>
              <ul className="space-y-3 text-sm mb-5">
                {rows.map(({ course, monthly, months: m }) => (
                  <li key={course.slug} className="flex justify-between gap-3">
                    <span className="text-white/80 print:text-black">
                      {course.title}
                      <span className="block text-xs text-white/50 print:text-black/60">
                        {pkr(monthly)} × {m || "?"} months
                      </span>
                    </span>
                    <span className="font-semibold">{pkr(monthly * m)}</span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-white/15 pt-3 print:border-black/20">
                  <span className="text-white/80 print:text-black">One-time admission fee</span>
                  <span className="font-semibold">{pkr(admission)}</span>
                </li>
              </ul>
              <div className="flex justify-between items-baseline border-t border-gold/40 pt-4">
                <span className="text-sm text-white/70 print:text-black">Estimated total</span>
                <span className="font-display font-bold text-2xl text-gold print:text-black">{pkr(grand)}</span>
              </div>
              <p className="text-xs text-white/55 print:text-black/60 mt-2">
                About {pkr(monthlyTotal)} per month while you study, plus the one-time admission fee.
              </p>
              <div className="flex gap-2 mt-5 print:hidden">
                <Link href="/admissions" className="flex-1 text-center bg-gold hover:bg-gold-dark text-navy font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors">
                  Apply now
                </Link>
                <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 border border-white/25 text-white text-sm px-3.5 rounded-lg hover:bg-white/10">
                  <Printer size={14} /> Print
                </button>
              </div>
            </>
          )}
          <p className="text-[11px] text-white/45 print:text-black/50 mt-4">
            Estimate only. Contact the office for installment options and any current offers.
          </p>
        </div>
      </aside>
    </div>
  );
}
