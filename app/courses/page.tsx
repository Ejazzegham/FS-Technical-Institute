import CoursesExplorer from "@/components/CoursesExplorer";
import CTABanner from "@/components/CTABanner";
import PageHero from "@/components/PageHero";
import { getCourses } from "@/lib/content";

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <>
      {/* Hero */}
      <PageHero
        breadcrumb="Home > Courses"
        title="Our Courses"
        tagline="Learn In-Demand Skills. Build Your Future."
        description="Explore our wide range of professional courses designed to provide you with practical knowledge and hands-on experience to excel in today's competitive world."
        image="/images/courses-hero.png"
        mobileImage="/images/courses-hero-mobile.png"
        alt="Explore FSTI courses — coding, data, design and more"
        theme="light"
        focus="60% center"
      />

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
