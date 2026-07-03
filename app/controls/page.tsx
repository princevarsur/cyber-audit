import { getServerSupabase } from "@/lib/supabaseServer";
import PageHeader from "@/components/PageHeader";
import CrudTable, { Column, Field } from "@/components/CrudTable";

export const dynamic = "force-dynamic";

const columns: Column[] = [
  { key: "control_code", label: "ID", mono: true },
  { key: "control_name", label: "Control" },
  { key: "control_type", label: "Type" },
  { key: "framework_reference", label: "Framework Ref", mono: true },
  { key: "implementation_status", label: "Status", badge: true },
  { key: "owner", label: "Owner" },
];

const fields: Field[] = [
  { key: "control_code", label: "Control ID", type: "text", required: true, placeholder: "CTL-008" },
  { key: "control_name", label: "Control Name", type: "text", required: true },
  { key: "control_type", label: "Control Type", type: "select", options: ["Administrative", "Technical", "Physical"] },
  { key: "framework_reference", label: "Framework Reference", type: "text", placeholder: "NIST CSF PR.AA-03" },
  { key: "implementation_status", label: "Implementation Status", type: "select", options: ["Implemented", "Partially Implemented", "Not Implemented"] },
  { key: "owner", label: "Owner", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
];

export default async function ControlsPage() {
  const sb = getServerSupabase();
  const { data } = await sb.from("controls").select("*").order("control_code");
  return (
    <div>
      <PageHeader title="Control Library" subtitle="Safeguards selected to reduce assessed risk" />
      <CrudTable tableName="controls" rows={data ?? []} columns={columns} fields={fields} />
    </div>
  );
}
