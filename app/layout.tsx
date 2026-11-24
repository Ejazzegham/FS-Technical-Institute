import type { Metadata } from "next";
import { Noticia_Text, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import SplashScreen from "@/components/SplashScreen";
import { getSiteChrome } from "@/lib/content";
import type { SearchItem } from "@/components/SiteSearch";
import { siteUrl } from "@/lib/site";

const display = Noticia_Text({
  variable: "--font-display-loaded",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const body = Inter({
  variable: "--font-body-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Furqan Saeed Technical Institute | Learn Skills. Build Your Future.",
  description:
    "Furqan Saeed Technical Institute (FSTI) offers quality technical education in Web Development, Graphic Design, Cyber Security, Digital Marketing and MS Office to help you build a successful career.",
};

// Public pages are pre-built for speed. The admin panel refreshes them
// instantly after each save (/api/admin/revalidate); this is the safety net
// so that nothing ever stays stale for longer than a minute.
export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { contactInfo, courses, navigation, social, announcement } = await getSiteChrome();
  const footerCourses = courses.map(({ slug, title }) => ({ slug, title }));

  // Command-palette search index: live courses + site links + premium tools.
  const tools: SearchItem[] = [
    { title: "Course Finder", href: "/course-finder", hint: "Answer 4 questions and get a course match" },
    { title: "Fee Calculator", href: "/fee-calculator", hint: "Estimate your total fee and monthly plan" },
    { title: "Book a Free Demo Class", href: "/demo-class", hint: "Try a class before you enrol" },
    { title: "Our Faculty", href: "/faculty", hint: "Meet the instructors" },
    { title: "FAQs", href: "/faq", hint: "Answers to common questions" },
  ];
  const seen = new Set<string>();
  const searchItems: SearchItem[] = [
    ...courses.map((c) => ({ title: c.title, href: `/courses/${c.slug}`, hint: `Course · ${c.category}` })),
    ...[...navigation.navLinks, ...navigation.footerLinks].map((l) => ({ title: l.label, href: l.href, hint: "Page" })),
    ...tools,
  ].filter((i) => (seen.has(i.href) ? false : (seen.add(i.href), true)));
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-navy">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Furqan Saeed Technical Institute",
              alternateName: "FSTI",
              url: siteUrl(),
              logo: `${siteUrl()}/images/logo.png`,
              email: contactInfo.email || undefined,
              telephone: contactInfo.phone || undefined,
              address: contactInfo.address ? { "@type": "PostalAddress", streetAddress: contactInfo.address } : undefined,
              sameAs: social.links.map((l) => l.href).filter(Boolean),
            }),
          }}
        />
        <SplashScreen />
        <SiteChrome
          contactInfo={contactInfo}
          courses={footerCourses}
          navigation={navigation}
          social={social}
          announcement={announcement}
          searchItems={searchItems}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
