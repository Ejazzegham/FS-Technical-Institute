"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Menu,
  X,
  LogIn,
  Home,
  Info,
  BookOpen,
  Video,
  Printer,
  Images,
  GraduationCap,
  ShieldCheck,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { socialIcons } from "@/components/SocialIcons";
import { navLinks, contactInfo as defaultContactInfo } from "@/lib/data";
import type { ContactInfo } from "@/lib/content";

// Icon per nav link, keyed by href, so the mobile drawer reads as a proper
// menu (icon + label) instead of a bare list of text links.
const navIcons: Record<string, LucideIcon> = {
  "/": Home,
  "/about": Info,
  "/courses": BookOpen,
  "/online-class": Video,
  "/printing-press": Printer,
  "/gallery": Images,
  "/admissions": GraduationCap,
  "/verification": ShieldCheck,
  "/contact": PhoneCall,
};

export default function Header({ contactInfo = defaultContactInfo }: { contactInfo?: ContactInfo }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close the drawer on route change (adjust state during render, not in an effect).
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Lock body scroll and allow Escape to close while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="hidden md:flex items-center justify-between bg-navy-dark text-white text-xs px-6 lg:px-10 py-2">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <Phone size={13} />
            <a href={`tel:${contactInfo.phone}`} className="hover:text-gold transition-colors">
              {contactInfo.phone}
            </a>
          </span>
          <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 hover:text-gold transition-colors">
            <Mail size={13} /> {contactInfo.email}
          </a>
          <span className="flex items-center gap-2 text-white/70">
            <MapPin size={13} /> {contactInfo.address}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/portal" className="hover:text-gold transition-colors font-medium">
            Student Portal
          </Link>
          <span className="w-px h-3 bg-white/20" />
          <span className="text-white/70">Follow Us:</span>
          {socialIcons.map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label="social link"
              className="hover:text-gold transition-colors"
            >
              <Icon size={13} />
            </a>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-black/5 shadow-[0_1px_2px_rgba(15,30,61,0.04)] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-2.5 lg:py-3 gap-3">
          <Link href="/" className="flex items-center gap-2.5 lg:gap-3 shrink-0 min-w-0">
            <Image
              src="/images/logo.png"
              alt="Furqan Saeed Technical Institute logo"
              width={44}
              height={44}
              className="w-9 h-9 lg:w-11 lg:h-11 rounded-full object-contain shrink-0"
            />
            <span className="leading-tight min-w-0">
              <span className="block font-display font-extrabold text-navy text-[13px] sm:text-base lg:text-lg tracking-tight whitespace-nowrap">
                FURQAN SAEED
              </span>
              <span className="block text-[8.5px] sm:text-[10px] lg:text-[11px] font-semibold text-gold-dark tracking-widest -mt-0.5 whitespace-nowrap">
                TECHNICAL INSTITUTE
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    active ? "text-gold-dark" : "text-navy/80 hover:text-navy"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-gold-dark" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admissions"
              className="hidden md:inline-flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy-light transition-colors"
            >
              Apply Now <ArrowRight size={15} />
            </Link>
            <button
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-navy/10 bg-navy/[0.03] text-navy hover:bg-navy hover:text-white hover:border-navy transition-colors"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav-drawer"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer backdrop */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-navy-dark/60 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile slide-in drawer */}
      <nav
        id="mobile-nav-drawer"
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 right-0 z-[70] w-[86%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-navy to-navy-light">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="Furqan Saeed Technical Institute logo"
              width={36}
              height={36}
              className="rounded-full object-contain bg-white/10"
            />
            <span className="leading-tight">
              <span className="block font-display font-extrabold text-white text-sm tracking-tight">
                FURQAN SAEED
              </span>
              <span className="block text-[9px] font-semibold text-gold tracking-widest -mt-0.5">
                TECHNICAL INSTITUTE
              </span>
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-2 -mr-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const Icon = navIcons[link.href] ?? Home;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`group relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl text-[14.5px] font-medium transition-colors ${
                      active ? "text-gold-dark bg-gold/10" : "text-navy/75 hover:bg-navy/[0.04] hover:text-navy"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full transition-colors ${
                        active ? "bg-gold-dark" : "bg-transparent"
                      }`}
                    />
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        active ? "bg-gold-dark/15 text-gold-dark" : "bg-navy/5 text-navy/50 group-hover:text-navy/70"
                      }`}
                    >
                      <Icon size={15} />
                    </span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="h-px bg-black/5 my-3 mx-1" />

          <Link
            href="/portal"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl text-[14.5px] font-medium text-navy/75 hover:bg-navy/[0.04] hover:text-navy transition-colors"
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-navy/5 text-navy/50">
              <LogIn size={15} />
            </span>
            Student Portal Login
          </Link>

          <div className="mt-4 mx-1 rounded-xl bg-navy/[0.03] border border-navy/5 p-3.5 flex flex-col gap-2.5">
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-2.5 text-xs font-medium text-navy/65 hover:text-navy transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Phone size={11} className="text-gold-dark" />
              </span>
              {contactInfo.phone}
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2.5 text-xs font-medium text-navy/65 hover:text-navy transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Mail size={11} className="text-gold-dark" />
              </span>
              {contactInfo.email}
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-black/5 flex flex-col gap-3">
          <Link
            href="/admissions"
            onClick={() => setOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-navy-light transition-colors"
          >
            Apply Now <ArrowRight size={15} />
          </Link>
          <div className="flex items-center justify-center gap-2.5">
            {socialIcons.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social link"
                className="w-7 h-7 flex items-center justify-center rounded-full border border-navy/10 text-navy/50 hover:border-gold-dark hover:text-gold-dark transition-colors"
              >
                <Icon size={12} />
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
