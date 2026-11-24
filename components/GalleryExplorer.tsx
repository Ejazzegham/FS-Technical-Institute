"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Presentation,
  FlaskConical,
  CalendarDays,
  Wrench,
  Trophy,
  Image as ImageIcon,
} from "lucide-react";
import { galleryCategories, type GalleryCategory } from "@/lib/data";
import type { GalleryItem } from "@/lib/content";

const categoryIcons: Record<GalleryCategory, typeof Presentation> = {
  Classrooms: Presentation,
  Labs: FlaskConical,
  Events: CalendarDays,
  Workshops: Wrench,
  Achievements: Trophy,
};

const tileGradients: Record<GalleryCategory, string> = {
  Classrooms: "from-sky-900 to-slate-900",
  Labs: "from-teal-900 to-slate-900",
  Events: "from-indigo-900 to-slate-900",
  Workshops: "from-orange-900 to-slate-900",
  Achievements: "from-fuchsia-900 to-slate-900",
};

export default function GalleryExplorer({ galleryItems }: { galleryItems: GalleryItem[] }) {
  const [active, setActive] = useState<"All Photos" | GalleryCategory>("All Photos");

  const filtered =
    active === "All Photos" ? galleryItems : galleryItems.filter((g) => g.category === active);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <FilterButton
          active={active === "All Photos"}
          onClick={() => setActive("All Photos")}
          icon={LayoutGrid}
          label="All Photos"
        />
        {galleryCategories.map((cat) => (
          <FilterButton
            key={cat}
            active={active === cat}
            onClick={() => setActive(cat)}
            icon={categoryIcons[cat]}
            label={cat}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const Icon = categoryIcons[item.category];
          return (
            <div
              key={item.id}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br ${tileGradients[item.category]} flex items-center justify-center`}
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <Icon size={36} className="text-white/15 group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium leading-tight flex items-center gap-1.5">
                  <ImageIcon size={12} className="shrink-0" /> {item.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function FilterButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutGrid;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-navy text-white"
          : "bg-white text-navy/70 border border-black/10 hover:border-gold hover:text-navy"
      }`}
    >
      <Icon size={15} className={active ? "text-gold" : "text-navy/50"} />
      {label}
    </button>
  );
}
