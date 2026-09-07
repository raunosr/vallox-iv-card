# Airflow visual decision — 2026-09-06

Design record for contributors. For operating the card, see the [user guide](../USER-GUIDE.md).

The user chose the original diamond core: keeping its size and position across
operating states makes the diagram easier to follow than changing the core shape.
The larger route-map and horizontal-channel alternatives were discarded; their
demo-only rendering layer and comparison switcher have been removed.

The production renderer retains the original core geometry and incorporates:

- An outdoor inlet that enters from the right, with a left-pointing supply outlet.
- A bypass route following the lower-right edge, passing below the separately
  outlined extract channel. The heater stays on the same outlet in all states.
- A small closed-channel routing symbol when bypass is identified. It represents
  the schematic route, not a measured damper angle or full-bypass percentage.
- A softly frosted outline, subtle icy tint and meltwater falling from its lower
  edges during defrost. After review, the user preferred this simpler treatment over separate
  ice patches and snowflakes, which were removed. This illustrates the operating
  state, not measured ice quantity or progress.
- A stationary supply route for supply-stop defrost and reduced-motion support.

Run `npm run dev` and use `/?scenario=defrost` or `/?scenario=bypass`.
The normal demo controls also include supply-stop defrost. Old `variant` links
continue to open the production graphic; no prototype overlay remains.
