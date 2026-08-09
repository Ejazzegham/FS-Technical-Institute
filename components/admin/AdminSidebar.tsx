"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Receipt,
  UserCog,
  BookOpen,
  LayoutGrid,
  ClipboardCheck,
  GraduationCap,
  Award,
  BarChart3,
  Megaphone,
  Mail,
  Settings,
  DatabaseBackup,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { sidebarLinks } from "@/lib/adminData";

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  students: Users,
  fee: Wallet,
  expenses: Receipt,
  staff: UserCog,
  courses: BookOpen,
  classes: LayoutGrid,
  attendance: ClipboardCheck,
  exams: GraduationCap,
  certificates: Award,
  reports: BarChart3,
  notice: Megaphone,
  messages: Mail,
  settings: Settings,
  backup: DatabaseBackup,
};

export default function AdminSidebar({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>("Fee Management");

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-navy text-white flex flex-col z-40 transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 shrink-0">
        <Image
          src="/images/logo.png"
          alt="FSTI logo"
          width={40}
          height={40}
          className="rounded-full object-contain"
        />
        <span className="leading-tight">
          <span className="block font-display font-extrabold text-white text-sm">
            FURQAN SAEED
          </span>
          <span className="block text-[9px] font-semibold text-gold tracking-widest -mt-0.5">
            TECHNICAL INSTITUTE
          </span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="text-[10px] font-bold text-white/35 tracking-widest px-3 mb-2">
          MAIN MENU
        </p>
        <ul className="space-y-0.5">
          {sidebarLinks.map((link) => {
            const Icon = iconMap[link.icon];
            const active = pathname === link.href;
            const hasChildren = !!link.children?.length;
            const isExpanded = expanded === link.label;

            return (
              <li key={link.label}>
                {hasChildren ? (
                  <button
                    onClick={() => setExpanded(isExpanded ? null : link.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? "bg-gold text-navy" : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="flex-1 text-left">{link.label}</span>
                    <ChevronDown
                      size={14}
                      className={`shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? "bg-gold text-navy" : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" />
                    {link.label}
                  </Link>
                )}

                {hasChildren && isExpanded && (
                  <ul className="mt-0.5 ml-4 pl-4 border-l border-white/10 space-y-0.5">
                    {link.children!.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onNavigate}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            pathname === child.href
                              ? "text-gold font-semibold"
                              : "text-white/55 hover:text-white"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-5 py-3 border-t border-white/10 text-[10px] text-white/30 shrink-0">
        © 2025 Furqan Saeed Technical Institute
        <br />
        All rights reserved.
      </div>
    </aside>
  );
}
