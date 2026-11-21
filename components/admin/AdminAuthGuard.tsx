"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/adminAuth";

// This guard hides the admin UI from anyone who isn't signed in AS THE
// ADMIN ACCOUNT specifically (see lib/adminAuth.ts) — not just anyone who
// happens to be logged in. Without the email check, any registered student
// (registration also creates a Firebase Auth account) could sign in here
// with their own credentials and reach the admin UI.
//
// This is a convenience / UX layer, NOT the real security boundary — that's
// enforced by Firestore security rules (see firestore.rules), which only
// allow reads and writes on management collections from the admin email.
// Even if someone bypassed this component entirely, Firestore itself would
// refuse their requests.
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      if (u && !isAdminEmail(u.email)) {
        // Signed in, but not the admin account — kick them out immediately
        // rather than leaving them logged in on a page they can't use.
        signOut(getFirebaseAuth());
        router.replace("/admin/login?denied=1");
        setUser(null);
        return;
      }
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

  if (!user || !isAdminEmail(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-navy/50">Redirecting to login…</p>
      </div>
    );
  }

  return <>{children}</>;
}
