# Vallox IV Card 2.0

The card is a standalone Lit custom element. Home Assistant and Vallox own all
persistent control state. No cloud AI, custom integration or browser timer is required.

## Boundaries

- `shared/types.ts` describes the small HA frontend API surface and typed configuration.
  The editor schema groups settings; validation is also used by the editor before save.
- `card/vallox-iv-card.logic.ts` normalizes readings, units and advertised capabilities.
  Unknown is distinct from off and zero. Physical temperatures are converted separately.
- `data/history.ts` reads compressed Recorder history for the configured entities only.
  It preserves attributes (including changing units and fan presets), caches requests per
  HA connection for five minutes, and bounds configuration-cache entries.
- `data/energy.ts` operates on timestamped series without HA service access. It handles
  energy gaps/resets, local calendar days (including DST), comparable hours and defrost intervals.
- `data/insights.ts` produces versioned, evidence-linked findings. It has no command dependency.
- `data/actions.ts` only accepts explicit user commands. It targets `fan_entity` or the
  configured adapter script. The browser never calls the global Vallox profile service directly.
- `card/core.ts` draws a stationary counterflow core. Separate flow paths indicate direction;
  fan request is not presented as measured airflow. The heater symbol uses only its bound sensor.
- The native `ha-card` owns background, border and shadow styling. Do not redeclare
  those on the outer selector: it overrides theme rules in the HA frame's shadow root.
  SVG surfaces use `card-background-color`, since `ha-card-background` may be a gradient.
  Normal controls use the HA primary colour; airflow colours carry temperature meaning.
  The demo models the HA frame and a glass theme to exercise the same CSS cascade.
- Blueprints implement a persistent seasonal state machine and native profile timing.
  They can be installed independently of the frontend.

## Physical semantics

Supply temperature efficiency is `(core_outlet - outdoor) / (extract - outdoor)`.
It is only estimated in heat recovery with at least 3 °C difference. The final, possibly
electrically heated supply temperature is never used in that calculation. An explicit
efficiency sensor overrides estimation and retains its configured kind and scale. A
one-percent measurement stays 1%; out-of-range readings are shown with a binding notice.

CO₂ and relative humidity belong to extract air. The core outlet temperature and heater
status belong to supply air. The core state determines flow routing. During defrost, fan
RPM distinguishes running supply from stopped supply; without RPM/configuration the
supply path is dashed and its movement remains unconfirmed. `defrost_mode` can explicitly
select a known unit setting; it never changes that setting.

## Energy and evidence limitations

Consumption needs a cumulative nonnegative Wh/kWh/MWh sensor. W/kW alone is displayed
as power; an HA Integral helper can supply cumulative energy. Counter intervals longer
than 15 minutes, unavailable intervals, decreasing counters and changing units are not
interpolated. Select a meter reporting at least every 15 minutes. Partial daily totals are
not presented as complete; 90% coverage is required. Brief valid intervals can be apportioned
at hour/day boundaries, so totals near boundaries are approximate.

Recorded state is held until the next recorded change. Recorder retention must cover the
comparison period; unrecorded HA downtime cannot always be distinguished from unchanged
states. Electricity attribution is suppressed for intervals without valid meter endpoints.
Temperature/power graphs show hourly averages; heater share uses minute-weighted samples.
Defrost event durations and electricity allocation use recorded state boundaries.

Comparable-hour analysis requires the same profile, outdoor temperature ±2 °C and fan
request ±5 percentage points, at least six hours from three distinct local dates. The
reference window excludes the latest day and extends back seven days. Three complete
consecutive hours over 1.5× their references produce an observation. This is not a fault diagnosis.
Defrost time uses the same comparable conditions and three-hour persistence, with at least
90% known operating-state coverage. It works independently of the energy meter. A zero
defrost reference does not support a relative increase claim; repeated long events remain
a separate rule.

There is no generic 17 °C target, no automatic target adjustment, no universal comfort
floor, no estimate from heater nameplate power and no whole-home savings claim. An
optional comfort floor is supplied by the user, in °C, and is shown only as their preference.
Lower winter settings are valid input. Defrost settings are never changed by advice.

## Seasonal memory and failure behavior

Memory is a persisted text value: `expected_lock|candidate|candidate_since|last_switch`.
Never configure an initial value that replaces it on restart. Source samples are taken
every five minutes. Auto needs 260 valid samples, 90% age coverage and a fresh sampled
source. Qualification resets on missing data and HA restart, while the last-switch interval
survives restart. This deliberately waits again after an unobserved outage.

Auto waits six hours above 15 °C / below 12 °C, and 24 hours between changes. Both thresholds
and times are blueprint inputs. Between thresholds it holds the current state. An external
lock change pauses Auto. Expected state is persisted before a command; an interrupted or
unconfirmed command therefore fails closed. Explicit Winter/Summer selection can act
without weather history. Only the bypass-lock switch is commanded.

## Validation

Vitest covers normalization, command targeting, missing readings, energy segmentation,
DST, evidence gates and user-defined low temperatures. Playwright measures actual bounds,
touch targets, keyboard operation, motion preferences and the HA-style constrained slot.
Python tests execute the shipped YAML's templates and action decisions against a deterministic
HA stub. They do not emulate HA's scheduler or the firmware. Confirm native timer completion
on the installed unit before retiring an existing timer chain.
