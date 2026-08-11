import Link from "next/link";
import Image from "next/image";
import { Target, Eye, Gem, Check, ArrowRight, GraduationCap } from "lucide-react";
import { getStats } from "@/lib/content";
import PageHero from "@/components/PageHero";

const missionVisionValues = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To deliver quality technical education and practical training that empowers students to achieve their career goals and become responsible professionals.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "To be a leading technical institute, recognized for excellence in education, innovation, and producing skilled professionals for a better tomorrow.",
  },
  {
    icon: Gem,
    title: "Our Values",
    list: ["Quality Education", "Practical Learning", "Student Success", "Integrity & Innovation"],
  },
];

const commitments = [
  "Experienced and Certified Instructors",
  "Modern Labs & Advanced Tools",
  "Industry-Oriented Curriculum",
  "Hands-on Practical Training",
  "Career Guidance & Support",
];

const leadership = [
  {
    name: "Mr. Furqan Saeed",
    role: "Admin",
    image: "/images/team/admin-furqan-saeed.jpg",
    bio: [
      "Mr. Furqan Saeed is a dedicated and responsible administrator who plays an important role in the smooth and effective management of the institute. He focuses on maintaining professional standards, student support, administrative coordination, and a positive learning environment.",
      "With his organized approach and commitment to excellence, Mr. Furqan Saeed helps ensure that the institute's academic and administrative activities run efficiently. His goal is to support students and staff while contributing to the continued growth and success of FS Technical Institute.",
    ],
  },
  {
    name: "Mr. Mubashir Mukhtar",
    role: "Principal",
    image: "/images/team/principal-mubashir-mukhtar.jpg",
    bio: [
      "Mr. Mubashir Mukhtar is a dedicated and visionary Computer/IT Principal committed to providing quality technical education and practical digital skills. With a strong focus on computer education, professional IT training, and skill development, he encourages students to learn, innovate, and prepare for the demands of the modern digital world.",
      "Under his leadership, the institute aims to create a professional learning environment where students can develop practical computer skills, confidence, and career-ready expertise. His mission is to empower students with knowledge and skills that help them build a successful future in the technology-driven world.",
    ],
  },
];

export default async function AboutPage() {
  const aboutStats = await getStats("about");
  return (
    <>
      {/* Hero */}
      <PageHero
        breadcrumb="Home > About Us"
        title="About Us"
        tagline="Empowering Students. Building Futures."
        description="Furqan Saeed Technical Institute is dedicated to providing quality technical education and practical training to help students gain in-demand skills and build successful careers."
        image="/images/about-hero.png"
        alt="Furqan Saeed Technical Institute — student-focused, quality education, practical learning and career growth"
        theme="light"
        focus="62% center"
        primaryCta={{ label: "Apply for Admission", href: "/admissions" }}
        secondaryCta={{ label: "Explore Courses", href: "/courses" }}
      />

      {/* Who we are */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">WHO WE ARE</p>
          <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-5 leading-snug">
            Shaping Futures Through
            <br />
            Quality Education
          </h2>
          <p className="text-sm text-navy/60 leading-relaxed mb-4">
            At Furqan Saeed Technical Institute, we believe in empowering individuals through
            quality education, practical training, and continuous learning. Our
            industry-focused courses are designed to equip students with the skills and
            confidence needed to succeed in today&apos;s competitive world.
          </p>
          <p className="text-sm text-navy/60 leading-relaxed">
            We are committed to building a community of learners, innovators, and
            professionals who are ready to make a difference in the world.
          </p>
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
          <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-4 leading-snug">
            Meet the People Behind FSTI
          </h2>
          <p className="text-sm text-navy/55 leading-relaxed">
            Guided by experienced leadership committed to academic excellence, professional
            standards, and student success.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {leadership.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="relative aspect-[4/5] sm:aspect-auto sm:w-[42%] sm:min-h-[320px] shrink-0">
                <Image
                  src={member.image}
                  alt={`${member.name} — ${member.role} at Furqan Saeed Technical Institute`}
                  fill
                  sizes="(max-width: 640px) 100vw, 260px"
                  className="object-cover"
                />
              </div>
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
