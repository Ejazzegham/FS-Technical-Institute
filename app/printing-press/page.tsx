import Image from "next/image";
import { Printer, LayoutTemplate, Layers, Scissors, Stamp, Truck, PenTool, Phone, MapPin } from "lucide-react";
import PrintingPressSlider from "@/components/PrintingPressSlider";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import { getContactInfo } from "@/lib/content";

// Kept independent from the shared site contact number so it stays fixed
// even if the institute's main phone number (header/footer/contact page)
// changes in the future.
const PRESS_PHONE = "+92346-7640392";

const pressHeroSlides: HeroSlide[] = [
  {
    image: "/images/printing-press/hero-1-panaflex.png",
    alt: "Panaflex printing machine producing a large flex banner",
    eyebrow: "LARGE FORMAT PRINTING",
    title: "Panaflex & Banner Printing",
    description:
      "Vibrant, weatherproof banners, hoardings and signage — printed sharp and built to last.",
    theme: "light",
    focus: "65% center",
    primaryCta: { label: "Call Now: " + PRESS_PHONE, href: "tel:" + PRESS_PHONE.replace(/\s/g, "") },
    secondaryCta: { label: "View Services", href: "#services" },
  },
  {
    image: "/images/printing-press/hero-2-offset.png",
    alt: "Offset printing press producing colorful printed sheets",
    eyebrow: "OFFSET PRINTING",
    title: "High-Volume Offset Printing",
    description:
      "Crisp, consistent color for brochures, stationery and bulk print runs — production-scale quality.",
    theme: "light",
    focus: "65% center",
    primaryCta: { label: "Call Now: " + PRESS_PHONE, href: "tel:" + PRESS_PHONE.replace(/\s/g, "") },
    secondaryCta: { label: "View Services", href: "#services" },
  },
  {
    image: "/images/printing-press/hero-3-digital.png",
    alt: "Digital printing machine producing full-color printed sheets",
    eyebrow: "DIGITAL PRINTING",
    title: "Precision Digital Printing",
    description:
      "Sharp detail and fast turnaround for short runs, proofs, and full-color photo-quality prints.",
    theme: "light",
    focus: "65% center",
    primaryCta: { label: "Call Now: " + PRESS_PHONE, href: "tel:" + PRESS_PHONE.replace(/\s/g, "") },
    secondaryCta: { label: "View Services", href: "#services" },
  },
  {
    image: "/images/printing-press/hero-4-embossing.png",
    alt: "Furqan Saeed Printing Press embossing and stamp-making machine",
    eyebrow: "STAMP & SEAL MAKING",
    title: "Custom Stamps, Seals & Embossing",
    description:
      "Precision-engineered stamps and embossed finishes for certificates, ID cards and official documents.",
    theme: "light",
    focus: "62% center",
    primaryCta: { label: "Call Now: " + PRESS_PHONE, href: "tel:" + PRESS_PHONE.replace(/\s/g, "") },
    secondaryCta: { label: "View Services", href: "#services" },
  },
  {
    image: "/images/printing-press/hero-5-press.png",
    alt: "Furqan Saeed Printing Press large-format press and finishing equipment",
    eyebrow: "FURQAN SAEED PRINTING PRESS",
    title: "Complete Printing Solutions, Under One Roof",
    description:
      "From design to finishing — professional printing equipment delivering quality and precision on every job.",
    theme: "light",
    focus: "65% center",
    primaryCta: { label: "Call Now: " + PRESS_PHONE, href: "tel:" + PRESS_PHONE.replace(/\s/g, "") },
    secondaryCta: { label: "View Services", href: "#services" },
  },
];

const highlights = [
  { icon: Printer, label: "High Quality Printing" },
  { icon: LayoutTemplate, label: "Large Format Printing" },
  { icon: Layers, label: "Paper & Card Printing" },
  { icon: Scissors, label: "Paper Cutting Services" },
  { icon: Stamp, label: "Stamp & Seal Making" },
  { icon: Truck, label: "Fast Delivery On Time" },
  { icon: PenTool, label: "Designing Support" },
];

const printingServices = [
  "Visiting cards & business cards",
  "Letterheads & envelopes",
  "Brochures, flyers & pamphlets",
  "Posters, catalogs & magazines",
  "Booklets, books, notebooks & registers",
  "Forms, invoices, receipts & vouchers",
  "Certificates & ID cards",
  "Invitation, wedding & greeting cards",
  "Calendars, stickers & labels",
  "Product packaging, folders & files",
  "Menus, danglers & tags",
  "Promotional materials",
];

const largeFormatServices = [
  "Panaflex / Flex printing",
  "Vinyl printing & banners",
  "Hoardings & shop signs",
  "Promotional boards & event backdrops",
  "Wall graphics & vehicle branding",
  "Window graphics",
  "Roll-up banners & standees",
  "Billboard printing",
];

