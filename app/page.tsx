import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import StatsBar from "@/components/StatsBar";
import CourseCard from "@/components/CourseCard";
import CTABanner from "@/components/CTABanner";
import HeroSlider from "@/components/HeroSlider";
import FaqSection from "@/components/FaqSection";
import EventSpotlight from "@/components/EventSpotlight";
import { getStats, getCourses, getEvents, getHeroSlides, getHomeContent, getFaqs } from "@/lib/content";
import { iconFor } from "@/lib/iconMap";

export default async function HomePage() {
  const [stats, courses, events, heroSlides, home, faqs] = await Promise.all([
    getStats("home"),
    getCourses(),
    getEvents(),
    getHeroSlides("home"),
    getHomeContent(),
    getFaqs(),
  ]);
  return (
    <>
      {/* Hero */}
      {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}

      {/* Events & highlights — managed from /admin/events */}
      <EventSpotlight events={events} />

      {stats.length > 0 && <StatsBar stats={stats} />}

      {/* Popular courses */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">{home.popularEyebrow}</p>
          <h2 className="font-display font-bold text-navy text-3xl">{home.popularTitle}</h2>
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
            {home.whyChooseUs.map((item) => {
              const Icon = iconFor(item.icon);
              return (
              <div key={item.title} className="flex items-start gap-3">
                <span className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-navy" />
                </span>
                <div>
                  <h4 className="font-semibold text-navy text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-navy/55 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">{home.aboutEyebrow}</p>
            <h2 className="font-display font-bold text-navy text-2xl mb-4 leading-snug">{home.aboutTitle}</h2>
            <p className="text-sm text-navy/60 leading-relaxed mb-6">{home.aboutText}</p>
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

      <FaqSection faqs={faqs.slice(0, 5)} title="Frequently Asked Questions" showAllLink />

      {home.ctaTitle && (
        <section className="pb-20">
          <CTABanner title={home.ctaTitle} subtitle={home.ctaSubtitle} buttonLabel={home.ctaButton} />
        </section>
      )}
    </>
  );
}
