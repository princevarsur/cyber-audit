import { getServerSupabase } from "@/lib/supabaseServer";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import type { Policy } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PoliciesPage() {
  const sb = getServerSupabase();
  const { data } = await sb.from("policies").select("*").order("policy_code");
  const policies = (data ?? []) as Policy[];

  return (
    <div>
      <PageHeader
        title="Policy Library"
        subtitle="Governance documentation supporting the control environment"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {policies.map((p) => (
          <div key={p.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-xs text-slate-500">{p.policy_code}</span>
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
              </div>
              <Badge value={p.status} />
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Purpose</dt>
                <dd className="mt-0.5 text-slate-300">{p.purpose}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Scope</dt>
                <dd className="mt-0.5 text-slate-300">{p.scope}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Policy Statement</dt>
                <dd className="mt-0.5 text-slate-300">{p.policy_statement}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center justify-between border-t border-edge pt-3 text-xs text-slate-500">
              <span>Owner: <span className="text-slate-300">{p.owner}</span></span>
              <span>Review by: <span className="text-slate-300">{p.review_date}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
