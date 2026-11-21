"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, Save, Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { contactInfo as defaults } from "@/lib/data";

type ContactInfo = typeof defaults;

export default function AdminSettingsPage() {
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "site_settings", "contact"));
        setInfo(snap.exists() ? (snap.data() as ContactInfo) : defaults);
      } catch {
        setInfo(defaults);
      }
    })();
  }, []);

  async function handleSave() {
    if (!info) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "site_settings", "contact"), info);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Couldn't save. Check Firestore rules — see ADMIN-SETUP.md.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Contact Info</h1>
      <p className="text-sm text-navy/50 mb-6">
        Shown in the site header, footer, and Contact page.
      </p>

      <div className="bg-white rounded-xl border border-black/5 p-6 max-w-lg">
        {!info ? (
          <div className="flex items-center gap-2 text-sm text-navy/40 py-6 justify-center">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        ) : (
          <div className="space-y-4">
            {(
              [
                ["phone", "Phone"],
                ["whatsapp", "WhatsApp Number (digits only, e.g. 923007640392)"],
                ["email", "Email"],
                ["address", "Address"],
                ["hours", "Office Hours"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-navy/60 mb-1.5">{label}</label>
                <input
                  value={info[key]}
                  onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
                  className="w-full rounded-lg border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            ))}

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark disabled:opacity-60 text-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : saved ? (
                <Check size={14} />
              ) : (
                <Save size={14} />
              )}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
