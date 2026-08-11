import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Headphones, ArrowRight, MessageCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { getContactInfo } from "@/lib/content";

export default async function ContactPage() {
  const contactInfo = await getContactInfo();
  const mapQuery = encodeURIComponent(`Furqan Saeed Technical Institute, ${contactInfo.address}`);
  const whatsappNumber = contactInfo.whatsapp.replace(/[^\d]/g, "");
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello FSTI, I'd like more information."
  )}`;

  const infoCards = [
    {
      icon: Phone,
      title: "Call Us",
      lines: [contactInfo.phone],
    },
    {
      icon: Mail,
      title: "Email Us",
      lines: [contactInfo.email, "We reply within 24 hours"],
    },
    {
      icon: MapPin,
      title: "Visit Us",
      lines: [contactInfo.address],
    },
    {
      icon: Clock,
      title: "Office Hours",
      lines: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"],
    },
  ];

  return (
    <>
      {/* Hero */}
      <PageHero
        breadcrumb="Home > Contact Us"
        title="Contact Us"
        tagline="We're Here to Help You!"
        description="Have a question or need more information? Reach out to us and our team will get back to you shortly."
        image="/images/contact-hero.png"
        mobileImage="/images/contact-hero-mobile.png"
        alt="Contact Furqan Saeed Technical Institute — quick support, live chat, email, call and visit"
        theme="light"
        focus="68% center"
        primaryCta={{ label: "Get in Touch", href: "#contact-form" }}
      />

      {/* Info cards */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 -mt-10 relative z-10 mb-16">
        <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-black/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-black/5">
          {infoCards.map((card) => (
            <div key={card.title} className="flex items-start gap-3 px-6 py-6">
              <span className="w-11 h-11 rounded-full bg-navy flex items-center justify-center shrink-0">
                <card.icon size={18} className="text-gold" />
              </span>
              <div>
                <p className="font-semibold text-navy text-sm mb-1">{card.title}</p>
                {card.lines.map((line) => (
                  <p key={line} className="text-xs text-navy/55 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section id="contact-form" className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 grid lg:grid-cols-2 gap-8">
        <ContactForm />

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-7 flex flex-col">
          <h2 className="font-display font-bold text-navy text-xl mb-4">Find Us Here</h2>
          <div className="flex-1 rounded-xl overflow-hidden min-h-[320px] border border-black/5">
            <iframe
              title="FSTI location map"
              src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="bg-navy rounded-2xl px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <span className="hidden md:flex w-14 h-14 rounded-full border-2 border-gold/40 items-center justify-center shrink-0">
              <Headphones size={24} className="text-gold" />
            </span>
            <div>
              <h3 className="font-display font-bold text-white text-xl">
                Need Immediate Assistance?
              </h3>
              <p className="text-white/60 text-sm mt-1">
                Talk to our admission advisor for quick guidance.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Talk to Advisor <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
