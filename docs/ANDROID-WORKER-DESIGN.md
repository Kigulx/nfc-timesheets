# Android worker design: Calm Route

TASK-360, 23 September 2026. Scope: the worker experience and its scan fallback.

The owner's reference is the rounded phone layout in the local Calm Order concept.
The independent design critic compared three directions before implementation:

| Direction | Strength | Trade-off | Choice |
| --- | --- | --- | --- |
| Calm Route | Clear primary action, soft neutral surfaces, compact entrance illustration, one next assignment | Less decorative than a marketing page | Selected |
| Working Route | A vertical timeline helps multi-site days | Dense and harder at 200% text; clock-in competes with planning | Borrow only compact upcoming assignment presentation |
| Illustrated Journal | Warm paper and character illustrations feel friendly | Large characters compete with instructions; decorative colour can obscure shift state | Not selected for the working app |

## Presentation

- Cards have 26dp corners, consistent internal spacing and theme-based surfaces.
- The main heading uses a clear 28sp hierarchy, with a localized day/date above it.
- Native vector scenes show an entrance with a tag and phone, and a cleaning-supplies basket.
  They need no downloads, libraries or image decoding. Decorative drawings and initials are
  excluded from accessibility announcements; all instructions remain real localized text.
- A dark primary action is at least 54dp high. Controls remain at least 48dp high.
- The schedule initially shows one upcoming assignment; all assignments and refresh remain
  reachable. A short note explicitly distinguishes planned work from recorded hours.
- Materials, account, language, pending-delivery and history cards use the same visual rules.
- Brand colour roles remain fixed, independent of wallpaper. The running field remains the
  fixed blue required by decision-60. Its optional animated backdrop stays feature-gated.

## Motion and honest state

The persisted shift is the source of the time card, never an animation callback. The card
moves upward 28dp and settles from 97% to full scale over 320ms. Compose's animation clock
observes Android's duration scale, including zero. Content, semantics and controls exist
immediately; no write or network action waits for the animation.

The entrance is keyed by the shift's start time and remembered through saved UI state.
Returning from another tab or recreating the activity does not create another shift.
The newest completed row uses the same finite entrance after clock-out. There is no new
infinite animation on the idle screen.

A neutral clock represents pending/error/overdue states; the decorative check appears only
when the open shift is confirmed and has no synchronization error. Existing pending text,
error details, manual confirmations, timeout resolution and retry actions remain visible.
The timer uses tabular digits fitted to the available width so large text cannot clip time.

## Review and evidence

Build and actual emulator verification are recorded in TASK-360 and the local report under
`captures/company-workspaces/android-polish/`. Concept descriptions are design proposals;
screenshots are actual APK captures. NFC intent simulation exercises the app's routing and
shift UI, but cannot prove physical radio/card reading on an emulator.
