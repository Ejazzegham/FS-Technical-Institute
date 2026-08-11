import VerificationForm from "@/components/VerificationForm";
import PageHero from "@/components/PageHero";
import { FileSearch, GraduationCap, BadgeCheck } from "lucide-react";

const steps = [
  {
    icon: FileSearch,
    title: "Enter Serial Number",
    text: "Type the serial / enrollment number printed on the student's certificate or enrollment card.",
  },
  {
    icon: BadgeCheck,
    title: "Instant Lookup",
    text: "We check it against our official records and pull up the matching student profile.",
  },
  {
    icon: GraduationCap,
    title: "View Full Details",
    text: "See the diploma completed, duration, marks, grade and current status — all in one place.",
  },
];

export default function VerificationPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        breadcrumb="Home > Verification"
        title="Student Verification"
        tagline="Confirm a Record in Seconds."
        description="Enter a student's serial number to instantly verify their diploma, duration, marks, and enrollment status with FSTI."
        image="/images/verification-hero.png"
        alt="FSTI Student Verification — secure verification, fast process, accurate records and data protection"
        theme="light"
        focus="66% center"
      />

      {/* Lookup */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <VerificationForm />
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">HOW IT WORKS</p>
          <h2 className="font-display font-bold text-navy text-2xl md:text-3xl">
            Three Simple Steps
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.title}
              className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 text-center"
            >
              <span className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mx-auto mb-4">
                <step.icon size={20} className="text-gold" />
              </span>
              <h3 className="font-display font-bold text-navy mb-2">{step.title}</h3>
              <p className="text-sm text-navy/55 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
