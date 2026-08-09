import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  PlayCircle,
  GraduationCap,
  Users2,
  Wrench,
  Briefcase,
  Quote,
} from "lucide-react";
import StatsBar from "@/components/StatsBar";
import CourseCard from "@/components/CourseCard";
import CTABanner from "@/components/CTABanner";
import { getStats, getCourses, getTestimonials } from "@/lib/content";

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
      <section className="relative bg-navy overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 md:py-10 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <p className="text-gold text-xs font-bold tracking-widest mb-2">
              BUILD SKILLS. BUILD YOUR FUTURE
            </p>
            <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl leading-tight">
              Empowering Minds.
              <br />
              <span className="text-gold">Building Futures.</span>
            </h1>
            <p className="text-white/60 mt-3 max-w-md leading-relaxed text-sm">
              Quality technical education to help you gain in-demand skills, start your
              career and shape a better tomorrow.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Explore Courses <ArrowRight size={16} />
              </Link>
              <button className="inline-flex items-center gap-2 border border-white/25 hover:border-gold text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
                <PlayCircle size={18} /> Watch Intro
              </button>
            </div>
          </div>

          <div className="relative hidden sm:block">
            <div className="relative rounded-2xl overflow-hidden aspect-[1717/916] bg-gradient-to-br from-navy-light to-navy-dark border border-white/10">
              <Image
                src="/images/home-hero.png"
                alt="FSTI Technical Institute — modern IT labs, practical skills and career growth"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-5 -right-2 md:-right-6 bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center text-center shadow-xl">
              <GraduationCap size={18} className="text-gold-dark mb-1" />
              <span className="text-[9px] text-navy/60 leading-tight">Admissions</span>
              <span className="font-display font-bold text-navy text-sm leading-tight">Open</span>
              <span className="text-[9px] text-navy/60">[Add intake term]</span>
            </div>
          </div>
        </div>
      </section>

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
