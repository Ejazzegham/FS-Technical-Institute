"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnnouncementBar from "@/components/AnnouncementBar";
import SiteSearch, { type SearchItem } from "@/components/SiteSearch";
import type { ContactInfo } from "@/lib/content";
import type { AnnouncementContent, NavigationContent, SocialContent } from "@/lib/types";

const CHROMELESS_PREFIXES = ["/login", "/register", "/admin", "/portal"];

export default function SiteChrome({
  children,
  contactInfo,
  courses,
  navigation,
  social,
  announcement,
  searchItems,
}: {
  children: React.ReactNode;
  contactInfo: ContactInfo;
  courses?: { slug: string; title: string }[];
  navigation: NavigationContent;
  social: SocialContent;
  announcement: AnnouncementContent;
  searchItems: SearchItem[];
}) {
  const pathname = usePathname();
  const chromeless = CHROMELESS_PREFIXES.some((p) => pathname?.startsWith(p));

  if (chromeless) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar announcement={announcement} />
      <Header contactInfo={contactInfo} navLinks={navigation.navLinks} social={social.links} />
      <main className="flex-1">{children}</main>
      <Footer contactInfo={contactInfo} courses={courses} quickLinks={navigation.footerLinks} social={social.links} />
      <WhatsAppButton contactInfo={contactInfo} />
      <SiteSearch items={searchItems} />
    </>
  );
}
