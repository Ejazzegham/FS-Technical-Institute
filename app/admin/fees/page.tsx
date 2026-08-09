"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { Loader2, Save, Check, Wallet, ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { feeSettings as defaults, type Course } from "@/lib/data";

type FeeSettings = typeof defaults;

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "site_settings", "fees"));
        setFees(snap.exists() ? (snap.data() as FeeSettings) : defaults);
      } catch {
        setFees(defaults);
      }
    })();
    (async () => {
      try {
        const snap = await getDocs(collection(db, "site_courses"));
        setCourses(snap.docs.map((d) => d.data() as Course));
      } catch {
        setCourses([]);
      }
    })();
  }, []);

  async function handleSave() {
    if (!fees) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "site_settings", "fees"), fees);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Couldn't save. Check Firestore rules — see ADMIN-SETUP.md.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Fee Management</h1>
      <p className="text-sm text-navy/50 mb-6">
        Set the one-time admission fee that applies to every course, plus a note shown to
        students. Each course&apos;s own monthly fee is edited on its course entry.
      </p>

      <div className="bg-white rounded-xl border border-black/5 p-6 max-w-lg mb-8">
        {!fees ? (
          <div className="flex items-center gap-2 text-sm text-navy/40 py-6 justify-center">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy/60 mb-1.5">
                Admission Fee (applies to every course)
              </label>
              <input
                value={fees.admissionFee}
                onChange={(e) => setFees({ ...fees, admissionFee: e.target.value })}
                placeholder="Rs. 1,000"
                className="w-full rounded-lg border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy/60 mb-1.5">
                Fee Note (shown to students on the course page &amp; student portal)
              </label>
              <textarea
                value={fees.feeNote}
                onChange={(e) => setFees({ ...fees, feeNote: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark disabled:opacity-60 text-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : saved ? (
                <Check size={14} />
              ) : (
                <Save size={14} />
              )}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-navy flex items-center gap-2">
          <Wallet size={16} className="text-gold-dark" /> Monthly Fee by Course
        </h2>
        <a
          href="/admin/courses"
          className="inline-flex items-center gap-1 text-sm font-semibold text-navy/60 hover:text-navy"
        >
          Edit in Courses <ArrowRight size={13} />
        </a>
      </div>
      <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
        {courses === null ? (
          <div className="flex items-center justify-center py-10 text-navy/40 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center py-10 text-sm text-navy/40">
            No courses yet. Add courses from{" "}
            <a href="/admin/courses" className="text-navy underline">
              Courses
            </a>
            .
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-navy/40 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">Course</th>
                <th className="px-5 py-3 font-semibold">Duration</th>
                <th className="px-5 py-3 font-semibold">Monthly Fee</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.slug} className="border-b border-black/5 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 text-navy/80">{c.title}</td>
                  <td className="px-5 py-3 text-navy/60">{c.duration}</td>
                  <td className="px-5 py-3 font-semibold text-navy">
                    {c.monthlyFee || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
