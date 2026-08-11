import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  MapPinned,
  Headphones,
  ArrowRight,
} from "lucide-react";
import AdmissionForm from "@/components/AdmissionForm";
import PageHero from "@/components/PageHero";
import { admissionProcess, requiredDocuments } from "@/lib/data";
import { getCourses } from "@/lib/content";

const docIcons = [FileText, ImageIcon, ShieldCheck, MapPinned];

export default async function AdmissionsPage() {
  const courses = await getCourses();
  return (
    <>
      {/* Hero */}
      <PageHero
        breadcrumb="Home > Admissions"
        title="Admissions Open"
        tagline="Your Future Starts Here."
        description="Join Furqan Saeed Technical Institute and take the first step towards a successful and rewarding career. Our admission process is simple, transparent, and student-friendly."
        image="/images/admission-hero.png"
        mobileImage="/images/admission-hero-mobile.png"
        alt="FSTI Admissions Open — Enroll Now. Build Skills, Build Career, Build Future."
        theme="light"
        focus="55% center"
        primaryCta={{ label: "Start Your Application", href: "#admission-form" }}
      />

      {/* Form + process */}
      <section id="admission-form" className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20 grid lg:grid-cols-2 gap-8">
        <AdmissionForm courses={courses} />

        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-7">
            <h2 className="font-display font-bold text-navy text-xl mb-6">Admission Process</h2>
            <ol className="space-y-6">
              {admissionProcess.map((step, i) => (
                <li key={step.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    {i < admissionProcess.length - 1 && (
                      <span className="w-px flex-1 bg-black/10 mt-1" />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="font-semibold text-navy text-sm mb-1">{step.title}</p>
                    <p className="text-xs text-navy/50 leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-7">
            <h2 className="font-display font-bold text-navy text-lg mb-4">Required Documents</h2>
            <ul className="space-y-3">
              {requiredDocuments.map((doc, i) => {
                const Icon = docIcons[i % docIcons.length];
                return (
                  <li key={doc} className="flex items-center gap-3 text-sm text-navy/70">
                    <Icon size={16} className="text-gold-dark shrink-0" /> {doc}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-navy rounded-2xl p-6 md:p-7 flex flex-col gap-4">
            <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
              <Headphones size={20} className="text-gold" />
            </span>
            <div>
              <h3 className="font-display font-bold text-white text-lg mb-1">Need Help?</h3>
              <p className="text-white/55 text-sm">
                Our admission advisors are here to help you.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 self-start bg-gold hover:bg-gold-dark text-navy font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Contact Us <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
