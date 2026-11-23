import type { NextConfig } from "next";

// Images uploaded from the admin panel live on Cloudflare R2 (a public
// r2.dev URL or your own custom domain) — next/image must be told to allow it.
const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
  { protocol: "https", hostname: "**.r2.dev" },
];
try {
  if (process.env.CLOUDFLARE_R2_PUBLIC_URL) {
    const u = new URL(process.env.CLOUDFLARE_R2_PUBLIC_URL);
    remotePatterns.push({ protocol: u.protocol.replace(":", "") as "http" | "https", hostname: u.hostname });
  }
} catch {
  /* ignore malformed URL */
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
