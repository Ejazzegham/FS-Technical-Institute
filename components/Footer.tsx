"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { socialIcons } from "@/components/SocialIcons";
import { contactInfo as defaultContactInfo } from "@/lib/data";
import type { ContactInfo } from "@/lib/content";

export default function Footer({ contactInfo = defaultContactInfo }: { contactInfo?: ContactInfo }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

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
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-9 md:gap-x-8 lg:gap-x-10 divide-y divide-white/10 md:divide-y-0">
        {/* Brand */}
        <div className="lg:col-span-1 flex flex-col items-center text-center md:items-start md:text-left">
          <div className="flex flex-col items-center md:flex-row md:items-center gap-3 mb-4">
            <Image
              src="/images/logo.png"
              alt="FSTI logo"
              width={48}
              height={48}
              className="rounded-full object-contain"
            />
            <span className="leading-tight">
              <span className="block font-display font-extrabold text-white text-base">
                FURQAN SAEED
              </span>
              <span className="block text-[10px] font-semibold text-gold tracking-widest -mt-1">
                TECHNICAL INSTITUTE
              </span>
            </span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-[280px] md:max-w-none">
            Empowering students with in-demand skills and practical knowledge for a better future.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {socialIcons.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social link"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:border-gold hover:text-gold hover:bg-white/5 transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-9 md:pt-0 flex flex-col items-center text-center md:items-start md:text-left">
          <h4 className="font-semibold mb-4 text-[15px] tracking-wide relative pb-2 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:h-[2px] after:w-8 after:bg-gold-dark">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Courses</Link></li>
            <li><Link href="/admissions" className="hover:text-gold transition-colors">Admissions</Link></li>
            <li><Link href="/gallery" className="hover:text-gold transition-colors">Gallery</Link></li>
            <li><Link href="/verification" className="hover:text-gold transition-colors">Verification</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Courses */}
        <div className="pt-9 md:pt-0 flex flex-col items-center text-center md:items-start md:text-left">
          <h4 className="font-semibold mb-4 text-[15px] tracking-wide relative pb-2 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:h-[2px] after:w-8 after:bg-gold-dark">
            Courses
          </h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link href="/courses" className="hover:text-gold transition-colors">Website Designing &amp; Developing</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Graphic Designing</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Mobile App Development</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Social Media Marketing</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Microsoft Office</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">All Courses</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="pt-9 md:pt-0 flex flex-col items-center text-center md:items-start md:text-left">
          <h4 className="font-semibold mb-4 text-[15px] tracking-wide relative pb-2 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:h-[2px] after:w-8 after:bg-gold-dark">
            Contact Us
          </h4>
          <ul className="space-y-3.5 text-sm text-white/60 w-full max-w-[240px] md:max-w-none">
            <li className="flex items-start gap-3 justify-center md:justify-start text-left">
              <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <MapPin size={13} className="text-gold" />
              </span>
              {contactInfo.address}
            </li>
            <li className="flex items-center gap-3 justify-center md:justify-start text-left">
              <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Phone size={13} className="text-gold" />
              </span>
              {contactInfo.phone}
            </li>
            <li className="flex items-center gap-3 justify-center md:justify-start text-left">
              <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Mail size={13} className="text-gold" />
              </span>
              {contactInfo.email}
            </li>
            <li className="flex items-center gap-3 justify-center md:justify-start text-left">
              <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Clock size={13} className="text-gold" />
              </span>
              {contactInfo.hours}
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="pt-9 md:pt-0 flex flex-col items-center text-center md:items-start md:text-left">
          <h4 className="font-semibold mb-4 text-[15px] tracking-wide relative pb-2 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:h-[2px] after:w-8 after:bg-gold-dark">
            Newsletter
          </h4>
          <p className="text-sm text-white/60 mb-4 max-w-[260px] md:max-w-none">
            Subscribe to get updates on new courses and events.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full max-w-[280px] md:max-w-none">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 min-w-0 rounded-lg px-3.5 py-2.5 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-gold hover:bg-gold-dark text-navy text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60 shrink-0"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
          {status === "done" && (
            <p className="text-xs text-gold mt-2.5">Thanks for subscribing!</p>
          )}
          {status === "error" && (
            <p className="text-xs text-red-400 mt-2.5">Something went wrong. Try again.</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 text-xs text-white/50 text-center">
          <p>© {new Date().getFullYear()} Furqan Saeed Technical Institute. All Rights Reserved.</p>
          <a
            href="https://hz-technology.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            Powered by HZ-Technology
          </a>
        </div>
      </div>
    </footer>
  );
}
