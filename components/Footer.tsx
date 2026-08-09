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
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/images/logo.png"
              alt="FSTI logo"
              width={44}
              height={44}
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
          <p className="text-sm text-white/60 leading-relaxed">
            Empowering students with in-demand skills and practical knowledge for a better future.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {socialIcons.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social link"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 hover:border-gold hover:text-gold transition-colors"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Courses</Link></li>
            <li><Link href="/admissions" className="hover:text-gold transition-colors">Admissions</Link></li>
            <li><Link href="/gallery" className="hover:text-gold transition-colors">Gallery</Link></li>
            <li><Link href="/verification" className="hover:text-gold transition-colors">Verification</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Courses</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/courses" className="hover:text-gold transition-colors">Website Designing &amp; Developing</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Graphic Designing</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Mobile App Development</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Social Media Marketing</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">Microsoft Office</Link></li>
            <li><Link href="/courses" className="hover:text-gold transition-colors">All Courses</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-gold" /> {contactInfo.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-gold" /> {contactInfo.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-gold" /> {contactInfo.email}
            </li>
            <li className="flex items-center gap-2">
              <Clock size={15} className="text-gold" /> {contactInfo.hours}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <p className="text-sm text-white/60 mb-3">
            Subscribe to get updates on new courses and events.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 min-w-0 rounded-md px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-gold hover:bg-gold-dark text-navy text-sm font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
          {status === "done" && (
            <p className="text-xs text-gold mt-2">Thanks for subscribing!</p>
          )}
          {status === "error" && (
            <p className="text-xs text-red-400 mt-2">Something went wrong. Try again.</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
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
