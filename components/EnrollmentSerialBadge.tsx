"use client";

import { useEffect, useState } from "react";
import { Hash, Loader2 } from "lucide-react";

/**
 * Shows the next auto-generated enrollment/serial number (e.g.
 * "FSTI-2026-0001"). Refetches whenever `refreshKey` changes, so parents can
 * bump it (e.g. after a successful submission, when a new registration
 * starts) to reveal the next number in the sequence.
 */
export default function EnrollmentSerialBadge({
  refreshKey = 0,
  variant = "dark",
  label = "Serial No.",
}: {
  refreshKey?: number;
  variant?: "dark" | "light";
  label?: string;
}) {
  // `value` doubles as the loading flag: null means "still loading" on first
  // render, and is left untouched (no flicker) on subsequent refreshes until
  // the new number arrives.
  const [value, setValue] = useState<string | null>(null);
  const loading = value === null;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/enrollment-number")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setValue(data.enrollmentNumber ?? "FSTI-—");
      })
      .catch(() => {
        if (!cancelled) setValue("FSTI-—");
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const dark = variant === "dark";

  return (
    <div
      className={
        dark
          ? "inline-flex items-center gap-3 bg-navy rounded-xl px-5 py-3 shrink-0"
          : "inline-flex items-center gap-3 bg-navy/[0.04] border border-navy/10 rounded-xl px-4 py-2.5 shrink-0"
      }
    >
      <span
        className={
          dark
            ? "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"
            : "w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center shrink-0"
        }
      >
        <Hash size={14} className="text-gold" />
      </span>
      <span className="leading-tight text-left">
        <span className={dark ? "block text-[11px] text-white/50" : "block text-[11px] text-navy/45"}>
          {label} · Generated Automatically
        </span>
        {loading ? (
          <span
            className={
              "flex items-center gap-1.5 font-display font-bold text-lg " +
              (dark ? "text-white/50" : "text-navy/40")
            }
          >
            <Loader2 size={14} className="animate-spin" /> Loading
          </span>
        ) : (
          <span className={"block font-display font-bold text-lg " + (dark ? "text-gold" : "text-gold-dark")}>
            {value}
          </span>
        )}
      </span>
    </div>
  );
}
