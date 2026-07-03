"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ratingFromScore, riskScore } from "@/lib/scoring";
import Badge from "@/components/Badge";

export type Column = {
  key: string;
  label: string;
  badge?: boolean;
  mono?: boolean;
  // optional value transform for display
  render?: (row: any) => React.ReactNode;
};

type Option = string | { value: string; label: string };

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select";
  options?: Option[];
  required?: boolean;
  min?: number;
  max?: number;
  full?: boolean; // span full width in the form grid
  placeholder?: string;
};

export default function CrudTable({
  tableName,
  rows,
  columns,
  fields,
  computeRisk = false,
  searchable = true,
}: {
  tableName: string;
  rows: any[];
  columns: Column[];
  fields: Field[];
  computeRisk?: boolean;
  searchable?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      columns.some((c) => String(r[c.key] ?? "").toLowerCase().includes(q))
    );
  }, [rows, query, columns]);

  function openAdd() {
    setEditing(null);
    setForm({});
    setError(null);
    setOpen(true);
  }
  function openEdit(row: any) {
    setEditing(row);
    const initial: Record<string, any> = {};
    fields.forEach((f) => (initial[f.key] = row[f.key] ?? ""));
    setForm(initial);
    setError(null);
    setOpen(true);
  }

  async function save() {
    setBusy(true);
    setError(null);
    const payload: Record<string, any> = {};
    for (const f of fields) {
      let v = form[f.key];
      if (v === "" || v === undefined) v = null;
      if (f.type === "number" && v !== null) v = Number(v);
      payload[f.key] = v;
    }
    if (computeRisk) {
      const s = riskScore(payload.likelihood, payload.impact);
      payload.risk_rating = ratingFromScore(s);
      // inherent_risk_score is a generated column — never write it.
      delete payload.inherent_risk_score;
    }

    const res = editing
      ? await supabase.from(tableName).update(payload).eq("id", editing.id)
      : await supabase.from(tableName).insert(payload);

    setBusy(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  async function remove(row: any) {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    const { error } = await supabase.from(tableName).delete().eq("id", row.id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="card p-0">
      <div className="flex flex-col gap-3 border-b border-edge p-4 sm:flex-row sm:items-center sm:justify-between">
        {searchable ? (
          <input
            className="input sm:max-w-xs"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        ) : (
          <span />
        )}
        <button className="btn-primary" onClick={openAdd}>
          + Add {tableName === "compliance_mappings" ? "mapping" : tableName.replace(/s$/, "")}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-edge">
          <thead className="bg-surface2">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="th">
                  {c.label}
                </th>
              ))}
              <th className="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            {filtered.length === 0 && (
              <tr>
                <td className="td text-slate-500" colSpan={columns.length + 1}>
                  No records match your search.
                </td>
              </tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-surface2/40">
                {columns.map((c) => (
                  <td key={c.key} className={`td ${c.mono ? "font-mono text-xs text-slate-400" : ""}`}>
                    {c.render ? c.render(row) : c.badge ? <Badge value={row[c.key]} /> : row[c.key] ?? "—"}
                  </td>
                ))}
                <td className="td text-right whitespace-nowrap">
                  <button className="text-brand hover:underline" onClick={() => openEdit(row)}>
                    Edit
                  </button>
                  <button className="ml-3 text-red-400 hover:underline" onClick={() => remove(row)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <div className="mt-10 w-full max-w-2xl rounded-xl border border-edge bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-edge px-5 py-4">
              <h3 className="text-lg font-semibold text-white">
                {editing ? "Edit record" : "Add record"}
              </h3>
              <button className="text-slate-400 hover:text-white" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-xs font-medium text-slate-400">
                    {f.label}
                    {f.required && <span className="text-red-400"> *</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      className="input min-h-[80px]"
                      value={form[f.key] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  ) : f.type === "select" ? (
                    <select
                      className="input"
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    >
                      <option value="">— Select —</option>
                      {(f.options ?? []).map((o) => {
                        const val = typeof o === "string" ? o : o.value;
                        const lab = typeof o === "string" ? o : o.label;
                        return (
                          <option key={val} value={val}>
                            {lab}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      className="input"
                      type={f.type}
                      min={f.min}
                      max={f.max}
                      value={form[f.key] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              {computeRisk && (
                <div className="sm:col-span-2 rounded-lg bg-base p-3 text-sm text-slate-300">
                  Inherent score:{" "}
                  <span className="font-semibold text-brand">
                    {riskScore(form.likelihood, form.impact) || 0}
                  </span>{" "}
                  → rating{" "}
                  <span className="font-semibold">
                    {ratingFromScore(riskScore(form.likelihood, form.impact) || 0)}
                  </span>
                </div>
              )}
            </div>
            {error && (
              <p className="px-5 text-sm text-red-400">Error: {error}</p>
            )}
            <div className="flex justify-end gap-2 border-t border-edge px-5 py-4">
              <button className="btn-ghost" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={save} disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
