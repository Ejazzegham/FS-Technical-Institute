import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  GraduationCap,
  Users2,
  Wrench,
  Briefcase,
  Quote,
} from "lucide-react";
import StatsBar from "@/components/StatsBar";
import CourseCard from "@/components/CourseCard";
import CTABanner from "@/components/CTABanner";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import { getStats, getCourses, getTestimonials } from "@/lib/content";

const heroSlides: HeroSlide[] = [
  {
    image: "/images/hero/Dream_Bigger__Learn_Better__Go_Further_.png",
    alt: "A door opening onto a bright skyline at the top of a glowing staircase, representing the path admission at FSTI opens",
    eyebrow: "ADMISSIONS 2026 OPEN",
    title: "Dream Bigger. Learn Better. Go Further.",
    description:
      "Practical IT and digital skills training that turns ambition into a real career.",
    theme: "light",
    focus: "70% center",
    primaryCta: { label: "Apply for Admission", href: "/admissions" },
    secondaryCta: { label: "Explore Courses", href: "/courses" },
  },
  {
    image: "/images/hero/Separate_Classes_for_Boys___Girls.png",
    alt: "Separate classrooms for boys and girls, with morning and evening batch timings",
    eyebrow: "COMFORTABLE LEARNING ENVIRONMENT",
    title: "Separate Classes for Boys & Girls",
    description:
      "Morning and evening batches, so you can learn on a schedule that actually fits your day.",
    theme: "light",
    focus: "68% center",
    primaryCta: { label: "View Batch Timings", href: "/admissions" },
    secondaryCta: { label: "Explore Courses", href: "/courses" },
  },
  {
    image: "/images/hero/Master_Graphic_Design.png",
    alt: "A designer working in Photoshop and Illustrator on a colorful graphic composition",
    eyebrow: "CREATIVE ARTS PROGRAM",
    title: "Master Graphic Design",
    description:
      "Photoshop, Illustrator and real design projects, taught by working creative professionals.",
    theme: "dark",
    focus: "72% center",
    primaryCta: { label: "View Design Courses", href: "/courses" },
  },
  {
    image: "/images/hero/Become_a_Web_Developer.png",
    alt: "A student writing HTML, CSS and JavaScript code on a laptop for a web development project",
    eyebrow: "TECH & PROGRAMMING PROGRAM",
    title: "Become a Web Developer",
    description:
      "HTML, CSS and JavaScript fundamentals through to real, deployed projects.",
    theme: "dark",
    focus: "70% center",
    primaryCta: { label: "View Web Dev Courses", href: "/courses" },
  },
  {
    image: "/images/hero/Empowering_Minds__Building_Futures_.png",
    alt: "FSTI Technical Institute logo — Professional IT & Digital Skills Training Institute",
    eyebrow: "WELCOME TO FSTI",
    title: "Empowering Minds. Building Futures.",
    description:
      "Professional IT & digital skills training designed to launch your career.",
    theme: "light",
    focus: "68% center",
    primaryCta: { label: "Apply Now", href: "/admissions" },
    secondaryCta: { label: "About FSTI", href: "/about" },
  },
  {
    image: "/images/hero/Admissions_Open_Enroll_Now.png",
    alt: "Admissions open — enroll now. Build skills, build career, build future.",
    eyebrow: "ENROLL TODAY",
    title: "Admissions Open — Enroll Now",
    description:
      "Build Skills. Build Career. Build Future. Limited seats for morning and evening batches — secure yours today.",
    theme: "light",
    focus: "70% center",
    primaryCta: { label: "Apply for Admission", href: "/admissions" },
    secondaryCta: { label: "Explore Courses", href: "/courses" },
  },
  {
    image: "/images/hero/Build_Your_Career.png",
    alt: "Icons representing coding, design, growth and global career opportunities around a graduation cap",
    eyebrow: "SKILLS FOR THE FUTURE",
    title: "Build Skills. Build Your Career.",
    description:
      "From coding and design to digital tools — practical training mapped directly to real career growth.",
    theme: "light",
    focus: "55% center",
    primaryCta: { label: "Explore Courses", href: "/courses" },
    secondaryCta: { label: "Apply for Admission", href: "/admissions" },
  },
];

const whyChooseUs = [
  {
    title: "Expert Instructors",
    desc: "Learn from qualified and industry-experienced trainers.",
    icon: Users2,
  },
  {
    title: "Hands-on Training",
    desc: "Practical learning with real projects and tools.",
    icon: Wrench,
  },
  {
    title: "Career Support",
    desc: "Guidance for jobs, freelancing and career growth.",
    icon: Briefcase,
  },
  {
    title: "Modern Lab & Tools",
    desc: "Access to latest software and technology.",
    icon: GraduationCap,
  },
];

export default async function HomePage() {
  const [stats, courses, testimonials] = await Promise.all([
    getStats("home"),
    getCourses(),
    getTestimonials(),
  ]);
  return (
    <>
      {/* Hero */}
      <HeroSlider slides={heroSlides} />

      <StatsBar stats={stats} />

      {/* Popular courses */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">POPULAR COURSES</p>
          <h2 className="font-display font-bold text-navy text-3xl">Learn In-Demand Skills</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 8).map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            View All Courses <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Why choose us + About snippet */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">WHY CHOOSE US?</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-navy" />
                </span>
                <div>
                  <h4 className="font-semibold text-navy text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-navy/55 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">ABOUT US</p>
            <h2 className="font-display font-bold text-navy text-2xl mb-4 leading-snug">
              Shaping Futures Through Quality Education
            </h2>
            <p className="text-sm text-navy/60 leading-relaxed mb-6">
              Furqan Saeed Technical Institute is committed to delivering quality technical
              education and practical training to empower students with skills for a
              successful career.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Learn More About Us <ArrowRight size={15} />
            </Link>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-navy to-navy-dark border border-black/5">
            <Image
              src="/images/who-we-are.jpg"
              alt="Furqan Saeed Technical Institute students and campus"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="pb-20">
        <CTABanner
          title="Ready to Start Your Journey?"
          subtitle="Join thousands of students who are building successful careers."
          buttonLabel="Apply Now"
        />
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="text-center mb-12">
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">
            WHAT OUR STUDENTS SAY
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-black/5 rounded-xl p-6 shadow-sm relative"
            >
              <Quote size={26} className="text-gold/30 mb-3" />
              <p className="text-sm text-navy/70 leading-relaxed mb-5">{t.quote}</p>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center text-navy font-semibold text-sm">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-navy/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
