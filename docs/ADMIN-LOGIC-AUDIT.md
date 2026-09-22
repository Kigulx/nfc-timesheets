# Admin logic audit — TASK-338

Verified locally on 2026-09-19. Branch: `codex/app-improvements`, preserving Android commit `8a32cc7`. No deployment, push, PR or merge.

## What the requested improvements mean

- Address suggestions should help choose a complete street address; an address change must invalidate the old map coordinates.
- The existing building card already displays this month's confirmed hours, target, latest cleaning and open issues. It now links directly to that building's owner-report sharing controls.
- Zone creation remains in the operator app (decision-54); web administration edits existing zones and explains the field workflow.
- Owner links are revocable bearer credentials. The existing fragment-based URL and strong random token are retained. This change does not introduce a URL shortener or broaden the portal payload.

## Confirmed defects fixed

1. Worker deactivation through the edit form left session rows reusable after reactivation. The update now deletes those sessions atomically.
2. A successful login-phone write followed by a failed login-email write left the form's original-phone baseline stale. Retrying, including reverting the phone, now writes the intended value.
3. Form deactivation of a building/contact/company did not consistently revoke owner links. Links now remain revoked after reactivation. Company changes revoke the old grants; moving a contact clears incompatible building contact references.
4. A grant could be issued to a contact from another company. Both issuance and public reads now require active, matching ownership.
5. Form deactivation of a building left its zones active. Both deactivation paths now disable them; reactivating a building does not reactivate its zones automatically.
6. Editing an address preserved its previous pin. The UI clears it, and the API also catches old clients echoing unchanged coordinates with a changed address.
7. A late geocoder reply could overwrite newer coordinates/address. The write now compares the address, coordinates and exact previous geocoding timestamp before applying its result.
8. Null geocoder coordinates became zero through numeric coercion. Malformed coordinates, incomplete coordinate pairs and broad geographic centroids are rejected.
9. Building setup still claimed three steps and described retired building-level tags. DE/EN text now matches the two-step, zone-based workflow and explains deactivation consequences.

## Verification

- `node server/check-api.js`: PASS on genuine isolated PostgreSQL 16.14. New lifecycle, cross-company, stale-pin, malformed-coordinate, centroid and delayed-geocoder regressions included. The suite uses throwaway schemas; no production database was used.
- Independent browser feature checks: worker creation/validation/partial save/deactivation/reactivation; company/contact/building creation and validation; owner-report issuance/rotation/revocation; address editing/cancel/fallback; zone validation/edit/deactivation/reactivation. UI results were compared with database state.
- Owner report verified empty and populated. It exposes building name and recent cleaning date, first name and duration, without surname, email, wage, zone details or admin navigation.
- `pnpm verify` was run. It still stops at four pre-existing Windows path assertions in `web/scripts/check.mjs`: map constructor file path; locations building UUID rule; locations unverified-zone wording; worker required-rate form. The user requested that path handling remain unchanged.
- Separate Biome lint, TypeScript and static production build: PASS. Lint retains the pre-existing optional-chain warning at `web/app/payroll/page.tsx:749`.
- DE/EN key and ICU parity checks pass. New form wording was also checked in both languages in the browser.
- Dedicated review read all ADR files and approved the final implementation. `node ops/check-branding.mjs`: all checks OK, no TODO/FAIL. `git diff --check`: PASS.

## Boundaries and setup

No Google browser/geocoding key is configured in this local environment. Manual-entry fallback and parser/race behavior are verified; live Google suggestions, actual placement on Google tiles and provider permissions/billing are not verified. Address search uses the existing browser Maps loader and the official Places Autocomplete widget, without new dependencies. A configured browser key must support Places API (New). The server geocoder still independently verifies the selected address. An interpolated address is not a survey-grade building coordinate.

The owner portal remains the existing last-20-cleanings view; this work does not add a complete monthly owner statement or PDF export. Monthly hours in the administrator card retain the existing loaded-data cap and truncation warning.

Backlog.md 1.52.0 is installed as the official standalone Windows executable at `%LOCALAPPDATA%\Programs\Backlog.md\backlog.exe`, added to user PATH. New terminals can run `backlog`; existing terminals may need reopening. The repository's existing CLI instructions are retained. No additional cloud service or MCP configuration is needed for that workflow. The global pnpm wrapper install failed, so the official pnpm-fetched executable was installed directly instead.

Screenshots: `docs/media/app-improvements/index.html` and `docs/media/app-improvements-screenshots.zip` (local ignored artifacts). Existing before/after comparisons are retained, with six additional real screenshots from this audit. All displayed records are synthetic. Screenshots are evidence of the tested UI state, not of live Google or production behavior.

Official references: [Backlog.md](https://github.com/MrLesk/Backlog.md), [Google Places Autocomplete widget](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new).
