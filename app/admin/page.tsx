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
  MonitorPlay,
  Wallet,
  Loader2,
  ArrowUpRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { formatPKR } from "@/lib/feePayments";
import {
  loadAdmissions,
  loadAttendance,
  loadFees,
  type AdmissionsData,
  type AttendanceData,
  type FeesData,
} from "@/lib/adminDashboard";
import {
  AdmissionStatusCard,
  AdmissionsCard,
  AttendanceCard,
  FeeCollectionsCard,
} from "@/components/admin/DashboardCharts";

type Card = { key: string; label: string; icon: LucideIcon; href: string; tone: string; tint: string };

const cards: Card[] = [
  { key: "students", label: "Students", icon: Users, href: "/admin/students", tone: "#6366f1", tint: "#eef0ff" },
  { key: "admissions", label: "Admissions", icon: ClipboardList, href: "/admin/submissions/admissions", tone: "#8b5cf6", tint: "#f3edff" },
  { key: "site_courses", label: "Courses", icon: GraduationCap, href: "/admin/courses", tone: "#06b6d4", tint: "#e6f8fc" },
  { key: "contact_requests", label: "Contact Messages", icon: Mail, href: "/admin/submissions/contact", tone: "#f43f5e", tint: "#ffeef1" },
  { key: "newsletter_subscribers", label: "Subscribers", icon: Bell, href: "/admin/submissions/newsletter", tone: "#f59e0b", tint: "#fff5e0" },
  { key: "site_gallery", label: "Gallery Items", icon: ImageIcon, href: "/admin/gallery", tone: "#ec4899", tint: "#fdecf5" },
  { key: "site_software", label: "Software & Tools", icon: MonitorPlay, href: "/admin/software", tone: "#10b981", tint: "#e5f8f0" },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [admissions, setAdmissions] = useState<AdmissionsData | null>(null);
  const [fees, setFees] = useState<FeesData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);

  useEffect(() => {
    cards.forEach(async (c) => {
      try {
        const snap = await getDocs(collection(db, c.key));
        setCounts((prev) => ({ ...prev, [c.key]: snap.size }));
      } catch {
        setCounts((prev) => ({ ...prev, [c.key]: null }));
      }
    });

    // Each chart loads independently, so one failing query can't blank the others.
    loadAdmissions()
      .then(setAdmissions)
      .catch(() => setAdmissions({ monthly: [], byStatus: [], total: 0 }));
    loadFees()
      .then(setFees)
      .catch(() => setFees({ monthly: [], thisMonth: 0, total: 0, byMethod: [] }));
    loadAttendance()
      .then(setAttendance)
      .catch(() => setAttendance({ daily: [], presentPct: 0, marked: 0 }));
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="font-display font-bold text-xl text-navy">{greeting()}, Admin 👋</h1>
          <p className="text-xs text-navy/50">Here&apos;s what&apos;s happening at the institute today.</p>
        </div>
      </div>

      {/* Compact stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Fees this month */}
        <Link
          href="/admin/fees/records"
          className="group relative flex items-center gap-3 bg-white rounded-lg border border-[#e6eaf2] px-3 py-2.5 hover:border-[#10b981]/50 hover:shadow-sm transition-all"
        >
          <span className="w-9 h-9 rounded-md bg-[#e5f8f0] flex items-center justify-center shrink-0">
            <Wallet size={16} className="text-[#10b981]" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block font-display font-bold text-navy text-[15px] truncate">
              {fees ? formatPKR(fees.thisMonth) : <Loader2 size={14} className="animate-spin text-navy/30" />}
            </span>
            <span className="block text-[11px] text-navy/50 truncate">Fees this month</span>
          </span>
          <ArrowUpRight size={13} className="absolute top-2 right-2 text-navy/20 group-hover:text-[#10b981] transition-colors" />
        </Link>

        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="group relative flex items-center gap-3 bg-white rounded-lg border border-[#e6eaf2] px-3 py-2.5 hover:shadow-sm transition-all"
            style={{ ["--tone" as string]: c.tone }}
          >
            <span className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: c.tint }}>
              <c.icon size={16} style={{ color: c.tone }} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block font-display font-bold text-navy text-[17px]">
                {counts[c.key] === undefined ? (
                  <Loader2 size={14} className="animate-spin text-navy/30" />
                ) : counts[c.key] === null ? (
                  "—"
                ) : (
                  counts[c.key]
                )}
              </span>
              <span className="block text-[11px] text-navy/50 truncate">{c.label}</span>
            </span>
            <ArrowUpRight size={13} className="absolute top-2 right-2 text-navy/20 group-hover:text-[var(--tone)] transition-colors" />
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <FeeCollectionsCard data={fees} className="lg:col-span-2" />
        <AdmissionsCard data={admissions} />
        <AttendanceCard data={attendance} className="lg:col-span-2" />
        <AdmissionStatusCard data={admissions} />
      </div>

      {/* Seed hint */}
      <div className="rounded-lg bg-gradient-to-r from-[#0f1e3d] to-[#1d3566] px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-md bg-gold/20 flex items-center justify-center">
            <Sparkles size={15} className="text-gold" />
          </span>
          <div className="leading-tight">
            <p className="font-display font-bold text-white text-sm">First time here?</p>
            <p className="text-xs text-white/60">
              If your content collections are empty, seed them from the site&apos;s built-in defaults.
            </p>
          </div>
        </div>
        <Link
          href="/admin/seed"
          className="bg-gold hover:bg-gold-dark text-navy font-semibold text-xs px-4 py-2 rounded-md transition-colors shrink-0"
        >
          Go to Seed Content
        </Link>
      </div>
    </div>
  );
}
