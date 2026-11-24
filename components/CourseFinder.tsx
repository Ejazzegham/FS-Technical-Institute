"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import type { Course, CourseCategory } from "@/lib/types";

type Option = { label: string; value: string };
type Question = { id: "interest" | "goal" | "level" | "time"; title: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: "interest",
    title: "What would you most like to do?",
    options: [
      { label: "Build websites, apps or software", value: "tech" },
      { label: "Design, video and creative work", value: "creative" },
      { label: "Earn online as a freelancer or marketer", value: "online" },
      { label: "Office, business and communication skills", value: "office" },
      { label: "Trading, finance and markets", value: "finance" },
      { label: "I'm not sure yet", value: "any" },
    ],
  },
  {
    id: "goal",
    title: "What is your main goal?",
    options: [
      { label: "Get a job", value: "job" },
      { label: "Freelance and earn online", value: "freelance" },
      { label: "Start or grow my own business", value: "business" },
      { label: "Just learn a useful skill", value: "skill" },
    ],
  },
  {
    id: "level",
    title: "How much experience do you have?",
    options: [
      { label: "Complete beginner", value: "beginner" },
      { label: "I know the basics", value: "some" },
      { label: "I'm already fairly confident", value: "advanced" },
    ],
  },
  {
    id: "time",
    title: "How long can you commit?",
    options: [
      { label: "Up to 3 months", value: "3" },
      { label: "Up to 6 months", value: "6" },
      { label: "6 months or more", value: "12" },
    ],
  },
];

const INTEREST_CATEGORIES: Record<string, CourseCategory[]> = {
  tech: ["IT & Programming"],
  creative: ["Design & Multimedia"],
  online: ["Freelancing", "Digital Marketing"],
  office: ["Microsoft Office", "Personal Development"],
  finance: ["Trading & Finance"],
};

const GOAL_CATEGORIES: Record<string, CourseCategory[]> = {
  job: ["IT & Programming", "Microsoft Office", "Design & Multimedia"],
  freelance: ["Freelancing", "Design & Multimedia", "IT & Programming", "Digital Marketing"],
  business: ["Digital Marketing", "Trading & Finance", "Personal Development"],
  skill: [],
};

function months(duration: string): number {
  const n = parseInt(duration, 10);
  if (!Number.isFinite(n)) return 0;
  return /year/i.test(duration) ? n * 12 : n;
}

function score(course: Course, a: Record<string, string>): number {
  let s = 0;
  if (a.interest === "any") s += 20;
  else if (INTEREST_CATEGORIES[a.interest]?.includes(course.category)) s += 50;
  if (GOAL_CATEGORIES[a.goal]?.includes(course.category)) s += 20;
  if (a.goal === "job" && course.careers?.length) s += 5;
  if (a.goal === "freelance" && /freelanc/i.test(course.title + course.overview)) s += 8;
  const level = (course.level || "").toLowerCase();
  if (a.level === "beginner" && level.includes("beginner")) s += 15;
  if (a.level === "some" && (level.includes("intermediate") || level.includes("beginner"))) s += 10;
  if (a.level === "advanced" && level.includes("advanced")) s += 15;
  const m = months(course.duration);
  const limit = Number(a.time);
  if (m && m <= limit) s += 15;
  else if (m && m > limit) s -= Math.min(15, (m - limit) * 3);
  return s;
}

export default function CourseFinder({ courses }: { courses: Course[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = step >= QUESTIONS.length;

  const matches = useMemo(() => {
    if (!done) return [];
    const ranked = courses
      .map((c) => ({ course: c, score: score(c, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    const top = ranked[0]?.score || 1;
    return ranked.map((r) => ({ ...r, pct: Math.max(55, Math.min(98, Math.round((r.score / Math.max(top, 80)) * 98))) }));
  }, [done, answers, courses]);

  if (courses.length === 0) return <p className="text-center text-sm text-navy/50">Courses will appear here soon.</p>;

  if (done) {
    return (
      <div>
        <div className="flex items-center gap-2 text-gold-dark text-xs font-bold tracking-widest mb-4">
          <Sparkles size={14} /> YOUR TOP MATCHES
        </div>
        <div className="space-y-4">
          {matches.map(({ course, pct }, i) => (
            <div key={course.slug} className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-full bg-navy text-gold font-display font-bold flex items-center justify-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-navy">{course.title}</h3>
                <p className="text-xs text-navy/55 mt-0.5">
                  {course.category} · {course.duration} · {course.level}
                  {course.monthlyFee ? ` · ${course.monthlyFee}/month` : ""}
                </p>
                <div className="mt-3 h-1.5 bg-navy/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-navy/50 mt-1">{pct}% match</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/courses/${course.slug}`} className="text-xs font-semibold border border-navy/15 text-navy px-3.5 py-2 rounded-lg hover:bg-navy/5">
                  Details
                </Link>
                <Link href={`/demo-class?course=${course.slug}`} className="text-xs font-semibold bg-navy text-white px-3.5 py-2 rounded-lg hover:bg-navy-light">
                  Free demo
                </Link>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setStep(0);
            setAnswers({});
          }}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark"
        >
          <RotateCcw size={14} /> Start over
        </button>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold tracking-widest text-gold-dark">QUESTION {step + 1} OF {QUESTIONS.length}</p>
        <div className="flex gap-1.5" aria-hidden>
          {QUESTIONS.map((_, i) => (
            <span key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? "bg-gold" : "bg-navy/10"}`} />
          ))}
        </div>
      </div>
      <h2 className="font-display font-bold text-navy text-xl mb-5">{q.title}</h2>
      <div className="grid gap-3">
        {q.options.map((o) => (
          <button
            key={o.value}
            onClick={() => {
              setAnswers((a) => ({ ...a, [q.id]: o.value }));
              setStep((s) => s + 1);
            }}
            className="text-left text-sm font-medium text-navy border border-navy/10 rounded-xl px-4 py-3.5 hover:border-gold hover:bg-gold/5 transition-colors flex items-center justify-between group"
          >
            {o.label}
            <ArrowRight size={15} className="text-navy/25 group-hover:text-gold-dark" />
          </button>
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => setStep((s) => s - 1)} className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-navy/50 hover:text-navy">
          <ArrowLeft size={13} /> Back
        </button>
      )}
    </div>
  );
}
