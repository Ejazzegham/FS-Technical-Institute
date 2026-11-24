// Content fetchers — every piece of editable site content is read from
// Firestore. There are NO built-in fallbacks: if a collection hasn't been
// seeded yet the getters return empty structures and pages simply hide the
// empty sections. Run /admin/seed once to copy the starter content in.
//
// These use the Firebase *client* SDK (same as app/api/*/route.ts), so reads
// rely on Firestore rules allowing public reads of `site_*` (see
// firestore.rules).

import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  Course,
  Testimonial,
  StatItem,
  GalleryItem,
  LiveClass,
  RecordedLecture,
  SiteEvent,
  ContactInfo,
  FeeSettings,
  HeroSlide,
  HomeContent,
  AboutContent,
  AdmissionsContent,
  OnlineClassContent,
  CourseHighlightsContent,
  PrintingPressContent,
  NavigationContent,
  SocialContent,
  AnnouncementContent,
  Faq,
  Instructor,
} from "@/lib/types";

export type { Testimonial, StatItem, GalleryItem, SiteEvent, ContactInfo, FeeSettings };

// Structural empties (no institute content) so consumers never see `undefined`.
export const EMPTY_CONTACT: ContactInfo = { phone: "", whatsapp: "", email: "", address: "", hours: "" };
export const EMPTY_FEES: FeeSettings = { admissionFee: "", feeNote: "" };
const EMPTY_HOME: HomeContent = {
  whyChooseUs: [], aboutEyebrow: "", aboutTitle: "", aboutText: "",
  popularEyebrow: "", popularTitle: "", ctaTitle: "", ctaSubtitle: "", ctaButton: "",
};
const EMPTY_ABOUT: AboutContent = {
  heroTagline: "", heroDescription: "", whoEyebrow: "", whoTitle: "", whoText1: "", whoText2: "",
  mission: "", vision: "", values: [], commitments: [], leadershipTitle: "", leadershipText: "", leadership: [],
};
const EMPTY_ADMISSIONS: AdmissionsContent = { process: [], documents: [], batches: [] };
const EMPTY_PRESS: PrintingPressContent = {
  phone: "", highlights: [], printingServices: [], largeFormatServices: [], finishingServices: [], sliderImages: [],
};
const EMPTY_NAV: NavigationContent = { navLinks: [], footerLinks: [] };
const EMPTY_ANNOUNCEMENT: AnnouncementContent = { enabled: false, text: "", href: "", linkLabel: "" };

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

/** Read one `site_content/<key>` document, merged over a structural empty. */
async function getContentDoc<T extends object>(key: string, empty: T): Promise<T> {
  try {
    const snap = await getDoc(doc(db, "site_content", key));
    if (snap.exists()) return { ...empty, ...(snap.data() as Partial<T>) };
  } catch (err) {
    console.error("content: failed to read site_content/" + key, err);
  }
  return empty;
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export async function getCourses(): Promise<Course[]> {
  const docs = await safeGetDocs("site_courses");
  if (!docs) return [];
  return dedupeCourses(docs.map((d) => d.data() as Course));
}

// The admin panel can end up with the same course saved twice (e.g. one
// doc keyed by slug and another with an auto id). Keep the first of each
// slug / title so a course never renders twice on the site.
function dedupeCourses(list: Course[]): Course[] {
  const seenSlugs = new Set<string>();
  const seenTitles = new Set<string>();
  const norm = (t: string) => (t ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return list.filter((c) => {
    const slug = (c.slug ?? "").trim().toLowerCase();
    const title = norm(c.title);
    if ((slug && seenSlugs.has(slug)) || (title && seenTitles.has(title))) return false;
    if (slug) seenSlugs.add(slug);
    if (title) seenTitles.add(title);
    return true;
  });
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  try {
    const snap = await getDoc(doc(db, "site_courses", slug));
    if (snap.exists()) return snap.data() as Course;
  } catch (err) {
    console.error("content: failed to read course", slug, err);
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export async function getTestimonials(): Promise<Testimonial[]> {
  const docs = await safeGetDocs("site_testimonials");
  return (docs ?? []).map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, "id">) }));
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const docs = await safeGetDocs("site_gallery");
  return (docs ?? []).map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, "id">) }));
}

export async function getLiveClasses(): Promise<LiveClass[]> {
  const docs = await safeGetDocs("site_live_classes");
  return (docs ?? []).map((d) => ({ id: d.id, ...(d.data() as Omit<LiveClass, "id">) }));
}

