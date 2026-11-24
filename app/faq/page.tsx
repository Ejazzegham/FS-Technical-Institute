import type { Metadata } from "next";
import SimpleHero from "@/components/SimpleHero";
import FaqSection from "@/components/FaqSection";
import CTABanner from "@/components/CTABanner";
import { getFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQs | Furqan Saeed Technical Institute",
  description: "Answers to common questions about admissions, fees, courses and classes at FSTI.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const categories = Array.from(new Set(faqs.map((f) => f.category || "General")));
  return (
    <>
      <SimpleHero
        eyebrow="HELP CENTER"
        title="Frequently Asked Questions"
        description="Everything you need to know about admissions, fees, courses and classes."
      />
      <div className="pt-16">
        {faqs.length === 0 && <p className="text-center text-sm text-navy/50 pb-16">No questions published yet.</p>}
        {categories.map((cat) => (
          <FaqSection key={cat} eyebrow={cat.toUpperCase()} title={cat} faqs={faqs.filter((f) => (f.category || "General") === cat)} />
        ))}
      </div>
      <section className="pb-20">
        <CTABanner
          title="Still have a question?"
          subtitle="Our team is happy to help you choose the right path."
          buttonLabel="Contact Us"
          href="/contact"
        />
      </section>
    </>
  );
}
