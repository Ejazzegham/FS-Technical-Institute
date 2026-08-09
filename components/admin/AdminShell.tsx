"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Image as ImageIcon,
  Quote,
  BarChart3,
  Video,
  PlayCircle,
  Award,
  Mail,
  ClipboardList,
  Users,
  Bell,
  Settings,
  Wallet,
  DatabaseZap,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

const nav = [
  { section: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    section: "Site content",
    items: [
      { href: "/admin/courses", label: "Courses", icon: GraduationCap },
      { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/stats", label: "Stats", icon: BarChart3 },
      { href: "/admin/live-classes", label: "Live Classes", icon: Video },
      { href: "/admin/recorded-lectures", label: "Recorded Lectures", icon: PlayCircle },
      { href: "/admin/certificates", label: "Certificates", icon: Award },
      { href: "/admin/fees", label: "Fee Management", icon: Wallet },
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
    ],
  },
  { section: "Setup", items: [{ href: "/admin/seed", label: "Seed Content", icon: DatabaseZap }] },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut(getFirebaseAuth());
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-navy">
      <aside className="w-64 shrink-0 bg-navy text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="font-display font-bold text-lg">FSTI Admin</p>
          <p className="text-xs text-white/50">Content &amp; submissions</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {nav.map((group) => (
            <div key={group.section}>
              <p className="px-2 text-[10px] font-bold tracking-widest text-white/35 mb-1.5">
                {group.section.toUpperCase()}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active ? "bg-gold text-navy" : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon size={15} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ExternalLink size={15} /> View site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">{children}</div>
      </main>
    </div>
  );
}