const finishingServices = [
  "Graphic & layout designing",
  "Logo placement & image editing",
  "Lamination & cutting",
  "Binding, spiral & hard binding",
  "Folding, creasing & perforation",
  "Stitching & mounting",
];

export default async function PrintingPressPage() {
  const contactInfo = await getContactInfo();

  return (
    <>
      {/* Hero */}
      <HeroSlider slides={pressHeroSlides} />

      {/* Highlights strip */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 -mt-6 md:-mt-8 relative z-10">
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {highlights.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <span className="w-11 h-11 rounded-full border-2 border-navy/10 flex items-center justify-center text-navy">
                <Icon size={18} />
              </span>
              <p className="text-[11px] font-semibold text-navy/70 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intro with picture */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-slate-800 to-navy-dark order-2 md:order-1">
          <Image
            src="/images/printing-press/press-hero.png"
            alt="Furqan Saeed Printing Press — offset and large format printing"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">WHO WE ARE</p>
          <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-5 leading-snug">
            Professional Printing Solutions
            <br />
            Under One Roof
          </h2>
          <p className="text-sm text-navy/60 leading-relaxed mb-4">
            Furqan Saeed Printing Press provides complete and professional printing solutions
            for individuals, businesses, educational institutions, organizations, and events.
            We are committed to delivering high-quality printing, attractive designs, sharp
            colors, durable materials, and timely service for every project.
          </p>
          <p className="text-sm text-navy/60 leading-relaxed">
            From everyday business stationery to large-format advertising and promotional
            materials, we offer a wide range of printing services to meet all your needs —
            using digital printing, offset printing, color printing, black-and-white printing,
            photo printing, and high-resolution large-format printing according to the
            requirements of each project.
          </p>
        </div>
      </section>

      {/* Slider */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <PrintingPressSlider />
      </section>

      {/* Services */}
      <section id="services" className="bg-navy/[0.03] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-gold-dark text-xs font-bold tracking-widest mb-2 text-center">
            OUR PRINTING SERVICES
          </p>
          <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-10 text-center">
            Everything You Need, Printed Right
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
              <span className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center text-navy mb-4">
                <Printer size={18} />
              </span>
              <h3 className="font-display font-bold text-navy text-lg mb-3">Stationery &amp; Print</h3>
              <ul className="space-y-2">
                {printingServices.map((item) => (
                  <li key={item} className="text-sm text-navy/60 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
              <span className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center text-navy mb-4">
                <LayoutTemplate size={18} />
              </span>
              <h3 className="font-display font-bold text-navy text-lg mb-3">Outdoor &amp; Large Format</h3>
              <ul className="space-y-2">
                {largeFormatServices.map((item) => (
                  <li key={item} className="text-sm text-navy/60 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
              <span className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center text-navy mb-4">
                <PenTool size={18} />
              </span>
              <h3 className="font-display font-bold text-navy text-lg mb-3">Designing &amp; Finishing</h3>
              <ul className="space-y-2">
                {finishingServices.map((item) => (
                  <li key={item} className="text-sm text-navy/60 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-navy/60 leading-relaxed mt-4">
                Whether you need a single professional document or a large quantity of
                promotional material, our team focuses on producing a clean, attractive, and
                professional final product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality you can trust */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="bg-navy rounded-2xl px-6 md:px-12 py-12 text-center">
          <p className="text-gold text-xs font-bold tracking-widest mb-3">QUALITY YOU CAN TRUST</p>
          <h2 className="font-display font-bold text-white text-2xl md:text-3xl mb-5 max-w-2xl mx-auto">
            Quality Printing Creates a Strong Impression
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-3xl mx-auto mb-4">
            We use modern printing technology, quality paper and materials, and professional
            finishing techniques to ensure that every order meets high standards. Our goal is
            to provide reliable service, competitive pricing, excellent print quality, and
            on-time delivery for every customer.
          </p>
          <p className="text-white/60 text-sm leading-relaxed max-w-3xl mx-auto">
            From business cards to banners, brochures to books, stickers to Panaflex, and
            stationery to complete promotional branding — Furqan Saeed Printing Press is your
            complete printing partner.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm px-6 md:px-10 py-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <span className="hidden md:flex w-14 h-14 rounded-full border-2 border-gold/40 items-center justify-center shrink-0">
              <Printer size={24} className="text-gold-dark" />
            </span>
            <div>
              <h3 className="font-display font-bold text-navy text-xl">Ready to Print?</h3>
              <p className="text-navy/50 text-sm mt-1 flex flex-col md:flex-row md:items-center md:gap-4">
                <span className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <MapPin size={14} className="text-gold-dark" /> {contactInfo.address}
                </span>
              </p>
            </div>
          </div>
          <a
            href={`tel:${PRESS_PHONE.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold text-sm px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
          >
            <Phone size={15} /> {PRESS_PHONE}
          </a>
        </div>
      </section>
    </>
  );
}
