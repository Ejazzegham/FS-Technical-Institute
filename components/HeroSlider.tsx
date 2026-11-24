"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  image: string;
  /** Optional mobile-specific crop/composition, shown below the md breakpoint
   *  instead of `image`. Falls back to `image` (centered) when omitted. */
  mobileImage?: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  /** "light" = image has a bright area behind the text on desktop (use navy text).
   *  "dark"  = image is dark behind the text on desktop (use white text). */
  theme: "light" | "dark";
  /** CSS object-position for the image, tuned per photo so the subject stays
   *  in frame when cropped taller on mobile. Defaults to "center". */
  focus?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

const AUTOPLAY_MS = 6500;

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, count]);

  function goTo(i: number) {
    setIndex(((i % count) + count) % count);
  }
  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-navy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Admissions and programs"
    >
      {/* Slides are stacked and cross-fade (no sliding, no zooming). */}
      <div className="grid">
        {slides.map((slide, i) => {
          const active = i === index;
          const light = slide.theme === "light";
          return (
            <article
              key={slide.image}
              className={
                "col-start-1 row-start-1 w-full transition-opacity duration-1000 ease-in-out " +
                (active ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0")
              }
              aria-hidden={!active}
            >
              <div className="relative w-full">

                <div className="relative w-full">
                  {/* Same 12:5 frame for every slide = the artwork's own ratio, so nothing is cropped */}
                  <div className="relative md:aspect-[12/5] aspect-[12/5] overflow-hidden">
                    <Image
                      src={slide.mobileImage ?? slide.image}
                      alt={slide.alt}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="object-cover block md:hidden"
                    />
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="object-cover hidden md:block"
                    />
                    <div
                      className={
                        "hidden md:block absolute inset-0 pointer-events-none " +
                        (light
                          ? "bg-gradient-to-r from-white/95 from-0% via-white/55 via-32% to-white/0 to-58%"
                          : "bg-gradient-to-r from-navy/90 from-0% via-navy/50 via-32% to-navy/0 to-58%")
                      }
                    />
                    <div className="md:hidden absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                  </div>

                {/* Text panel: overlaid on the image at md+, a solid navy card below it on mobile */}
                <div className="relative bg-navy md:bg-transparent md:absolute md:inset-y-0 md:left-0 md:flex md:items-center md:w-[52%] lg:w-[48%] px-6 py-7 md:pl-[6vw] md:pr-6 lg:pl-[7vw]">
                  <div
                    key={active ? `txt-${index}` : "idle"}
                    className={
                      "max-w-md xl:max-w-xl mx-auto text-center md:mx-0 md:text-left" +
                      (active ? " hero-stagger" : " opacity-0")
                    }
                  >
                    <p
                      className={
                        "text-xs font-bold tracking-widest mb-2 text-gold " +
                        (light ? "md:text-gold-dark" : "md:text-gold")
                      }
                    >
                      {slide.eyebrow}
                    </p>
                    <h2
                      className={
                        "font-display font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight mb-2 text-white " +
                        (light ? "md:text-navy" : "md:text-white")
                      }
                    >
                      {slide.title}
                    </h2>
                    <p
                      className={
                        "text-sm leading-relaxed mb-4 max-w-sm mx-auto md:mx-0 text-white/70 " +
                        (light ? "md:text-navy/60" : "md:text-white/70")
                      }
                    >
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      {slide.primaryCta && (
                        <Link
                          href={slide.primaryCta.href}
                          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                        >
                          {slide.primaryCta.label} <ArrowRight size={15} />
                        </Link>
                      )}
                      {slide.secondaryCta && (
                        <Link
                          href={slide.secondaryCta.href}
                          className={
                            "inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-lg border transition-colors text-sm border-white/30 text-white hover:border-gold hover:text-gold " +
                            (light
                              ? "md:border-navy/20 md:text-navy md:hover:border-gold-dark md:hover:text-gold-dark"
                              : "md:border-white/25 md:text-white md:hover:border-gold md:hover:text-gold")
                          }
                        >
                          {slide.secondaryCta.label}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Arrows — desktop/tablet only; mobile uses swipe */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots — a solid bar below the card on mobile, overlaid at md+ */}
      <div className="relative md:absolute md:inset-x-0 md:bottom-5 flex justify-center gap-2 py-3 md:py-0 bg-navy md:bg-transparent z-20">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}: ${slide.title}`}
            aria-current={i === index}
            className={
              "h-1.5 rounded-full transition-all duration-300 " +
              (i === index ? "w-7 bg-gold" : "w-1.5 bg-white/40 hover:bg-white/70")
            }
          />
        ))}
      </div>
    </section>
  );
}
