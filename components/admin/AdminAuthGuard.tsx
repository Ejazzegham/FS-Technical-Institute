"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

// This guard hides the admin UI from anyone who isn't signed in. It is a
// convenience / UX layer, NOT the real security boundary — that's enforced
// by Firestore security rules (see ADMIN-SETUP.md), which only allow reads
// and writes on management collections from the one admin UID. Even if
// someone bypassed this component entirely, Firestore itself would refuse
// their requests.
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      if (!u) router.replace("/admin/login");
    });
    return () => unsub();
  }, [router]);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-navy/50">Checking admin session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-navy/50">Redirecting to login…</p>
      </div>
    );
  }

  return <>{children}</>;
}
