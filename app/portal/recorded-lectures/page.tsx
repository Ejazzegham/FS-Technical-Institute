"use client";

import { useEffect, useState } from "react";
import { usePortal } from "@/components/portal/PortalContext";
import RecordedLecturesGrid from "@/components/RecordedLecturesGrid";
import { getRecordedLectures } from "@/lib/content";
import type { RecordedLecture } from "@/lib/data";

export default function PortalRecordedLecturesPage() {
  const { student } = usePortal();
  const [lectures, setLectures] = useState<RecordedLecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getRecordedLectures().then((rl) => {
      if (!cancelled) {
        setLectures(rl);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-gold-dark text-xs font-bold tracking-widest mb-1.5">STUDY ANYTIME</p>
        <h1 className="font-display font-bold text-navy text-2xl">Recorded Lectures</h1>
        <p className="text-sm text-navy/50 mt-1">
          Catch up on any lecture you missed, filtered by course.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 rounded-xl h-40" />
            ))}
          </div>
        ) : (
          <RecordedLecturesGrid
            recordedLectures={lectures}
            defaultActive={student?.course || "All Courses"}
            showFooterLink={false}
          />
        )}
      </div>
    </div>
  );
}
