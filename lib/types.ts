// Shared types for site content. The content itself lives in Firestore
// (collections `site_*`); the only place hardcoded copies exist is
// lib/seedData.ts, which is used exclusively by /admin/seed.

export type CourseCategory =
  | "IT & Programming"
  | "Design & Multimedia"
  | "Freelancing"
  | "Digital Marketing"
  | "Microsoft Office"
  | "Trading & Finance"
  | "Personal Development";

export type CourseIcon =
  | "code"
  | "palette"
  | "trending-up"
  | "layout-grid"
  | "smartphone"
  | "terminal"
  | "video"
  | "ruler"
  | "megaphone"
  | "briefcase"
  | "youtube"
  | "line-chart"
  | "languages"
  | "graduation-cap";

export type Course = {
  slug: string;
  title: string;
  category: CourseCategory;
  icon: CourseIcon;
  overview: string;
  description: string;
  duration: string;
  level: string;
  monthlyFee?: string;
  rating?: number;
  reviewsCount?: number;
  enrolledStudents?: number;
  completedStudents?: number;
  curriculum: string[];
  curriculumGroups?: { title: string; items: string[] }[];
  projects: string[];
  practiceGroups?: { title: string; items: string[] }[];
  careers: string[];
  image?: string;
};

export type Testimonial = { id?: string; name: string; role: string; quote: string };
export type StatItem = { label: string; value: string };

export type GalleryCategory = "Classrooms" | "Labs" | "Events" | "Workshops" | "Achievements";
export type GalleryItem = { id: string; category: GalleryCategory; caption: string; imageUrl?: string };

export type LiveClass = {
  id: string;
  courseSlug: string;
  title: string;
  instructor: string;
  time: string;
  studentsOnline: number;
};

export type RecordedLecture = {
  id: string;
  courseSlug: string;
  title: string;
  instructor: string;
  duration: string;
};

export type SoftwareTool = {
  id: string;
  name: string;
  category: "Live Classes" | "Recording Lectures" | "Both";
  purpose: string;
  website?: string;
};

export type SiteEvent = {
  id: string;
  title: string;
  badge?: string;
  description?: string;
  mediaType?: "Image" | "Video" | "Text only";
  imageUrl?: string;
  videoUrl?: string;
  eventDate?: string;
  venue?: string;
  ctaLabel?: string;
  ctaHref?: string;
  expiresAt?: string;
  status?: "Live" | "Hidden";
  order?: number;
};

export type ContactInfo = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
};

export type FeeSettings = {
  admissionFee: string;
  feeNote: string;
};

export type HeroSlide = {
  image: string;
  /** Optional mobile-specific crop shown below the md breakpoint. */
  mobileImage?: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  /** "light" = bright area behind the text (navy text); "dark" = white text. */
  theme: "light" | "dark";
  /** CSS object-position, tuned per photo. */
  focus?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

// ---- Page content documents (collection `site_content`, one doc per key) ----

export type HomeContent = {
  whyChooseUs: { title: string; desc: string; icon: string }[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  popularEyebrow: string;
  popularTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
};

export type AboutContent = {
  heroTagline: string;
  heroDescription: string;
  whoEyebrow: string;
  whoTitle: string;
  whoText1: string;
  whoText2: string;
  mission: string;
  vision: string;
  values: string[];
  commitments: string[];
  leadershipTitle: string;
  leadershipText: string;
  leadership: { name: string; role: string; image: string; bio: string[] }[];
};

export type AdmissionsContent = {
  process: { step: number; title: string; desc: string }[];
  documents: string[];
  batches: string[];
};

export type OnlineClassContent = { features: { title: string; desc: string }[] };
export type CourseHighlightsContent = { items: string[] };

export type PrintingPressContent = {
  phone: string;
  highlights: { icon: string; label: string }[];
  printingServices: string[];
  largeFormatServices: string[];
  finishingServices: string[];
  sliderImages: { src: string; alt: string }[];
};

export type NavigationContent = {
  navLinks: { href: string; label: string }[];
  footerLinks: { href: string; label: string }[];
};

export type SocialContent = { links: { label: string; href: string }[] };

export type AnnouncementContent = { enabled: boolean; text: string; href: string; linkLabel: string };

export type HeroContent = { slides: HeroSlide[] };

// ---- Premium features ----

export type Faq = { id?: string; question: string; answer: string; category?: string; order?: number };

export type Instructor = {
  id?: string;
  name: string;
  title: string;
  bio: string;
  expertise: string;
  experience?: string;
  image?: string;
  order?: number;
};

export type DemoRequest = {
  name: string;
  phone: string;
  email?: string;
  course: string;
  preferredTime: string;
  mode: "On-campus" | "Online";
  message?: string;
};
