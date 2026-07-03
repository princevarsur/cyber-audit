import { getServerSupabase } from "@/lib/supabaseServer";
import PageHeader from "@/components/PageHeader";
import CrudTable, { Column, Field } from "@/components/CrudTable";

export const dynamic = "force-dynamic";

const columns: Column[] = [
  { key: "asset_code", label: "ID", mono: true },
  { key: "asset_name", label: "Asset" },
  { key: "asset_type", label: "Type" },
  { key: "owner", label: "Owner" },
  { key: "business_criticality", label: "Criticality", badge: true },
  { key: "data_classification", label: "Classification", badge: true },
];

const fields: Field[] = [
  { key: "asset_code", label: "Asset ID", type: "text", required: true, placeholder: "AST-007" },
  { key: "asset_name", label: "Asset Name", type: "text", required: true },
  { key: "asset_type", label: "Type", type: "select", options: ["Database", "SaaS", "Cloud", "Endpoint", "Network", "Application"] },
  { key: "owner", label: "Owner", type: "text" },
  { key: "business_criticality", label: "Business Criticality", type: "select", options: ["Critical", "High", "Medium", "Low"] },
  { key: "data_classification", label: "Data Classification", type: "select", options: ["Restricted (PHI)", "Confidential", "Internal", "Public"] },
  { key: "description", label: "Description", type: "textarea" },
];

export default async function AssetsPage() {
  const sb = getServerSupabase();
  const { data } = await sb.from("assets").select("*").order("asset_code");
  return (
    <div>
      <PageHeader title="Asset Inventory" subtitle="Systems and data stores in scope for risk assessment" />
      <CrudTable tableName="assets" rows={data ?? []} columns={columns} fields={fields} />
    </div>
  );
}
