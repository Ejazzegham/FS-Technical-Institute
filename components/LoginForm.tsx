"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, User, Lock, CheckCircle2 } from "lucide-react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { getFirebaseAuth, db } from "@/lib/firebase";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already signed in, skip straight to the portal.
  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (user) router.replace("/portal");
    });
    return () => unsub();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const form = e.currentTarget;
    const identifier = (form.elements.namedItem("identifier") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      let email = identifier;

      // If they typed an enrollment number instead of an email, look up the email in Firestore.
      if (!identifier.includes("@")) {
        const q = query(
          collection(db, "students"),
          where("enrollmentNumber", "==", identifier),
          limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          throw new Error("No account found for that enrollment number.");
        }
        email = snap.docs[0].data().email as string;
      }

      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      setStatus("done");
      router.replace("/portal");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim()
          : "Could not sign in.";
      setErrorMsg(message || "Invalid credentials. Please try again.");
      setStatus("error");
    }
  }

  // Belt-and-suspenders: if client-side navigation doesn't take effect for any
  // reason, force a full page navigation shortly after.
  useEffect(() => {
    if (status !== "done") return;
    const t = setTimeout(() => {
      window.location.href = "/portal";
    }, 1200);
    return () => clearTimeout(t);
  }, [status]);

  if (status === "done") {
    return (
      <div className="bg-white border border-black/5 shadow-xl shadow-navy/5 rounded-2xl p-8 text-center">
        <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
        <h3 className="font-display font-bold text-navy text-xl mb-2">Welcome back!</h3>
        <p className="text-sm text-navy/50 mb-5">Taking you to your student portal…</p>
        <a
          href="/portal"
          className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
        >
          Continue to Portal <ArrowRight size={15} />
        </a>
      </div>
    );
  }

  return (
    <div className="relative bg-white border border-black/5 shadow-xl shadow-navy/[0.06] rounded-2xl overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />

      <div className="p-6 sm:p-7">
        <h2 className="font-display font-bold text-navy text-2xl mb-1.5">
          Welcome <span className="text-gold-dark">Back!</span>
        </h2>
        <span className="block w-10 h-[3px] bg-gold rounded-full mb-3" />
        <p className="text-sm text-navy/50 mb-5">Sign in to access your student portal</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
            <input
              name="identifier"
              required
              placeholder="Student ID / Enrollment Number or Email"
              className="input pl-10"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="input pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/35 hover:text-navy transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-navy/60 cursor-pointer">
              <input type="checkbox" name="remember" className="accent-gold" defaultChecked />
              Remember Me
            </label>
            <a href="#" className="text-gold-dark hover:text-gold font-medium">
              Forgot Password?
            </a>
          </div>

          {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3.5 rounded-lg shadow-md shadow-navy/20 transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Signing in..." : "Sign In"} <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-sm text-navy/55 mt-5">
          New Student?{" "}
          <a href="/register" className="text-gold-dark hover:text-gold font-semibold">
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
}
