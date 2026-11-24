"use client";

import Link from "next/link";
import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import type { AnnouncementContent } from "@/lib/types";

// Dismissible top-of-site announcement, managed from /admin/page-content.
export default function AnnouncementBar({ announcement }: { announcement?: AnnouncementContent }) {
  const [closed, setClosed] = useState(false);
  if (!announcement?.enabled || !announcement.text || closed) return null;
  return (
    <div className="bg-gold text-navy-dark text-xs sm:text-[13px] font-medium">
      <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center justify-center gap-3 relative">
        <Megaphone size={14} className="shrink-0" />
        <p className="text-center pr-6">
          {announcement.text}
          {announcement.href && announcement.linkLabel && (
            <Link href={announcement.href} className="ml-2 underline underline-offset-2 font-semibold">
              {announcement.linkLabel}
            </Link>
          )}
        </p>
        <button
          onClick={() => setClosed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
