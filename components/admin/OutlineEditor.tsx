"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";

export type OutlineGroup = { title: string; items: string[] };

export default function OutlineEditor({
  value,
  onChange,
  headingPlaceholder = "Heading, e.g. MS Word",
  itemsPlaceholder = "One item per line, e.g.\nIntroduction to Microsoft Word\nText & Paragraph Formatting\nTables & Lists",
}: {
  value: OutlineGroup[];
  onChange: (next: OutlineGroup[]) => void;
  headingPlaceholder?: string;
  itemsPlaceholder?: string;
}) {
  function addSection() {
    onChange([...value, { title: "", items: [] }]);
  }

  function removeSection(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function updateTitle(index: number, title: string) {
    onChange(value.map((g, i) => (i === index ? { ...g, title } : g)));
  }

  function updateItems(index: number, raw: string) {
    const items = raw.split("\n");
    onChange(value.map((g, i) => (i === index ? { ...g, items } : g)));
  }

  return (
    <div className="space-y-3">
      {value.map((group, i) => (
        <div key={i} className="rounded-lg border border-black/10 bg-slate-50/60 p-3.5">
          <div className="flex items-center gap-2 mb-2.5">
            <GripVertical size={14} className="text-navy/25 shrink-0" />
            <input
              type="text"
              value={group.title}
              onChange={(e) => updateTitle(i, e.target.value)}
              placeholder={headingPlaceholder}
              className="flex-1 rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="button"
              onClick={() => removeSection(i)}
              className="p-1.5 rounded-md text-red-500/70 hover:text-red-600 hover:bg-red-50 shrink-0"
              aria-label="Remove section"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <textarea
            value={group.items.join("\n")}
            onChange={(e) => updateItems(i, e.target.value)}
            placeholder={itemsPlaceholder}
            rows={4}
            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <p className="text-[11px] text-navy/35 mt-1">Everything below the heading is one item per line.</p>
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/70 hover:text-navy border border-dashed border-black/15 hover:border-navy/30 rounded-lg px-4 py-2.5 w-full justify-center transition-colors"
      >
        <Plus size={15} /> Add Heading & Items
      </button>

      {value.length === 0 && (
        <p className="text-[11px] text-navy/35">
          Click &ldquo;Add Heading &amp; Items&rdquo; to create a section — give it a heading like{" "}
          <span className="font-medium">MS Word</span>, then list everything under that heading, one line
          each. Add another section for the next heading, e.g. <span className="font-medium">MS Excel</span>.
        </p>
      )}
    </div>
  );
}
