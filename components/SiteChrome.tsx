"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { ContactInfo } from "@/lib/content";

const CHROMELESS_PREFIXES = ["/login", "/register", "/admin", "/portal"];

export default function SiteChrome({
  children,
  contactInfo,
}: {
  children: React.ReactNode;
  contactInfo?: ContactInfo;
}) {
  const pathname = usePathname();
  const chromeless = CHROMELESS_PREFIXES.some((p) => pathname?.startsWith(p));

  if (chromeless) {
    return <>{children}</>;
  }

  return (
    <>
      <Header contactInfo={contactInfo} />
      <main className="flex-1">{children}</main>
      <Footer contactInfo={contactInfo} />
      <WhatsAppButton contactInfo={contactInfo} />
    </>
  );
}
