# Vallox IV Card — Copilot instructions

Read the shared [project instructions](../AGENTS.md) and the
[development guide](../docs/DEVELOPMENT.md) for the task you are working on.
These files are the common guidance for Codex, Claude Code and Copilot.

The project is a Lit 3 / TypeScript HA dashboard card. Vite builds the committed
`dist/vallox-iv-card.js` HACS artifact. Edit `src/` and rebuild instead of editing
that generated bundle. Keep the public `custom:vallox-iv-card` name compatible.

Preserve missing versus zero/off, explicit efficiency scales, extract-air CO₂ and
humidity, and separate airflow paths. Suggestions never change settings or invent
energy readings. Persistent timing belongs in HA/Vallox. UI changes must preserve
responsive dimensions, theme contrast, keyboard access and reduced motion.

CI uses Node 22 and Python 3.12. Run `npm run check` for runtime changes,
`npm run test:browser` for UI changes and `python tests/test_blueprints.py` for
companions. Validate links, examples and images for documentation-only changes.
Keep user-facing instructions in README/user docs and engineering guidance in
AGENTS.md/developer docs. Do not publish private HA configuration or credentials.
