import { getServerSupabase } from "@/lib/supabaseServer";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { ratingFromScore } from "@/lib/scoring";
import type { Risk, Control, ComplianceMapping, GapAssessment } from "@/lib/types";

export const dynamic = "force-dynamic";

const roadmap = {
  "30 Days — Contain Critical Exposure": [
    "Complete organization-wide MFA enforcement on Microsoft 365 (closes RSK-001).",
    "Enable AWS S3 public-access block and CSPM scanning (closes RSK-005).",
    "Enforce full-disk encryption + remote wipe via MDM on all laptops.",
  ],
  "60 Days — Build Resilience": [
    "Implement tested, immutable offsite backups and run first restore test (RSK-002).",
    "Stand up quarterly least-privilege access reviews for PHI systems (RSK-004).",
    "Finalize and approve the Data Classification Policy (currently Draft).",
  ],
  "90 Days — Mature the Program": [
    "Conduct an incident-response tabletop exercise and update runbooks.",
    "Establish a formal risk governance cadence (NIST CSF Govern function).",
    "Re-assess residual risk and refresh the executive risk report.",
  ],
};

export default async function ExecutivePage() {
  const sb = getServerSupabase();
  const [{ data: risks }, { data: controls }, { data: mappings }, { data: gaps }] = await Promise.all([
    sb.from("risks").select("*").order("inherent_risk_score", { ascending: false }),
    sb.from("controls").select("*"),
    sb.from("compliance_mappings").select("*"),
    sb.from("gap_assessments").select("*"),
  ]);

  const r = (risks ?? []) as Risk[];
  const c = (controls ?? []) as Control[];
  const m = (mappings ?? []) as ComplianceMapping[];
  const g = (gaps ?? []) as GapAssessment[];

  const rating = (x: Risk) => x.risk_rating ?? ratingFromScore(x.inherent_risk_score ?? 0);
  const critical = r.filter((x) => rating(x) === "Critical").length;
  const compliant = m.filter((x) => x.compliance_status === "Compliant").length;
  const complianceScore = m.length ? Math.round((compliant / m.length) * 100) : 0;
  const implemented = c.filter((x) => x.implementation_status === "Implemented").length;

  const posture =
    critical >= 2 ? "Elevated" : critical === 1 ? "Moderate" : "Managed";
  const postureAccent = critical >= 2 ? "red" : critical === 1 ? "amber" : "emerald";

  const top5 = r.slice(0, 5);
  const complianceGaps = m.filter(
    (x) => x.compliance_status === "Non-Compliant" || x.compliance_status === "Not Started" || x.compliance_status === "Partially Compliant"
  );

  return (
    <div>
      <PageHeader
        title="Executive Summary"
        subtitle="Board-level view of security posture and remediation strategy · SecureHealth Inc."
      />

      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-white">Overall Security Posture</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          SecureHealth Inc. currently holds a{" "}
          <span className="font-semibold text-white">{posture.toLowerCase()}</span> risk posture. Of{" "}
          {r.length} assessed risks, <span className="font-semibold text-red-300">{critical}</span> are rated
          Critical — driven primarily by incomplete MFA coverage and untested backups. The control program is{" "}
          {Math.round((implemented / (c.length || 1)) * 100)}% implemented and NIST CSF 2.0 compliance stands at{" "}
          {complianceScore}%. Executing the 30/60/90-day roadmap below is expected to eliminate all Critical
          exposures and raise compliance above 80%.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Posture" value={posture} accent={postureAccent as any} />
        <StatCard label="Critical Risks" value={critical} accent="red" />
        <StatCard label="Compliance Score" value={`${complianceScore}%`} accent="brand" />
        <StatCard label="Controls Implemented" value={`${implemented}/${c.length}`} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-0">
          <h3 className="border-b border-edge p-4 text-sm font-semibold text-white">Top 5 Risks</h3>
          <ul className="divide-y divide-edge">
            {top5.map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm text-slate-100">{x.risk_title}</p>
                  <p className="text-xs text-slate-500">{x.risk_code} · owner {x.owner}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-200">{x.inherent_risk_score}</span>
                  <Badge value={rating(x)} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-0">
          <h3 className="border-b border-edge p-4 text-sm font-semibold text-white">Compliance Gaps</h3>
          <ul className="divide-y divide-edge">
            {complianceGaps.map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm text-slate-100">{x.function_category}</p>
                  <p className="text-xs text-slate-500">{x.requirement}</p>
                </div>
                <Badge value={x.compliance_status} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mt-6 p-0">
        <h3 className="border-b border-edge p-4 text-sm font-semibold text-white">Recommended Actions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-edge">
            <thead className="bg-surface2">
              <tr>
                <th className="th">Gap</th>
                <th className="th">Recommendation</th>
                <th className="th">Risk</th>
                <th className="th">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {g.map((x) => (
                <tr key={x.id}>
                  <td className="td">{x.requirement}</td>
                  <td className="td text-slate-300">{x.recommendation}</td>
                  <td className="td"><Badge value={x.risk_level} /></td>
                  <td className="td"><Badge value={x.priority} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="mb-3 mt-8 text-lg font-semibold text-white">30 / 60 / 90-Day Remediation Roadmap</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Object.entries(roadmap).map(([phase, items], i) => (
          <div key={phase} className="card">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand ring-1 ring-brand/30">
                {i + 1}
              </span>
              <h4 className="text-sm font-semibold text-white">{phase}</h4>
            </div>
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it} className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
