import Image from "next/image";
import CoursesExplorer from "@/components/CoursesExplorer";
import CTABanner from "@/components/CTABanner";
import { getCourses } from "@/lib/content";

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 md:py-10 relative z-10">
          <p className="text-white/50 text-xs mb-4">Home &gt; Courses</p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl mb-3">Our Courses</h1>
              <p className="text-gold font-semibold mb-4">
                Learn In-Demand Skills. Build Your Future.
              </p>
              <p className="text-white/60 leading-relaxed max-w-md">
                Explore our wide range of professional courses designed to provide you with
                practical knowledge and hands-on experience to excel in today&apos;s
                competitive world.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gradient-to-br from-navy-light to-navy-dark border border-white/10">
              <Image
                src="/images/courses-hero.jpg"
                alt="Explore FSTI courses"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category explorer */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">COURSE CATEGORIES</p>
          <h2 className="font-display font-bold text-navy text-3xl">Choose From In-Demand Fields</h2>
        </div>

        <p className="text-center text-gold-dark text-xs font-bold tracking-widest mb-6">
          POPULAR COURSES
        </p>

        <CoursesExplorer courses={courses} />
      </section>

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
