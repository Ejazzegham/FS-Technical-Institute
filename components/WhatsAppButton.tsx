"use client";

import { MessageCircle } from "lucide-react";
import { contactInfo as defaultContactInfo } from "@/lib/data";
import type { ContactInfo } from "@/lib/content";

// Persistent floating WhatsApp button shown on every public page (via
// SiteChrome). Always links to the same FSTI WhatsApp number used
// throughout the site (lib/data.ts -> contactInfo.whatsapp), so updating
// the number in one place updates this button too.
export default function WhatsAppButton({
  contactInfo = defaultContactInfo,
}: {
  contactInfo?: ContactInfo;
}) {
  // Defensive: fall back to the known-good number if a caller ever passes a
  // contactInfo object that's missing `whatsapp` (e.g. a partially-saved
  // Firestore doc) — .replace() on undefined would otherwise crash here.
  const digits = (contactInfo?.whatsapp || defaultContactInfo.whatsapp).replace(/[^\d]/g, "");
  if (!digits) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hello FSTI, I'd like more information."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 hover:scale-105 transition-transform"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-60" />
      <MessageCircle size={26} fill="white" className="relative z-10 text-[#25D366]" />
    </a>
  );
}
