# Card configuration

Use the visual editor for normal setup. The same options are available in YAML.
Replace example entity IDs with those provided by your installation.

[Getting started](../README.md#set-up-the-card) · [User guide](USER-GUIDE.md) ·
[Finnish YAML example](../examples/card-fi.yaml)

## Unit and profiles

| YAML option | Purpose / default |
|---|---|
| `type` | `custom:vallox-iv-card` |
| `title` | Optional card title; default `VALLOX`. |
| `fan_entity` | The Vallox `fan.*` entity. Required for profile and start/stop commands. |
| `modes` | Ordered list; default `[Home, Away, Boost]`. Unsupported profiles are hidden. Add `Fireplace`, `Extra` or `Auto` only if your fan advertises them. |
| `profile_duration` | Sensor reporting the unit's remaining profile time in minutes. |
| `profile_action_script` | Optional installed script for custom native timing; not needed for normal fan controls. |
| `boost_duration`, `fireplace_duration` | Durations passed to that script; defaults 30 and 15 minutes. Without a script, the unit's saved duration applies. |

Profile names in YAML use the integration's names, even with a Finnish UI. A custom
profile script must be configured for your installation. See [companions](MIGRATION.md#optional-companions--experimental).

## Airflow and core

| YAML option | Select this entity |
|---|---|
| `outdoor_air_temp` | Outdoor air entering the unit. |
| `extract_air_temp` | Air extracted from the rooms. |
| `supply_air_temp` | Final supply air delivered to the rooms. |
| `exhaust_air_temp` | Exhaust air leaving for outdoors. |
| `supply_cell_temp` | Supply air after the core, before the post-heater. |
| `cell_state` | Core operating-state sensor, usually `sensor.vallox_cell_state`. This is not an efficiency percentage. |
| `post_heater` | Post-heater state, normally a `binary_sensor.*`. |
| `efficiency` | Optional efficiency sensor. If omitted, the card may estimate supply temperature efficiency. |
| `efficiency_kind` | `custom` (default), `supply` or `extract`; describes the selected sensor's meaning. |
| `efficiency_scale` | `percent` (default, 1 = 1%) or `ratio` (1 = 100%). Never choose the scale just from the current value. |
| `temperature_unit` | `°C` or `°F`; otherwise follows HA's temperature unit. |

For an extract-efficiency sensor reporting percent:

```yaml
efficiency: sensor.vallox_poistoilman_hyotysuhde
efficiency_kind: extract
efficiency_scale: percent
```

## Other sensors

| YAML option | Purpose |
|---|---|
| `profile` | Profile sensor for history comparison. Current controls use the fan's reported profile. |
| `fan_speed` | Fan request in percent; otherwise the current fan percentage can be used. |
| `supply_fan_speed`, `extract_fan_speed` | RPM sensors for identifying supply-stop defrost. |
| `defrost_mode` | `auto` (default, uses RPM), `bypass` or `supply_stop`. An explicit choice describes your unit; it does not change its settings. |
| `co2`, `humidity` | Extract-air CO₂ and relative humidity sensors. |
| `filter_remaining` | Optional filter status/days-remaining sensor, available in Controls. |

## Energy and suggestions

```yaml
energy:
  power_entity: sensor.ventilation_power
  energy_entity: sensor.ventilation_energy
insights:
  enabled: true
  heating_system: heat_pump
```

The power entity must report **W or kW**. The cumulative energy entity must report
**Wh, kWh or MWh**. They are different measurements; do not bind both fields to the
same energy counter. All energy bindings are optional.

| `insights` option | Purpose / default |
|---|---|
| `enabled` | Show suggestions; enabled unless set to `false`. |
| `heating_system` | `unknown`, `heat_pump`, `district_heating`, `other_efficient` or `electric`. |
| `daily_budget_kwh` | Your optional daily budget. No universal budget is supplied. |
| `comfort_floor` | Your optional supply-air comfort reminder in °C, including when display units are °F. Not a device setting or a detection prerequisite. No general minimum is enforced. |
| `excess_ratio` | Relative increase in consumption or defrost time over your comparable history; default `0.5` means more than +50% for three consecutive hours. Does not gate frequent-heater-use advice. |
| `defrost_minutes` | Long-defrost observation threshold; default 60 minutes. This is not a fault criterion. |

[Energy behaviour and limitations](USER-GUIDE.md#energy-and-suggestions).

Selecting the heating system is enough to tailor the heater-use advice. All numerical
thresholds are optional. Frequent non-defrost heating is detected from six-hour state
history even without a daily budget or a comparable historical consumption baseline.

## Appearance

| YAML option | Purpose / default |
|---|---|
| `language` | `fi` or `en`; otherwise follows HA, with English fallback. |
| `compact` | Force the compact view. Limited card height also selects it automatically. |
| `show_efficiency`, `show_cell_state`, `show_profile`, `show_fan_speed` | Show/hide these readouts; enabled by default. |
| `show_co2`, `show_humidity`, `show_post_heater`, `show_supply_cell_temp` | Show configured optional readouts; enabled by default. |
| `enable_temp_colors` | Temperature colours; enabled by default. |
| `value_font_size` | Relative number size; `48` is the normal scale, not a fixed displayed pixel size. |
| `font_weight` | Number weight; default `600`. |
| `unit_opacity` | Temperature-unit opacity; default `0.6`. |
| `co2_limit` | CO₂ highlight threshold; default `1000` ppm. |
| `enable_co2_blink` | Optional animated CO₂ emphasis; respects reduced motion. |
| `label_extract_air`, `label_outdoor_air`, `label_supply_air`, `label_exhaust_air`, `label_efficiency`, `label_humidity` | Optional custom labels. |
| `temp_color_cold`, `temp_color_freeze`, `temp_color_neutral`, `temp_color_warm`, `temp_color_hot` | Optional temperature colours. Use the editor's colour selectors. |

In a Sections view, start with:

```yaml
grid_options:
  columns: 12
  rows: 6
```

Use four rows for the compact layout. The energy/details tabs remain accessible from
the top-right profile badge when the energy row is hidden.

## Optional seasonal helper bindings

Use these only after installing and testing the companion helpers and blueprint:

```yaml
seasonal:
  mode_entity: input_select.vallox_season_mode
  status_entity: input_text.vallox_season_status
  mean_entity: sensor.vallox_outdoor_mean_24h
  bypass_lock_entity: switch.vallox_bypass_locked
```

These entity IDs are examples. See [companion installation](MIGRATION.md#optional-companions--experimental).
