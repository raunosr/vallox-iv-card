# Vallox IV Card 2.0

A standalone Home Assistant card with a counterflow core, four air streams, integrated
profile controls, measured electricity and explainable suggestions. Lit + TypeScript.
Finnish and English, dark and light HA themes.

**Version 2.0.0-beta.4 — opt-in prerelease.** The card works independently. Seasonal control
and custom profile timing are experimental, optional Home Assistant companions that still
need real-device validation. Installing the card does not install or enable these companions.
See the [release notes](docs/releases/v2.0.0-beta.4.md) and [validation status](docs/BETA-VALIDATION.md).

## What you see

- Core state and an explanation of heat recovery, bypass, cool recovery and defrost.
- A labelled propeller indicator for fan request, separate from core efficiency.
- Extract temperature with its CO₂ and humidity readings.
- Supply temperature with core-outlet temperature and a heater symbol on its airflow route.
- Thicker directional paths; stopped or unconfirmed supply flow during defrost.
- Home/Away/Boost controls and optional Fireplace/Extra/Auto when advertised by the unit.
- Power, daily/24-hour electricity, seven-day consumption and a shared state/temperature/power timeline.
- Read-only suggestions with observations, limitations and manufacturer references.

The card responds to its available height and width. Four-row compact cards keep air-quality
and heater readings attached to the correct air stream. Open energy through the details
button. Keyboard operation, reduced motion and 44-pixel touch targets are supported.

## Installation

In HACS, open **Vallox IV Card → ⋮ → Redownload → Need a different version?** and select
**v2.0.0-beta.4**. Use **Update information** first if the release has not appeared yet.
HACS also offers an optional prerelease switch for beta update notifications.
See the [HACS version selector](https://hacs.xyz/docs/use/repositories/dashboard/#downloading-a-specific-version-of-a-repository)
and [prerelease switch](https://www.hacs.xyz/docs/use/entities/switch/) documentation.

Reload the frontend after updating. The HACS module resource should point to
`/hacsfiles/vallox-iv-card/vallox-iv-card.js`. A manually registered `/local/` copy is a
different file and will not be updated by HACS. Keep only one production card resource.
See [installation, migration and rollback](docs/MIGRATION.md) before replacing it.
For manual installation, use the release asset `vallox-iv-card.js` or build
`dist/vallox-iv-card.js` locally.

```yaml
type: custom:vallox-iv-card
fan_entity: fan.vallox
outdoor_air_temp: sensor.vallox_outdoor_air
extract_air_temp: sensor.vallox_extract_air
supply_air_temp: sensor.vallox_supply_air
exhaust_air_temp: sensor.vallox_exhaust_air
supply_cell_temp: sensor.vallox_supply_cell_air
cell_state: sensor.vallox_cell_state
post_heater: binary_sensor.vallox_post_heater
co2: sensor.vallox_carbon_dioxide
humidity: sensor.vallox_humidity
modes: [Home, Away, Boost]
```

The visual editor exposes optional settings. See [the Finnish example](examples/card-fi.yaml).

| Setting | Meaning / default |
|---|---|
| `fan_entity` | Explicit fan target; required for commands |
| `modes` | Ordered profiles; default Home/Away/Boost; unsupported profiles hidden |
| `profile_action_script` | Optional adapter for custom timing; never inferred automatically |
| `boost_duration`, `fireplace_duration` | Adapter defaults: 30 / 15 minutes |
| `profile_duration` | Actual remaining time; no browser return timer |
| `supply_fan_speed`, `extract_fan_speed` | RPM readings for identifying supply-stop defrost |
| `defrost_mode` | `auto` (RPM), `bypass`, `supply_stop`; describes a known setting without changing it |
| `efficiency` | Optional sensor; otherwise estimate from the core outlet |
| `efficiency_kind` | `custom`, `supply`, `extract`; identifies the supplied sensor's meaning |
| `efficiency_scale` | `percent` default; `ratio` must be explicit for 0–1 values |
| `energy.power_entity`, `energy.energy_entity` | Optional W/kW and cumulative Wh/kWh/MWh |
| `insights.heating_system` | `unknown`, `heat_pump`, `district_heating`, `other_efficient`, `electric` |
| `insights.daily_budget_kwh` | Optional personal budget, no universal default |
| `insights.comfort_floor` | Optional user preference in °C, no generic lower limit |
| `insights.excess_ratio`, `insights.defrost_minutes` | Observation defaults 0.5 / 60; not manufacturer fault limits |
| `seasonal` | Mode/status/mean/bypass-lock helper bindings |
| `language`, `temperature_unit` | Inherit HA; optional fi/en and °C/°F overrides |
| `compact` | Force compact layout; a low card height also selects it |

## Energy philosophy

There is **no general 17 °C recommendation** and no automatic supply-temperature change.
Away 12 °C, Home/Boost 15 °C and lower winter settings are valid inputs to the user's own
comparison. Findings account for the selected heating system and measured electricity,
distinguishing heater activity during and outside defrost.

A broken meter does not become zero consumption. Heater nameplate power is not used to
estimate kWh. Electricity during defrost is not labelled entirely as incremental defrost
cost. A ventilation meter alone cannot establish whole-home savings. Read the
[measurement details](docs/ARCHITECTURE.md) for coverage requirements and limitations.

## Optional server controls

- [Native profile timer](blueprints/script/vallox_profile.yaml): one command path for
  card, sauna and CO₂. Guards the untargeted timed service against multiple Vallox units.
  Repeated requests are idempotent; an explicit restart is separate.
- [Seasonal control](blueprints/automation/vallox_season.yaml): initially Off. Above a
  15 °C 24-hour mean, releases the winter lock; below 12 °C, locks. Requires six qualifying
  hours and a minimum 24-hour interval. Thresholds and times are configurable.
- [Companion helper example](examples/packages/vallox_companion.yaml) and
  [migration/rollback instructions](docs/MIGRATION.md).

Summer allows Vallox to choose bypass or cool recovery. No supply target or frost-protection
parameter is changed. Missing data and external lock changes are handled explicitly.

## Development

Node 22 is used in CI. Install with `npm ci`, then:

```text
npm run dev
npm run check
npx playwright install chromium
npm run test:browser
pip install -r tests/requirements.txt
python tests/test_blueprints.py
```

The local demo at http://127.0.0.1:5173/ has simulated winter, bypass, cool-recovery,
defrost, stopped, missing-sensor and high-consumption scenarios. Its commands only affect
demo state. Width, height, theme and language can be changed.

`npx vite build --mode ha-preview` builds a separate `vallox-iv-card-v2-preview` element
in `.cache/ha-preview` for testing beside v1. The standard build produces one HACS bundle.
Tagged releases run checks and verify the tag against package.json before publication.

See [architecture](docs/ARCHITECTURE.md), [migration](docs/MIGRATION.md) and
[evidence](docs/EVIDENCE.md). Actual winter observations are still needed to evaluate
the rules for a particular house.
