import { getServerSupabase } from "@/lib/supabaseServer";
import PageHeader from "@/components/PageHeader";
import CrudTable, { Column, Field } from "@/components/CrudTable";

export const dynamic = "force-dynamic";

const columns: Column[] = [
  { key: "requirement", label: "Requirement" },
  { key: "current_state", label: "Current State" },
  { key: "gap", label: "Gap" },
  { key: "risk_level", label: "Risk Level", badge: true },
  { key: "recommendation", label: "Recommendation" },
  { key: "priority", label: "Priority", badge: true },
];

const fields: Field[] = [
  { key: "requirement", label: "Requirement", type: "text", required: true, full: true },
  { key: "current_state", label: "Current State", type: "textarea" },
  { key: "gap", label: "Gap", type: "textarea" },
  { key: "risk_level", label: "Risk Level", type: "select", options: ["Critical", "High", "Medium", "Low"] },
  { key: "recommendation", label: "Recommendation", type: "textarea" },
  { key: "priority", label: "Priority", type: "select", options: ["High", "Medium", "Low"] },
];

export default async function GapsPage() {
  const sb = getServerSupabase();
  const { data } = await sb.from("gap_assessments").select("*").order("created_at");
  return (
    <div>
      <PageHeader
        title="Gap Assessment"
        subtitle="Difference between current state and target control requirements"
      />
      <CrudTable tableName="gap_assessments" rows={data ?? []} columns={columns} fields={fields} />
    </div>
  );
}
