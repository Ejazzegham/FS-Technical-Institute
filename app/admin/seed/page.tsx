"use client";

import { useState } from "react";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { Loader2, DatabaseZap, CheckCircle2, AlertTriangle } from "lucide-react";
import { revalidateSite } from "@/lib/adminClient";
import { db } from "@/lib/firebase";
import * as seed from "@/lib/seedData";

type TaskResult = { label: string; status: "pending" | "running" | "done" | "skipped" | "error"; detail?: string };

type Task = { label: string; run: (overwrite: boolean) => Promise<string | void> };

async function isEmpty(collectionName: string) {
  const snap = await getDocs(collection(db, collectionName));
  return snap.empty;
}

/** Seed a collection of documents unless it already has data (or overwrite is on). */
function collectionTask<T extends object>(
  label: string,
  name: string,
  items: T[],
  idOf: (item: T, i: number) => string,
  unit: string,
): Task {
  return {
    label,
    run: async (overwrite) => {
      if (!overwrite && !(await isEmpty(name))) return "skipped";
      for (let i = 0; i < items.length; i++) {
        await setDoc(doc(db, name, idOf(items[i], i)), { ...items[i], order: i });
      }
      return `${items.length} ${unit}`;
    },
  };
}

/** Seed one `site_content/<key>` document unless it already exists (or overwrite is on). */
function contentTask(label: string, key: string, data: object): Task {
  return {
    label,
    run: async (overwrite) => {
      const ref = doc(db, "site_content", key);
      if (!overwrite && (await getDoc(ref)).exists()) return "skipped";
      await setDoc(ref, JSON.parse(JSON.stringify(data)));
    },
  };
}

function settingsTask(label: string, key: string, data: object): Task {
  return {
    label,
    run: async (overwrite) => {
      const ref = doc(db, "site_settings", key);
      if (!overwrite && (await getDoc(ref)).exists()) return "skipped";
      await setDoc(ref, data);
    },
  };
}

const TASKS: Task[] = [
  {
    label: "site_courses",
    run: async (overwrite) => {
      if (!overwrite && !(await isEmpty("site_courses"))) return "skipped";
      for (const c of seed.courses) await setDoc(doc(db, "site_courses", c.slug), JSON.parse(JSON.stringify(c)));
      return `${seed.courses.length} courses`;
    },
  },
  collectionTask("site_gallery", "site_gallery", seed.galleryItems, (g) => g.id, "items"),
  collectionTask("site_testimonials", "site_testimonials", seed.testimonials, (_, i) => `t${i + 1}`, "testimonials"),
  collectionTask("site_live_classes", "site_live_classes", seed.liveClasses, (l) => l.id, "classes"),
  collectionTask("site_recorded_lectures", "site_recorded_lectures", seed.recordedLectures, (l) => l.id, "lectures"),
  collectionTask("site_software", "site_software", seed.softwareTools, (t) => t.id, "tools"),
  collectionTask("site_faqs (FAQ page)", "site_faqs", seed.faqs, (_, i) => `faq${i + 1}`, "FAQs"),
  collectionTask("site_instructors (Faculty page)", "site_instructors", seed.instructors, (_, i) => `ins${i + 1}`, "instructors"),
  {
    label: "site_stats (home / about / gallery)",
    run: async (overwrite) => {
      if (!overwrite && (await getDoc(doc(db, "site_stats", "home"))).exists()) return "skipped";
      await setDoc(doc(db, "site_stats", "home"), { items: seed.stats });
      await setDoc(doc(db, "site_stats", "about"), { items: seed.aboutStats });
      await setDoc(doc(db, "site_stats", "gallery"), { items: seed.galleryStats });
    },
  },
  settingsTask("site_settings (contact)", "contact", seed.contactInfo),
  settingsTask("site_settings (fees)", "fees", seed.feeSettings),
  contentTask("Home hero slides", "hero_home", { slides: seed.homeHeroSlides }),
  contentTask("Printing Press hero slides", "hero_press", { slides: seed.pressHeroSlides }),
  contentTask("Home page text", "home", seed.homeContent),
  contentTask("About page text & leadership", "about", seed.aboutContent),
  contentTask("Admissions (process, documents, batches)", "admissions", seed.admissionsContent),
  contentTask("Online class features", "online_class", seed.onlineClassContent),
  contentTask("Course highlights", "course_highlights", seed.courseHighlightsContent),
  contentTask("Printing Press page", "printing_press", seed.printingPressContent),
  contentTask("Navigation & footer links", "navigation", seed.navigationContent),
  contentTask("Social links", "social", seed.socialContent),
  contentTask("Announcement bar", "announcement", seed.announcementContent),
];

export default function AdminSeedPage() {
  const [results, setResults] = useState<TaskResult[]>(TASKS.map((t) => ({ label: t.label, status: "pending" })));
  const [running, setRunning] = useState(false);
  const [overwrite, setOverwrite] = useState(false);

  function update(i: number, patch: Partial<TaskResult>) {
    setResults((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function run() {
    setRunning(true);
    setResults(TASKS.map((t) => ({ label: t.label, status: "pending" })));
    let current = -1;
    try {
      for (let i = 0; i < TASKS.length; i++) {
        current = i;
        update(i, { status: "running" });
        const out = await TASKS[i].run(overwrite);
        if (out === "skipped") update(i, { status: "skipped", detail: "already has data" });
        else update(i, { status: "done", detail: out || undefined });
      }
      void revalidateSite();
    } catch (err) {
      console.error(err);
      if (current >= 0) update(current, { status: "error", detail: "Check Firestore rules — see ADMIN-SETUP.md" });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Seed Content</h1>
      <p className="text-sm text-navy/50 mb-6 max-w-2xl">
        Copies the site&apos;s current built-in content (from <code>lib/seedData.ts</code>) into Firestore so it
        becomes editable here. The public site reads everything from Firestore, so run this once after deploying. By default it
        skips anything that already has data, so it never overwrites your edits.
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
        className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors mb-6"
      >
        {running ? <Loader2 size={15} className="animate-spin" /> : <DatabaseZap size={15} />}
        {running ? "Seeding…" : "Run Seed"}
      </button>

      <div className="bg-white rounded-md border border-black/5 divide-y divide-black/5">
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
