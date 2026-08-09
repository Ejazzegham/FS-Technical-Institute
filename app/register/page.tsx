import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Clock, FileCheck2, Headphones } from "lucide-react";
import RegisterForm from "@/components/RegisterForm";
import { getCourses } from "@/lib/content";

const trustStrip = [
  { icon: ShieldCheck, title: "Secure", subtitle: "& Reliable" },
  { icon: Clock, title: "Save Time", subtitle: "& Hassle Free" },
  { icon: FileCheck2, title: "Easy", subtitle: "Registration" },
  { icon: Headphones, title: "24/7", subtitle: "Student Support" },
];

export default async function RegisterPage() {
  const courses = await getCourses();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-navy/50 mb-8">
          <Image src="/images/logo.png" alt="FSTI logo" width={32} height={32} className="rounded-full" />
          Furqan Saeed Technical Institute
        </Link>

        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold-dark text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full mb-3">
            Student Portal
          </span>
          <h1 className="font-display font-extrabold text-navy text-3xl">
            Student <span className="text-gold-dark">Registration</span>
          </h1>
          <span className="block w-12 h-[3px] bg-gold rounded-full mt-2 mb-3" />
          <p className="text-sm text-navy/55 max-w-lg">
            Create your student portal account below — your enrollment number is
            generated automatically and will appear on the form as soon as you start.
          </p>
        </div>

        <RegisterForm courses={courses} />
      </div>

      <div className="bg-navy">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {trustStrip.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <item.icon size={16} className="text-gold" />
              </span>
              <span className="leading-tight">
                <span className="block text-white text-sm font-semibold">{item.title}</span>
                <span className="block text-white/50 text-xs">{item.subtitle}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
