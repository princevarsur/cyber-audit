export default function StatCard({
  label,
  value,
  sublabel,
  accent = "brand",
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: "brand" | "red" | "orange" | "amber" | "emerald" | "slate";
}) {
  const accents: Record<string, string> = {
    brand: "text-brand",
    red: "text-red-400",
    orange: "text-orange-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    slate: "text-slate-300",
  };
  return (
    <div className="card">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accents[accent]}`}>{value}</p>
      {sublabel && <p className="mt-1 text-xs text-slate-500">{sublabel}</p>}
    </div>
  );
}
