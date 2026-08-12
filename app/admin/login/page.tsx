"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { LockKeyhole, ShieldAlert } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/adminAuth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(() =>
    searchParams.get("denied") === "1"
      ? "That account doesn't have admin access. Please sign in with the admin email."
      : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      if (u && isAdminEmail(u.email)) router.replace("/admin");
    });
    return () => unsub();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
      if (!isAdminEmail(cred.user.email)) {
        // Correct password, but not the admin account — this is a valid
        // Firebase login (e.g. a student's account), just not one that's
        // allowed into the admin panel. Sign them back out immediately.
        await signOut(getFirebaseAuth());
        setError("This account doesn't have admin access.");
        setLoading(false);
        return;
      }
      router.replace("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center mb-5">
          <LockKeyhole size={18} className="text-gold" />
        </div>
        <h1 className="font-display font-bold text-xl text-navy mb-1">Admin Login</h1>
        <p className="text-sm text-navy/50 mb-6">Sign in to manage the FSTI website.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy/60 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/60 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <ShieldAlert size={14} className="shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-dark disabled:opacity-60 text-navy font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-navy/40 mt-6 text-center">
          No account yet? Create one in Firebase Console → Authentication.
          <br />
          See ADMIN-SETUP.md for the full setup guide.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
