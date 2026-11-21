// Content fetchers — read editable site content from Firestore, falling
// back to the static defaults in lib/data.ts if a collection hasn't been
// seeded yet (see /admin/seed). This lets the site keep working out of the
// box, and lets the admin panel take over once content is migrated.
//
// These use the same Firebase *client* SDK the rest of the app already uses
// server-side (see app/api/*/route.ts) — there's no separate Admin SDK/
// service account in this project, so reads rely on Firestore security
// rules allowing public reads of the `site_*` collections (see
// ADMIN-SETUP.md).

import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  courses as staticCourses,
  testimonials as staticTestimonials,
  stats as staticStats,
  aboutStats as staticAboutStats,
  galleryStats as staticGalleryStats,
  galleryItems as staticGalleryItems,
  liveClasses as staticLiveClasses,
  recordedLectures as staticRecordedLectures,
  contactInfo as staticContactInfo,
  feeSettings as staticFeeSettings,
  type Course,
  type LiveClass,
  type RecordedLecture,
  type GalleryCategory,
} from "@/lib/data";

export type Testimonial = { id?: string; name: string; role: string; quote: string };
export type StatItem = { label: string; value: string };
export type GalleryItem = { id: string; category: GalleryCategory; caption: string; imageUrl?: string };
export type ContactInfo = typeof staticContactInfo;
export type FeeSettings = typeof staticFeeSettings;

async function safeGetDocs(collectionName: string) {
  try {
    const snap = await getDocs(collection(db, collectionName));
    const docs = [...snap.docs];
    docs.sort((a, b) => {
      const oa = (a.data() as { order?: number }).order ?? 0;
      const ob = (b.data() as { order?: number }).order ?? 0;
      return oa - ob;
    });
    return docs;
  } catch (err) {
    console.error(`content: failed to read ${collectionName}`, err);
    return null;
  }
}

export async function getCourses(): Promise<Course[]> {
  const docs = await safeGetDocs("site_courses");
  if (!docs || docs.length === 0) return staticCourses;
  return docs.map((d) => d.data() as Course);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  try {
    const snap = await getDoc(doc(db, "site_courses", slug));
    if (snap.exists()) return snap.data() as Course;
  } catch (err) {
    console.error("content: failed to read course", slug, err);
  }
  return staticCourses.find((c) => c.slug === slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const docs = await safeGetDocs("site_testimonials");
  if (!docs || docs.length === 0) return staticTestimonials;
  return docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, "id">) }));
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const docs = await safeGetDocs("site_gallery");
  if (!docs || docs.length === 0) return staticGalleryItems;
  return docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, "id">) }));
}

export async function getLiveClasses(): Promise<LiveClass[]> {
  const docs = await safeGetDocs("site_live_classes");
  if (!docs || docs.length === 0) return staticLiveClasses;
  return docs.map((d) => ({ id: d.id, ...(d.data() as Omit<LiveClass, "id">) }));
}

export async function getRecordedLectures(): Promise<RecordedLecture[]> {
  const docs = await safeGetDocs("site_recorded_lectures");
  if (!docs || docs.length === 0) return staticRecordedLectures;
  return docs.map((d) => ({ id: d.id, ...(d.data() as Omit<RecordedLecture, "id">) }));
}

// Stats come in three flavors (home / about / gallery), stored as one doc
// each in `site_stats` so the admin can edit them independently.
export async function getStats(key: "home" | "about" | "gallery"): Promise<StatItem[]> {
  const fallback = key === "gallery" ? staticGalleryStats : key === "about" ? staticAboutStats : staticStats;
  try {
    const snap = await getDoc(doc(db, "site_stats", key));
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.items) && data.items.length > 0) return data.items as StatItem[];
    }
  } catch (err) {
    console.error("content: failed to read stats", key, err);
  }
  return fallback;
}

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const snap = await getDoc(doc(db, "site_settings", "contact"));
    // Merge over the static defaults rather than replacing them outright —
    // if the Firestore doc was saved before a field (e.g. `whatsapp`) was
    // added, or that field was left blank, this keeps every ContactInfo
    // property defined instead of `undefined`, which crashes anything that
    // calls .replace()/.trim() etc. on it (see WhatsAppButton).
    if (snap.exists()) return { ...staticContactInfo, ...(snap.data() as Partial<ContactInfo>) };
  } catch (err) {
    console.error("content: failed to read contact info", err);
  }
  return staticContactInfo;
}

export async function getFeeSettings(): Promise<FeeSettings> {
  try {
    const snap = await getDoc(doc(db, "site_settings", "fees"));
    if (snap.exists()) return { ...staticFeeSettings, ...(snap.data() as Partial<FeeSettings>) };
  } catch (err) {
    console.error("content: failed to read fee settings", err);
  }
  return staticFeeSettings;
}
