import type { Metadata } from "next";
import SimpleHero from "@/components/SimpleHero";
import CourseFinder from "@/components/CourseFinder";
import { getCourses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Course Finder | Furqan Saeed Technical Institute",
  description: "Answer four quick questions and get course recommendations matched to your goals.",
};

export default async function CourseFinderPage() {
  const courses = await getCourses();
  return (
    <>
      <SimpleHero
        eyebrow="COURSE FINDER"
        title="Find the Right Course in 30 Seconds"
        description="Four quick questions about your interests, goals and time — we'll match you with the best-fit courses."
      />
      <section className="max-w-2xl mx-auto px-6 py-14">
        <CourseFinder courses={courses} />
      </section>
    </>
  );
}
