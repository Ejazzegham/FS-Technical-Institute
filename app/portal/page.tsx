"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users2,
  BadgeCheck,
  CalendarClock,
  Video,
  PlayCircle,
  Award,
  Wallet,
  MessagesSquare,
  UserRound,
  ArrowRight,
  Clock,
} from "lucide-react";
import { usePortal } from "@/components/portal/PortalContext";
import StudentAvatar from "@/components/portal/StudentAvatar";
import { courses } from "@/lib/data";
import { getLiveClasses, getRecordedLectures } from "@/lib/content";
import type { LiveClass, RecordedLecture } from "@/lib/data";
import { courseIconMap, courseChipColors } from "@/lib/courseVisuals";
import { firstName, formatTimestamp } from "@/lib/portalUtils";

const quickLinks = [
  { href: "/portal/profile", label: "My Profile", desc: "View & edit your details", icon: UserRound },
  { href: "/portal/certificate", label: "Certificate", desc: "Check your certificate status", icon: Award },
  { href: "/portal/fees", label: "Fee Information", desc: "Admission & monthly fee", icon: Wallet },
  { href: "/portal/support", label: "Support", desc: "Talk to the admin office", icon: MessagesSquare },
];

export default function PortalDashboard() {
  const { student } = usePortal();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [recordedLectures, setRecordedLectures] = useState<RecordedLecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getLiveClasses(), getRecordedLectures()]).then(([lc, rl]) => {
      if (!cancelled) {
        setLiveClasses(lc);
        setRecordedLectures(rl);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const course = courses.find((c) => c.title === student?.course);
  const CourseIcon = course ? courseIconMap[course.icon] : BookOpen;

  const myLiveClasses = liveClasses.filter((lc) => lc.courseSlug === course?.slug);
  const myRecordedLectures = recordedLectures.filter((rl) => rl.courseSlug === course?.slug).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-navy-dark" />
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <StudentAvatar name={student?.fullName} photoUrl={student?.photoUrl} size={72} ring />
          <div className="flex-1 min-w-0">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-1">
              Welcome Back
            </p>
            <h1 className="font-display font-extrabold text-white text-2xl sm:text-3xl mb-3 truncate">
              {firstName(student?.fullName)} 👋
            </h1>
            <div className="flex flex-wrap gap-2">
              <Chip icon={BadgeCheck}>{student?.enrollmentNumber}</Chip>
              {course && <Chip icon={CourseIcon}>{course.title}</Chip>}
              {student?.batch && <Chip icon={Users2}>{student.batch}</Chip>}
              <Chip icon={CalendarClock}>Member since {formatTimestamp(student?.createdAt)}</Chip>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Enrolled Course" value={course?.title || "—"} />
        <StatCard icon={Clock} label="Duration" value={course?.duration || "—"} />
        <StatCard icon={Users2} label="Batch" value={student?.batch || "—"} />
        <StatCard icon={BadgeCheck} label="Status" value="Active" accent />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Live classes for their course */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-navy text-lg">Your Live Classes</h2>
            <Link
              href="/portal/live-classes"
              className="text-xs font-semibold text-navy/50 hover:text-navy flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <SkeletonRows />
          ) : myLiveClasses.length === 0 ? (
            <EmptyState
              icon={Video}
              text="No live classes scheduled for your course right now. Check back soon."
            />
          ) : (
            <div className="divide-y divide-black/5">
              {myLiveClasses.map((lc) => (
                <div key={lc.id} className="py-4 flex items-center gap-4">
                  <span
                    className={`w-11 h-11 rounded-lg ${
                      course ? courseChipColors[course.icon] : "bg-slate-600"
                    } flex items-center justify-center text-white shrink-0`}
                  >
                    <Video size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-navy text-sm">{lc.title}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> LIVE
                      </span>
                    </div>
                    <p className="text-xs text-navy/45">
                      {lc.instructor} &nbsp;•&nbsp; {lc.time}
                    </p>
                  </div>
                  <Link
                    href="/portal/live-classes"
                    className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
                  >
                    Join
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Recommended recorded lectures */}
          <div className="mt-8 pt-6 border-t border-black/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-navy text-sm">
                Recorded Lectures for {course?.title || "Your Course"}
              </h3>
              <Link
                href="/portal/recorded-lectures"
                className="text-xs font-semibold text-navy/50 hover:text-navy flex items-center gap-1"
              >
                View All <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? (
              <SkeletonRows compact />
            ) : myRecordedLectures.length === 0 ? (
              <EmptyState icon={PlayCircle} text="No recorded lectures for your course yet." />
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {myRecordedLectures.map((rl) => (
                  <div
                    key={rl.id}
                    className="flex items-center gap-3 bg-slate-50 rounded-xl px-3.5 py-3 border border-black/5"
                  >
                    <span className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0">
                      <PlayCircle size={15} className="text-gold" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{rl.title}</p>
                      <p className="text-xs text-navy/40">{rl.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
            <h3 className="font-display font-bold text-navy text-sm mb-4">Quick Links</h3>
            <div className="space-y-2">
              {quickLinks.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <q.icon size={16} className="text-gold-dark" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy">{q.label}</p>
                    <p className="text-xs text-navy/45 truncate">{q.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-navy/20 group-hover:text-navy/50 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-navy rounded-2xl p-5">
            <h3 className="font-display font-bold text-white text-sm mb-2">Need Help?</h3>
            <p className="text-xs text-white/55 leading-relaxed mb-4">
              Our admin office is here for any question about your course, fee or schedule.
            </p>
            <Link
              href="/portal/support"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gold hover:bg-gold-dark text-navy px-4 py-2 rounded-lg transition-colors"
            >
              Contact Support <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon: Icon, children }: { icon: React.ElementType; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full">
      <Icon size={12} className="text-gold" /> {children}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
      <span
        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
          accent ? "bg-emerald-50" : "bg-navy/5"
        }`}
      >
        <Icon size={16} className={accent ? "text-emerald-600" : "text-navy"} />
      </span>
      <p className="text-xs text-navy/45 mb-0.5">{label}</p>
      <p className={`font-display font-bold text-base truncate ${accent ? "text-emerald-600" : "text-navy"}`}>
        {value}
      </p>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-8">
      <span className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
        <Icon size={18} className="text-navy/30" />
      </span>
      <p className="text-sm text-navy/45 max-w-xs">{text}</p>
    </div>
  );
}

function SkeletonRows({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid sm:grid-cols-2 gap-3" : "space-y-4"}>
      {Array.from({ length: compact ? 2 : 3 }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-100 rounded-xl ${compact ? "h-14" : "h-14"}`}
        />
      ))}
    </div>
  );
}
