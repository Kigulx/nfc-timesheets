---
id: TASK-364
title: Repair PR 7 Android and SMS verification gates
status: In Progress
assignee:
  - '@codex'
created_date: '2026-09-23 20:16'
updated_date: '2026-09-23 20:22'
labels: []
dependencies: []
priority: high
ordinal: 283000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Clean GitHub runners fail downloading the Android test JSON dependency and seeding the SMS fixture after company isolation. Route contract checks also assume obsolete source text.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Android checks pass with a freshly downloaded pinned dependency
- [ ] #2 SMS tests pass under tenant isolation and restricted API database role
- [ ] #3 PR 7 verification jobs pass on the updated commit
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Fix pinned test dependency and route assertions; migrate SMS fixtures to company-scoped setup; run local full suites; independent review; push fork and verify CI.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Fresh canonical Maven download matches SHA-256 of the existing pinned 20250107 artifact; retained version and added checksum verification. All six locally adapted JVM groups pass, shell manifest/no-shift/reader gates pass, debug APK builds, and check-api passes with real local Postgres. SMS now seeds tenant context and runs API under restricted role. Local full SMS is blocked by missing psql; unchanged Linux migration runner will be exercised in CI.
<!-- SECTION:NOTES:END -->
