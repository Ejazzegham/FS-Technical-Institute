"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { Trash2, Loader2, ExternalLink } from "lucide-react";
import { db } from "@/lib/firebase";

export type ColumnDef = {
  key: string;
  label: string;
  /** Render this field's value as a clickable link (e.g. an uploaded document URL) */
  link?: boolean;
};

type Row = { _id: string; [key: string]: unknown };

function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "object" && v !== null && "toDate" in v && typeof (v as { toDate: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toLocaleString();
  }
  return String(v);
}

export default function SubmissionList({
  title,
  description,
  collectionName,
  columns,
  statusField,
  statusOptions,
}: {
  title: string;
  description?: string;
  collectionName: string;
  columns: ColumnDef[];
  /** If set, renders an editable status dropdown for this field (e.g. "status" on admissions) */
  statusField?: string;
  statusOptions?: string[];
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const snap = await getDocs(collection(db, collectionName));
      const data = snap.docs
        .map((d) => ({ _id: d.id, ...d.data() }) as Row)
        .sort((a, b) => {
          const ta = a.createdAt as { toMillis?: () => number } | undefined;
          const tb = b.createdAt as { toMillis?: () => number } | undefined;
          return (tb?.toMillis?.() ?? 0) - (ta?.toMillis?.() ?? 0);
        });
      setRows(data);
    } catch (err) {
      console.error(err);
      setError(
        "Couldn't load submissions. Make sure Firebase is configured and Firestore rules allow admin reads — see ADMIN-SETUP.md."
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
    if (!confirm("Delete this record? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, collectionName, id));
      await load();
    } catch (err) {
      console.error(err);
      alert("Couldn't delete. Check Firestore rules.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id: string, value: string) {
    if (!statusField) return;
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, collectionName, id), { [statusField]: value });
      await load();
    } catch (err) {
      console.error(err);
      alert("Couldn't update status. Check Firestore rules.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy">{title}</h1>
          {description && <p className="text-sm text-navy/50 mt-1">{description}</p>}
        </div>
        {rows && <p className="text-sm text-navy/40 shrink-0">{rows.length} total</p>}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-black/5 overflow-hidden overflow-x-auto">
        {rows === null ? (
          <div className="flex items-center justify-center py-16 text-navy/40 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center py-16 text-sm text-navy/40">No submissions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-navy/40 text-xs uppercase tracking-wide">
                {columns.map((c) => (
                  <th key={c.key} className="px-5 py-3 font-semibold whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                {statusField && <th className="px-5 py-3 font-semibold whitespace-nowrap">Status</th>}
                <th className="px-5 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-b border-black/5 last:border-0 hover:bg-slate-50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-3 text-navy/80 max-w-xs truncate">
                      {c.link && row[c.key] ? (
                        <a
                          href={String(row[c.key])}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-navy underline"
                        >
                          View <ExternalLink size={11} />
                        </a>
                      ) : (
                        formatValue(row[c.key])
                      )}
                    </td>
                  ))}
                  {statusField && (
                    <td className="px-5 py-3">
                      <select
                        value={(row[statusField] as string) ?? statusOptions?.[0]}
                        disabled={updatingId === row._id}
                        onChange={(e) => handleStatusChange(row._id, e.target.value)}
                        className="select-compact"
                      >
                        {statusOptions?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  <td className="px-5 py-3 text-right">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
