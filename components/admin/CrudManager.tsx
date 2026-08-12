"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import OutlineEditor, { type OutlineGroup } from "@/components/admin/OutlineEditor";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "url" | "list" | "outline";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  helpText?: string;
};

type DocRow = { _id: string; [key: string]: unknown };

export default function CrudManager({
  title,
  description,
  collectionName,
  fields,
  idField,
  idTransform,
  columns,
}: {
  title: string;
  description?: string;
  collectionName: string;
  fields: FieldDef[];
  /** If set, this field's value becomes the Firestore document ID (e.g. "slug"). Otherwise Firestore auto-generates one. */
  idField?: string;
  /** Optional transform applied to the idField value before it's used as the document ID (e.g. uppercasing a serial number). */
  idTransform?: (value: string) => string;
  /** Field keys to show as table columns. Defaults to the first 3 fields. */
  columns?: string[];
}) {
  const [rows, setRows] = useState<DocRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<DocRow | null | "new">(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const displayCols = columns ?? fields.slice(0, 3).map((f) => f.key);

  const load = useCallback(async () => {
    setError(null);
    try {
      const snap = await getDocs(collection(db, collectionName));
      const data = snap.docs
        .map((d) => ({ _id: d.id, ...d.data() }) as DocRow)
        .sort((a, b) => (Number(a.order ?? 0) as number) - (Number(b.order ?? 0) as number));
      setRows(data);
    } catch (err) {
      console.error(err);
      setError(
        "Couldn't load data. Make sure Firebase is configured (.env.local) and Firestore rules allow admin reads — see ADMIN-SETUP.md."
      );
      setRows([]);
    }
  }, [collectionName]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, collectionName, id));
      await load();
    } catch (err) {
      console.error(err);
      alert("Couldn't delete this entry. Check Firestore rules.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSave(values: Record<string, string | number | OutlineGroup[]>, existingId?: string) {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...values };
      fields
        .filter((f) => f.type === "number")
        .forEach((f) => {
          payload[f.key] = Number(payload[f.key] ?? 0);
        });
      fields
        .filter((f) => f.type === "list")
        .forEach((f) => {
          const raw = String(payload[f.key] ?? "");
          payload[f.key] = raw
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        });
      fields
        .filter((f) => f.type === "outline")
        .forEach((f) => {
          const raw = (payload[f.key] as OutlineGroup[] | undefined) ?? [];
          // Drop empty sections and blank item lines before saving.
          payload[f.key] = raw
            .map((g) => ({ title: g.title.trim(), items: g.items.map((s) => s.trim()).filter(Boolean) }))
            .filter((g) => g.title || g.items.length > 0);
        });

      if (existingId) {
        await setDoc(doc(db, collectionName, existingId), payload, { merge: true });
      } else if (idField && payload[idField]) {
        const rawId = String(payload[idField]).trim();
        const id = idTransform ? idTransform(rawId) : rawId;
        payload[idField] = id;
        await setDoc(doc(db, collectionName, id), payload);
      } else {
        await addDoc(collection(db, collectionName), payload);
      }
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      alert("Couldn't save this entry. Check Firestore rules — see ADMIN-SETUP.md.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy">{title}</h1>
          {description && <p className="text-sm text-navy/50 mt-1">{description}</p>}
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-1.5 bg-navy hover:bg-navy-light text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <Plus size={15} /> Add New
        </button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
        {rows === null ? (
          <div className="flex items-center justify-center py-16 text-navy/40 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center py-16 text-sm text-navy/40">
            Nothing here yet. Click &ldquo;Add New&rdquo; to create the first entry, or visit{" "}
            <a href="/admin/seed" className="text-navy underline">
              Seed Content
            </a>{" "}
            to migrate the site&apos;s existing content.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-navy/40 text-xs uppercase tracking-wide">
                {displayCols.map((c) => (
                  <th key={c} className="px-5 py-3 font-semibold">
                    {fields.find((f) => f.key === c)?.label ?? c}
                  </th>
                ))}
                <th className="px-5 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-b border-black/5 last:border-0 hover:bg-slate-50">
                  {displayCols.map((c) => (
                    <td key={c} className="px-5 py-3 text-navy/80 max-w-xs truncate">
                      {String(row[c] ?? "—")}
                    </td>
                  ))}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => setEditing(row)}
                        className="p-1.5 rounded-md text-navy/50 hover:text-navy hover:bg-black/5"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(row._id)}
                        disabled={deletingId === row._id}
                        className="p-1.5 rounded-md text-red-500/70 hover:text-red-600 hover:bg-red-50"
                        aria-label="Delete"
                      >
                        {deletingId === row._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing !== null && (
        <EditModal
          fields={fields}
          idField={idField}
          initial={editing === "new" ? null : editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSave={(values) => handleSave(values, editing === "new" ? undefined : editing._id)}
        />
      )}
    </div>
  );
}

function EditModal({
  fields,
  idField,
  initial,
  saving,
  onCancel,
  onSave,
}: {
  fields: FieldDef[];
  idField?: string;
  initial: DocRow | null;
  saving: boolean;
  onCancel: () => void;
  onSave: (values: Record<string, string | number | OutlineGroup[]>) => void;
}) {
  const [values, setValues] = useState<Record<string, string | number | OutlineGroup[]>>(() => {
    const v: Record<string, string | number | OutlineGroup[]> = {};
    fields.forEach((f) => {
      const raw = initial?.[f.key];
      if (f.type === "list") {
        v[f.key] = Array.isArray(raw) ? (raw as string[]).join("\n") : "";
      } else if (f.type === "outline") {
        v[f.key] = Array.isArray(raw) ? (raw as OutlineGroup[]) : [];
      } else {
        v[f.key] = (raw as string | number) ?? (f.type === "number" ? 0 : "");
      }
    });
    return v;
  });

  const isEditingExisting = !!initial;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 sticky top-0 bg-white">
          <h2 className="font-display font-bold text-navy">
            {isEditingExisting ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button onClick={onCancel} className="text-navy/40 hover:text-navy">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(values);
          }}
          className="px-6 py-5 space-y-4"
        >
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-navy/60 mb-1.5">
                {f.label} {f.required && <span className="text-red-500">*</span>}
                {idField === f.key && isEditingExisting && (
                  <span className="text-navy/30 font-normal"> (ID — can&apos;t change after creation)</span>
                )}
              </label>
              {f.type === "textarea" || f.type === "list" ? (
                <textarea
                  required={f.required}
                  value={(values[f.key] as string) ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  rows={f.type === "list" ? 5 : 3}
                  className="input"
                />
              ) : f.type === "outline" ? (
                <OutlineEditor
                  value={(values[f.key] as OutlineGroup[]) ?? []}
                  onChange={(next) => setValues((v) => ({ ...v, [f.key]: next }))}
                />
              ) : f.type === "select" ? (
                <select
                  required={f.required}
                  value={(values[f.key] as string) ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  className="input"
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                  required={f.required}
                  disabled={idField === f.key && isEditingExisting}
                  value={(values[f.key] as string | number) ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  placeholder={f.placeholder}
                  className="input disabled:bg-slate-50 disabled:text-navy/40"
                />
              )}
              {f.helpText && <p className="text-[11px] text-navy/35 mt-1">{f.helpText}</p>}
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark disabled:opacity-60 text-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-semibold text-navy/50 hover:text-navy px-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
