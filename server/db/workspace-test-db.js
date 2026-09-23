// Run real API tests as a restricted role so PostgreSQL actually enforces RLS.
import { readFileSync } from "node:fs";
import pg from "pg";

export async function prepareWorkspaceTestDb(admin, schema) {
  const role = `${schema}_api`;
  await admin.query("SELECT set_config('app.system','on',false), set_config('app.tenant_id','1',false)");
  await admin.query(readFileSync(new URL("./migrations/022_company_workspaces.sql", import.meta.url), "utf8"));
  await admin.query(readFileSync(new URL("./migrations/023_workspace_onboarding.sql", import.meta.url), "utf8"));
  await admin.query(`CREATE ROLE ${pg.escapeIdentifier(role)} NOLOGIN NOSUPERUSER NOBYPASSRLS`);
  await admin.query(`GRANT USAGE ON SCHEMA ${pg.escapeIdentifier(schema)} TO ${pg.escapeIdentifier(role)}`);
  await admin.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ${pg.escapeIdentifier(schema)} TO ${pg.escapeIdentifier(role)}`);
  await admin.query(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ${pg.escapeIdentifier(schema)} TO ${pg.escapeIdentifier(role)}`);
  return role;
}
