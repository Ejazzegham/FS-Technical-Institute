import Image from "next/image";
import Link from "next/link";
import { GraduationCap, BookOpen, Award, Monitor, Users2 } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import { getContactInfo } from "@/lib/content";

const features = [
  { icon: BookOpen, label: "Quality\nEducation" },
  { icon: Award, label: "Expert\nTrainers" },
  { icon: Monitor, label: "Modern\nLabs" },
  { icon: Users2, label: "Career\nSupport" },
];

export default async function LoginPage() {
  const contactInfo = await getContactInfo();
  return (
    <div className="lg:h-screen lg:overflow-hidden grid lg:grid-cols-2 bg-white">
      {/* Left branding / info panel — hidden on small screens */}
      <div className="relative hidden lg:flex flex-col justify-start bg-navy overflow-hidden px-12 py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-navy-dark" />
        <GraduationCap size={140} className="absolute -bottom-8 -right-8 text-white/5 rotate-[-8deg]" />
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />

        <div className="relative z-10 flex flex-col items-center pt-6 text-center">
          <Link href="/">
            <Image
              src="/images/logo-v2.png"
              alt="Furqan Saeed Technical Institute"
              width={240}
              height={240}
              priority
              className="drop-shadow-2xl"
            />
          </Link>
          <p className="font-display font-extrabold text-white text-lg tracking-wide mt-4">
            Furqan Saeed Technical Institute
          </p>
          <p className="text-white/55 text-sm mt-1.5">Contact: {contactInfo.phone}</p>
        </div>
      </div>

      {/* Right column: sign-in card */}
      <div className="relative flex flex-col justify-center px-6 sm:px-10 py-8 lg:py-6 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/5 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-navy/5 blur-3xl"
        />

        <div className="relative w-full max-w-md mx-auto">
          <Link href="/" className="flex lg:hidden items-center gap-3 mb-6 justify-center">
            <Image
              src="/images/logo-v2.png"
              alt="FSTI logo"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
            <span className="leading-tight">
              <span className="block font-display font-extrabold text-navy text-base">
                FURQAN SAEED
              </span>
              <span className="block text-[10px] font-semibold text-gold-dark tracking-widest -mt-0.5">
                TECHNICAL INSTITUTE
              </span>
            </span>
          </Link>

          <span className="hidden lg:inline-flex items-center gap-1.5 bg-gold/10 text-gold-dark text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full mb-3">
            Student Sign In
          </span>

          <LoginForm />

          <div className="grid grid-cols-4 gap-3 mt-6 lg:hidden">
            {features.map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center gap-1.5">
                <span className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                  <f.icon size={16} className="text-gold-dark" />
                </span>
                <span className="text-[10px] text-navy/50 leading-tight whitespace-pre-line">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
