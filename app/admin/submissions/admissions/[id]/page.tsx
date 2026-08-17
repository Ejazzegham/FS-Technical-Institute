"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLeft, Loader2, Save, Check, Trash2, ExternalLink } from "lucide-react";
import { db, getFirebaseAuth } from "@/lib/firebase";
import { courses, batches, qualifications, religions, bloodGroups } from "@/lib/data";

const statusOptions = ["New", "Contacted", "Enrolled", "Rejected"];

type Admission = {
  fullName?: string;
  fatherName?: string;
  email?: string;
  mobile?: string;
  cnic?: string;
  course?: string;
  batch?: string;
  qualification?: string;
  religion?: string;
  bloodGroup?: string;
  address?: string;
  status?: string;
  enrollmentNumber?: string;
  photoUrl?: string;
  documentUrl?: string;
  createdAt?: { toDate?: () => Date } | null;
};

const EMPTY: Admission = {};

export default function AdminAdmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [original, setOriginal] = useState<Admission | null>(null);
  const [form, setForm] = useState<Admission>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const snap = await getDoc(doc(db, "admissions", id));
    if (snap.exists()) {
      const data = snap.data() as Admission;
      setOriginal(data);
      setForm(data);
    } else {
      setOriginal(null);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  function set<K extends keyof Admission>(key: K, value: Admission[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Only write the editable fields back — never touch photoUrl/documentUrl/
      // enrollmentNumber/createdAt from this form, those are set by the
      // original submission and shouldn't be hand-edited here.
      await updateDoc(doc(db, "admissions", id), {
        fullName: form.fullName ?? "",
        fatherName: form.fatherName ?? "",
        email: form.email ?? "",
        mobile: form.mobile ?? "",
        cnic: form.cnic ?? "",
        course: form.course ?? "",
        batch: form.batch ?? "",
        qualification: form.qualification ?? "",
        religion: form.religion ?? "",
        bloodGroup: form.bloodGroup ?? "",
        address: form.address ?? "",
        status: form.status ?? "New",
      });
      setOriginal(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      console.error(err);
      alert("Couldn't save changes. Check Firestore rules.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this admission application? This can't be undone.")) return;
    setDeleting(true);
    try {
      // Goes through the server so the linked Firebase Auth account and any
      // uploaded files get removed too, not just the Firestore document —
      // see /api/admin/delete-record.
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/admin/delete-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ collection: "admissions", id }),
      });
      const result = await res.json().catch(() => ({}) as { error?: string });
      if (!res.ok) throw new Error(result.error || "Delete failed");
      router.push("/admin/submissions/admissions");
    } catch (err) {
      console.error(err);
      alert(`Couldn't delete. ${err instanceof Error ? err.message : "Please try again."}`);
      setDeleting(false);
    }
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(original);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-navy/40 py-24">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  }

  if (!original) {
    return (
      <div>
        <Link href="/admin/submissions/admissions" className="inline-flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy mb-6">
          <ArrowLeft size={14} /> Back to Admissions
        </Link>
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">Application not found — it may have already been deleted.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/submissions/admissions" className="inline-flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy mb-6">
        <ArrowLeft size={14} /> Back to Admissions
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy">{original.fullName || "Unnamed Applicant"}</h1>
          <p className="text-sm text-navy/50 mt-1">
            {original.enrollmentNumber || "No enrollment #"}
            {original.createdAt?.toDate ? ` · Received ${original.createdAt.toDate().toLocaleString()}` : ""}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60 text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors shrink-0"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          Delete
        </button>
      </div>

      {(original.photoUrl || original.documentUrl) && (
        <div className="flex gap-3 mb-6">
          {original.photoUrl && (
            <a href={original.photoUrl} target="_blank" className="inline-flex items-center gap-1.5 text-sm text-navy underline">
              View Photo <ExternalLink size={12} />
            </a>
          )}
          {original.documentUrl && (
            <a href={original.documentUrl} target="_blank" className="inline-flex items-center gap-1.5 text-sm text-navy underline">
              View Document <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-black/5 p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name">
            <input value={form.fullName ?? ""} onChange={(e) => set("fullName", e.target.value)} required className="input" />
          </Field>
          <Field label="Father's Name">
            <input value={form.fatherName ?? ""} onChange={(e) => set("fatherName", e.target.value)} className="input" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} required className="input" />
          </Field>
          <Field label="Mobile">
            <input value={form.mobile ?? ""} onChange={(e) => set("mobile", e.target.value)} required className="input" />
          </Field>
          <Field label="CNIC / B-Form">
            <input value={form.cnic ?? ""} onChange={(e) => set("cnic", e.target.value)} className="input" />
          </Field>
          <Field label="Status">
            <select value={form.status ?? "New"} onChange={(e) => set("status", e.target.value)} className="select-compact w-full">
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Course">
            <select value={form.course ?? ""} onChange={(e) => set("course", e.target.value)} className="select-compact w-full">
              <option value="">— Select —</option>
              {courses.map((c) => (
                <option key={c.slug} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Batch">
            <select value={form.batch ?? ""} onChange={(e) => set("batch", e.target.value)} className="select-compact w-full">
              <option value="">— Select —</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Qualification">
            <select value={form.qualification ?? ""} onChange={(e) => set("qualification", e.target.value)} className="select-compact w-full">
              <option value="">— Select —</option>
              {qualifications.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Religion">
            <select value={form.religion ?? ""} onChange={(e) => set("religion", e.target.value)} className="select-compact w-full">
              <option value="">— Select —</option>
              {religions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Blood Group">
            <select value={form.bloodGroup ?? ""} onChange={(e) => set("bloodGroup", e.target.value)} className="select-compact w-full">
              <option value="">— Select —</option>
              {bloodGroups.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Address">
          <textarea value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} rows={2} className="input resize-none" />
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !dirty}
            className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark disabled:opacity-50 text-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? "Saved" : "Save Changes"}
          </button>
          {dirty && !saving && <span className="text-xs text-navy/40">Unsaved changes</span>}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy/60 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
