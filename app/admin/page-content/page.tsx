"use client";

import { useState } from "react";
import ContentDocEditor from "@/components/admin/ContentDocEditor";
import { SECTIONS } from "@/lib/contentSchema";

export default function AdminPageContentPage() {
  const [key, setKey] = useState(SECTIONS[0].key);
  const section = SECTIONS.find((s) => s.key === key) ?? SECTIONS[0];
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Page Content</h1>
      <p className="text-sm text-navy/50 mb-6 max-w-2xl">
        Edit the text, banners, menus and links across the public site. Changes appear on the site within moments of saving.
      </p>
      <div className="grid lg:grid-cols-[240px_1fr] gap-6 items-start">
        <nav className="bg-white rounded-md border border-black/5 p-2 lg:sticky lg:top-24">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setKey(s.key)}
              className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                s.key === key ? "bg-navy text-white font-semibold" : "text-navy/70 hover:bg-navy/5"
              }`}
            >
              {s.title}
            </button>
          ))}
        </nav>
        <section className="bg-white rounded-md border border-black/5 p-5 md:p-6">
          <h2 className="font-display font-bold text-lg text-navy">{section.title}</h2>
          <p className="text-xs text-navy/50 mb-5">{section.description}</p>
          <ContentDocEditor key={section.key} section={section} />
        </section>
      </div>
    </div>
  );
}
