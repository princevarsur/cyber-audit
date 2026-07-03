import { getServerSupabase } from "@/lib/supabaseServer";
import PageHeader from "@/components/PageHeader";
import CrudTable, { Column, Field } from "@/components/CrudTable";
import type { Control } from "@/lib/types";

export const dynamic = "force-dynamic";

const columns: Column[] = [
  { key: "mapping_code", label: "ID", mono: true },
  { key: "function_category", label: "CSF Function / Category" },
  { key: "requirement", label: "Requirement" },
  { key: "control_label", label: "Mapped Control" },
  { key: "compliance_status", label: "Status", badge: true },
  { key: "evidence_notes", label: "Evidence" },
];

export default async function CompliancePage() {
  const sb = getServerSupabase();
  const [{ data: mappings }, { data: controls }] = await Promise.all([
    sb.from("compliance_mappings").select("*").order("mapping_code"),
    sb.from("controls").select("id, control_code, control_name").order("control_code"),
  ]);

  const controlList = (controls ?? []) as Pick<Control, "id" | "control_code" | "control_name">[];
  const labelById = new Map(controlList.map((c) => [c.id, `${c.control_code} · ${c.control_name}`]));

  const rows = (mappings ?? []).map((m) => ({
    ...m,
    control_label: m.control_id ? labelById.get(m.control_id) ?? "—" : "—",
  }));

  const fields: Field[] = [
    { key: "mapping_code", label: "Mapping ID", type: "text", required: true, placeholder: "MAP-009" },
    { key: "framework", label: "Framework", type: "text", placeholder: "NIST CSF 2.0" },
    {
      key: "function_category",
      label: "CSF Function / Category",
      type: "select",
      options: [
        "Govern (GV.RM)",
        "Identify (ID.AM)",
        "Protect (PR.AA)",
        "Protect (PR.AT)",
        "Protect (PR.DS)",
        "Detect (DE.CM)",
        "Respond (RS.MA)",
        "Recover (RC.RP)",
      ],
    },
    { key: "requirement", label: "Requirement", type: "textarea" },
    {
      key: "control_id",
      label: "Mapped Control",
      type: "select",
      options: controlList.map((c) => ({ value: c.id, label: `${c.control_code} · ${c.control_name}` })),
    },
    {
      key: "compliance_status",
      label: "Compliance Status",
      type: "select",
      options: ["Compliant", "Partially Compliant", "Non-Compliant", "Not Started"],
    },
    { key: "evidence_notes", label: "Evidence Notes", type: "textarea" },
  ];

  return (
    <div>
      <PageHeader
        title="Compliance Mapping"
        subtitle="Controls mapped to NIST Cybersecurity Framework (CSF) 2.0"
      />
      <CrudTable tableName="compliance_mappings" rows={rows} columns={columns} fields={fields} />
    </div>
  );
}
