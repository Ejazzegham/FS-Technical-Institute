import type { Metadata } from "next";
import { Noticia_Text, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import SplashScreen from "@/components/SplashScreen";
import { getContactInfo } from "@/lib/content";

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
  title: "Furqan Saeed Technical Institute | Learn Skills. Build Your Future.",
  description:
    "Furqan Saeed Technical Institute (FSTI) offers quality technical education in Web Development, Graphic Design, Cyber Security, Digital Marketing and MS Office to help you build a successful career.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contactInfo = await getContactInfo();
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-navy">
        <SplashScreen />
        <SiteChrome contactInfo={contactInfo}>{children}</SiteChrome>
      </body>
    </html>
  );
}
