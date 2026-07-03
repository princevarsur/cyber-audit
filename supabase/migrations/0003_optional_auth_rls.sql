-- 0003_optional_auth_rls.sql — OPTIONAL production hardening (NOT applied to the demo)
--
-- The demo (0002_rls.sql) allows the anon role to read AND write so the in-app
-- CRUD forms work without a login. This file is the production-grade alternative:
-- anonymous users get READ-ONLY access, and only authenticated users can write.
--
-- Apply this ONLY after you have added Supabase Auth and a sign-in flow to the app,
-- otherwise the CRUD forms (which use the anon key) will fail on insert/update/delete.
--
-- Usage:
--   1. Enable Supabase Auth and wire a login page in the app.
--   2. Run this migration (it replaces the open anon write policies).

do $$
declare t text;
begin
  foreach t in array array['company_profile','assets','controls','risks','compliance_mappings','policies','gap_assessments']
  loop
    execute format('alter table %I enable row level security;', t);

    -- Drop the permissive demo policies.
    execute format('drop policy if exists %I on %I;', t||'_anon_all', t);
    execute format('drop policy if exists %I on %I;', t||'_auth_all', t);

    -- Anonymous role: read-only.
    execute format('create policy %I on %I for select to anon using (true);', t||'_anon_read', t);

    -- Authenticated role: full read + write.
    execute format('create policy %I on %I for all to authenticated using (true) with check (true);', t||'_auth_all', t);
  end loop;
end $$;
