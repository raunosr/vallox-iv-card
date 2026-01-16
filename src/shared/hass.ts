// TODO (Milestone 1): Implement Home Assistant state helpers

import type { HomeAssistant } from './types';

const UNAVAILABLE_STATES = ['unavailable', 'unknown', 'none'];

/**
 * Safely gets the state string for an entity
 * @returns The state string or null if unavailable/missing
 */
export function getState(
  hass: HomeAssistant | undefined,
  entityId: string | undefined
): string | null {
  if (!hass || !entityId) {
    return null;
  }

  const entity = hass.states[entityId];
  if (!entity) {
    return null;
  }

  const state = entity.state;
  if (UNAVAILABLE_STATES.includes(state.toLowerCase())) {
    return null;
  }

  return state;
}

/**
 * Safely gets a numeric state value for an entity
 * @returns The numeric value or null if unavailable/invalid
 */
export function getNumericState(
  hass: HomeAssistant | undefined,
  entityId: string | undefined
): number | null {
  const state = getState(hass, entityId);
  if (state === null) {
    return null;
  }

  const num = parseFloat(state);
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  return num;
}

/**
 * Gets the unit of measurement for an entity
 * @returns The unit string or empty string
 */
export function getUnit(
  hass: HomeAssistant | undefined,
  entityId: string | undefined
): string {
  if (!hass || !entityId) {
    return '';
  }

  const entity = hass.states[entityId];
  if (!entity?.attributes) {
    return '';
  }

  return entity.attributes.unit_of_measurement || '';
}

/**
 * Checks if an entity exists in Home Assistant
 */
export function entityExists(
  hass: HomeAssistant | undefined,
  entityId: string | undefined
): boolean {
  if (!hass || !entityId) {
    return false;
  }
  return entityId in hass.states;
}

/**
 * Checks if an entity is in an unavailable state
 */
export function isUnavailable(
  hass: HomeAssistant | undefined,
  entityId: string | undefined
): boolean {
  if (!hass || !entityId) {
    return true;
  }

  const entity = hass.states[entityId];
  if (!entity) {
    return true;
  }

  return UNAVAILABLE_STATES.includes(entity.state.toLowerCase());
}

/**
 * Gets the friendly name of an entity
 */
export function getFriendlyName(
  hass: HomeAssistant | undefined,
  entityId: string | undefined
): string {
  if (!hass || !entityId) {
    return '';
  }

  const entity = hass.states[entityId];
  return entity?.attributes?.friendly_name || entityId;
}
