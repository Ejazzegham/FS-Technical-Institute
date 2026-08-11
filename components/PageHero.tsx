import Image from "next/image";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export type PageHeroChip = {
  icon: LucideIcon;
  label: string;
};

export type PageHeroCta = {
  label: string;
  href: string;
};

export type PageHeroProps = {
  /** Small breadcrumb line above the title, e.g. "Home > About Us" */
  breadcrumb: string;
  title: React.ReactNode;
  /** Short gold highlight line under the title, e.g. "Your Future Starts Here." */
  tagline?: string;
  description: string;
  image: string;
  alt: string;
  /** "light" = image has a bright area behind the text (use navy text).
   *  "dark"  = image is dark behind the text (use white text). */
  theme?: "light" | "dark";
  /** CSS object-position for the image, tuned so the subject stays in frame when cropped. */
  focus?: string;
  primaryCta?: PageHeroCta;
  secondaryCta?: PageHeroCta;
  /** Optional row of small feature chips under the description. */
  chips?: PageHeroChip[];
};

export default function PageHero({
  breadcrumb,
  title,
  tagline,
  description,
  image,
  alt,
  theme = "light",
  focus = "center",
  primaryCta,
  secondaryCta,
  chips,
}: PageHeroProps) {
  const light = theme === "light";

  return (
    <section className="relative w-full overflow-hidden bg-navy rounded-b-[3rem]">
      <div className="relative md:aspect-[12/5] md:max-h-[560px]">
        {/* Image */}
        <div className="relative h-[240px] sm:h-[300px] md:absolute md:inset-0 md:h-full overflow-hidden">
          <Image
            src={image}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover hero-media"
            style={{ "--hero-focus": focus } as React.CSSProperties}
          />
          {/* Desktop scrim: reinforces contrast just behind the text, then clears so the graphic stays vivid */}
          <div
            className={
              "hidden md:block absolute inset-0 pointer-events-none " +
              (light
                ? "bg-gradient-to-r from-white/95 from-0% via-white/55 via-32% to-white/0 to-58%"
                : "bg-gradient-to-r from-navy/90 from-0% via-navy/50 via-32% to-navy/0 to-58%")
            }
          />
          {/* Mobile scrim: settles the image under the panel above it */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
        </div>

        {/* Text panel: overlaid on the image at md+, a solid navy card below it on mobile */}
        <div className="relative bg-navy md:bg-transparent md:absolute md:inset-y-0 md:left-0 md:flex md:items-center md:w-[58%] lg:w-[54%] px-6 py-7 md:px-10 lg:px-16">
          <div className="max-w-md mx-auto text-center md:mx-0 md:text-left">
            <p
              className={
                "text-[11px] mb-3 text-white/50 " + (light ? "md:text-navy/40" : "md:text-white/50")
              }
            >
              {breadcrumb}
            </p>
            <h1
              className={
                "font-display font-extrabold text-3xl md:text-3xl lg:text-4xl leading-tight mb-3 text-white " +
                (light ? "md:text-navy" : "md:text-white")
              }
            >
              {title}
            </h1>
            {tagline && (
              <p
                className={
                  "font-semibold mb-3 text-gold " + (light ? "md:text-gold-dark" : "md:text-gold")
                }
              >
                {tagline}
              </p>
            )}
            <p
              className={
                "text-sm leading-relaxed max-w-sm mx-auto md:mx-0 text-white/70 " +
                (light ? "md:text-navy/60" : "md:text-white/70")
              }
            >
              {description}
            </p>

            {chips && chips.length > 0 && (
              <div className="flex flex-col items-center sm:flex-row sm:flex-wrap justify-center gap-3 mt-5 md:items-start md:justify-start">
                {chips.map((chip) => (
                  <div key={chip.label} className="flex items-center gap-2.5">
                    <span
                      className={
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white/10 " +
                        (light ? "md:bg-navy/8" : "md:bg-white/10")
                      }
                    >
                      <chip.icon size={16} className={"text-gold " + (light ? "md:text-gold-dark" : "md:text-gold")} />
                    </span>
                    <span className={"text-sm font-medium text-white/80 " + (light ? "md:text-navy/70" : "md:text-white/80")}>
                      {chip.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
                {primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                  >
                    {primaryCta.label} <ArrowRight size={15} />
                  </Link>
                )}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className={
                      "inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-lg border transition-colors text-sm border-white/30 text-white hover:border-gold hover:text-gold " +
                      (light
                        ? "md:border-navy/20 md:text-navy md:hover:border-gold-dark md:hover:text-gold-dark"
                        : "md:border-white/25 md:text-white md:hover:border-gold md:hover:text-gold")
                    }
                  >
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
    </section>
  );
}
