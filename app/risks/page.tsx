import { getServerSupabase } from "@/lib/supabaseServer";
import PageHeader from "@/components/PageHeader";
import CrudTable, { Column, Field } from "@/components/CrudTable";
import type { Asset } from "@/lib/types";

export const dynamic = "force-dynamic";

const columns: Column[] = [
  { key: "risk_code", label: "ID", mono: true },
  { key: "risk_title", label: "Risk" },
  { key: "asset_label", label: "Asset" },
  { key: "likelihood", label: "L" },
  { key: "impact", label: "I" },
  { key: "inherent_risk_score", label: "Score" },
  { key: "risk_rating", label: "Rating", badge: true },
  { key: "residual_risk_score", label: "Residual" },
  { key: "status", label: "Status", badge: true },
  { key: "owner", label: "Owner" },
];

export default async function RisksPage() {
  const sb = getServerSupabase();
  const [{ data: risks }, { data: assets }] = await Promise.all([
    sb.from("risks").select("*").order("inherent_risk_score", { ascending: false }),
    sb.from("assets").select("id, asset_code, asset_name").order("asset_code"),
  ]);

  const assetList = (assets ?? []) as Pick<Asset, "id" | "asset_code" | "asset_name">[];
  const labelById = new Map(assetList.map((a) => [a.id, `${a.asset_code} · ${a.asset_name}`]));

  // Flatten the asset relationship into a serializable column for display.
  const rows = (risks ?? []).map((r) => ({
    ...r,
    asset_label: r.asset_id ? labelById.get(r.asset_id) ?? "—" : "—",
  }));

  const fields: Field[] = [
    { key: "risk_code", label: "Risk ID", type: "text", required: true, placeholder: "RSK-006" },
    { key: "risk_title", label: "Risk Title", type: "text", required: true, full: true },
    {
      key: "asset_id",
      label: "Affected Asset",
      type: "select",
      options: assetList.map((a) => ({ value: a.id, label: `${a.asset_code} · ${a.asset_name}` })),
    },
    { key: "threat", label: "Threat", type: "text" },
    { key: "vulnerability", label: "Vulnerability", type: "text" },
    { key: "likelihood", label: "Likelihood (1-5)", type: "number", min: 1, max: 5 },
    { key: "impact", label: "Impact (1-5)", type: "number", min: 1, max: 5 },
    { key: "control_recommendation", label: "Control Recommendation", type: "textarea" },
    { key: "residual_risk_score", label: "Residual Risk Score", type: "number", min: 0, max: 25 },
    { key: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Mitigated", "Closed"] },
    { key: "owner", label: "Owner", type: "text" },
  ];

  return (
    <div>
      <PageHeader
        title="Risk Register"
        subtitle="Likelihood × Impact scoring (1–5) · 1–5 Low · 6–10 Medium · 11–15 High · 16–25 Critical"
      />
      <CrudTable tableName="risks" rows={rows} columns={columns} fields={fields} computeRisk />
    </div>
  );
}
