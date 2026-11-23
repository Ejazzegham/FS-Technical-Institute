"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Play,
  Sparkles,
  X,
  Maximize2,
} from "lucide-react";
import type { SiteEvent } from "@/lib/content";

const DAY = 24 * 60 * 60 * 1000;

function parseLocal(s?: string): number | null {
  if (!s) return null;
  const t = new Date(s).getTime();
  return Number.isNaN(t) ? null : t;
}

/** Visible while: not past "auto-hide", else not >24h after the event date, else always. */
function isVisible(e: SiteEvent, now: number): boolean {
  const exp = parseLocal(e.expiresAt);
  if (exp !== null) return now <= exp;
  const start = parseLocal(e.eventDate);
  if (start !== null) return now <= start + DAY;
  return true;
}

function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

function mediaKind(e: SiteEvent): "video" | "image" | "text" {
  if (e.mediaType === "Video" && e.videoUrl) return "video";
  if (e.mediaType === "Text only") return "text";
  if (e.imageUrl) return "image";
  if (e.videoUrl) return "video";
  return "text";
}

function posterOf(e: SiteEvent): string | undefined {
  if (e.imageUrl) return e.imageUrl;
  const yt = youtubeId(e.videoUrl);
  return yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : undefined;
}

function formatWhen(ms: number) {
  const d = new Date(ms);
  return {
    date: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    hasTime: d.getHours() !== 0 || d.getMinutes() !== 0,
  };
}

