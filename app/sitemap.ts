import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

const STATIC_ROUTES = [
  "", "/about", "/courses", "/online-class", "/gallery", "/admissions", "/verification", "/contact",
  "/printing-press", "/faq", "/faculty", "/demo-class", "/course-finder", "/fee-calculator",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const courses = await getCourses();
  return [
    ...STATIC_ROUTES.map((p) => ({ url: base + p, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...courses.map((c) => ({ url: `${base}/courses/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
