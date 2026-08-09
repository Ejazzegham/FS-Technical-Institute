import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Code2,
  Palette,
  TrendingUp,
  LayoutGrid,
  Smartphone,
  Terminal,
  Video,
  Ruler,
  Megaphone,
  Briefcase,
  MonitorPlay,
  LineChart,
  Languages,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Clock,
  BarChart3,
  Layers,
  Award,
  CheckCircle2,
  FolderKanban,
  MessageCircle,
  Wallet,
  BadgeDollarSign,
  Star,
  Users2,
  UserCheck,
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import CTABanner from "@/components/CTABanner";
import { courses, courseHighlights, type Course } from "@/lib/data";
import { getCourses, getCourseBySlug, getContactInfo, getFeeSettings } from "@/lib/content";
import { detectCurriculumGroups, detectPracticeGroups } from "@/lib/curriculum-grouping";

const iconMap: Record<Course["icon"], typeof Code2> = {
  code: Code2,
  palette: Palette,
  "trending-up": TrendingUp,
  "layout-grid": LayoutGrid,
  smartphone: Smartphone,
  terminal: Terminal,
  video: Video,
  ruler: Ruler,
  megaphone: Megaphone,
  briefcase: Briefcase,
  youtube: MonitorPlay,
  "line-chart": LineChart,
  languages: Languages,
  "graduation-cap": GraduationCap,
};

