"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import type { Course } from "@/lib/types";

const TIMES = ["Morning (9 AM – 12 PM)", "Afternoon (12 – 3 PM)", "Evening (4 – 7 PM)", "Weekend"];

export default function DemoClassForm({ courses, defaultCourse = "" }: { courses: Course[]; defaultCourse?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f.entries())),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not submit your request.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-8 text-center">
        <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
        <h3 className="font-display font-bold text-navy text-xl mb-2">Demo class requested!</h3>
        <p className="text-sm text-navy/60">Our team will call you shortly to confirm your slot.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-7 space-y-4">
      {/* Honeypot — hidden from people, bots fill it in */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-medium text-navy/80 mb-1.5">Full Name <span className="text-red-500">*</span></span>
          <input name="name" required className="input" placeholder="Your full name" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-navy/80 mb-1.5">Phone / WhatsApp <span className="text-red-500">*</span></span>
          <input name="phone" required inputMode="tel" className="input" placeholder="03XX XXXXXXX" />
        </label>
      </div>
      <label className="block">
        <span className="block text-sm font-medium text-navy/80 mb-1.5">Email (optional)</span>
        <input type="email" name="email" className="input" placeholder="you@example.com" />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-medium text-navy/80 mb-1.5">Course <span className="text-red-500">*</span></span>
          <select name="course" required defaultValue={defaultCourse} className="input">
            <option value="" disabled>Select a course</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.title}>{c.title}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-navy/80 mb-1.5">Preferred time</span>
          <select name="preferredTime" defaultValue={TIMES[0]} className="input">
            {TIMES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>
      <fieldset className="flex gap-6 text-sm text-navy/75">
        {["On-campus", "Online"].map((m, i) => (
          <label key={m} className="inline-flex items-center gap-2">
            <input type="radio" name="mode" value={m} defaultChecked={i === 0} /> {m}
          </label>
        ))}
      </fieldset>
      <label className="block">
        <span className="block text-sm font-medium text-navy/80 mb-1.5">Anything we should know?</span>
        <textarea name="message" rows={3} className="input resize-none" placeholder="Your goals, experience level…" />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
      >
        <CalendarCheck size={16} /> {status === "loading" ? "Sending..." : "Book My Free Demo"}
      </button>
    </form>
  );
}
