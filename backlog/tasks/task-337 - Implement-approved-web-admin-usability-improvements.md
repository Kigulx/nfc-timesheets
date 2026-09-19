---
id: TASK-337
title: Implement approved web admin usability improvements
status: In Progress
assignee:
  - '@codex'
created_date: '2026-09-19 18:16'
labels:
  - web
  - ux
dependencies: []
ordinal: 254000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Owner approved the scoped proposals in TASK-336. Improve clarity, information density and daily navigation on the existing static Next.js admin. Preserve hosting and filesystem path conventions; do not change slash handling in verification. Work on codex/app-improvements above Android 8a32cc7 with separate logical commits; no push, PR or merge.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Worker access and building-zone guidance match current decisions in German and English without changing authentication or NFC behavior.
- [ ] #2 Workers list is visible sooner and supports search and status filtering; onboarding and SMS controls remain reachable.
- [ ] #3 Locations show compact summaries and opening zones exposes the section with operator-only guidance and all existing actions preserved.
- [ ] #4 Shift state filters and actionable summaries preserve URL context and distinguish running shifts from exceptions.
- [ ] #5 Browser feature verification and decision/code review are recorded; pnpm verify and branding checks are run with existing failures reported honestly.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Correct obsolete guidance and missing-email alerts. 2. Improve worker list, search, filters and grouped form. 3. Compact location summaries and make zones reachable. 4. Add shift state controls and contextual summary links. 5. Polish shared spacing. 6. Run browser feature checks and dedicated decision review, resolve findings, run verification, and commit each logical slice. Keep scripts/check.mjs slash behavior untouched as requested.
<!-- SECTION:PLAN:END -->
