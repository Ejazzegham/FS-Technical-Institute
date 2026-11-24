"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight, Send } from "lucide-react";
import { resolveSocialLinks, type SocialLink } from "@/components/SocialIcons";
import type { ContactInfo } from "@/lib/content";

type FooterCourse = { slug: string; title: string };

const MAX_FOOTER_COURSES = 6;

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-display font-bold text-white text-[15px] tracking-wide relative pb-3 mb-5 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:h-[2px] after:w-8 after:rounded-full after:bg-gold">
      {children}
    </h4>
  );
}

const linkClass =
  "group inline-flex items-center gap-1.5 text-sm text-white/65 hover:text-gold transition-colors";

export default function Footer({
  contactInfo,
  courses,
  quickLinks = [],
  social = [],
}: {
  contactInfo: ContactInfo;
  courses?: FooterCourse[];
  quickLinks?: { href: string; label: string }[];
  social?: SocialLink[];
}) {
  const socialLinks = resolveSocialLinks(social);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  // Link every course to its own detail page (/courses/<slug>). Uses the live
  // course list when provided, falling back to the built-in list.
  const footerCourses = (courses ?? [])
    .filter((c) => c.slug)
    .slice(0, MAX_FOOTER_COURSES);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="relative bg-navy-dark text-white overflow-hidden">
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Newsletter band */}
      <div className="border-b border-white/10 bg-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div className="max-w-md">
            <h3 className="font-display font-bold text-xl text-white">Stay in the loop</h3>
            <p className="text-sm text-white/60 mt-1">
              Subscribe for updates on new courses, batches and events.
            </p>
          </div>
          <div className="w-full lg:w-auto lg:min-w-[420px]">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                className="flex-1 rounded-full px-5 py-3 text-sm text-navy bg-white placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy text-sm font-semibold px-6 py-3 rounded-full transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
                <Send size={14} />
              </button>
            </form>
            <div className="h-5 mt-2 text-xs">
              {status === "done" && <p className="text-gold">Thanks for subscribing!</p>}
              {status === "error" && <p className="text-red-400">Something went wrong. Try again.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-10">
        {/* Brand */}
        <div className="lg:col-span-4 flex flex-col items-center text-center md:items-start md:text-left">
          <Link href="/" className="flex items-center gap-3 mb-5">
            <Image
              src="/images/logo-v2.png"
              alt="FSTI logo"
              width={48}
              height={48}
              className="rounded-full object-contain"
            />
            <span className="leading-tight text-left">
              <span className="block font-display font-extrabold text-white text-base tracking-tight">
                FURQAN SAEED
              </span>
              <span className="block text-[10px] font-semibold text-gold tracking-[0.2em] -mt-0.5">
                TECHNICAL INSTITUTE
              </span>
            </span>
          </Link>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm">
            Empowering students with in-demand skills and practical knowledge for a better future.
          </p>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm mt-3">
            Furqan Saeed Technical Institute offers job-oriented professional courses in IT, software and web
            development, graphic design, digital marketing, freelancing and more. With experienced instructors,
            hands-on projects, separate classes for boys and girls, and flexible online classes, we help
            students build real skills and start their careers with confidence.
          </p>
          <div className="flex items-center gap-2.5 mt-6">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-gold hover:text-gold hover:bg-white/5 transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2 flex flex-col items-center text-center md:items-start md:text-left">
          <ColumnTitle>Quick Links</ColumnTitle>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Courses */}
        <div className="lg:col-span-3 flex flex-col items-center text-center md:items-start md:text-left">
          <ColumnTitle>Our Courses</ColumnTitle>
          <ul className="space-y-2.5">
            {footerCourses.map((c) => (
              <li key={c.slug}>
                <Link href={`/courses/${c.slug}`} className={linkClass}>
                  {c.title}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link
                href="/courses"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-white transition-colors"
              >
                View All Courses
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3 flex flex-col items-center text-center md:items-start md:text-left">
          <ColumnTitle>Contact Us</ColumnTitle>
          <ul className="space-y-4 text-sm text-white/65 w-full max-w-[280px] md:max-w-none">
            <li className="flex items-start gap-3 justify-center md:justify-start text-left">
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-gold" />
              </span>
              <span className="pt-1 leading-snug">{contactInfo.address}</span>
            </li>
            <li className="flex items-center gap-3 justify-center md:justify-start text-left">
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Phone size={14} className="text-gold" />
              </span>
              <a href={`tel:${contactInfo.phone}`} className="hover:text-gold transition-colors">
                {contactInfo.phone}
              </a>
            </li>
            <li className="flex items-center gap-3 justify-center md:justify-start text-left">
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Mail size={14} className="text-gold" />
              </span>
              <a href={`mailto:${contactInfo.email}`} className="hover:text-gold transition-colors break-all">
                {contactInfo.email}
              </a>
            </li>
            <li className="flex items-center gap-3 justify-center md:justify-start text-left">
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Clock size={14} className="text-gold" />
              </span>
              {contactInfo.hours}
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 text-xs text-white/50 text-center">
          <p>© {new Date().getFullYear()} Furqan Saeed Technical Institute. All Rights Reserved.</p>
          <div className="flex items-center gap-x-5 gap-y-1 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms of Use
            </Link>
            <a
              href="https://bahutechnology.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Powered by Bahu Technology
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
