# Development and releases

User installation and operation belong in [README](../README.md), [User guide](USER-GUIDE.md)
and [Configuration](CONFIGURATION.md). This file is for contributors.

## Local setup

CI uses Node.js 22 and Python 3.12. From the repository root:

```sh
npm ci
npx playwright install chromium
python -m pip install -r tests/requirements.txt
npm run dev
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.
The demo runs at `http://127.0.0.1:5173/`. Its simulated commands never contact HA.
Use its controls for scenario, dimensions, language, theme and optional profiles.

Useful examples:

- `/?scenario=winter&width=420&height=440&theme=dark`
- `/?scenario=bypass&width=390&height=376`
- `/?scenario=defrost-stop&width=320&height=248`
- `/?scenario=missing&layout=masonry&width=390`

## Source map

| Location | Responsibility |
|---|---|
| `src/card/vallox-iv-card.logic.ts` | Normalize HA readings and advertised capabilities. |
| `src/card/core.ts` | Stationary core geometry, independent airflow channels and heater. |
| `src/card/vallox-iv-card.ts`, `.styles.ts` | Responsive layout, dialogs and interactions. |
| `src/data/` | History, measured energy, read-only insights and explicit actions. |
| `src/editor/` | Visual editor and its settings schema. |
| `src/shared/` | Types, validation, units, localization and theme colours. |
| `demo/`, `index.html` | Standalone simulation; no real-device credentials. |
| `tests/` | Logic, browser and companion-template checks. |
| `blueprints/`, `examples/packages/` | Optional HA companions, independent of the browser. |
| `dist/vallox-iv-card.js` | Generated and committed HACS bundle; do not hand-edit. |

Read [architecture](ARCHITECTURE.md) before changing behavior. Historical v1 design
and visual exploration notes are under [archive](archive/V1-SPEC.md) and
[design decisions](decisions/airflow-visual.md); they do not override current behavior.

## Checks

```sh
npm run check
npm run test:browser
python tests/test_blueprints.py
```

`check` runs TypeScript, ESLint, Vitest and the production build. For browser changes,
inspect normal and compact layouts; tests cover 320/390/480/768 px widths,
248/376/504 px heights, theme contrast, geometry and keyboard/touch interactions.
If a local machine is resource constrained, use `npm run test:browser -- --workers=1`.

Use the checks relevant to the change; documentation-only edits need accurate links,
examples and screenshots. CI and tagged releases run the full suite. Companion tests
are deterministic templates/actions against a stub, not real HA scheduling or firmware.
See [validation scope](VALIDATION.md).

## Documentation screenshots

Run the local demo in one terminal, then in another:

```sh
node scripts/capture-screenshots.mjs
```

The script captures the rendered card in English at a fixed simulated time and
480×504 layout, using a dark heat-recovery example and a light defrost example.
Images go to `docs/images/`. It uses only the local fixture page. Inspect both images
before committing. Keep the simulated-data caption beside them in the README;
never publish private dashboard captures or credentials in documentation.

## Test beside an installed card

```sh
npx vite build --mode ha-preview
```

This produces the isolated `vallox-iv-card-v2-preview` element/editor under
`.cache/ha-preview`. It can coexist with the production `vallox-iv-card` for an
authorized HA test. Back up affected dashboard/resource settings first and remove
the preview registrations and references when the test is finished. Do not register
a manual production bundle alongside the HACS production bundle.

## Release procedure

1. Set the requested version with `npm version <version> --no-git-tag-version`.
   `package.json` is the version source; keep the lockfile in sync.
2. Update current installation docs, blueprint source URLs, validation scope and
   `docs/releases/v<version>.md`. Preserve historical release notes.
3. Build and commit `dist/vallox-iv-card.js`. Confirm the generated bundle matches
   source and that the branch/PR checks pass before merging.
4. Tag the verified release commit `v<version>` and push the tag. Never move an
   already published tag or replace its bundle to slip in later changes.
5. The release workflow reruns checks, matches tag/version and publishes the bundle.
   Stable versions are marked Latest; prereleases are opt-in and do not replace Latest.
6. Verify GitHub's release flags and asset hash. Refresh HACS release information
   when checking availability. Install into a user's HA only within the authorized task.

Documentation updates can be merged after a release without changing its immutable
tag or runtime bundle. Do not describe simulated winter observations as field evidence.

## Coding-agent compatibility

Shared project instructions live in root [AGENTS.md](../AGENTS.md). Codex discovers
that filename directly ([OpenAI documentation](https://learn.chatgpt.com/docs/agent-configuration/agents-md)).
Root [CLAUDE.md](../CLAUDE.md) imports it with `@AGENTS.md`, as supported by
[Claude Code](https://code.claude.com/docs/en/memory#agentsmd).
[Copilot's repository instructions](../.github/copilot-instructions.md) provide a
short, self-contained entry point and link to the same guidance. Copilot feature
support varies by environment ([GitHub support matrix](https://docs.github.com/en/copilot/reference/custom-instructions-support)).

Keep detailed workflows here and common rules in AGENTS.md rather than in the
customer README. Changes to shared rules should keep the Claude import and Copilot
entry point consistent. These files configure project context; they are not a claim
that every client follows every instruction identically.
