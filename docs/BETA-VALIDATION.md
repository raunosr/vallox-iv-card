# Beta validation — v2.0.0-beta.4

## Automated checks

- TypeScript and ESLint pass; the production bundle is built from the same source.
- 35 Vitest tests cover readings, command targets, energy integrity and suggestions.
- 50 Playwright tests cover light/dark themes, 320/390/480/768 px widths,
  248/376/504 px heights, masonry, keyboard controls and reduced motion.
- Beta 3 also checks a blue-grey HA theme, actual selected-button contrast, enlarged
  arrowheads and a readable core at 464×376 with the unchanged energy row.
- Secondary readings are checked with wider fonts in Finnish and English, keeping
  measured values and heater state visible within their own air-stream columns.
- Core and heater bounds remain fixed across seven states at 320×248, 390×376,
  420×440 and 768×504. Airflow directions and separated crossings are covered.
- Efficiency and heater history controls dispatch the correct HA entity event with
  pointer, Enter and Space, with no ventilation command. Finnish/English labels,
  visible focus, unavailable readings and a calculated efficiency are covered.
  Both touch areas are at least 44×44 px, aligned with their symbols and separate
  across all twelve tested width/height combinations.
- 13 Python tests execute the companion YAML templates/actions against a deterministic
  HA stub, including missing data, repeated requests and persistent seasonal memory.
- Dependency audit reported no known vulnerabilities during beta preparation.

## What has been checked in Home Assistant

The first beta's isolated dashboard was checked with a real Vallox installation. Temperatures,
fan request, CO₂, humidity, core state and heater status load correctly. The visual
editor and Recorder history have also been checked. Sections cards at 464×376 and
464×248 remain within their assigned space, and an unavailable meter displays missing
measurement rather than zero. The production card and the isolated preview have
separate element names so they can be compared.

Beta 3's visual changes were also confirmed in the real development dashboard after
correcting its resource registration. Other installed dashboard themes still need
user testing.

Bypass, defrost, supply-stop, missing readings and winter energy situations are also
covered by the local simulation. The ice effect is illustrative, not measured ice
quantity or defrost progress.

## Beta limitations

The optional profile and seasonal companions have **not completed real-device field
validation**. The YAML tests do not emulate Home Assistant's scheduler or Vallox firmware.
Verify native timer expiry, repeated requests, manual profile changes and restart
behavior on the intended installation before retiring existing controls. Seasonal
Auto needs sufficient sampling history and is initially Off.

Energy comparisons still need testing across working meters, reporting intervals and
actual winter defrost histories. The card deliberately withholds conclusions when
coverage is insufficient. A ventilation meter alone does not establish whole-home
energy savings.

These are reasons for an opt-in prerelease, not a stable release. The card can be used
without either companion, and suggestions never change device settings.
