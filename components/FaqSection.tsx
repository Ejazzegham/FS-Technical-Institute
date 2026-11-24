import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Faq } from "@/lib/types";

// Accessible accordion (native <details>, no JS) + FAQPage structured data
// so Google can show the answers directly in search results.
export default function FaqSection({
  faqs,
  title,
  eyebrow = "FAQ",
  showAllLink = false,
}: {
  faqs: Faq[];
  title: string;
  eyebrow?: string;
  showAllLink?: boolean;
}) {
  if (faqs.length === 0) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <section className="max-w-3xl mx-auto px-6 lg:px-10 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="text-center mb-8">
        <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">{eyebrow}</p>
        <h2 className="font-display font-bold text-navy text-2xl md:text-3xl">{title}</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details
            key={f.id ?? f.question}
            className="group bg-white border border-black/5 rounded-xl shadow-sm open:shadow-md transition-shadow"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-sm font-semibold text-navy">
              {f.question}
              <span className="text-gold-dark text-lg leading-none transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-5 pb-5 text-sm text-navy/65 leading-relaxed">{f.answer}</p>
          </details>
        ))}
      </div>
      {showAllLink && (
        <div className="text-center mt-6">
          <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark">
            View all questions <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}
