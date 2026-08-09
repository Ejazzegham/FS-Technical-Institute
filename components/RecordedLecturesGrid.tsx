"use client";

import { useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import type { RecordedLecture } from "@/lib/data";
import { courses } from "@/lib/data";
import { courseGradients } from "@/lib/courseVisuals";

function courseFor(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export default function RecordedLecturesGrid({
  recordedLectures,
  defaultActive = "All Courses",
  hideHeading = false,
  showFooterLink = true,
}: {
  recordedLectures: RecordedLecture[];
  defaultActive?: string;
  hideHeading?: boolean;
  showFooterLink?: boolean;
}) {
  const [active, setActive] = useState<string>(defaultActive);

  // Tabs are generated from the actual courses these lectures belong to, so the
  // labels here always match the names shown on the Courses page.
  const usedSlugs = Array.from(new Set(recordedLectures.map((l) => l.courseSlug)));
  const tabCourses = usedSlugs.map(courseFor).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const tabs = ["All Courses", ...tabCourses.map((c) => c.title)];

  const filtered =
    active === "All Courses"
      ? recordedLectures
      : recordedLectures.filter((l) => courseFor(l.courseSlug)?.title === active);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        {!hideHeading && <h2 className="font-display font-bold text-navy text-xl">Recorded Lectures</h2>}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                active === tab
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-navy/60 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {filtered.map((lecture) => {
          const course = courseFor(lecture.courseSlug);
          return (
            <div
              key={lecture.id}
              className="bg-white rounded-xl border border-black/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden group"
            >
              <div
                className={`relative h-28 bg-gradient-to-br ${
                  course ? courseGradients[course.icon] : "from-slate-800 to-slate-950"
                } flex items-center justify-center`}
              >
                <span className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">
                  {lecture.duration}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-navy text-sm leading-snug mb-1">{lecture.title}</p>
                <p className="text-xs text-navy/45 mb-0.5">{course?.title ?? "General"}</p>
                <p className="text-xs text-navy/40">{lecture.instructor}</p>
              </div>
            </div>
          );
        })}
      </div>

      {showFooterLink && (
        <div className="text-center mt-8">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark transition-colors"
          >
            View All Recorded Lectures <ArrowRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
