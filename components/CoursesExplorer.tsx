"use client";

import { useRef, useState } from "react";
import {
  Code2,
  Palette,
  Briefcase,
  TrendingUp,
  LayoutGrid,
  LineChart,
  Languages,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import type { Course } from "@/lib/data";

const categories: { label: Course["category"] | "All Courses"; icon: typeof Code2 }[] = [
  { label: "IT & Programming", icon: Code2 },
  { label: "Design & Multimedia", icon: Palette },
  { label: "Freelancing", icon: Briefcase },
  { label: "Digital Marketing", icon: TrendingUp },
  { label: "Microsoft Office", icon: LayoutGrid },
  { label: "Trading & Finance", icon: LineChart },
  { label: "Personal Development", icon: Languages },
  { label: "All Courses", icon: MoreHorizontal },
];

export default function CoursesExplorer({ courses }: { courses: Course[] }) {
  const [active, setActive] = useState<string>("All Courses");
  const topRef = useRef<HTMLDivElement>(null);

  const filtered =
    active === "All Courses" ? courses : courses.filter((c) => c.category === active);

  return (
    <>
      <div ref={topRef} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
        {categories.map((cat) => {
          const isActive = active === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setActive(cat.label)}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border px-4 py-6 text-center text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-navy/80 border-black/5 hover:border-gold hover:text-navy"
              }`}
            >
              <cat.icon size={20} className={isActive ? "text-gold" : "text-navy/60"} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((course) => (
          <CourseCard key={course.slug} course={course} detailed />
        ))}
      </div>

      {active !== "All Courses" && (
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => {
              setActive("All Courses");
              topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center gap-2 border border-navy/20 hover:border-navy text-navy font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            View All Courses <ArrowRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}
