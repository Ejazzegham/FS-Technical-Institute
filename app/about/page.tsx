import Link from "next/link";
import Image from "next/image";
import { Target, Eye, Gem, Check, ArrowRight, GraduationCap } from "lucide-react";
import { getStats, getAboutContent } from "@/lib/content";
import PageHero from "@/components/PageHero";

export default async function AboutPage() {
  const [aboutStats, about] = await Promise.all([getStats("about"), getAboutContent()]);
  const missionVisionValues = [
    { icon: Target, title: "Our Mission", desc: about.mission, list: undefined as string[] | undefined },
    { icon: Eye, title: "Our Vision", desc: about.vision, list: undefined as string[] | undefined },
    { icon: Gem, title: "Our Values", desc: "", list: about.values },
  ];
  const { commitments, leadership } = about;
  return (
    <>
      {/* Hero */}
      <PageHero
        breadcrumb="Home > About Us"
        title="About Us"
        tagline={about.heroTagline}
        description={about.heroDescription}
        image="/images/about-hero.png"
        mobileImage="/images/about-hero-mobile.png"
        alt="Furqan Saeed Technical Institute — student-focused, quality education, practical learning and career growth"
        theme="light"
        focus="62% center"
        primaryCta={{ label: "Apply for Admission", href: "/admissions" }}
        secondaryCta={{ label: "Explore Courses", href: "/courses" }}
      />

      {/* Who we are */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">{about.whoEyebrow}</p>
          <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-5 leading-snug">{about.whoTitle}</h2>
          <p className="text-sm text-navy/60 leading-relaxed mb-4">{about.whoText1}</p>
          <p className="text-sm text-navy/60 leading-relaxed">{about.whoText2}</p>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-slate-800 to-navy-dark">
          <Image
            src="/images/who-we-are.jpg"
            alt="Who we are — FSTI students and instructors"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">OUR LEADERSHIP</p>
          <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-4 leading-snug">{about.leadershipTitle}</h2>
          <p className="text-sm text-navy/55 leading-relaxed">{about.leadershipText}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {leadership.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col sm:flex-row"
            >
              {member.image && (
              <div className="relative aspect-[4/5] sm:aspect-auto sm:w-[42%] sm:min-h-[320px] shrink-0">
                <Image
                  src={member.image}
                  alt={`${member.name} — ${member.role} at Furqan Saeed Technical Institute`}
                  fill
                  sizes="(max-width: 640px) 100vw, 260px"
                  className="object-cover"
                />
              </div>
              )}
              <div className="p-6 md:p-7 flex flex-col justify-center">
                <p className="text-gold-dark text-xs font-bold tracking-widest mb-1 uppercase">
                  {member.role}
                </p>
                <h3 className="font-display font-bold text-navy text-xl mb-3">{member.name}</h3>
                {member.bio.map((para, i) => (
                  <p
                    key={i}
                    className={`text-sm text-navy/60 leading-relaxed ${
                      i < member.bio.length - 1 ? "mb-3" : ""
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div className="bg-navy rounded-2xl grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {missionVisionValues.map((item) => (
            <div key={item.title} className="p-8 text-center">
              <span className="w-14 h-14 mx-auto rounded-full border-2 border-gold/40 flex items-center justify-center mb-4">
                <item.icon size={22} className="text-gold" />
              </span>
              <h3 className="font-display font-bold text-white text-lg mb-3">{item.title}</h3>
              {item.desc && (
                <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
              )}
              {item.list && (
                <ul className="text-white/70 text-sm space-y-2 text-left max-w-[220px] mx-auto mt-1">
                  {item.list.map((v) => (
                    <li key={v} className="flex items-center gap-2">
                      <Check size={14} className="text-gold shrink-0" /> {v}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 pb-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-black/5 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black/5">
          {aboutStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 px-5 py-6 justify-center">
              <span className="w-11 h-11 rounded-full bg-navy flex items-center justify-center shrink-0">
                <GraduationCap size={18} className="text-gold" />
              </span>
              <span className="leading-tight">
                <span className="block font-display font-bold text-lg text-navy">{stat.value}</span>
                <span className="block text-xs text-navy/60">{stat.label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">WHY CHOOSE US?</p>
          <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-5 leading-snug">
            Your Success is
            <br />
            Our Commitment
          </h2>
          <ul className="space-y-3 mb-7">
            {commitments.map((c) => (
              <li key={c} className="flex items-center gap-2 text-sm text-navy/70">
                <Check size={15} className="text-gold-dark shrink-0" /> {c}
              </li>
            ))}
          </ul>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Explore Courses <ArrowRight size={15} />
          </Link>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-slate-800 to-navy-dark">
          <Image
            src="/images/success-commitment.jpg"
            alt="Your success is our commitment — FSTI students at work"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>
    </>
  );
}
