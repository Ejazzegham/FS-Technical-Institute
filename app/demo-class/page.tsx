import type { Metadata } from "next";
import { Check } from "lucide-react";
import SimpleHero from "@/components/SimpleHero";
import DemoClassForm from "@/components/DemoClassForm";
import { getCourses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book a Free Demo Class | Furqan Saeed Technical Institute",
  description: "Try a class at FSTI before you enrol. Pick a course and a time that suits you.",
};

export default async function DemoClassPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const [courses, { course }] = await Promise.all([getCourses(), searchParams]);
  const preselected = courses.find((c) => c.slug === course)?.title ?? "";
  return (
    <>
      <SimpleHero
        eyebrow="FREE DEMO CLASS"
        title="Try a Class Before You Enrol"
        description="Sit in on a real session, meet the instructor and see if the course is right for you — no commitment."
      />
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <h2 className="font-display font-bold text-navy text-xl mb-4">What to expect</h2>
          <ul className="space-y-3 text-sm text-navy/70">
            {["A real lesson from the course you pick", "A chat with the instructor about your goals", "Clear guidance on fees, batches and next steps", "No obligation to enrol"].map((t) => (
              <li key={t} className="flex gap-2"><Check size={16} className="text-gold-dark shrink-0 mt-0.5" /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <DemoClassForm courses={courses} defaultCourse={preselected} />
        </div>
      </section>
    </>
  );
}
