"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Shows a full-screen splash (dark navy background + FSTI logo) once per
// browser session, on the very first page load — not on every client-side
// route change. Controlled via sessionStorage so a refresh within the same
// tab session won't replay it, but a fresh visit / new tab will.
const SESSION_KEY = "fsti-splash-shown";
const HOLD_MS = 1400; // how long the splash stays fully visible
const FADE_MS = 500; // matches the transition-duration below

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, "1");
    setMounted(true);

    const fadeTimer = setTimeout(() => setFadeOut(true), HOLD_MS);
    const unmountTimer = setTimeout(() => setMounted(false), HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Furqan Saeed Technical Institute"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-navy overflow-hidden transition-opacity ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      {/* Decorative background glows + rings, kept subtle so the logo stays the focus */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gold/20 blur-[90px]"
          style={{ animation: "splashGlow 3.2s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-28 -right-16 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px]"
          style={{ animation: "splashGlow 3.6s ease-in-out infinite 0.4s" }}
        />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="relative flex flex-col items-center gap-6 px-6">
        <div
          className="relative w-40 h-40 md:w-52 md:h-52"
          style={{ animation: "splashLogoIn 0.8s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <span className="absolute inset-0 rounded-full border border-gold/30" />
          <span className="absolute -inset-3 rounded-full border border-white/10" />
          <Image
            src="/images/splash-logo.png"
            alt="Furqan Saeed Technical Institute"
            fill
            sizes="208px"
            priority
            className="object-contain drop-shadow-[0_0_35px_rgba(240,169,59,0.35)]"
          />
        </div>

        <div
          className="flex flex-col items-center gap-3"
          style={{ animation: "splashTextIn 0.7s ease-out 0.35s both" }}
        >
          <p className="text-white text-sm md:text-base font-display font-bold tracking-wide text-center">
            Furqan Saeed Technical Institute
          </p>
          <p className="text-gold/90 text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase">
            Build Skills. Build Your Future.
          </p>
          <div className="w-36 h-1 rounded-full bg-white/10 overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-dark rounded-full"
              style={{ animation: `splashBar ${HOLD_MS}ms ease-in-out forwards` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
