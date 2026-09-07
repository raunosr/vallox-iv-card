# Installation and migration to 2.0.0

## HACS installation

1. Open Vallox IV Card in HACS. If needed, add `raunosr/vallox-iv-card` as a custom
   repository with type **Dashboard**.
2. Use **⋮ → Update information** to refresh release metadata, then install or update
   to **v2.0.0** from the normal stable channel.
3. If selecting a version manually, use **Redownload → Need a different version? → v2.0.0**.
4. Reload the frontend, including any kiosk/tablet sessions.

This is a stable release; no prerelease switch is needed. Users upgrading from a 2.0
beta can keep their card YAML. Turn off the repository's prerelease switch if you want
only future stable updates. See [version selection](https://hacs.xyz/docs/use/repositories/dashboard/#downloading-a-specific-version-of-a-repository).

The module resource is `/hacsfiles/vallox-iv-card/vallox-iv-card.js`. If an earlier
installation registered a manually copied `/local/vallox-iv-card.js`, HACS updates a
different file. Save the old resource URL and replace its registration with the HACS
resource; do not register both production versions at once.

## Card configuration

Existing YAML keeps `custom:vallox-iv-card`. Temperature/entity bindings, labels,
color ramps and display toggles continue to be read. Add an explicit `fan_entity`
for the new controls. Bind power and cumulative energy sensors only if available.
See [the example](../examples/card-fi.yaml) and use the visual editor for optional fields.

Check that `supply_cell_temp` is the temperature after the core, before post-heating;
it should not point to the final supply-air sensor. For an explicit efficiency sensor,
set `efficiency_kind` to its actual meaning. The default scale is percent: a value of
1 means 1%. Use `efficiency_scale: ratio` only for an explicitly documented 0–1 sensor.

Click the efficiency number or heater symbol to open the configured entity's Home
Assistant more-info dialog and history, just like the temperatures. Keyboard users
can focus either control and press Enter or Space. An efficiency calculated by the
card from temperatures has no separate entity history. Heater history remains
accessible when its current state is unavailable. History availability and the chart
type depend on the entity and Home Assistant's Recorder configuration.

The default Sections size is 12 columns × 6 rows. Four rows select the compact view.
Remove separately stacked profile buttons if you want to use the controls inside the
card. Font overrides adapt to available space; old absolute label positions do not
apply to the redesigned layout. Test your layout on a separate view first.

## Manual installation

The release asset is `vallox-iv-card.js`; a local build produces
`dist/vallox-iv-card.js`. Copy it into HA's `www` directory and register a JavaScript
module resource if HACS is not used. Reload after replacing the resource.

An old isolated preview uses `custom:vallox-iv-card-v2-preview` and does not update
with HACS. Change its type to `custom:vallox-iv-card`, verify the selected entities,
and remove its old resource registration once no cards reference it. Developer
preview builds are described in the [development guide](DEVELOPMENT.md#test-beside-an-installed-card).

## Optional companions — experimental

Installing through HACS installs the card only. It does not install helpers,
blueprints or automations, and does not change ventilation settings.

The [profile script](../blueprints/script/vallox_profile.yaml) and
[seasonal automation](../blueprints/automation/vallox_season.yaml) can be imported
separately from their versioned GitHub URLs. They still need real-device validation.
The [helper package example](../examples/packages/vallox_companion.yaml) requires
replacing source entities and validation in the intended HA installation.

The package uses a sampling sensor with timestamp attributes, which requires YAML.
Ordinary statistics and Integral helpers can be created through HA's Helpers UI.
The seasonal mode begins with **Off**; persisted mode and memory are restored after
restart. Wait for full 24-hour sampling coverage before opting into Auto.

Before replacing existing timed controls:

1. Save the affected dashboard, scripts and automation configurations.
2. Instantiate the profile blueprint with your fan target. Custom native timing is
   guarded against installations with multiple Vallox fans, because the timed Vallox
   action does not support a device target.
3. Verify profile activation, remaining time, expiry, repeated requests, manual
   cancellation and restart behavior using the intended device.
4. Route the card and any sauna/CO₂ producers to the tested adapter while preserving
   their triggers. An ordinary repeated request must not set `restart: true`.
5. Disable the previous return-timer chain only after testing. Keep its configuration
   for rollback, and remove unused helpers only after checking their consumers.

No supply target, comfort minimum or frost-protection parameter is set by the card.
The seasonal companion changes only the winter bypass lock when enabled.

## Energy setup

Bind a W/kW power sensor and a cumulative Wh/kWh/MWh energy sensor. If only power is
available, create an **Integral** helper, choose hours and the k prefix for a W source,
and confirm the result actually reports kWh. Use a meter reporting at least every
15 minutes; the analysis excludes larger gaps, unavailable periods and counter resets.
Recorder retention must cover the comparison period. See [measurement limits](ARCHITECTURE.md).

## Rollback

In HACS, redownload **v1.0.0** and restore the saved v1 dashboard configuration, then
reload all frontend sessions. Returning to the stable channel also requires turning
off the repository's prerelease switch if it was enabled. A manually managed resource
can instead be restored to its saved file/URL.

If companions were installed, select seasonal **Off** and restore the saved producer
actions and timer automation states as a coherent set. Do not run two return-timer
systems together. Deleting only an isolated preview dashboard/resource does not affect
the standard card installation.
