# Vallox IV Card — project instructions

This repository is a Lit 3 / TypeScript Home Assistant dashboard card, built by Vite
into one HACS module. `custom:vallox-iv-card` is the public card type. English and
Finnish, light/dark themes, Sections and masonry are supported.

## Where to work

- `src/card/`: normalized device model, SVG core, layout, controls and timeline.
- `src/data/`: Recorder history, measured energy, local insights and explicit actions.
- `src/editor/` and `src/shared/`: settings, validation, types, units and localization.
- `demo/` and `tests/`: simulated data and regression coverage.
- `blueprints/` and `examples/`: optional HA companions and user configuration.
- `dist/vallox-iv-card.js`: generated release artifact. Rebuild; never hand-edit.

Read `docs/ARCHITECTURE.md` before changing behavior and `docs/DEVELOPMENT.md` for
setup, screenshots and release workflow. The README and user guide are for card
users, not agent instructions. `docs/archive/V1-SPEC.md` is historical, not current.

## Preserve behavior and meaning

- Distinguish missing/unavailable from zero and off. Do not infer percent versus ratio.
- CO₂/humidity belong to extract air; after-core temperature and heater belong to
  supply air. Estimate efficiency before post-heating, never from final supply.
- Keep the core and heater geometry fixed across operating states. Air paths remain
  separate; animation is illustrative, not measured airflow or defrost progress.
- Use the card's available width and height, HA theme variables, reduced motion,
  visible focus and at least 44px touch targets. Default Sections size is 12×6.
- Suggestions are read-only. No universal minimum supply target, invented meter
  values, heater-nameplate kWh estimates or unsupported whole-home savings claims.
- Target the configured fan for explicit controls. Persistent timing/seasonal control
  belongs in HA/the device, not a browser timer. Keep companions optional.
- Live HA changes must stay within the user's authorized task. Back up the affected
  config, inspect consumers and verify written state. Do not publish private exports,
  credentials or installation-specific settings in this public repository.

## Validation and delivery

Use Node 22 and Python 3.12 as in CI. Install with `npm ci`,
`npx playwright install chromium` and `python -m pip install -r tests/requirements.txt`.

- TypeScript/runtime changes: `npm run check`.
- UI/interaction changes: `npm run test:browser` and inspect normal/compact screenshots.
- Companion changes: `python tests/test_blueprints.py`.
- Documentation only: validate links, examples and rendered screenshots; do not
  regenerate unrelated code or change a released version just for prose.

`package.json` is the version source. Tags are `v` plus that version. Preserve
published tags/assets; follow `docs/DEVELOPMENT.md` for an authorized release.
Keep commits focused and report relevant verification and remaining real-world limits.

## Code Review Rules

Flag changes that conflate unavailable data with zero/off, use electrically heated
supply temperature for recovery efficiency, invent energy evidence, expose secrets,
send commands from suggestions or make airflow overlap/escape its assigned card.
Do not treat synthetic winter data or template stubs as firmware field validation.
