# Vallox IV Card

See what your ventilation is doing — and control it from one Home Assistant card.

**Vallox IV Card 2.0** shows the four air temperatures, heat recovery, bypass, defrost,
fan profile and measured electricity in a layout that fits your dashboard.
Available in English and Finnish, with light and dark theme support.

[Install with HACS](#install-with-hacs) · [Set up the card](#set-up-the-card) ·
[User guide](docs/USER-GUIDE.md) · [Configuration](docs/CONFIGURATION.md) ·
[Latest release](https://github.com/raunosr/vallox-iv-card/releases/latest)

## See the airflow, understand the state

| Heat recovery · dark theme | Defrost · light theme |
|:--:|:--:|
| ![Vallox card showing separate warm and cold air streams, temperatures and integrated profile buttons](https://raw.githubusercontent.com/raunosr/vallox-iv-card/master/docs/images/heat-recovery.png) | ![Vallox card showing a frosted core, the bypass route and an active post-heater during defrost](https://raw.githubusercontent.com/raunosr/vallox-iv-card/master/docs/images/defrost.png) |

*Screenshots use simulated readings. The frost effect illustrates defrost; it does not
measure ice or show how much of a defrost cycle is complete.*

- **Follow the air:** separate paths for outdoor/supply and extract/exhaust air,
  with distinct heat-recovery, bypass, cool-recovery and defrost states.
- **Control your profile:** Home, Away and Boost inside the card; optionally show
  Fireplace and other profiles supported by your unit.
- **Check indoor air:** CO₂ and humidity appear beside extract air.
- **Understand post-heating:** see the temperature after the core, the heater state
  and the final supply temperature together.
- **Open history:** press a temperature, the efficiency number or the heater symbol
  to open that entity's Home Assistant history.
- **Track electricity:** connect your own power/energy meter for consumption history
  and explainable suggestions.

## What you need

- Home Assistant with the [Vallox integration](https://www.home-assistant.io/integrations/vallox/)
  already configured and working.
- HACS for the easiest installation, or use the [manual installation instructions](docs/MIGRATION.md#manual-installation).
- The Vallox fan and temperature entities you want to display. Optional features
  appear when you select their sensors.

This is a **dashboard card** for the Vallox integration, not a replacement integration.
Available sensors and profiles depend on your unit and its integration.
An electricity meter is optional; the card works without one.

## Install with HACS

1. Open **HACS → ⋮ → Custom repositories**.
2. Add `https://github.com/raunosr/vallox-iv-card` with type **Dashboard**.
3. Find **Vallox IV Card** in HACS and download the latest stable version.
4. Reload Home Assistant in your browser or Companion App.

Already installed? Update to **2.0.0** in HACS. If it has not appeared, use
**⋮ → Update information** on the repository. This is a stable release; no beta
opt-in is needed.

HACS normally registers the resource. Its URL should be
`/hacsfiles/vallox-iv-card/vallox-iv-card.js`, with type **JavaScript module**.
If you previously installed a manual copy, follow the
[migration instructions](docs/MIGRATION.md) so two versions do not load together.

## Set up the card

1. Edit your dashboard and choose **Add card → Vallox IV Card**.
2. In **Unit and profiles**, select your Vallox fan and the profiles you want to show.
3. In **Airflow and core**, select the four temperature sensors and **Core state**.
   Core state means the sensor reporting heat recovery, bypass or defrost — usually
   `sensor.vallox_cell_state`.
4. Optionally select the **post-heater**, **temperature after the core**, **CO₂**,
   **humidity**, **efficiency** and **remaining profile duration** sensors.
5. Save. In a Sections dashboard, start with the default **12 columns × 6 rows**.
   Four rows use the compact layout.

Your entity IDs may differ from the examples. Find them under
**Settings → Devices & services → Vallox → your device**. Some diagnostic entities
may need enabling before they appear in the selector.

Prefer YAML? Add a **Manual** card and adapt this example:

```yaml
type: custom:vallox-iv-card
fan_entity: fan.vallox
modes: [Home, Away, Boost]
outdoor_air_temp: sensor.vallox_outdoor_air
extract_air_temp: sensor.vallox_extract_air
supply_air_temp: sensor.vallox_supply_air
exhaust_air_temp: sensor.vallox_exhaust_air
supply_cell_temp: sensor.vallox_supply_cell_air
cell_state: sensor.vallox_cell_state
post_heater: binary_sensor.vallox_post_heater
co2: sensor.vallox_carbon_dioxide
humidity: sensor.vallox_humidity
profile_duration: sensor.vallox_profile_duration
grid_options:
  columns: 12
  rows: 6
```

[Full configuration reference](docs/CONFIGURATION.md) ·
[Finnish example](examples/card-fi.yaml)

## Use the card

| Press | What happens |
|---|---|
| **Home / Away / Boost** | Selects that profile on your configured Vallox fan. |
| **Profile badge** at the top right | Opens controls, remaining timer information and additional details. |
| **A temperature** | Opens the selected temperature entity's history. |
| **Efficiency number** | Opens its configured sensor's history. A calculated estimate has no separate entity history. |
| **Heater symbol** | Opens the post-heater's on/off history, including when its current state is unknown. |
| **Energy row** | Opens energy history and observations. If an observation needs attention, its tab opens first. |

Boost and Fireplace use the duration stored in your unit. Their timers run in Vallox,
so closing the dashboard does not end or extend them. A custom duration requires the
[optional profile companion](docs/MIGRATION.md#optional-companions--experimental).
Start/stop is available in the controls dialog and uses the fan integration.

The percentage beside the **fan icon** is the fan request; the percentage in the
**core** is efficiency. The diagram explains air routing, not measured airflow volume
or a measured bypass-damper position.

## Add energy measurement when you're ready

In the editor's **Energy measurement** section, select:

- **Power:** a sensor reporting W or kW.
- **Cumulative energy:** a sensor reporting Wh, kWh or MWh.

Use separate power and energy entities with the correct units. The card shows
instantaneous power, today's energy, the last 24 hours and a seven-day view when
enough history exists. With only a power sensor, you can create a Home Assistant
**Integral helper** for cumulative energy.

Without a working meter, the card shows **Energy measurement unavailable**.
It does not substitute zero or calculate consumption from the heater's rated power.

Suggestions can account for your heating system and your own daily energy budget.
They explain the observation and what to check; they never change temperature or
defrost settings. There is no universal supply-temperature minimum or built-in
17 °C recommendation. [Learn how energy and suggestions work](docs/USER-GUIDE.md#energy-and-suggestions).

## Optional seasonal control

An optional Home Assistant blueprint can switch the winter bypass lock using outdoor
temperature history. Releasing the lock lets Vallox choose bypass or cool recovery;
it does not force the core into a fixed position.

The seasonal and custom-timer companions are **experimental**, installed separately
and initially disabled where applicable. Updating the card through HACS does not
install or enable them. [Companion setup and validation](docs/MIGRATION.md#optional-companions--experimental).

## Help and troubleshooting

- **The old design still appears:** reload every browser/Companion App session and
  check for a manually installed `/local/` resource or an isolated preview card.
  Use `custom:vallox-iv-card` with the HACS resource.
- **A profile is missing:** check the selected fan and your **Visible profiles** list.
  Only profiles advertised by that fan are shown.
- **Core state is unknown:** select the operating-state sensor, not an efficiency sensor.
- **Energy or history is missing:** check the sensor's availability, units and Recorder
  history. Power alone is not cumulative energy.
- **The after-core temperature equals supply:** check that `supply_cell_temp` is
  bound to the pre-heater sensor.

See the [user guide](docs/USER-GUIDE.md), [migration and rollback](docs/MIGRATION.md),
[release notes](docs/releases/v2.0.0.md) and [validation scope](docs/VALIDATION.md).
For a problem, [open an issue](https://github.com/raunosr/vallox-iv-card/issues) with
your card/HA/browser versions, card dimensions, anonymized YAML and a screenshot.

Want to contribute? See [contributing](CONTRIBUTING.md).
