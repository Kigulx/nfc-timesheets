---
id: TASK-377
title: 'Superadmin: enter a company account (impersonation) from /platform/'
status: In Progress
assignee: []
created_date: '2026-10-20 17:20'
labels: []
dependencies: []
references:
  - docs/superadmin-impersonation.md
priority: high
ordinal: 308000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Platform administrators could create companies but had no way to see or fix a company's workspace without asking for the owner's password. decision-66 deferred impersonation to its own decision; decision-80 now defines it (docs/superadmin-impersonation.md).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A superadmin can enter any company that has an admin account from /platform/ and lands on that company's workspace
- [ ] #2 Inside a company a persistent banner names the company, the acting account and the platform account, with a Back to platform button that restores the platform session
- [ ] #3 The entered session expires after 1 hour, cannot change the password, and is revoked when its opener stops being a superadmin
- [ ] #4 Every enter and every non-GET request inside is recorded in the company's action_log with origin superadmin
- [ ] #5 check-workspaces.js runs check-impersonation.js and passes on loopback PostgreSQL; en/de messages complete
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented on branch codex/superadmin-impersonation: migration 029 (sessions.impersonator_admin_id), lib/auth.js, routes/workspaces.js (enter/exit), routes/admin.js (whoami/logout/password guard), server.js audit; web platform page, AppShell banner, account error. Verified: check-workspaces incl. check-impersonation PASS; mutation of password guard and opener-role clause both fail the check; tsc/biome/check.mjs pass; next build OK; browser walk enter -> banner -> back to platform on 127.0.0.1:8080. Pre-existing on origin/main too: check-api 'adopted serial ... 409s by NAME' fails; check-agent idempotency replay is flaky. Owner must accept decision-80 (status proposed).
<!-- SECTION:NOTES:END -->
