import { getServerSupabase } from "@/lib/supabaseServer";
import PageHeader from "@/components/PageHeader";
import type { CompanyProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CompanyPage() {
  const sb = getServerSupabase();
  const { data } = await sb.from("company_profile").select("*").limit(1).single();
  const company = data as CompanyProfile | null;

  if (!company) {
    return (
      <div>
        <PageHeader title="Company Profile" />
        <p className="text-slate-400">No company profile found.</p>
      </div>
    );
  }

  const facts = [
    { label: "Company", value: company.name },
    { label: "Industry", value: company.industry },
    { label: "Employees", value: company.employees },
    { label: "Primary Framework", value: "NIST CSF 2.0" },
    { label: "Regulatory Driver", value: "HIPAA Security Rule" },
  ];

  return (
    <div>
      <PageHeader title="Company Profile" subtitle="The organization under assessment" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/15 text-2xl font-bold text-brand ring-1 ring-brand/30">
              SH
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{company.name}</h2>
              <p className="text-sm text-slate-400">
                {company.industry} · {company.employees} employees
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-slate-300">{company.summary}</p>
        </div>

        <div className="card">
          <h3 className="mb-3 text-sm font-semibold text-white">Key Facts</h3>
          <dl className="space-y-2">
            {facts.map((f) => (
              <div key={f.label} className="flex justify-between gap-4 border-b border-edge/60 pb-2 text-sm">
                <dt className="text-slate-400">{f.label}</dt>
                <dd className="text-right font-medium text-slate-100">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-4 card">
        <h3 className="mb-3 text-sm font-semibold text-white">Technology Environment</h3>
        <div className="flex flex-wrap gap-2">
          {(company.environment ?? []).map((e) => (
            <span key={e} className="badge bg-surface2 text-slate-200 ring-1 ring-edge">
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
