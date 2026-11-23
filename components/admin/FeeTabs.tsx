"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin/fees/collection", label: "Collect Fee" },
  { href: "/admin/fees/records", label: "Fee Records" },
  { href: "/admin/fees", label: "Fee Settings" },
];

export default function FeeTabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 border-b border-black/10 mb-6">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4 py-2.5 text-sm font-semibold -mb-px border-b-2 transition-colors ${
              active ? "border-gold text-navy" : "border-transparent text-navy/50 hover:text-navy"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
