# Android worker and tag verification — 2026-09-22

TASK-339, branch `codex/android-worker-experience`, based on merged `main` at `a5bea71`.
No deployment, push, Play upload or production database writes were performed.

## Changed behavior

- Three worker destinations: Shift, Materials, More. Hours/history and operator entry
  are reachable through More. Logout requires confirmation; material drafts survive
  tab changes, language changes and an operator excursion.
- German, English and system language selection; dates and notification text use the
  same language. Both translations ship in Play bundles (decision-71).
- Foreground reader mode on signed-in worker screens sends cards into the existing
  tap inbox without opening the manual scan screen. The reader is disarmed for operator
  tools and backgrounding, and rejects callbacks from a previous reader session.
- Zone IDs resolve to building names in worker shifts. Foreground roster refresh
  merges names/serials into the latest state instead of overwriting an intervening tap.
- A newly written/reported zone links directly to its bind/activation screen. Activation
  still requires a matching operator test scan; writing alone never activates a zone.
- Starts awaiting server acceptance say "Not confirmed yet", show the actual refusal
  reason and retain the recorded time. Screen-reader text and ongoing/hourly reminders
  use the same distinction. The existing retry policy and offline queue are unchanged.
- A debug-only loopback API fixture permits repeatable real API/database journeys;
  release builds always use the branded HTTPS host.

## Driven worker verification

Pixel_9 API 36 emulator, debug APK, real local API on port 8082 and an isolated
PostgreSQL schema. Worker and operator sessions were both authenticated independently.

| Action | Observed result |
| --- | --- |
| Navigate all three tabs; open hours/history | Controls reachable; History Back respects system insets |
| Type a material draft; switch tabs/language/operator | Draft retained |
| Choose DE/EN/system; restart app | Text and dates switch; selection survives restart |
| Change language during an open shift | Same database shift stays open; notification title/body translate |
| Open operator from worker; return | Both identities remain authenticated and separate |
| Cancel logout in DE and EN | Worker remains signed in |
| Deliver a verified zone ACTION_VIEW from Materials/More | Returns to Shift; opens then closes exactly one row |
| Display a zone shift | Correct building name in running/recent/history surfaces |
| Set font scale to 1.5 | Worker controls remain readable/reachable; setting restored |

The first driven pass found three defects: History Back under the status bar, lost
material drafts and `Unknown location` for zone shifts. All were fixed and the same
actions passed a second driven pass. A separate review found and fixed a foreground
roster/tap state race. Its final review found no remaining change-specific blocker.

## Build and automated evidence

Dedicated tag verification drove simulated chips through the shipping writer and real
local report/resolve/bind/verify APIs. Locked, undersized, corrupt, wrong and unreadable
cards were refused. Bound and initially unbound zones followed their respective CTA paths;
no operator step created a shift. A missing building-name header after binding was fixed
and retested. A worker tap before verification exposed misleading confirmed-state text;
its replacement pending screen and notification passed in DE/EN. After operator activation,
the **same queued client UUID with its original start time** reached the server exactly
once, then a tap from Materials after background/resume closed that same row. No pending
or open shifts remained at the end of the fixture test.

- Final `:app:assembleDebug :app:assembleRelease :app:bundleRelease`: **PASS**.
- `node ops/check-branding.mjs`: **OK**, no TODO/non-ok lines.
- Android DE/EN resources: 354 matching resource keys (349 strings, five plurals),
  nonempty translations and matching format arguments.
- Dedicated foreground-reader test: **PASS**, compiling the shipping reader against
  fake radio/roster helpers. Covers automatic delivery, raw fallback, host rejection,
  pause/disarm, stale queued callbacks and re-enable behavior.
- Version-entry, known-tags, fake-chip writer, raw-card I/O and real operator-401 checks:
  **PASS**. Manifest, verification-without-shifts and reader-armed shell gates passed.
- Full API/PostgreSQL suite: first run had a transient oversized-body `fetch failed`;
  the complete rerun **PASS**. Server source was unchanged.
- Source diff whitespace checks passed. After staging generated Backlog files,
  `git diff --cached --check` reported one extra blank line at EOF in decision-71;
  the CLI-generated decision was retained without manual markdown edits.

Checks that are **not green**:

- The native Kotlin core check fails its existing forward-slash-only filename assertion
  on Windows (`app\\src\\…\\TagWriter.kt`). Other core assertions passed. Git Bash's
  runner also needs native Windows classpath separators; an ignored local runner executed
  the same Kotlin test sources. Repository path conventions were not changed.
- `pnpm verify` stops at four existing Windows path assertions: HomeMap and the
  locations/workers page lookups. It therefore does **not** establish a full green web
  verification. No web source was changed.
- `:app:lintDebug` reports 129 errors, 66 warnings and one hint, including existing
  `java.time` usage below API 26 and notification permission checks. It was not suppressed
  or baselined. The newly identified Play language-split warning was addressed by shipping
  both translations; APK/AAB builds passed afterward.

## Evidence and limits

Detailed local reports and screenshots are in ignored
`android/captures/worker-experience/`. They contain local fixture data, not production
evidence. Worker report: `worker-verification.md`; tag report: `tag-verification.md`.
The screenshot gallery is `comparison/index.html`. Its navigation/settings "before"
screens come from `main` at `a5bea71`, with only debug local-API transport added to use the
same fixture; the old UI was not edited. The pending-state pair records the actual defect
and its correction. The latest APK was restored afterward, preserving app data.

An explicit ACTION_VIEW proves the app's routing, not Android's external link chooser.
Simulated chips exercise real writer/verification code and API state transitions, not RF
hardware. Physical tap behavior, the Google Play-installed build, and pre-Android-13
language fallback were **not** runtime-verified. A physical signed-build test remains
necessary for the reported foreground URL prompt. Outside-app NFC behavior is governed
by Android and App Link verification and is not changed by the foreground reader.

Physical release acceptance: with a dedicated test worker and verified test-zone card,
open Shift, Materials and More in turn, present the card without using manual scan, and
confirm the app shows the correct building with no URL prompt. Remove the card between
taps and respect the existing three-second duplicate guard; verify one start and one end
in the admin. Repeat after background/resume and after returning from operator tools.
Operator test scans must leave the worker's shift count unchanged. This final physical
acceptance was not performed during the emulator run.
