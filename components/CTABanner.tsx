import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function CTABanner({
  title,
  subtitle,
  buttonLabel,
  href = "/courses",
}: {
  title: string;
  subtitle: string;
  buttonLabel: string;
  href?: string;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-navy rounded-2xl px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <span className="hidden md:flex w-14 h-14 rounded-full border-2 border-gold/40 items-center justify-center shrink-0">
            <GraduationCap size={24} className="text-gold" />
          </span>
          <div>
            <h3 className="font-display font-bold text-white text-xl">{title}</h3>
            <p className="text-white/60 text-sm mt-1">{subtitle}</p>
          </div>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-6 py-3 rounded-lg transition-colors shrink-0"
        >
          {buttonLabel} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
