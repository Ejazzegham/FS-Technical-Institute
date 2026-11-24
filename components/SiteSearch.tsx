"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, X } from "lucide-react";

export type SearchItem = { title: string; href: string; hint: string };

// Command-palette style site search. Open with Ctrl/Cmd+K, "/" or the
// floating button. Items are built server-side from live Firestore content.
export default function SiteSearch({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = term
      ? items.filter((i) => (i.title + " " + i.hint).toLowerCase().includes(term))
      : items;
    return list.slice(0, 8);
  }, [q, items]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [open]);

  function go(href: string) {
    setOpen(false);
    setQ("");
    router.push(href);
  }

  if (items.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 bg-navy text-white text-xs font-medium pl-3 pr-3.5 py-2.5 rounded-full shadow-lg shadow-black/20 hover:bg-navy-light transition-colors"
      >
        <Search size={14} /> Search
        <kbd className="ml-1 text-[10px] bg-white/15 rounded px-1.5 py-0.5">Ctrl K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-navy-dark/60 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 border-b border-black/5">
              <Search size={16} className="text-navy/40" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter" && results[active]) {
                    go(results[active].href);
                  }
                }}
                placeholder="Search courses, pages and tools…"
                className="flex-1 py-4 text-sm outline-none text-navy placeholder:text-navy/35"
              />
              <button onClick={() => setOpen(false)} aria-label="Close search" className="text-navy/40 hover:text-navy">
                <X size={16} />
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto py-2">
              {results.length === 0 && <li className="px-4 py-6 text-sm text-navy/50 text-center">No matches found.</li>}
              {results.map((r, i) => (
                <li key={r.href + r.title}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left ${
                      i === active ? "bg-navy/[0.05]" : ""
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-medium text-navy">{r.title}</span>
                      <span className="block text-xs text-navy/50">{r.hint}</span>
                    </span>
                    {i === active && <CornerDownLeft size={14} className="text-navy/40 shrink-0" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
