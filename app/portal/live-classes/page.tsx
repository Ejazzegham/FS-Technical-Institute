"use client";

import { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { usePortal } from "@/components/portal/PortalContext";
import JoinLiveClass from "@/components/JoinLiveClass";
import { courses } from "@/lib/data";
import { getLiveClasses } from "@/lib/content";
import type { LiveClass } from "@/lib/data";
import { courseIconMap, courseChipColors } from "@/lib/courseVisuals";

function courseFor(slug: string) {
  return courses.find((c) => c.slug === slug);
}

function ClassRow({ lc }: { lc: LiveClass }) {
  const course = courseFor(lc.courseSlug);
  const Icon = course ? courseIconMap[course.icon] : Video;
  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
      <span
        className={`w-12 h-12 rounded-lg ${
          course ? courseChipColors[course.icon] : "bg-slate-600"
        } flex items-center justify-center text-white shrink-0`}
      >
        <Icon size={20} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="font-semibold text-navy text-sm">{lc.title}</p>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> LIVE
          </span>
        </div>
        <p className="text-xs font-semibold text-gold-dark mb-0.5">{course?.title ?? "General"}</p>
        <p className="text-xs text-navy/45">
          Instructor: {lc.instructor} &nbsp;•&nbsp; {lc.time}
        </p>
      </div>
      <div className="text-center sm:text-right shrink-0">
        <p className="font-display font-bold text-navy text-base leading-none">{lc.studentsOnline}</p>
        <p className="text-[10px] text-navy/40">Students Online</p>
      </div>
      <button className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0">
        Join Now
      </button>
    </div>
  );
}

export default function PortalLiveClassesPage() {
  const { student } = usePortal();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getLiveClasses().then((lc) => {
      if (!cancelled) {
        setLiveClasses(lc);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const course = courses.find((c) => c.title === student?.course);
  const mine = liveClasses.filter((lc) => lc.courseSlug === course?.slug);
  const others = liveClasses.filter((lc) => lc.courseSlug !== course?.slug);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-gold-dark text-xs font-bold tracking-widest mb-1.5">LIVE INTERACTIVE CLASSES</p>
        <h1 className="font-display font-bold text-navy text-2xl">Join Your Live Classes</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
            <h2 className="font-display font-bold text-navy text-lg mb-1">
              {course?.title || "Your Course"}
            </h2>
            <p className="text-sm text-navy/45 mb-4">Live sessions scheduled for your enrolled course.</p>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-100 rounded-xl h-16" />
                ))}
              </div>
            ) : mine.length === 0 ? (
              <div className="flex flex-col items-center text-center gap-2 py-10">
                <span className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
                  <Video size={18} className="text-navy/30" />
                </span>
                <p className="text-sm text-navy/45 max-w-xs">
                  No live class is scheduled for your course right now — check back soon or ask your
                  instructor.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/5">
                {mine.map((lc) => (
                  <ClassRow key={lc.id} lc={lc} />
                ))}
              </div>
            )}
          </div>

          {others.length > 0 && (
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
              <h2 className="font-display font-bold text-navy text-lg mb-4">Other Live Classes</h2>
              <div className="divide-y divide-black/5 opacity-80">
                {others.map((lc) => (
                  <ClassRow key={lc.id} lc={lc} />
                ))}
              </div>
            </div>
          )}
        </div>

        <JoinLiveClass showLoginCta={false} supportHref="/portal/support" />
      </div>
    </div>
  );
}
