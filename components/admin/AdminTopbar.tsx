"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, Bell, Mail, ChevronDown, LogOut, User, Settings } from "lucide-react";

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-black/5">
      <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 lg:px-8 py-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-navy shrink-0 p-1 -ml-1"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="relative flex-1 min-w-0 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
          <input
            placeholder="Search anything..."
            className="w-full rounded-lg bg-slate-100 pl-10 pr-3 py-2.5 text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div className="flex-1" />

        <button className="relative text-navy/60 hover:text-navy shrink-0 p-1" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <button className="relative text-navy/60 hover:text-navy shrink-0 p-1 hidden sm:inline-flex" aria-label="Messages">
          <Mail size={20} />
        </button>

        <div className="relative shrink-0">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2"
          >
            <span className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold">
              A
            </span>
            <span className="hidden sm:block text-left leading-tight">
              <span className="block text-sm font-semibold text-navy">Admin</span>
              <span className="block text-[11px] text-navy/45">Super Administrator</span>
            </span>
            <ChevronDown size={14} className="text-navy/40" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-black/5 shadow-lg py-1.5">
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-navy/70 hover:bg-slate-50"
              >
                <User size={14} /> My Profile
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-navy/70 hover:bg-slate-50"
              >
                <Settings size={14} /> Settings
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} /> Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
