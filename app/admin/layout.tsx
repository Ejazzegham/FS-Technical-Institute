"use client";

import { usePathname } from "next/navigation";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>
  );
}
