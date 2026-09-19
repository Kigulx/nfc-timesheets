---
id: TASK-338
title: Audit and harden admin management and building reporting flows
status: In Progress
assignee:
  - '@codex'
created_date: '2026-09-19 18:55'
updated_date: '2026-09-19 19:13'
labels: []
dependencies: []
ordinal: 255000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Owner requests a logic audit and fixes for worker/company/building/zone management, address accuracy and suggestions, building map summary and owner reporting access. Continue local codex/app-improvements commits without deployment or push. Preserve operator-only zone creation and existing hosting/path conventions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Confirmed lifecycle, identity and sharing defects are fixed with targeted regression evidence.
- [ ] #2 Address edits cannot silently preserve an obsolete pin and invalid geocoder coordinates are rejected.
- [ ] #3 Building summary offers a direct owner-report access path and address assistance degrades safely when unavailable.
- [ ] #4 Browser workflows, automated checks and independent review recorded with backend/provider limitations explicit.
- [ ] #5 Backlog.md is usable as an installed command and existing project workflow is preserved.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Trace frontend to API and ADRs; record concrete defects. Fix lifecycle/report access and pin integrity in separate commits with regression checks. Add scoped address assistance and contextual owner-report entry. Verify affected browser flows and current checks; required dedicated review after implementation.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Full server/check-api.js passes on isolated local PostgreSQL 16.14, including new regression cases for form deactivation, cross-company grant refusal, stale pins, partial coordinate rejection and late geocoder replies. Backlog 1.52.0 standalone executable installed to user Programs and user PATH; existing AGENTS CLI workflow retained. No production data or hosting touched.
<!-- SECTION:NOTES:END -->
