"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { PortalProvider, usePortal, portalSignOut } from "@/components/portal/PortalContext";
import PortalShell from "@/components/portal/PortalShell";

function PortalGate({ children }: { children: React.ReactNode }) {
  const { student } = usePortal();
  const router = useRouter();

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-black/5 shadow-sm p-8 text-center">
          <span className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={20} className="text-red-500" />
          </span>
          <h1 className="font-display font-bold text-navy text-lg mb-2">
            We couldn&apos;t find your profile
          </h1>
          <p className="text-sm text-navy/55 mb-6">
            Your account signed in, but no student profile is linked to it yet. Please contact
            the admin office, or sign out and register again.
          </p>
          <button
            onClick={() => portalSignOut(router)}
            className="w-full bg-navy hover:bg-navy-light text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <PortalShell>{children}</PortalShell>;
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <PortalGate>{children}</PortalGate>
    </PortalProvider>
  );
}
