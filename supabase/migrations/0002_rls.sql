-- 0002_rls.sql — Row Level Security
-- NOTE (portfolio tradeoff): this demo enables open read + write for the anon role
-- so the in-app CRUD forms work without an auth/login flow. In a real deployment
-- you would restrict writes to authenticated users / specific roles.
do $$
declare t text;
begin
  foreach t in array array['company_profile','assets','controls','risks','compliance_mappings','policies','gap_assessments']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists %I on %I;', t||'_anon_all', t);
    execute format('create policy %I on %I for all to anon using (true) with check (true);', t||'_anon_all', t);
    execute format('drop policy if exists %I on %I;', t||'_auth_all', t);
    execute format('create policy %I on %I for all to authenticated using (true) with check (true);', t||'_auth_all', t);
  end loop;
end $$;
