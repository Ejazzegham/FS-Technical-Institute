"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import {
  GraduationCap,
  Image as ImageIcon,
  Mail,
  ClipboardList,
  Bell,
  Users,
  Loader2,
} from "lucide-react";
import { db } from "@/lib/firebase";

const cards = [
  { key: "site_courses", label: "Courses", icon: GraduationCap, href: "/admin/courses" },
  { key: "site_gallery", label: "Gallery Items", icon: ImageIcon, href: "/admin/gallery" },
  { key: "contact_requests", label: "Contact Messages", icon: Mail, href: "/admin/submissions/contact" },
  { key: "admissions", label: "Admissions", icon: ClipboardList, href: "/admin/submissions/admissions" },
  { key: "newsletter_subscribers", label: "Subscribers", icon: Bell, href: "/admin/submissions/newsletter" },
  { key: "students", label: "Students", icon: Users, href: "/admin/students" },
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    cards.forEach(async (c) => {
      try {
        const snap = await getDocs(collection(db, c.key));
        setCounts((prev) => ({ ...prev, [c.key]: snap.size }));
      } catch {
        setCounts((prev) => ({ ...prev, [c.key]: null }));
      }
    });
  }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Dashboard</h1>
      <p className="text-sm text-navy/50 mb-6">Quick overview of your site&apos;s content and activity.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="bg-white rounded-xl border border-black/5 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center mb-4">
              <c.icon size={16} className="text-navy" />
            </span>
            <p className="font-display font-bold text-navy text-2xl mb-0.5">
              {counts[c.key] === undefined ? (
                <Loader2 size={18} className="animate-spin text-navy/30" />
              ) : counts[c.key] === null ? (
                "—"
              ) : (
                counts[c.key]
              )}
            </p>
            <p className="text-xs text-navy/50">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-navy rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="font-display font-bold text-white mb-1">First time here?</p>
          <p className="text-sm text-white/60">
            If your content collections are empty, seed them from the site&apos;s built-in defaults.
          </p>
        </div>
        <Link
          href="/admin/seed"
          className="bg-gold hover:bg-gold-dark text-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0"
        >
          Go to Seed Content
        </Link>
      </div>
    </div>
  );
}
