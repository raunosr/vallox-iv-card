# Vallox IV Card — contributor notes

Lit 3 + TypeScript, bundled by Vite into one HACS JavaScript module.

- `src/card/vallox-iv-card.logic.ts`: HA readings → normalized device state.
- `src/card/core.ts`: stationary SVG core, independent air channels and heater.
- `src/card/vallox-iv-card.ts` / `.styles.ts`: responsive layout and controls.
- `src/data/`: history, measured energy, read-only insights and explicit actions.
- `src/editor/schema.ts` / `vallox-iv-card-editor.ts`: HA visual editor.
- `src/shared/`: configuration, validation, units, localization and theme colors.
- `blueprints/`: optional HA companions, independent from the browser.

Read `docs/ARCHITECTURE.md` and `docs/MIGRATION.md` before changing behavior.
`SPEC.md` describes historical v1, not the current implementation.

Keep unavailable distinct from zero/off; never guess percent vs ratio. CO₂ and
humidity belong to extract air. Use the core outlet for estimated supply efficiency.
Suggestions are read-only, with no generic minimum supply target or invented energy.
Only explicit user actions reach `data/actions.ts`; timing belongs to HA/the device.

The core and heater retain the same bounds in every operating state. Use the card's
available width and height, HA theme variables, reduced motion and 44px touch targets.
Sections defaults are 12 columns × 6 rows; four rows use a compact view.

Run `npm run check`, `npm run test:browser` and `python tests/test_blueprints.py`.
CI uses Node 22 and Python 3.12. The version source is `package.json`; tags use `v`
plus that version. Update the built `dist/vallox-iv-card.js` with source changes.
Prereleases are opt-in and use reviewed notes from `docs/releases/<tag>.md`.
