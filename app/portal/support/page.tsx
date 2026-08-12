"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircleMore } from "lucide-react";
import { usePortal } from "@/components/portal/PortalContext";
import ContactForm from "@/components/ContactForm";
import { contactInfo as defaultContactInfo } from "@/lib/data";
import { getContactInfo, type ContactInfo } from "@/lib/content";
import { whatsappLink } from "@/lib/portalUtils";

export default function PortalSupportPage() {
  const { student } = usePortal();
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    getContactInfo().then(setContactInfo).catch(() => setContactInfo(defaultContactInfo));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-gold-dark text-xs font-bold tracking-widest mb-1.5">WE&apos;RE HERE TO HELP</p>
        <h1 className="font-display font-bold text-navy text-2xl">Support</h1>
        <p className="text-sm text-navy/50 mt-1">
          Reach the admin office directly, or send a message below.
        </p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-4">
          <a
            href={whatsappLink(contactInfo.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-5 transition-colors"
          >
            <span className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <MessageCircleMore size={20} />
            </span>
            <div>
              <p className="font-display font-bold text-sm">Chat on WhatsApp</p>
              <p className="text-xs text-white/75">Fastest way to reach us</p>
            </div>
          </a>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 space-y-4">
            <ContactRow icon={Phone} label="Phone" value={contactInfo.phone} href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} />
            <ContactRow icon={Mail} label="Email" value={contactInfo.email} href={`mailto:${contactInfo.email}`} />
            <ContactRow icon={MapPin} label="Address" value={contactInfo.address} />
            <ContactRow icon={Clock} label="Office Hours" value={contactInfo.hours} />
          </div>

          <p className="text-xs text-navy/40 px-1">
            When you contact us, please mention your enrollment number
            {student ? ` (${student.enrollmentNumber})` : ""} so we can find your record quickly.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-8">
          <h2 className="font-display font-bold text-navy text-lg mb-6">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-navy" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-navy/45 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-navy break-words">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:opacity-70 transition-opacity">
      {content}
    </a>
  ) : (
    content
  );
}
