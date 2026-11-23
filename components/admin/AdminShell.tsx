"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Image as ImageIcon,
  BarChart3,
  Video,
  PlayCircle,
  Award,
  Mail,
  ClipboardList,
  Users,
  CalendarCheck,
  Bell,
  Settings,
  Wallet,
  Receipt,
  DatabaseZap,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

const nav = [
  { section: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    section: "Fee management",
    items: [
      { href: "/admin/fees/collection", label: "Collect Fee", icon: Receipt },
      { href: "/admin/fees/records", label: "Fee Records", icon: Wallet },
      { href: "/admin/fees", label: "Fee Settings", icon: Settings },
    ],
  },
  {
    section: "Site content",
    items: [
      { href: "/admin/events", label: "Events & Highlights", icon: Sparkles },
      { href: "/admin/courses", label: "Courses", icon: GraduationCap },
      { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
      { href: "/admin/stats", label: "Stats", icon: BarChart3 },
      { href: "/admin/live-classes", label: "Live Classes", icon: Video },
      { href: "/admin/recorded-lectures", label: "Recorded Lectures", icon: PlayCircle },
      { href: "/admin/certificates", label: "Certificates", icon: Award },
      { href: "/admin/settings", label: "Contact Info", icon: Settings },
    ],
  },
  {
    section: "Submissions",
    items: [
      { href: "/admin/submissions/contact", label: "Contact Messages", icon: Mail },
      { href: "/admin/submissions/admissions", label: "Admissions", icon: ClipboardList },
      { href: "/admin/submissions/newsletter", label: "Newsletter", icon: Bell },
      { href: "/admin/students", label: "Students", icon: Users },
      { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  { section: "Setup", items: [{ href: "/admin/seed", label: "Seed Content", icon: DatabaseZap }] },
];

const allItems = nav.flatMap((g) => g.items.map((i) => ({ ...i, section: g.section })));

/** Longest matching nav href wins, so /admin/fees/records doesn't highlight "Fee Settings". */
function findCurrent(pathname: string) {
  return (
    allItems
      .filter((i) => pathname === i.href || (i.href !== "/admin" && pathname.startsWith(i.href + "/")))
      .sort((a, b) => b.href.length - a.href.length)[0] ?? null
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const current = useMemo(() => findCurrent(pathname), [pathname]);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), (user) => setEmail(user?.email ?? ""));
  }, []);

  async function handleLogout() {
    await signOut(getFirebaseAuth());
    router.replace("/admin/login");
  }

  const initial = (email || "A").charAt(0).toUpperCase();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="admin-root h-screen flex bg-[#f4f6fb] text-navy overflow-hidden">
      {/* Mobile overlay */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-navy-dark/60 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[248px] shrink-0 flex flex-col text-white
          bg-gradient-to-b from-[#0f1e3d] via-[#0c1933] to-[#091227]
          transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 px-4 flex items-center gap-3 border-b border-white/[0.07] shrink-0">
          <span className="w-9 h-9 rounded-md bg-white flex items-center justify-center shrink-0 ring-1 ring-gold/40">
            <Image src="/images/logo.png" alt="FSTI" width={28} height={28} className="object-contain" />
          </span>
          <span className="leading-tight min-w-0">
            <span className="block font-display font-bold text-[13px] tracking-wide truncate">FSTI Admin</span>
            <span className="block text-[10px] text-gold/90 tracking-[0.14em] font-semibold">CONTROL PANEL</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden ml-auto p-1 text-white/60 hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {nav.map((group) => (
            <div key={group.section}>
              <p className="px-2.5 text-[10px] font-semibold tracking-[0.16em] text-white/30 mb-1.5 uppercase">
                {group.section}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = current?.href === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`group relative flex items-center gap-2.5 pl-3 pr-2.5 py-[7px] rounded-md text-[13px] font-medium transition-all ${
                        active
                          ? "bg-gradient-to-r from-gold to-[#f6c26b] text-navy shadow-[0_4px_14px_-4px_rgba(240,169,59,0.55)]"
                          : "text-white/65 hover:bg-white/[0.07] hover:text-white"
                      }`}
                    >
                      <item.icon
                        size={15}
                        className={active ? "text-navy" : "text-white/45 group-hover:text-gold transition-colors"}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.07] shrink-0">
          <div className="flex items-center gap-2.5 rounded-md bg-white/[0.05] px-2.5 py-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-[#e48a12] text-navy text-sm font-bold flex items-center justify-center shrink-0">
              {initial}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-xs font-semibold truncate">Administrator</span>
              <span className="block text-[10px] text-white/45 truncate">{email || "Signed in"}</span>
            </span>
            <button
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
              className="p-1.5 rounded text-white/55 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 bg-white/85 backdrop-blur border-b border-[#e6eaf2] flex items-center gap-3 px-4 md:px-8">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-1.5 -ml-1.5 rounded text-navy/70 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0 leading-tight">
            <p className="hidden sm:flex items-center gap-1 text-[11px] text-navy/40 font-medium">
              Admin <ChevronRight size={11} /> {current?.section ?? "Page"}
            </p>
            <h2 className="font-display font-bold text-[15px] sm:text-base text-navy truncate">
              {current?.label ?? "Admin"}
            </h2>
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2 rounded-md bg-slate-100/80 px-3 py-1.5 text-[11px] font-medium text-navy/60">
            <CalendarCheck size={13} className="text-gold-dark" /> {today}
          </div>

          <Link
            href="/admin/notifications"
            className="hidden sm:inline-flex p-2 rounded-md text-navy/55 hover:text-navy hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={17} />
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-navy text-white text-xs font-semibold px-3 py-2 hover:bg-navy-light transition-colors"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">View site</span>
          </a>
        </header>

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
