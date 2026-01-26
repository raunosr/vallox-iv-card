// TODO (Milestone 1): Implement config validation

import type { ValloxIvCardConfig } from './types';

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<ValloxIvCardConfig> = {
  show_efficiency: true,
  show_profile: true,
  show_fan_speed: true,
  show_cell_state: true,
  show_co2: true,
  show_humidity: true,
  show_post_heater: true,
  // Alert & dynamic color defaults
  enable_temp_colors: true,
  co2_limit: 1000,
  co2_alert_color: '#ff4444',
  enable_co2_blink: true,
  // Typography defaults
  value_font_size: 48,
  unit_opacity: 0.6,
  font_weight: 500,
};

/**
 * Validates and applies defaults to card configuration
 * @throws Error if configuration is invalid
 */
export function validateConfig(config: unknown): ValloxIvCardConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid configuration: config must be an object');
  }

  const cfg = config as Record<string, unknown>;

  if (!cfg.type) {
    throw new Error('Invalid configuration: type is required');
  }

  // Apply defaults
  const validatedConfig: ValloxIvCardConfig = {
    ...DEFAULT_CONFIG,
    ...cfg,
    type: cfg.type as string,
  };

  // Validate entity IDs format if provided
  const entityFields = [
    'outdoor_air_temp',
    'supply_air_temp',
    'supply_cell_temp',
    'extract_air_temp',
    'exhaust_air_temp',
    'efficiency',
    'cell_state',
    'profile',
    'fan_speed',
    'co2',
    'humidity',
    'post_heater',
  ] as const;

  for (const field of entityFields) {
    const value = cfg[field];
    if (value !== undefined && typeof value !== 'string') {
      throw new Error(`Invalid configuration: ${field} must be a string`);
    }
    if (typeof value === 'string' && value.length > 0 && !value.includes('.')) {
      throw new Error(`Invalid configuration: ${field} must be a valid entity ID (e.g., sensor.xxx)`);
    }
  }

  if (cfg.value_color !== undefined && typeof cfg.value_color !== 'string') {
    throw new Error('Invalid configuration: value_color must be a string');
  }

  // Validate alert config options
  if (cfg.co2_limit !== undefined && (typeof cfg.co2_limit !== 'number' || cfg.co2_limit < 0)) {
    throw new Error('Invalid configuration: co2_limit must be a positive number');
  }
  if (cfg.co2_alert_color !== undefined && typeof cfg.co2_alert_color !== 'string') {
    throw new Error('Invalid configuration: co2_alert_color must be a string');
  }
  if (cfg.enable_co2_blink !== undefined && typeof cfg.enable_co2_blink !== 'boolean') {
    throw new Error('Invalid configuration: enable_co2_blink must be a boolean');
  }
  if (cfg.enable_temp_colors !== undefined && typeof cfg.enable_temp_colors !== 'boolean') {
    throw new Error('Invalid configuration: enable_temp_colors must be a boolean');
  }

  // Validate typography config options
  if (cfg.value_font_size !== undefined && (typeof cfg.value_font_size !== 'number' || cfg.value_font_size < 10 || cfg.value_font_size > 100)) {
    throw new Error('Invalid configuration: value_font_size must be a number between 10 and 100');
  }
  if (cfg.unit_opacity !== undefined && (typeof cfg.unit_opacity !== 'number' || cfg.unit_opacity < 0 || cfg.unit_opacity > 1)) {
    throw new Error('Invalid configuration: unit_opacity must be a number between 0 and 1');
  }
  if (cfg.font_weight !== undefined && (typeof cfg.font_weight !== 'number' || ![400, 500, 600, 700].includes(cfg.font_weight))) {
    throw new Error('Invalid configuration: font_weight must be 400, 500, 600, or 700');
  }

  return validatedConfig;
}

/**
 * Checks if at least one temperature entity is configured
 */
export function hasTemperatureEntities(config: ValloxIvCardConfig): boolean {
  return !!(
    config.outdoor_air_temp ||
    config.supply_air_temp ||
    config.extract_air_temp ||
    config.exhaust_air_temp
  );
}
