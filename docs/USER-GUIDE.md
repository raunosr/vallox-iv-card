# Using Vallox IV Card

[Back to README](../README.md) · [Configuration reference](CONFIGURATION.md)

## Read the four air streams

| Reading | Where the air is going |
|---|---|
| Outdoor air | From outside into the unit. |
| Extract air | From your rooms into the unit. CO₂ and humidity belong here. |
| Supply air | From the unit into your rooms, after any post-heating. |
| Exhaust air | From the unit back outside. |

**After core** is the supply temperature before the electric post-heater. Comparing
it with final supply temperature helps you understand post-heating. Select the
correct sensor: binding both to the final supply sensor hides that difference.

The heater symbol shows its selected sensor's state: heating, off or unknown.
It is a status display and a shortcut to history, not an on/off switch.

The **fan percentage** in the header is the fan request, not measured airflow.
Animation indicates direction; its speed is not an airflow measurement.

## Understand the core

| State | What the card is showing |
|---|---|
| Heat recovery | Heat transfers from extract air toward incoming supply air. |
| Bypass | The supply path runs around the core. The actual bypass degree is not measured by the card. |
| Cool recovery | The core helps retain indoor coolness when outdoor air is warmer. |
| Defrost | Warm extract air helps thaw the core; the frosted outline and drops are illustrative. |
| Stopped | The configured fan reports off; moving airflow stops. |
| Unknown | The necessary operating-state data is unavailable or not recognized. |

During defrost, supply air may take the bypass route or the supply fan may stop.
With `defrost_mode: auto`, configure **Supply fan RPM** and **Extract fan RPM** so
the card can distinguish these cases. Without enough information, supply movement
is marked as unconfirmed. Choose an explicit defrost display mode only when it
matches your unit; this option does not change the unit's actual defrost settings.

### Efficiency

The central percentage appears during heat recovery. An explicitly selected
efficiency sensor is shown with the kind and scale you configure. Use **Percent**
for ordinary percentage readings: 1 means 1%. Choose **Ratio** only for a sensor
documented to report a 0–1 fraction: 1 then means 100%.

Without an efficiency sensor, the card can estimate **supply temperature efficiency**
from outdoor, extract and after-core temperatures. It is labelled as an estimate and
is shown only when the required readings and temperature difference are suitable.
It is not a measurement of recovered heat output or whole-house energy efficiency.

Press the number to open the configured sensor's HA history. A calculated estimate
has no sensor of its own, so it has no direct entity-history action.

## Select and configure profiles

Home, Away and Boost are the default buttons. Choose their order in **Unit and
profiles → Visible profiles**. To include Fireplace, for example:

```yaml
modes: [Home, Away, Boost, Fireplace]
```

The card shows only profiles supported by the selected fan. Selecting a profile is
a real command to that fan. The highlighted button and header show its reported
state. A failed command is shown in the controls dialog.

Boost and Fireplace use the unit's saved duration by default. Select the remaining
profile-duration sensor to see its countdown in the header and controls dialog.
Timing continues on the device when you close the browser. Selecting the same
profile again does not intentionally restart its timer. Custom durations and an
explicit restart need the separately configured profile script.

Press the **profile badge** to open the **Controls** tab. It includes core/heater
details, filter information if configured, start/stop through the fan integration
and a shortcut to the fan's own HA details. It does not cut power through a smart plug.

## Open details and history

- Press a temperature to open its entity in HA.
- Press the heater symbol to open the heater sensor's on/off history.
- Press a measured efficiency number to open its sensor's percentage history.
- Press the energy row for the card's **Energy** and **Insights** tabs.
- In compact layouts, open the same tabs through the profile badge.

Home Assistant provides the entity dialog and its charts. Available history depends
on Recorder and the entity type. An unavailable current reading does not erase old
history; the heater shortcut remains available in that case.

Controls are keyboard accessible: Tab to a button, then Enter or Space. In the
details dialog, arrow keys move between tabs and Escape closes it. The card respects
your system's reduced-motion preference.

## Energy and suggestions

Choose a **W/kW power sensor** and a **cumulative Wh/kWh/MWh energy sensor** in
the editor. Use a whole-unit electricity meter if you want to relate electricity
to the ventilation unit's operation. The meter does not have to be a Shelly.

The power sensor supplies the current watts. The cumulative sensor supplies energy
totals; a daily-reset total is not a substitute for a continuously accumulating
counter. If you only have power, use an HA Integral helper to produce cumulative
energy. Select a meter that reports at least every 15 minutes and retain enough
Recorder history for the comparison period.

The Energy tab brings together daily/24-hour totals, seven-day consumption,
temperature and power history, and operating-state bands. Gaps, resets and unit
changes are excluded rather than silently turned into valid consumption. Complete
totals and comparisons need sufficient data coverage.

In **Suggestions**, select your heating system and optionally your own daily budget.
The card can highlight excess consumption, sustained heater activity outside defrost,
long defrost events or missing measurement. It compares similar conditions where
possible and tells you when evidence is insufficient.

There is no default daily energy budget, no universal minimum supply target and no
automatic setting change. Homes with an efficient main heating system can use their
own lower supply targets when comparing measured consumption. An optional comfort
floor is your preference, not a recommendation imposed by the card.

Electricity recorded during defrost is **the unit's total electricity during those
periods**. It is not all additional electricity caused by defrost. A drop in Vallox
electricity also does not by itself prove whole-home energy savings. See
[measurement and comparison details](ARCHITECTURE.md#energy-and-evidence-limitations).

## Fit the card to your dashboard

For Sections, start with 12 columns and 6 rows. Four rows select a compact view;
you can also enable **Appearance → Compact view**. The compact view keeps the main
readings and profile buttons while moving longer explanations and energy into
details. Masonry is supported too.

The card follows HA theme colours. English/Finnish and °C/°F normally follow HA;
override them in the editor if desired. Temperature colours, visibility, labels and
relative number size can also be adjusted. Large custom fonts may need more space.

## Seasonal control

The optional companion changes the winter bypass lock, not the momentary core
position. Summer mode can still involve heat exchange when retaining indoor coolness.
After installing the helpers and blueprint, bind their entities in **Optional
seasonal control**. The card then shows the mode, status, outdoor mean and lock state.

This companion is experimental and starts Off. Auto needs valid outdoor history;
it uses hysteresis and waiting periods to avoid rapid changes. The sample thresholds
are project defaults, not universal Vallox recommendations. See
[setup, validation and rollback](MIGRATION.md#optional-companions--experimental).
