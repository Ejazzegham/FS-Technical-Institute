"use client";

import { useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { Loader2, DatabaseZap, CheckCircle2, AlertTriangle } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  courses,
  testimonials,
  stats,
  aboutStats,
  galleryStats,
  galleryItems,
  liveClasses,
  recordedLectures,
  contactInfo,
  feeSettings,
  softwareTools,
} from "@/lib/data";

type TaskResult = { label: string; status: "pending" | "running" | "done" | "skipped" | "error"; detail?: string };

const TASKS = [
  "site_courses",
  "site_gallery",
  "site_testimonials",
  "site_live_classes",
  "site_recorded_lectures",
  "site_software",
  "site_stats (home/about/gallery)",
  "site_settings (contact)",
  "site_settings (fees)",
] as const;

export default function AdminSeedPage() {
  const [results, setResults] = useState<TaskResult[]>(TASKS.map((label) => ({ label, status: "pending" })));
  const [running, setRunning] = useState(false);
  const [overwrite, setOverwrite] = useState(false);

  function update(i: number, patch: Partial<TaskResult>) {
    setResults((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function isEmpty(collectionName: string) {
    const snap = await getDocs(collection(db, collectionName));
    return snap.empty;
  }

  async function run() {
    setRunning(true);
    setResults(TASKS.map((label) => ({ label, status: "pending" })));

    try {
      // 1. Courses
      update(0, { status: "running" });
      if (overwrite || (await isEmpty("site_courses"))) {
        for (const c of courses) await setDoc(doc(db, "site_courses", c.slug), c);
        update(0, { status: "done", detail: `${courses.length} courses` });
      } else {
        update(0, { status: "skipped", detail: "already has data" });
      }

      // 2. Gallery
      update(1, { status: "running" });
      if (overwrite || (await isEmpty("site_gallery"))) {
        for (let i = 0; i < galleryItems.length; i++) {
          const g = galleryItems[i];
          await setDoc(doc(db, "site_gallery", g.id), { ...g, order: i });
        }
        update(1, { status: "done", detail: `${galleryItems.length} items` });
      } else {
        update(1, { status: "skipped", detail: "already has data" });
      }

      // 3. Testimonials
      update(2, { status: "running" });
      if (overwrite || (await isEmpty("site_testimonials"))) {
        for (let i = 0; i < testimonials.length; i++) {
          await setDoc(doc(db, "site_testimonials", `t${i + 1}`), { ...testimonials[i], order: i });
        }
        update(2, { status: "done", detail: `${testimonials.length} testimonials` });
      } else {
        update(2, { status: "skipped", detail: "already has data" });
      }

      // 4. Live classes
      update(3, { status: "running" });
      if (overwrite || (await isEmpty("site_live_classes"))) {
        for (let i = 0; i < liveClasses.length; i++) {
          const lc = liveClasses[i];
          await setDoc(doc(db, "site_live_classes", lc.id), { ...lc, order: i });
        }
        update(3, { status: "done", detail: `${liveClasses.length} classes` });
      } else {
        update(3, { status: "skipped", detail: "already has data" });
      }

      // 5. Recorded lectures
      update(4, { status: "running" });
      if (overwrite || (await isEmpty("site_recorded_lectures"))) {
        for (let i = 0; i < recordedLectures.length; i++) {
          const rl = recordedLectures[i];
          await setDoc(doc(db, "site_recorded_lectures", rl.id), { ...rl, order: i });
        }
        update(4, { status: "done", detail: `${recordedLectures.length} lectures` });
      } else {
        update(4, { status: "skipped", detail: "already has data" });
      }

      // 6. Software & tools reference list
      update(5, { status: "running" });
      if (overwrite || (await isEmpty("site_software"))) {
        for (let i = 0; i < softwareTools.length; i++) {
          const sw = softwareTools[i];
          await setDoc(doc(db, "site_software", sw.id), { ...sw, order: i });
        }
        update(5, { status: "done", detail: `${softwareTools.length} tools` });
      } else {
        update(5, { status: "skipped", detail: "already has data" });
      }

      // 7. Stats
      update(6, { status: "running" });
      await setDoc(doc(db, "site_stats", "home"), { items: stats });
      await setDoc(doc(db, "site_stats", "about"), { items: aboutStats });
      await setDoc(doc(db, "site_stats", "gallery"), { items: galleryStats });
      update(6, { status: "done" });

      // 8. Contact settings
      update(7, { status: "running" });
      await setDoc(doc(db, "site_settings", "contact"), contactInfo);
      update(7, { status: "done" });

      // 9. Fee settings
      update(8, { status: "running" });
      await setDoc(doc(db, "site_settings", "fees"), feeSettings);
      update(8, { status: "done" });
    } catch (err) {
      console.error(err);
      const i = results.findIndex((r) => r.status === "running");
      if (i >= 0) update(i, { status: "error", detail: "Check Firestore rules — see ADMIN-SETUP.md" });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Seed Content</h1>
      <p className="text-sm text-navy/50 mb-6 max-w-2xl">
        Copies the site&apos;s current built-in content (from <code>lib/data.ts</code>) into Firestore so it
        becomes editable here. Safe to run once — by default it skips any collection that already has data,
        so it won&apos;t overwrite your edits.
      </p>

      <label className="flex items-center gap-2 text-sm text-navy/70 mb-5">
        <input
          type="checkbox"
          checked={overwrite}
          onChange={(e) => setOverwrite(e.target.checked)}
          className="rounded"
        />
        Overwrite existing content (re-seed from scratch)
      </label>

      <button
        onClick={run}
        disabled={running}
        className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors mb-6"
      >
        {running ? <Loader2 size={15} className="animate-spin" /> : <DatabaseZap size={15} />}
        {running ? "Seeding…" : "Run Seed"}
      </button>

      <div className="bg-white rounded-xl border border-black/5 divide-y divide-black/5">
        {results.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-5 py-3.5 text-sm">
            <span className="text-navy/80">{r.label}</span>
            <span className="flex items-center gap-1.5 text-xs">
              {r.status === "pending" && <span className="text-navy/30">Waiting</span>}
              {r.status === "running" && (
                <span className="flex items-center gap-1 text-navy/50">
                  <Loader2 size={12} className="animate-spin" /> Running
                </span>
              )}
              {r.status === "done" && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={12} /> Done{r.detail ? ` — ${r.detail}` : ""}
                </span>
              )}
              {r.status === "skipped" && <span className="text-navy/40">Skipped — {r.detail}</span>}
              {r.status === "error" && (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertTriangle size={12} /> {r.detail ?? "Error"}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
