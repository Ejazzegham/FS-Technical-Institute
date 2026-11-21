"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/images/printing-press/s1.png", alt: "Printing press — brand collateral and large-format printing" },
  { src: "/images/printing-press/s2.png", alt: "Printing press — stamp and seal making" },
  { src: "/images/printing-press/s3.png", alt: "Printing press — paper cutting services" },
  { src: "/images/printing-press/s4.png", alt: "Printing press — Panaflex and banner printing" },
];

export default function PrintingPressSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setActive((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setActive((i) => (i + 1) % slides.length);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-black/5 shadow-sm bg-navy">
      <div className="relative aspect-[16/9] md:aspect-[21/9]">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy/60 hover:bg-navy/80 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy/60 hover:bg-navy/80 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-gold" : "w-1.5 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
