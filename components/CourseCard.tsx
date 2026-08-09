import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, BarChart3 } from "lucide-react";
import type { Course } from "@/lib/data";
import { courseIconMap, courseGradients, courseChipColors } from "@/lib/courseVisuals";

export default function CourseCard({ course, detailed = false }: { course: Course; detailed?: boolean }) {
  const Icon = courseIconMap[course.icon];

  return (
    <div className="flip-card rounded-2xl h-80 group">
      <div className="flip-card-inner rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow duration-300">
        {/* Front: landscape image + title panel (also a link, so touch devices without hover still work) */}
        <Link
          href={`/courses/${course.slug}`}
          className="flip-card-face rounded-2xl overflow-hidden border border-black/5 bg-navy flex flex-col"
        >
          {/* Image area is flex-1 (fills whatever space remains above the title panel)
              with object-contain, so the full image always fits with zero cropping —
              at every breakpoint/column count, not just the ones we happened to test. */}
          <div
            className={`relative w-full flex-1 min-h-0 overflow-hidden ${
              course.image ? "bg-white" : `bg-gradient-to-br ${courseGradients[course.icon]} flex items-center justify-center`
            }`}
          >
            {course.image ? (
              <Image
                src={course.image}
                alt={course.title}
                fill
                sizes="(max-width: 768px) 100vw, 20vw"
                className="object-contain"
              />
            ) : (
              <Icon size={48} className="text-white/25" />
            )}
            <span
              className={`absolute top-3 left-3 w-9 h-9 rounded-lg ${courseChipColors[course.icon]} flex items-center justify-center shadow-md`}
            >
              <Icon size={18} className="text-white" />
            </span>
          </div>

          {/* Title panel below the image, sized to its content — the image area above
              (flex-1) absorbs whatever height is left, at any card width. */}
          <div className="shrink-0 px-4 py-3 flex flex-col gap-1.5">
            <h3 className="font-display font-bold text-white text-[15px] leading-snug line-clamp-2">
              {course.title}
            </h3>
            {detailed && (
              <div className="flex items-center gap-3 text-[11px] text-white/60">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 size={12} /> {course.level}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Back: 4-line intro + View Detail */}
        <div className="flip-card-face flip-card-back rounded-2xl overflow-hidden bg-navy border border-black/5 p-6 flex flex-col">
          <span
            className={`w-9 h-9 rounded-lg ${courseChipColors[course.icon]} flex items-center justify-center shadow-md mb-3 shrink-0`}
          >
            <Icon size={18} className="text-white" />
          </span>
          <h3 className="font-display font-bold text-white text-base leading-snug mb-2 shrink-0">{course.title}</h3>
          <p className="text-sm text-white/65 leading-relaxed line-clamp-4">{course.overview}</p>
          <div className="mt-auto pt-4">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center justify-center gap-1.5 w-full text-sm font-semibold bg-gold hover:bg-gold-dark text-navy px-4 py-2.5 rounded-lg transition-colors"
            >
              View Detail <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
