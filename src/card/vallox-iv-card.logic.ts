import type { HomeAssistant, ValloxIvCardConfig, ValloxIvCardState, Operation } from '../shared/types';
import { getNumericState, getState, getUnit } from '../shared/hass';

export function operationOf(raw: string | null): Operation {
  const state = raw?.toLowerCase().replace(/[ _-]/g, '');
  if (state === 'heatrecovery') return 'heat_recovery';
  if (state === 'coolrecovery') return 'cool_recovery';
  if (state === 'bypass') return 'bypass';
  if (state === 'defrost' || state === 'defrosting') return 'defrost';
  return 'unknown';
}

export function temperature(value: number | null, unit: string, to = '°C'): number | null {
  if (value === null || !['°C', '°F', 'C', 'F', 'K'].includes(unit)) return null;
  const c = unit === 'K' ? value - 273.15 : unit.endsWith('F') ? (value - 32) * 5 / 9 : value;
  return to === '°F' ? c * 9 / 5 + 32 : c;
}

export function energyValue(value: number | null, unit: string): number | null {
  if (value === null || value < 0) return null;
  return unit === 'kWh' ? value : unit === 'Wh' ? value / 1000 : unit === 'MWh' ? value * 1000 : null;
}

export function powerValue(value: number | null, unit: string): number | null {
  if (value === null || value < 0) return null;
  return unit === 'W' ? value : unit === 'kW' ? value * 1000 : null;
}

export function booleanState(raw: string | null): boolean | null {
  if (raw && ['on', 'true', '1', 'active', 'heating'].includes(raw.toLowerCase())) return true;
  if (raw && ['off', 'false', '0', 'inactive', 'idle'].includes(raw.toLowerCase())) return false;
  return null;
}

export function deriveCardState(hass: HomeAssistant | undefined, config: ValloxIvCardConfig): ValloxIvCardState {
  const tempUnit = config.temperature_unit ?? (hass?.config?.unit_system?.temperature === '°F' ? '°F' : '°C');
  const readTemp = (id?: string) => temperature(getNumericState(hass, id), getUnit(hass, id), tempUnit);
  const fan = config.fan_entity ? hass?.states[config.fan_entity] : undefined;
  const supportedModes: string[] = Array.isArray(fan?.attributes.preset_modes) ? fan.attributes.preset_modes.filter((s: unknown) => typeof s === 'string') : [];
  const running = booleanState(getState(hass, config.fan_entity));
  const cellState = getState(hass, config.cell_state);
  const operation = running === false ? 'stopped' : operationOf(cellState);
  const issues: string[] = [];
  if (config.supply_cell_temp && config.supply_cell_temp === config.supply_air_temp) issues.push('same_sensor');
  const efficiencyRaw = getNumericState(hass, config.efficiency);
  const efficiency = efficiencyRaw === null ? null : efficiencyRaw * (config.efficiency_scale === 'ratio' ? 100 : 1);
  if (efficiency !== null && (efficiency < 0 || efficiency > 100)) issues.push('efficiency_range');
  if (config.energy?.power_entity && getUnit(hass, config.energy.power_entity) && !['W', 'kW'].includes(getUnit(hass, config.energy.power_entity))) issues.push('power_unit');
  if (config.energy?.energy_entity && getUnit(hass, config.energy.energy_entity) && !['Wh', 'kWh', 'MWh'].includes(getUnit(hass, config.energy.energy_entity))) issues.push('energy_unit');
  const duration = getNumericState(hass, config.profile_duration);
  const supplyRpm = getNumericState(hass, config.supply_fan_speed);
  const extractRpm = getNumericState(hass, config.extract_fan_speed);
  const defrostMethod = config.defrost_mode === 'bypass' || config.defrost_mode === 'supply_stop' ? config.defrost_mode : supplyRpm === 0 && extractRpm !== null && extractRpm > 0 ? 'supply_stop' : supplyRpm !== null && supplyRpm > 0 ? 'bypass' : 'unknown';
  const knownRunning = config.fan_entity ? running : getNumericState(hass, config.fan_speed) === null ? null : getNumericState(hass, config.fan_speed)! > 0;
  const state: ValloxIvCardState = {
    outdoorTemp: readTemp(config.outdoor_air_temp), supplyTemp: readTemp(config.supply_air_temp),
    supplyCellTemp: readTemp(config.supply_cell_temp), extractTemp: readTemp(config.extract_air_temp), exhaustTemp: readTemp(config.exhaust_air_temp),
    efficiency, efficiencyEstimated: false, efficiencyKind: config.efficiency_kind ?? 'custom',
    cellState, operation, running, supportedModes,
    availableModes: (config.modes ?? ['Home', 'Away', 'Boost']).flatMap(m => supportedModes.filter(s => s.toLowerCase() === m.toLowerCase())),
    profile: fan && running !== null ? fan.attributes.preset_mode ?? null : getState(hass, config.profile),
    fanSpeed: getNumericState(hass, config.fan_speed) ?? (typeof fan?.attributes.percentage === 'number' ? fan.attributes.percentage : null),
    co2: getNumericState(hass, config.co2), humidity: getNumericState(hass, config.humidity),
    postHeaterActive: booleanState(getState(hass, config.post_heater)), tempUnit,
    duration: duration !== null && duration >= 0 ? duration : null,
    power: powerValue(getNumericState(hass, config.energy?.power_entity), getUnit(hass, config.energy?.power_entity)),
    energy: energyValue(getNumericState(hass, config.energy?.energy_entity), getUnit(hass, config.energy?.energy_entity)), issues,
    defrostMethod,
    supplyFlow: running === false ? false : operation === 'defrost' ? defrostMethod === 'unknown' ? null : defrostMethod === 'bypass' : supplyRpm === null ? knownRunning : supplyRpm > 0,
    extractFlow: running === false ? false : extractRpm === null ? knownRunning : extractRpm > 0,
  };
  if (!config.efficiency && !issues.includes('same_sensor')) {
    state.efficiency = calculateTheoreticalEfficiency(state);
    state.efficiencyEstimated = state.efficiency !== null;
    state.efficiencyKind = 'supply';
  }
  return state;
}

/** Temperature ratio at the core outlet, never including electric post-heating. */
export function calculateTheoreticalEfficiency(state: ValloxIvCardState): number | null {
  const { outdoorTemp, supplyCellTemp, extractTemp, operation, tempUnit } = state;
  if (operation !== 'heat_recovery' || outdoorTemp === null || supplyCellTemp === null || extractTemp === null) return null;
  const delta = extractTemp - outdoorTemp;
  if (delta < (tempUnit === '°F' ? 5.4 : 3)) return null;
  const ratio = (supplyCellTemp - outdoorTemp) / delta * 100;
  return ratio >= 0 && ratio <= 100 ? ratio : null;
}