function ctaProps(href: string) {
  const external = /^https?:\/\//i.test(href);
  return external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export default function EventSpotlight({ events }: { events: SiteEvent[] }) {
  const [now, setNow] = useState<number | null>(null);
  const [open, setOpen] = useState<SiteEvent | null>(null);

  // Tick once a second — only after mount, so server and client HTML match.
  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);

  const visible = useMemo(
    () => (now === null ? events : events.filter((e) => isVisible(e, now))),
    [events, now]
  );

  // Close modal on Escape + lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (visible.length === 0) return null;

  const [featured, ...rest] = visible;

  return (
    <section
      aria-label="Events and announcements"
      className="relative overflow-hidden bg-navy-dark text-white"
    >
      {/* ambient glow + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 w-[34rem] h-[34rem] rounded-full bg-gold/15 blur-[120px]" />
        <div className="absolute -bottom-48 -right-24 w-[38rem] h-[38rem] rounded-full bg-sky-500/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        {/* heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 ev-rise">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.22em] text-gold">
            <span className="relative flex h-2 w-2">
              <span className="ev-ping absolute inline-flex h-full w-full rounded-full bg-gold" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            HAPPENING AT FSTI
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-5 leading-tight">
            Don&apos;t Miss <span className="ev-gold-text">What&apos;s Next</span>
          </h2>
        </div>

        <FeaturedCard event={featured} now={now} onOpen={() => setOpen(featured)} />

        {rest.length > 0 && (
          <div
            className={`mt-8 grid gap-6 ${
              rest.length === 1 ? "max-w-xl mx-auto" : rest.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {rest.map((e, i) => (
              <MiniCard key={e.id} event={e} delay={i * 90} onOpen={() => setOpen(e)} />
            ))}
          </div>
        )}
      </div>

      {open && <EventModal event={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

/* ---------------------------------------------------------------- Featured */

function FeaturedCard({
  event: e,
  now,
  onOpen,
}: {
  event: SiteEvent;
  now: number | null;
  onOpen: () => void;
}) {
  const kind = mediaKind(e);
  const poster = posterOf(e);
  const start = parseLocal(e.eventDate);
  const when = start !== null ? formatWhen(start) : null;

  return (
    <article className="ev-rise rounded-[1.6rem] p-[1.5px] ev-border shadow-[0_30px_80px_-20px_rgba(240,169,59,0.35)]">
      <div
        className={`rounded-[1.5rem] bg-gradient-to-br from-[#14264d] via-navy to-navy-dark overflow-hidden grid ${
          kind === "text" ? "" : "lg:grid-cols-[1.15fr_1fr]"
        }`}
      >
        {kind !== "text" && (
          <button
            type="button"
            onClick={onOpen}
            aria-label={kind === "video" ? `Play video: ${e.title}` : `View image: ${e.title}`}
            className="group relative block w-full aspect-video lg:aspect-auto lg:min-h-[26rem] bg-navy-dark overflow-hidden text-left"
          >
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                alt={e.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-navy-light to-navy-dark" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-navy/80" />
            {kind === "video" ? (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gold text-navy shadow-2xl transition-transform group-hover:scale-110">
                  <span className="ev-ping absolute inset-0 rounded-full bg-gold/60" />
                  <Play size={30} className="relative ml-1" fill="currentColor" />
                </span>
              </span>
            ) : (
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur px-3 py-1.5 text-[11px] font-semibold opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
                <Maximize2 size={12} /> View full image
              </span>
            )}
          </button>
        )}

        <div className="relative p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          {kind === "text" && (
            <Sparkles aria-hidden size={120} className="ev-float absolute right-6 top-6 text-gold/10" />
          )}
          <Badge text={e.badge} />
          <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-[2.25rem] leading-tight mt-4">
            {e.title}
          </h3>
          {e.description && (
            <p className="mt-4 text-white/70 leading-relaxed whitespace-pre-line line-clamp-6">
              {e.description}
            </p>
          )}

          {(when || e.venue) && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              {when && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} className="text-gold" />
                  {when.date}
                  {when.hasTime && <span className="text-white/50">· {when.time}</span>}
                </span>
              )}
              {e.venue && (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} className="text-gold" /> {e.venue}
                </span>
              )}
            </div>
          )}

          {start !== null && <Countdown target={start} now={now} />}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {e.ctaHref && (
              <Link
                href={e.ctaHref}
                {...ctaProps(e.ctaHref)}
                className="group inline-flex items-center gap-2 rounded-xl bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-3 shadow-lg shadow-gold/20 transition-colors"
              >
                {e.ctaLabel || "Learn More"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {kind !== "text" && (
              <button
                type="button"
                onClick={onOpen}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 hover:border-gold/60 hover:bg-white/5 px-5 py-3 text-sm font-semibold transition-colors"
              >
                {kind === "video" ? (
                  <>
                    <Play size={14} fill="currentColor" /> Watch video
                  </>
                ) : (
                  <>
                    <Maximize2 size={14} /> View poster
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------- Countdown */

function Countdown({ target, now }: { target: number; now: number | null }) {
  if (now === null) return null;
  const diff = target - now;

  if (diff <= 0) {
    return (
      <div className="mt-6 inline-flex items-center gap-2.5 self-start rounded-full bg-emerald-400/10 border border-emerald-400/30 px-4 py-2 text-sm font-semibold text-emerald-300">
        <span className="relative flex h-2 w-2">
          <span className="ev-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Happening now
      </div>
    );
  }

  const s = Math.floor(diff / 1000);
  const parts = [
    { label: "Days", value: Math.floor(s / 86400) },
    { label: "Hours", value: Math.floor((s % 86400) / 3600) },
    { label: "Min", value: Math.floor((s % 3600) / 60) },
    { label: "Sec", value: s % 60 },
  ];

  return (
    <div className="mt-6 flex gap-2.5 sm:gap-3" role="timer" aria-label="Time until event">
      {parts.map((p) => (
        <div
          key={p.label}
          className="min-w-[3.9rem] sm:min-w-[4.4rem] rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur px-3 py-2.5 text-center"
        >
          <div className="font-display font-bold text-2xl sm:text-[1.7rem] tabular-nums text-gold leading-none">
            {String(p.value).padStart(2, "0")}
          </div>
          <div className="mt-1.5 text-[9px] font-bold tracking-[0.18em] uppercase text-white/45">{p.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Mini card */

function MiniCard({ event: e, delay, onOpen }: { event: SiteEvent; delay: number; onOpen: () => void }) {
  const kind = mediaKind(e);
  const poster = posterOf(e);
  const start = parseLocal(e.eventDate);
  const when = start !== null ? formatWhen(start) : null;

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ animationDelay: `${delay}ms` }}
      className="ev-rise group text-left rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {kind !== "text" && (
        <div className="relative aspect-video bg-navy overflow-hidden">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={e.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy-light to-navy-dark" />
          )}
          {kind === "video" && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy shadow-xl transition-transform group-hover:scale-110">
                <Play size={20} className="ml-0.5" fill="currentColor" />
              </span>
            </span>
          )}
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <Badge text={e.badge} small />
        <h4 className="font-display font-bold text-lg leading-snug mt-3">{e.title}</h4>
        {e.description && <p className="mt-2 text-sm text-white/60 line-clamp-3">{e.description}</p>}
        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-white/55">
          <span className="inline-flex items-center gap-1.5">
            {when && (
              <>
                <CalendarDays size={13} className="text-gold" /> {when.date}
              </>
            )}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-gold">
            Details <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------- Modal */

function EventModal({ event: e, onClose }: { event: SiteEvent; onClose: () => void }) {
  const kind = mediaKind(e);
  const yt = youtubeId(e.videoUrl);
  const start = parseLocal(e.eventDate);
  const when = start !== null ? formatWhen(start) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={e.title}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm ev-pop"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-navy-dark border border-gold/30 shadow-2xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 hover:bg-gold hover:text-navy transition-colors"
        >
          <X size={18} />
        </button>

        {kind === "video" && (
          <div className="aspect-video bg-black">
            {yt ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
                title={e.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                className="h-full w-full"
                src={e.videoUrl}
                poster={e.imageUrl}
                controls
                autoPlay
                playsInline
              />
            )}
          </div>
        )}
        {kind === "image" && e.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.imageUrl} alt={e.title} className="w-full max-h-[70vh] object-contain bg-black" />
        )}

        <div className="p-6 sm:p-8">
          <Badge text={e.badge} />
          <h3 className="font-display font-bold text-2xl sm:text-3xl mt-3 text-white">{e.title}</h3>
          {(when || e.venue) && (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-white/75">
              {when && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={15} className="text-gold" /> {when.date}
                  {when.hasTime && <span className="text-white/50">· {when.time}</span>}
                </span>
              )}
              {e.venue && (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-gold" /> {e.venue}
                </span>
              )}
            </div>
          )}
          {e.description && (
            <p className="mt-4 text-white/75 leading-relaxed whitespace-pre-line">{e.description}</p>
          )}
          {e.ctaHref && (
            <Link
              href={e.ctaHref}
              {...ctaProps(e.ctaHref)}
              onClick={onClose}
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-3 transition-colors"
            >
              {e.ctaLabel || "Learn More"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- Badge */

function Badge({ text, small }: { text?: string; small?: boolean }) {
  if (!text) return null;
  const live = /live/i.test(text);
  return (
    <span
      className={`inline-flex items-center gap-2 self-start rounded-full font-bold uppercase tracking-[0.16em] ${
        small ? "px-2.5 py-1 text-[9px]" : "px-3.5 py-1.5 text-[10px]"
      } ${
        live
          ? "bg-red-500/15 text-red-300 border border-red-400/30"
          : "bg-gold/15 text-gold border border-gold/30"
      }`}
    >
      {live ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="ev-ping absolute inline-flex h-full w-full rounded-full bg-red-400" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
        </span>
      ) : (
        <Sparkles size={small ? 10 : 12} />
      )}
      {text}
    </span>
  );
}
