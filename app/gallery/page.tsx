import Image from "next/image";
import GalleryExplorer from "@/components/GalleryExplorer";
import { GraduationCap, Trophy, Users2, CalendarDays } from "lucide-react";
import { getStats, getGalleryItems } from "@/lib/content";

const statIcons = [GraduationCap, Trophy, Users2, CalendarDays];

export default async function GalleryPage() {
  const [galleryStats, galleryItems] = await Promise.all([getStats("gallery"), getGalleryItems()]);
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 md:py-10 relative z-10">
          <p className="text-white/50 text-xs mb-4">Home &gt; Gallery</p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl mb-3">Gallery</h1>
              <p className="text-gold font-semibold mb-4">
                Glimpses of Learning, Achievements &amp; Activities
              </p>
              <p className="text-white/60 leading-relaxed max-w-md">
                Explore moments from classrooms, workshops, events, and student success
                stories at FSTI.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gradient-to-br from-navy-light to-navy-dark border border-white/10">
              <Image
                src="/images/gallery-hero.jpg"
                alt="FSTI classrooms, labs and workspaces"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter + grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <GalleryExplorer galleryItems={galleryItems} />
      </section>

      {/* Stats CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="bg-navy rounded-2xl px-6 md:px-10 py-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <span className="hidden md:flex w-14 h-14 rounded-full border-2 border-gold/40 items-center justify-center shrink-0">
              <GraduationCap size={24} className="text-gold" />
            </span>
            <div>
              <h3 className="font-display font-bold text-white text-xl">Be Part of Our Journey</h3>
              <p className="text-white/60 text-sm mt-1">
                Create, Learn, Achieve and Celebrate with FSTI.
              </p>
              <a
                href="/admissions"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-5 py-2.5 rounded-lg transition-colors mt-4"
              >
                Apply Now
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-10">
            {galleryStats.map((stat, i) => {
              const Icon = statIcons[i];
              return (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <Icon size={20} className="text-gold shrink-0" />
                  <span className="leading-tight">
                    <span className="block font-display font-bold text-white text-lg">
                      {stat.value}
                    </span>
                    <span className="block text-[11px] text-white/50">{stat.label}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
