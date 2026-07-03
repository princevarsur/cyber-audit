import { badgeClass } from "@/lib/scoring";

export default function Badge({ value }: { value?: string | null }) {
  if (!value) return <span className="text-slate-500">—</span>;
  return <span className={`badge ${badgeClass(value)}`}>{value}</span>;
}
