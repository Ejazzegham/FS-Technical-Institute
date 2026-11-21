"use client";

import { useState } from "react";
import { Video, LifeBuoy } from "lucide-react";

export default function JoinLiveClass({
  showLoginCta = true,
  supportHref = "/contact",
}: {
  showLoginCta?: boolean;
  supportHref?: string;
}) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setMessage("Enter a class code to continue.");
      return;
    }
    setMessage(
      `Looking up class "${code.trim()}" — your instructor will admit you once the session starts.`
    );
  }

  return (
    <div className="bg-navy rounded-2xl p-6 md:p-7">
      <h3 className="font-display font-bold text-white text-lg mb-2">Join Live Class</h3>
      <p className="text-sm text-white/55 mb-5">
        Enter the class code provided by your instructor to join the live session.
      </p>

      <form onSubmit={handleJoin} className="space-y-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter Class Code"
          className="w-full rounded-lg bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-5 py-3 rounded-lg transition-colors"
        >
          <Video size={16} /> Join Live Class
        </button>
        {message && <p className="text-xs text-gold/80">{message}</p>}
      </form>

      {showLoginCta && (
        <>
          <div className="flex items-center gap-2 my-4">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/30">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <a
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 border border-white/15 hover:border-gold text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            View My Classes
          </a>
        </>
      )}

      <div className="flex items-start gap-3 mt-6 pt-5 border-t border-white/10">
        <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <LifeBuoy size={15} className="text-gold" />
        </span>
        <div>
          <p className="text-white text-sm font-medium">Having Trouble Joining?</p>
          <p className="text-xs text-white/45 mb-1">
            Check your internet connection or contact our support team for assistance.
          </p>
          <a href={supportHref} className="text-xs text-gold font-semibold hover:text-gold-dark">
            Contact Support &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