export async function getRecordedLectures(): Promise<RecordedLecture[]> {
  const docs = await safeGetDocs("site_recorded_lectures");
  return (docs ?? []).map((d) => ({ id: d.id, ...(d.data() as Omit<RecordedLecture, "id">) }));
}

export async function getFaqs(): Promise<Faq[]> {
  const docs = await safeGetDocs("site_faqs");
  return (docs ?? []).map((d) => ({ id: d.id, ...(d.data() as Omit<Faq, "id">) }));
}

export async function getInstructors(): Promise<Instructor[]> {
  const docs = await safeGetDocs("site_instructors");
  return (docs ?? []).map((d) => ({ id: d.id, ...(d.data() as Omit<Instructor, "id">) }));
}

// Events & highlights shown in the home-page spotlight.
export async function getEvents(): Promise<SiteEvent[]> {
  const docs = await safeGetDocs("site_events");
  if (!docs) return [];
  return docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<SiteEvent, "id">) }))
    .filter((e) => e.status !== "Hidden" && e.title)
    .sort((a, b) => {
      const o = (a.order ?? 0) - (b.order ?? 0);
      if (o !== 0) return o;
      return (a.eventDate || "9999").localeCompare(b.eventDate || "9999");
    });
}

// ---------------------------------------------------------------------------
// Stats & settings
// ---------------------------------------------------------------------------

// Stats come in three flavors (home / about / gallery), stored as one doc
// each in `site_stats` so the admin can edit them independently.
export async function getStats(key: "home" | "about" | "gallery"): Promise<StatItem[]> {
  try {
    const snap = await getDoc(doc(db, "site_stats", key));
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.items)) return data.items as StatItem[];
    }
  } catch (err) {
    console.error("content: failed to read stats", key, err);
  }
  return [];
}

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const snap = await getDoc(doc(db, "site_settings", "contact"));
    // Merge over an all-empty-strings base so every property is always defined
    // (anything calling .replace()/.trim() on it, e.g. WhatsAppButton, is safe).
    if (snap.exists()) return { ...EMPTY_CONTACT, ...(snap.data() as Partial<ContactInfo>) };
  } catch (err) {
    console.error("content: failed to read contact info", err);
  }
  return EMPTY_CONTACT;
}

export async function getFeeSettings(): Promise<FeeSettings> {
  try {
    const snap = await getDoc(doc(db, "site_settings", "fees"));
    if (snap.exists()) return { ...EMPTY_FEES, ...(snap.data() as Partial<FeeSettings>) };
  } catch (err) {
    console.error("content: failed to read fee settings", err);
  }
  return EMPTY_FEES;
}

// ---------------------------------------------------------------------------
// Page content documents (`site_content/<key>`)
// ---------------------------------------------------------------------------

export const getHomeContent = () => getContentDoc<HomeContent>("home", EMPTY_HOME);
export const getAboutContent = () => getContentDoc<AboutContent>("about", EMPTY_ABOUT);
export const getAdmissionsContent = () => getContentDoc<AdmissionsContent>("admissions", EMPTY_ADMISSIONS);
export const getOnlineClassContent = () => getContentDoc<OnlineClassContent>("online_class", { features: [] });
export const getPrintingPressContent = () => getContentDoc<PrintingPressContent>("printing_press", EMPTY_PRESS);
export const getNavigation = () => getContentDoc<NavigationContent>("navigation", EMPTY_NAV);
export const getSocial = () => getContentDoc<SocialContent>("social", { links: [] });
export const getAnnouncement = () => getContentDoc<AnnouncementContent>("announcement", EMPTY_ANNOUNCEMENT);

export async function getCourseHighlights(): Promise<string[]> {
  return (await getContentDoc<CourseHighlightsContent>("course_highlights", { items: [] })).items;
}

export async function getHeroSlides(page: "home" | "press"): Promise<HeroSlide[]> {
  return (await getContentDoc<{ slides: HeroSlide[] }>(page === "home" ? "hero_home" : "hero_press", { slides: [] })).slides;
}

/** Everything the site header / footer / announcement bar need, in one call. */
export async function getSiteChrome() {
  const [contactInfo, courses, navigation, social, announcement] = await Promise.all([
    getContactInfo(),
    getCourses(),
    getNavigation(),
    getSocial(),
    getAnnouncement(),
  ]);
  return { contactInfo, courses, navigation, social, announcement };
}
