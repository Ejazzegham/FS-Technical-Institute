"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, updateDoc, type Timestamp } from "firebase/firestore";
import { getFirebaseAuth, db } from "@/lib/firebase";

export type StudentProfile = {
  uid: string;
  enrollmentNumber: string;
  fullName: string;
  fatherName?: string | null;
  email: string;
  mobile: string;
  cnic?: string | null;
  address?: string | null;
  course: string;
  batch?: string | null;
  qualification?: string | null;
  religion?: string | null;
  bloodGroup?: string | null;
  photoUrl?: string | null;
  documentUrl?: string | null;
  createdAt?: Timestamp | null;
};

/** Fields a student is allowed to edit themselves from the portal. */
export type EditableStudentFields = Partial<
  Pick<StudentProfile, "mobile" | "address" | "religion" | "bloodGroup" | "photoUrl">
>;

type PortalContextValue = {
  user: User;
  student: StudentProfile | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  updateProfile: (fields: EditableStudentFields) => Promise<void>;
};

const PortalContext = createContext<PortalContextValue | null>(null);

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalProvider");
  return ctx;
}

export function PortalLoadingScreen({ text = "Loading your portal…" }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <span className="w-9 h-9 rounded-full border-2 border-navy/15 border-t-gold animate-spin" />
        <p className="text-sm text-navy/50">{text}</p>
      </div>
    </div>
  );
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);

  const fetchStudent = useCallback(async (uid: string) => {
    setLoadingStudent(true);
    try {
      const snap = await getDoc(doc(db, "students", uid));
      setStudent(snap.exists() ? ({ uid, ...(snap.data() as object) } as StudentProfile) : null);
    } catch (err) {
      console.error("portal: failed to load student profile", err);
      setStudent(null);
    } finally {
      setLoadingStudent(false);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setAuthChecked(true);
      if (!u) {
        setLoadingStudent(false);
        router.replace("/login");
        return;
      }
      fetchStudent(u.uid);
    });
    return () => unsub();
  }, [router, fetchStudent]);

  if (!authChecked || (user && loadingStudent)) {
    return <PortalLoadingScreen />;
  }

  if (!user) {
    return <PortalLoadingScreen text="Redirecting to sign in…" />;
  }

  return (
    <PortalContext.Provider
      value={{
        user,
        student,
        refreshing: loadingStudent,
        refresh: () => fetchStudent(user.uid),
        updateProfile: async (fields) => {
          await updateDoc(doc(db, "students", user.uid), fields);
          await fetchStudent(user.uid);
        },
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export async function portalSignOut(router: ReturnType<typeof useRouter>) {
  await signOut(getFirebaseAuth());
  router.replace("/login");
}