const gradients: Record<string, string> = {
  code: "from-sky-900 to-slate-900",
  palette: "from-fuchsia-900 to-slate-900",
  "trending-up": "from-indigo-900 to-slate-900",
  "layout-grid": "from-orange-900 to-slate-900",
  smartphone: "from-teal-900 to-slate-900",
  terminal: "from-slate-800 to-slate-950",
  video: "from-rose-900 to-slate-900",
  ruler: "from-amber-900 to-slate-900",
  megaphone: "from-purple-900 to-slate-900",
  briefcase: "from-emerald-900 to-slate-900",
  youtube: "from-red-900 to-slate-900",
  "line-chart": "from-cyan-900 to-slate-900",
  languages: "from-blue-900 to-slate-900",
  "graduation-cap": "from-yellow-900 to-slate-900",
};

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `${course.title} Course | Furqan Saeed Technical Institute`,
    description: course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, allCourses, contactInfo, feeSettings] = await Promise.all([
    getCourseBySlug(slug),
    getCourses(),
    getContactInfo(),
    getFeeSettings(),
  ]);
  if (!course) notFound();

  const Icon = iconMap[course.icon];
  const related = allCourses.filter((c) => c.category === course.category && c.slug !== course.slug).slice(0, 3);
  const relatedFallback = related.length > 0 ? related : allCourses.filter((c) => c.slug !== course.slug).slice(0, 3);
  const whatsapp = contactInfo.whatsapp.replace(/[^0-9]/g, "");

  // Prefer explicit groups (static data), otherwise auto-detect
  // "1. MS Word" / "MS Word Projects" style headers admins have typed
  // directly into the flat curriculum/projects lists in the admin panel.
  const curriculumGroups =
    course.curriculumGroups && course.curriculumGroups.length > 0
      ? course.curriculumGroups
      : detectCurriculumGroups(course.curriculum);
  const practiceGroups =
    course.practiceGroups && course.practiceGroups.length > 0
      ? course.practiceGroups
      : detectPracticeGroups(course.projects);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 md:py-10 relative z-10">
          <p className="text-white/50 text-xs mb-4">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            {" > "}
            <Link href="/courses" className="hover:text-gold transition-colors">Courses</Link>
            {" > "}
            <span className="text-white/70">{course.title}</span>
          </p>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 bg-white/10 text-gold text-xs font-bold tracking-widest px-3 py-1.5 rounded-full mb-4">
                {course.category.toUpperCase()}
              </span>
              <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl mb-3 leading-tight">
                {course.title}
              </h1>
              <p className="text-white/60 leading-relaxed max-w-xl mb-6">{course.overview}</p>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/80 text-sm px-3 py-1.5 rounded-lg">
                  <Clock size={15} className="text-gold" /> {course.duration}
                </span>
                <span className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/80 text-sm px-3 py-1.5 rounded-lg">
                  <BarChart3 size={15} className="text-gold" /> {course.level}
                </span>
                <span className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/80 text-sm px-3 py-1.5 rounded-lg">
                  <Award size={15} className="text-gold" /> Certificate Included
                </span>
              </div>

              {(course.rating || course.enrolledStudents || course.completedStudents) && (
                <div className="flex flex-wrap items-center gap-5 mb-6 text-sm text-white/70">
                  {course.rating != null && (
                    <span className="flex items-center gap-1.5">
                      <Star size={15} className="text-gold fill-gold" />
                      <span className="font-semibold text-white">{course.rating.toFixed(1)}</span>
                      {course.reviewsCount ? ` (${course.reviewsCount} reviews)` : " rating"}
                    </span>
                  )}
                  {course.enrolledStudents != null && (
                    <span className="flex items-center gap-1.5">
                      <Users2 size={15} className="text-gold" />
                      <span className="font-semibold text-white">{course.enrolledStudents}+</span> students
                      enrolled
                    </span>
                  )}
                  {course.completedStudents != null && (
                    <span className="flex items-center gap-1.5">
                      <UserCheck size={15} className="text-gold" />
                      <span className="font-semibold text-white">{course.completedStudents}+</span> completed
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admissions"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Enroll Now <ArrowRight size={16} />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-gold hover:text-gold text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <ArrowLeft size={16} /> All Courses
                </Link>
              </div>
            </div>

            <div
              className={`relative rounded-2xl overflow-hidden aspect-[3/2] lg:col-span-6 border border-white/10 flex items-center justify-center ${
                course.image ? "bg-white" : `bg-gradient-to-br ${gradients[course.icon]}`
              }`}
            >
              {course.image ? (
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              ) : (
                <Icon size={64} className="text-white/20" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-3xl mx-auto px-6 lg:px-10 pt-16 md:pt-20 text-center">
        <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">COURSE OVERVIEW</p>
        <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-4">About This Course</h2>
        <p className="text-navy/60 leading-relaxed">{course.overview}</p>
      </section>

      {/* Course Information — full-width horizontal card */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-10">
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_8px_30px_rgba(15,30,61,0.06)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Layers, label: "Category", value: course.category },
              { icon: Clock, label: "Duration", value: course.duration },
              { icon: BarChart3, label: "Level", value: course.level },
              { icon: Award, label: "Certificate", value: "Included" },
              { icon: BadgeDollarSign, label: "Admission Fee", value: feeSettings.admissionFee },
              { icon: Wallet, label: "Monthly Fee", value: course.monthlyFee || "Contact for Pricing" },
            ].map(({ icon: FieldIcon, label, value }, i) => (
              <div
                key={label}
                className={`text-center px-4 py-6 border-b lg:border-b-0 border-black/5 ${
                  i % 3 !== 2 ? "sm:border-r" : ""
                } ${i < 5 ? "lg:border-r" : ""}`}
              >
                <span className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark mx-auto mb-2.5">
                  <FieldIcon size={16} />
                </span>
                <p className="text-[11px] text-navy/45 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-semibold text-navy">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-navy/[0.02] border-t border-black/5 px-6 py-5">
            <Link
              href="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
            >
              Enroll Now <ArrowRight size={16} />
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-navy/15 hover:border-gold text-navy font-semibold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
            >
              <MessageCircle size={16} className="text-gold-dark" /> Chat with an Advisor
            </a>
          </div>
        </div>
      </section>

      {/* Curriculum — three columns grouped by software/topic */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">CURRICULUM</p>
          <h2 className="font-display font-bold text-navy text-2xl md:text-3xl">What You Will Learn</h2>
        </div>

        {curriculumGroups.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumGroups.map((group) => (
              <div
                key={group.title}
                className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(15,30,61,0.04)] overflow-hidden"
              >
                <div className="bg-navy px-5 py-4">
                  <h3 className="text-white font-semibold text-sm">{group.title}</h3>
                </div>
                <ul className="p-5 space-y-1">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-navy/70 py-2 border-b border-black/5 last:border-0"
                    >
                      <span className="w-4 h-4 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={11} className="text-gold-dark" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {course.curriculum.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-white border border-black/5 rounded-xl px-4 py-3.5 text-sm text-navy/80 shadow-[0_1px_2px_rgba(15,30,61,0.04)] hover:border-gold/40 hover:shadow-[0_4px_14px_rgba(15,30,61,0.06)] transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="text-gold-dark" />
                </span>
                {item}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Practice — three columns grouped the same way */}
      <section className="bg-navy/[0.03] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">HANDS-ON EXPERIENCE</p>
            <h2 className="font-display font-bold text-navy text-2xl md:text-3xl">Practice</h2>
          </div>

          {practiceGroups.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {practiceGroups.map((group) => (
                <div
                  key={group.title}
                  className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(15,30,61,0.04)] overflow-hidden"
                >
                  <div className="bg-gold px-5 py-4">
                    <h3 className="text-navy font-semibold text-sm">{group.title}</h3>
                  </div>
                  <ul className="p-5 space-y-1">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-navy/70 py-2 border-b border-black/5 last:border-0"
                      >
                        <span className="w-4 h-4 rounded-full bg-navy/5 flex items-center justify-center shrink-0 mt-0.5">
                          <FolderKanban size={10} className="text-navy/60" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {course.projects.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 bg-white border border-black/5 text-navy text-sm font-medium px-4 py-2.5 rounded-full shadow-[0_1px_2px_rgba(15,30,61,0.04)] hover:border-gold/40 transition-colors"
                >
                  <FolderKanban size={14} className="text-gold-dark" /> {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Careers + Why Choose FSTI */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20 space-y-16">
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">WHERE THIS LEADS</p>
            <h2 className="font-display font-bold text-navy text-2xl md:text-3xl">Career Opportunities</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {course.careers.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-navy text-white rounded-xl px-4 py-3.5 text-sm font-medium shadow-[0_4px_14px_rgba(15,30,61,0.15)] hover:bg-navy-light transition-colors"
              >
                <Briefcase size={16} className="text-gold shrink-0" /> {item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-navy rounded-2xl px-6 md:px-12 py-12">
          <h3 className="font-display font-bold text-white text-2xl text-center mb-8">Why Choose FSTI?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 max-w-4xl mx-auto">
            {courseHighlights.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                <CheckCircle2 size={15} className="text-gold shrink-0 mt-0.5" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related courses */}
      {relatedFallback.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 md:pb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">KEEP EXPLORING</p>
            <h2 className="font-display font-bold text-navy text-3xl">Related Courses</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedFallback.map((c) => (
              <CourseCard key={c.slug} course={c} detailed />
            ))}
          </div>
        </section>
      )}

      <section className="pb-20">
        <CTABanner
          title="Not Sure Which Course is Right for You?"
          subtitle="Our experts will help you choose the best course based on your goals."
          buttonLabel="Talk to Our Advisor"
          href="/contact"
        />
      </section>
    </>
  );
}
