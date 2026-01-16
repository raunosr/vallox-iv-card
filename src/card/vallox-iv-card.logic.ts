// TODO (Milestone 1): Implement derived values & domain logic

import type { HomeAssistant, ValloxIvCardConfig, ValloxIvCardState } from '../shared/types';
import { getNumericState, getState, getUnit } from '../shared/hass';

/**
 * Derives the complete card state from Home Assistant and config
 */
export function deriveCardState(
  hass: HomeAssistant | undefined,
  config: ValloxIvCardConfig
): ValloxIvCardState {
  // Get temperature values
  const outdoorTemp = getNumericState(hass, config.outdoor_air_temp);
  const supplyTemp = getNumericState(hass, config.supply_air_temp);
  const supplyCellTemp = getNumericState(hass, config.supply_cell_temp);
  const extractTemp = getNumericState(hass, config.extract_air_temp);
  const exhaustTemp = getNumericState(hass, config.exhaust_air_temp);

  // Get efficiency and normalize it
  let efficiency = getNumericState(hass, config.efficiency);
  if (efficiency !== null) {
    // Normalize: if between 0-1, convert to percentage
    if (efficiency >= 0 && efficiency <= 1) {
      efficiency = efficiency * 100;
    }
    // Clamp to 0-100
    efficiency = Math.max(0, Math.min(100, efficiency));
  }

  // Get other metrics
  const cellState = getState(hass, config.cell_state);
  const profile = getState(hass, config.profile);
  const fanSpeed = getNumericState(hass, config.fan_speed);
  const co2 = getNumericState(hass, config.co2);
  const humidity = getNumericState(hass, config.humidity);

  // Post-heater: check if it's on/active
  const postHeaterState = getState(hass, config.post_heater);
  const postHeaterActive = postHeaterState !== null && 
    ['on', 'true', '1', 'active', 'heating'].includes(postHeaterState.toLowerCase());

  // Determine temperature unit from any available temp sensor
  const tempUnit = 
    getUnit(hass, config.outdoor_air_temp) ||
    getUnit(hass, config.supply_air_temp) ||
    getUnit(hass, config.extract_air_temp) ||
    getUnit(hass, config.exhaust_air_temp) ||
    '°C';

  return {
    outdoorTemp,
    supplyTemp,
    supplyCellTemp,
    extractTemp,
    exhaustTemp,
    efficiency,
    cellState,
    profile,
    fanSpeed,
    co2,
    humidity,
    postHeaterActive,
    tempUnit,
  };
}

/**
 * Calculates theoretical efficiency from temperatures
 * Formula: (supply - outdoor) / (extract - outdoor) * 100
 */
export function calculateTheoreticalEfficiency(state: ValloxIvCardState): number | null {
  const { outdoorTemp, supplyTemp, extractTemp } = state;

  if (outdoorTemp === null || supplyTemp === null || extractTemp === null) {
    return null;
  }

  const denominator = extractTemp - outdoorTemp;
  if (Math.abs(denominator) < 0.1) {
    // Avoid division by zero or near-zero
    return null;
  }

  const efficiency = ((supplyTemp - outdoorTemp) / denominator) * 100;
  
  // Clamp to reasonable range
  return Math.max(0, Math.min(100, efficiency));
}

/**
 * Determines if heating mode is active (outdoor < extract)
 */
export function isHeatingMode(state: ValloxIvCardState): boolean {
  const { outdoorTemp, extractTemp } = state;
  
  if (outdoorTemp === null || extractTemp === null) {
    return true; // Default to heating mode assumption
  }

  return outdoorTemp < extractTemp;
}

/**
 * Determines if bypass should be recommended
 */
export function shouldBypass(state: ValloxIvCardState): boolean {
  const { outdoorTemp, extractTemp } = state;
  
  if (outdoorTemp === null || extractTemp === null) {
    return false;
  }

  // Bypass when outdoor temp is close to or warmer than extract
  // (no heat recovery benefit)
  return outdoorTemp >= extractTemp - 2;
}
