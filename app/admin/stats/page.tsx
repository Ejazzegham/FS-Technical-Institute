"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, Save, Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { stats as defaultHome, aboutStats as defaultAbout, galleryStats as defaultGallery } from "@/lib/data";

type StatItem = { label: string; value: string };

const BLOCKS: { statKey: "home" | "about" | "gallery"; title: string; defaults: StatItem[]; hint: string }[] = [
  { statKey: "home", title: "Homepage Stats", defaults: defaultHome, hint: "The 4-number strip under the homepage hero." },
  { statKey: "about", title: "About Page Stats", defaults: defaultAbout, hint: "The 4-number strip on the About page." },
  { statKey: "gallery", title: "Gallery Page Stats", defaults: defaultGallery, hint: "The 4-number strip on the Gallery page." },
];

export default function AdminStatsPage() {
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Stats</h1>
      <p className="text-sm text-navy/50 mb-6">
        Each block has 4 fixed stats (label + value). Edit the numbers shown across the site.
      </p>
      <div className="space-y-6">
        {BLOCKS.map((b) => (
          <StatBlock key={b.statKey} {...b} />
        ))}
      </div>
    </div>
  );
}

function StatBlock({
  statKey: docKey,
  title,
  defaults,
  hint,
}: {
  statKey: "home" | "about" | "gallery";
  title: string;
  defaults: StatItem[];
  hint: string;
}) {
  const [items, setItems] = useState<StatItem[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "site_stats", docKey));
        if (snap.exists() && Array.isArray(snap.data().items) && snap.data().items.length > 0) {
          setItems(snap.data().items as StatItem[]);
        } else {
          setItems(defaults);
        }
      } catch {
        setItems(defaults);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docKey]);

  async function handleSave() {
    if (!items) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "site_stats", docKey), { items });
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
    <div className="bg-white rounded-xl border border-black/5 p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-navy">{title}</h2>
        <button
          onClick={handleSave}
          disabled={saving || !items}
          className="inline-flex items-center gap-1.5 bg-navy hover:bg-navy-light disabled:opacity-60 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
        >
          {saving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : saved ? (
            <Check size={13} />
          ) : (
            <Save size={13} />
          )}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <p className="text-xs text-navy/40 mb-4">{hint}</p>

      {!items ? (
        <div className="flex items-center gap-2 text-sm text-navy/40 py-6 justify-center">
          <Loader2 size={14} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-navy/50 mb-1">Label</label>
                <input
                  value={item.label}
                  onChange={(e) =>
                    setItems((prev) => prev!.map((it, idx) => (idx === i ? { ...it, label: e.target.value } : it)))
                  }
                  className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-navy/50 mb-1">Value</label>
                <input
                  value={item.value}
                  onChange={(e) =>
                    setItems((prev) => prev!.map((it, idx) => (idx === i ? { ...it, value: e.target.value } : it)))
                  }
                  className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
