---
id: TASK-334
title: Fix Android versionCode 29 startup crash
status: In Progress
assignee: []
created_date: '2026-09-08 18:48'
updated_date: '2026-09-08 19:33'
labels: []
dependencies: []
priority: high
type: bug
ordinal: 252000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Android release 29 crashes on launch while release 28 launches. The numeric version bump contains no behavior change; the regression window includes Android Sentry startup added before release 29. Diagnose with reproducible evidence, fix the startup regression without weakening clock-in behavior or telemetry privacy, verify a release-equivalent build, and push a focused branch to the Kigulx fork.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The root cause is demonstrated by a stack trace or a controlled before/after reproduction
- [ ] #2 A release-equivalent Android build launches without the version 29 startup crash
- [ ] #3 Existing Android checks and build gates pass
- [x] #4 Telemetry remains fail-soft and cannot block application startup or clock-in
- [x] #5 The focused fix is committed and pushed to the Kigulx fork on a non-main branch
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Reproduce or extract the crash signal and compare releases 28 and 29. 2. Isolate the smallest responsible startup change. 3. Add a regression check and implement the minimal decision-compliant fix. 4. Build and drive the affected startup flow on the available Android emulator/device. 5. Run project gates, review the diff, commit, and push a feature branch to the fork.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Root-cause window: version 28 predates Android Sentry; version 29 adds sentry-android 8.53.0 and a DSN. The library merges SentryInitProvider, which Android creates before TimeSheetsApplication.onCreate, bypassing Telemetry.start's catch. Fix: application metadata io.sentry.auto-init=false keeps the provider inert and leaves the single blank-DSN-aware, Throwable-guarded manual init. Verification: manifest-check and its sentry mutant pass; check-branding OK; release processReleaseManifest and compileReleaseKotlin BUILD SUCCESSFUL; merged release manifest contains both SentryInitProvider and auto-init=false. Full assembleRelease reaches compileReleaseJavaWithJavac then is blocked by this Codex Windows environment's loopback restriction; no device/emulator is available, so AC1-3 remain unchecked pending a real launch/full build.

Commit f85c449 pushed to Kigulx/nfc-timesheets branch codex/android-29-startup-crash; remote SHA verified equal to local HEAD. TASK remains In Progress until a release-equivalent APK is launched on a device/emulator and the complete Android gate can run outside this environment's loopback restriction.
<!-- SECTION:NOTES:END -->
