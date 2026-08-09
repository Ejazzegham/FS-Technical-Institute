"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

const subjects = [
  "General Inquiry",
  "Admissions",
  "Course Information",
  "Partnership",
  "Feedback",
  "Other",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Could not send message.");
      }
      setStatus("done");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-8 text-center">
        <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
        <h3 className="font-display font-bold text-navy text-xl mb-2">Message Sent!</h3>
        <p className="text-sm text-navy/60 mb-4">
          Thanks for reaching out — our team will get back to you shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold text-navy underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-7">
      <h2 className="font-display font-bold text-navy text-xl mb-1">Send Us a Message</h2>
      <p className="text-sm text-navy/50 mb-6">Fill out the form below and we&apos;ll get back to you.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-navy/80 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </span>
            <input name="name" required placeholder="Enter your full name" className="input" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-navy/80 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </span>
            <input type="email" name="email" required placeholder="Enter your email" className="input" />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-navy/80 mb-1.5">Phone Number</span>
            <input name="phone" placeholder="Enter your phone number" className="input" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-navy/80 mb-1.5">
              Subject <span className="text-red-500">*</span>
            </span>
            <select name="subject" required defaultValue="" className="input">
              <option value="" disabled>
                Select a subject
              </option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-navy/80 mb-1.5">
            Message <span className="text-red-500">*</span>
          </span>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Type your message here..."
            className="input resize-none"
          />
        </label>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Send Message"} <Send size={16} />
        </button>
      </form>
    </div>
  );
}
