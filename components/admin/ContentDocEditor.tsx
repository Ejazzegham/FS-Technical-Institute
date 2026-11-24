"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Save, Check, ImagePlus } from "lucide-react";
import { db } from "@/lib/firebase";
import { describeError, revalidateSite, uploadImage } from "@/lib/adminClient";
import type { FieldDef, ItemsDef, SectionDef } from "@/lib/contentSchema";

type Obj = Record<string, unknown>;

function getPath(o: Obj, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Obj)[k] : undefined), o);
}
function setPath(o: Obj, path: string, value: unknown): Obj {
  const [head, ...rest] = path.split(".");
  if (rest.length === 0) return { ...o, [head]: value };
  return { ...o, [head]: setPath(((o[head] as Obj) ?? {}) as Obj, rest.join("."), value) };
}

/** Drop empty call-to-action objects and undefined so Firestore accepts the write. */
function clean(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    const out: Obj = {};
    for (const [k, v] of Object.entries(value as Obj)) {
      const c = clean(v);
      if (c === undefined) continue;
      if (/Cta$/.test(k) && c && typeof c === "object" && !(c as Obj).label && !(c as Obj).href) continue;
      out[k] = c;
    }
    return out;
  }
  return value === undefined ? undefined : value;
}

const inputCls = "w-full border border-black/10 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-navy/40";

function FieldInput({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (def.type === "checkbox") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-navy/80">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} /> {def.label}
      </label>
    );
  }
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-navy/60 mb-1">{def.label}</span>
      {def.type === "textarea" && (
        <textarea rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
      {def.type === "list" && (
        <textarea
          rows={Math.min(8, Math.max(3, Array.isArray(value) ? value.length : 3))}
          value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          onBlur={(e) => onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
          className={inputCls}
        />
      )}
      {def.type === "select" && (
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          <option value="">— Select —</option>
          {def.options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      )}
      {def.type === "number" && (
        <input type="number" value={value === undefined || value === "" ? "" : Number(value)} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
      )}
      {def.type === "image" && (
        <span className="flex items-center gap-2">
          <input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="/images/… or https://…" className={inputCls} />
          <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold border border-navy/15 rounded-md px-3 py-2 cursor-pointer hover:bg-navy/5">
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />} Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setErr(null);
                try {
                  onChange(await uploadImage(file, "misc"));
                } catch (ex) {
                  setErr(ex instanceof Error ? ex.message : "Upload failed");
                } finally {
                  setUploading(false);
                }
              }}
            />
          </span>
        </span>
      )}
      {(!def.type || def.type === "text") && (
        <input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
      {err && <span className="block text-xs text-red-600 mt-1">{err}</span>}
      {def.help && <span className="block text-[11px] text-navy/40 mt-1">{def.help}</span>}
    </label>
  );
}

function ItemsEditor({ def, value, onChange }: { def: ItemsDef; value: unknown; onChange: (v: unknown[]) => void }) {
  const items = (Array.isArray(value) ? value : []) as Obj[];
  const move = (i: number, d: number) => {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      <p className="text-sm font-bold text-navy mb-2">{def.label}</p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-black/10 rounded-lg bg-slate-50/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-navy/70 truncate">
                {i + 1}. {String(getPath(item, def.titleKey) || "Untitled")}
              </p>
              <span className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => move(i, -1)} className="p-1.5 rounded hover:bg-black/5" aria-label="Move up"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} className="p-1.5 rounded hover:bg-black/5" aria-label="Move down"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="p-1.5 rounded text-red-600 hover:bg-red-50" aria-label="Remove"><Trash2 size={14} /></button>
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {def.fields.map((f) => (
                <div key={f.key} className={f.type === "textarea" || f.type === "list" || f.type === "image" ? "sm:col-span-2" : ""}>
                  <FieldInput def={f} value={getPath(item, f.key)} onChange={(v) => onChange(items.map((it, k) => (k === i ? setPath(it, f.key, v) : it)))} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, {}])} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-navy border border-navy/15 rounded-md px-3 py-2 hover:bg-navy/5">
        <Plus size={13} /> {def.addLabel}
      </button>
    </div>
  );
}

export default function ContentDocEditor({ section }: { section: SectionDef }) {
  const [data, setData] = useState<Obj | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getDoc(doc(db, "site_content", section.key))
      .then((snap) => {
        if (cancelled) return;
        setMissing(!snap.exists());
        setData(snap.exists() ? (snap.data() as Obj) : {});
      })
      .catch((e) => {
        if (!cancelled) {
          setError(describeError(e));
          setData({});
        }
      });
    return () => {
      cancelled = true;
    };
  }, [section.key]);

  async function save() {
    if (!data) return;
    setSaving(true);
    setError(null);
    try {
      await setDoc(doc(db, "site_content", section.key), clean(data) as Obj);
      void revalidateSite();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(describeError(e));
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-navy/40" /></div>;

  return (
    <div className="space-y-6">
      {missing && (
        <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2">
          Nothing is saved here yet. Run <strong>Setup → Seed Content</strong> to load the starter content, or fill this in and save.
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {section.fields.filter((f) => f.type !== "items").map((f) => (
          <div key={f.key} className={(f as FieldDef).type === "textarea" || (f as FieldDef).type === "list" ? "sm:col-span-2" : ""}>
            <FieldInput def={f as FieldDef} value={getPath(data, f.key)} onChange={(v) => setData((d) => setPath(d ?? {}, f.key, v))} />
          </div>
        ))}
      </div>
      {section.fields.filter((f): f is ItemsDef => f.type === "items").map((f) => (
        <ItemsEditor key={f.key} def={f} value={getPath(data, f.key)} onChange={(v) => setData((d) => setPath(d ?? {}, f.key, v))} />
      ))}
      {error && <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>}
      <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">
        {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <Save size={15} />}
        {saved ? "Saved" : "Save changes"}
      </button>
    </div>
  );
}
