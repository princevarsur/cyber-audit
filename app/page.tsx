import { getServerSupabase } from "@/lib/supabaseServer";
import { ratingFromScore } from "@/lib/scoring";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import RiskSeverityChart from "@/components/RiskSeverityChart";
import ComplianceStatusChart from "@/components/ComplianceStatusChart";
import Link from "next/link";
import type { Risk, Control, ComplianceMapping } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const sb = getServerSupabase();
  const [{ data: risks }, { data: controls }, { data: mappings }] = await Promise.all([
    sb.from("risks").select("*").order("inherent_risk_score", { ascending: false }),
    sb.from("controls").select("*"),
    sb.from("compliance_mappings").select("*"),
  ]);

  const r = (risks ?? []) as Risk[];
  const c = (controls ?? []) as Control[];
  const m = (mappings ?? []) as ComplianceMapping[];

  const rating = (x: Risk) => x.risk_rating ?? ratingFromScore(x.inherent_risk_score ?? 0);
  const critical = r.filter((x) => rating(x) === "Critical").length;
  const high = r.filter((x) => rating(x) === "High").length;
  const open = r.filter((x) => (x.status ?? "Open") === "Open").length;
  const completedControls = c.filter((x) => x.implementation_status === "Implemented").length;

  const compliant = m.filter((x) => x.compliance_status === "Compliant").length;
  const complianceScore = m.length ? Math.round((compliant / m.length) * 100) : 0;
  const totalRiskScore = r.reduce((s, x) => s + (x.inherent_risk_score ?? 0), 0);
  const avgRiskScore = r.length ? (totalRiskScore / r.length).toFixed(1) : "0";

  const severityData = ["Critical", "High", "Medium", "Low"].map((name) => ({
    name,
    value: r.filter((x) => rating(x) === name).length,
  }));

  const complianceData = ["Compliant", "Partially Compliant", "Non-Compliant", "Not Started"].map(
    (name) => ({ name, value: m.filter((x) => x.compliance_status === name).length })
  );

  const topRisks = [...r].sort((a, b) => (b.inherent_risk_score ?? 0) - (a.inherent_risk_score ?? 0)).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Security Posture Dashboard"
        subtitle="SecureHealth Inc. · Governance, Risk & Compliance overview"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Risks" value={r.length} accent="brand" />
        <StatCard label="Critical Risks" value={critical} accent="red" />
        <StatCard label="High Risks" value={high} accent="orange" />
        <StatCard label="Open Risks" value={open} accent="amber" />
        <StatCard label="Completed Controls" value={`${completedControls}/${c.length}`} accent="emerald" />
        <StatCard label="Compliance Score" value={`${complianceScore}%`} accent="brand" sublabel={`${compliant}/${m.length} requirements compliant`} />
        <StatCard label="Total Risk Score" value={totalRiskScore} accent="slate" sublabel={`avg ${avgRiskScore} per risk`} />
        <StatCard label="Controls Tracked" value={c.length} accent="slate" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RiskSeverityChart data={severityData} />
        <ComplianceStatusChart data={complianceData} />
      </div>

      <div className="mt-6 card p-0">
        <div className="flex items-center justify-between border-b border-edge p-4">
          <h3 className="text-sm font-semibold text-white">Top Risks by Inherent Score</h3>
          <Link href="/risks" className="text-sm text-brand hover:underline">
            View risk register →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-edge">
            <thead className="bg-surface2">
              <tr>
                <th className="th">Risk</th>
                <th className="th">Score</th>
                <th className="th">Rating</th>
                <th className="th">Status</th>
                <th className="th">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {topRisks.map((x) => (
                <tr key={x.id}>
                  <td className="td">
                    <span className="font-mono text-xs text-slate-500">{x.risk_code}</span>
                    <div className="text-slate-100">{x.risk_title}</div>
                  </td>
                  <td className="td font-semibold text-slate-100">{x.inherent_risk_score}</td>
                  <td className="td"><Badge value={rating(x)} /></td>
                  <td className="td"><Badge value={x.status} /></td>
                  <td className="td text-slate-400">{x.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
