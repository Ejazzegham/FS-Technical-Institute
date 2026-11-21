"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  Video,
  PlayCircle,
  Award,
  Wallet,
  MessagesSquare,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { usePortal, portalSignOut } from "@/components/portal/PortalContext";
import StudentAvatar from "@/components/portal/StudentAvatar";

const nav = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/profile", label: "My Profile", icon: UserRound },
  { href: "/portal/live-classes", label: "Live Classes", icon: Video },
  { href: "/portal/recorded-lectures", label: "Recorded Lectures", icon: PlayCircle },
  { href: "/portal/certificate", label: "Certificate", icon: Award },
  { href: "/portal/fees", label: "Fee Information", icon: Wallet },
  { href: "/portal/support", label: "Support", icon: MessagesSquare },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="space-y-0.5">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active ? "bg-gold text-navy" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const { student, user } = usePortal();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await portalSignOut(router);
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-navy">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 bg-navy text-white flex-col">
        <SidebarHeader />
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/portal/profile" className="flex items-center gap-3 group">
            <StudentAvatar name={student?.fullName} photoUrl={student?.photoUrl} size={46} ring />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate group-hover:text-gold transition-colors">
                {student?.fullName || "Student"}
              </p>
              <p className="text-[11px] text-gold/80 font-mono truncate">
                {student?.enrollmentNumber || "—"}
              </p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <NavLinks />
        </nav>
        <SidebarFooter user={user.email} onLogout={handleLogout} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-40 bg-navy text-white flex items-center justify-between px-4 py-3 border-b border-white/10">
        <Link href="/portal" className="flex items-center gap-2.5">
          <Image src="/images/logo.png" alt="FSTI logo" width={30} height={30} className="rounded-full" />
          <span className="font-display font-bold text-sm">Student Portal</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-navy text-white flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <p className="font-display font-bold">Student Portal</p>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <StudentAvatar name={student?.fullName} photoUrl={student?.photoUrl} size={44} ring />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{student?.fullName || "Student"}</p>
                  <p className="text-[11px] text-gold/80 font-mono truncate">
                    {student?.enrollmentNumber || "—"}
                  </p>
                </div>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </nav>
            <SidebarFooter user={user.email} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 overflow-y-auto pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
      <Image src="/images/logo.png" alt="FSTI logo" width={34} height={34} className="rounded-full" />
      <div className="leading-tight">
        <p className="font-display font-bold text-sm">FSTI Student Portal</p>
        <p className="text-[11px] text-white/40">Furqan Saeed Technical Institute</p>
      </div>
    </div>
  );
}

function SidebarFooter({ user, onLogout }: { user: string | null; onLogout: () => void }) {
  return (
    <div className="p-3 border-t border-white/10 space-y-1">
      {user && <p className="px-3 pb-1 text-[11px] text-white/35 truncate">{user}</p>}
      <Link
        href="/"
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        <ExternalLink size={15} /> Back to Website
      </Link>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        <LogOut size={15} /> Log out
      </button>
    </div>
  );
}
