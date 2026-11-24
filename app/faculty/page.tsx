import type { Metadata } from "next";
import Image from "next/image";
import { Award, BookOpenCheck } from "lucide-react";
import SimpleHero from "@/components/SimpleHero";
import CTABanner from "@/components/CTABanner";
import { getInstructors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Faculty | Furqan Saeed Technical Institute",
  description: "Meet the experienced instructors who teach at FSTI.",
};

function initials(name: string) {
  return name.replace(/^(mr|ms|mrs|dr)\.?\s+/i, "").split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default async function FacultyPage() {
  const instructors = await getInstructors();
  return (
    <>
      <SimpleHero
        eyebrow="OUR FACULTY"
        title="Learn From Experienced Instructors"
        description="Practical, industry-minded trainers who focus on real projects and student success."
      />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        {instructors.length === 0 && <p className="text-center text-sm text-navy/50">Faculty profiles will appear here soon.</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((p) => (
            <article key={p.id ?? p.name} className="bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
              <div className="relative h-48 bg-gradient-to-br from-navy to-navy-dark flex items-center justify-center">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                ) : (
                  <span className="w-20 h-20 rounded-full bg-white/10 border border-gold/40 text-gold font-display font-bold text-2xl flex items-center justify-center">
                    {initials(p.name)}
                  </span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="font-display font-bold text-navy text-lg">{p.name}</h2>
                <p className="text-gold-dark text-xs font-bold tracking-wide mb-3">{p.title}</p>
                <p className="text-sm text-navy/60 leading-relaxed mb-4 flex-1">{p.bio}</p>
                <ul className="space-y-1.5 text-xs text-navy/65">
                  {p.expertise && (
                    <li className="flex items-center gap-2"><BookOpenCheck size={13} className="text-gold-dark" /> {p.expertise}</li>
                  )}
                  {p.experience && (
                    <li className="flex items-center gap-2"><Award size={13} className="text-gold-dark" /> {p.experience} experience</li>
                  )}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="pb-20">
        <CTABanner title="Try a class before you enrol" subtitle="Book a free demo session with one of our instructors." buttonLabel="Book a Demo Class" href="/demo-class" />
      </section>
    </>
  );
}
