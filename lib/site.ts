// Public base URL for sitemap, canonical links and structured data.
// Set NEXT_PUBLIC_SITE_URL (e.g. https://your-domain.com) in production.
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
