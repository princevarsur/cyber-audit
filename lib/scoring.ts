// Shared GRC scoring logic and enums.

export type RiskRating = "Low" | "Medium" | "High" | "Critical";

// Likelihood (1-5) x Impact (1-5) = inherent risk score (1-25).
// 1–5 Low | 6–10 Medium | 11–15 High | 16–25 Critical
export function ratingFromScore(score: number): RiskRating {
  if (score >= 16) return "Critical";
  if (score >= 11) return "High";
  if (score >= 6) return "Medium";
  return "Low";
}

export function riskScore(likelihood: number, impact: number): number {
  return (Number(likelihood) || 0) * (Number(impact) || 0);
}

// Tailwind classes for badges keyed by a normalized value.
export const badgeStyles: Record<string, string> = {
  // Risk severity / rating & generic risk levels
  Critical: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
  High: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30",
  Medium: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  Low: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",

  // Risk status
  Open: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
  "In Progress": "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  Closed: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  Mitigated: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",

  // Compliance status
  Compliant: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  "Partially Compliant": "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  "Non-Compliant": "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
  "Not Started": "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30",

  // Implementation status
  Implemented: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  "Partially Implemented": "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  "Not Implemented": "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",

  // Criticality
  Restricted: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",

  // Policy / priority
  Active: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  Draft: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  Retired: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30",
};

export function badgeClass(value?: string | null): string {
  if (!value) return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30";
  // match on first word for values like "Restricted (PHI)"
  const key = badgeStyles[value] ? value : Object.keys(badgeStyles).find((k) => value.startsWith(k));
  return (key && badgeStyles[key]) || "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30";
}

// Chart colors keyed by rating / status.
export const chartColors: Record<string, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#f59e0b",
  Low: "#10b981",
  Compliant: "#10b981",
  "Partially Compliant": "#f59e0b",
  "Non-Compliant": "#ef4444",
  "Not Started": "#64748b",
};
