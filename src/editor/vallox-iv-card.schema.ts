// Config form schema for built-in visual editor

import type { ValloxIvCardConfig } from '../shared/types';

// Labels for form fields
const LABELS: Record<string, string> = {
  title: 'Card Title',
  outdoor_air_temp: 'Outdoor Air Temperature',
  supply_air_temp: 'Supply Air Temperature', 
  extract_air_temp: 'Extract Air Temperature',
  exhaust_air_temp: 'Exhaust Air Temperature',
  efficiency: 'Heat Recovery Efficiency',
  cell_state: 'Cell State',
  profile: 'Ventilation Profile',
  co2: 'CO₂ Sensor',
  post_heater: 'Post-Heater',
  humidity: 'Humidity Sensor',
  show_efficiency: 'Show Efficiency',
  show_profile: 'Show Profile',
  show_co2: 'Show CO₂',
  show_cell_state: 'Show Cell State',
  show_post_heater: 'Show Post-Heater',
  compact: 'Compact Mode',
  enable_temp_colors: 'Dynamic Temperature Colors',
  temp_color_cold: 'Cold Color (≤-10°C)',
  temp_color_freeze: 'Freeze Color (0°C)',
  temp_color_neutral: 'Neutral Color (22°C)',
  temp_color_warm: 'Warm Color (25°C)',
  temp_color_hot: 'Hot Color (≥25°C)',
};

/**
 * Schema definition for Home Assistant's built-in visual editor
 * Uses ha-form selector-based configuration
 */
export function getConfigFormSchema() {
  return {
    schema: [
      // Card title
      { name: 'title', selector: { text: {} } },

      // Temperature sensors
      { name: 'outdoor_air_temp', selector: { entity: { domain: 'sensor' } } },
      { name: 'supply_air_temp', selector: { entity: { domain: 'sensor' } } },
      { name: 'extract_air_temp', selector: { entity: { domain: 'sensor' } } },
      { name: 'exhaust_air_temp', selector: { entity: { domain: 'sensor' } } },

      // Heat recovery
      { name: 'efficiency', selector: { entity: { domain: 'sensor' } } },
      { name: 'cell_state', selector: { entity: { domain: 'sensor' } } },

      // Additional sensors
      { name: 'profile', selector: { entity: { domain: 'sensor' } } },
      { name: 'co2', selector: { entity: { domain: 'sensor' } } },
      { name: 'post_heater', selector: { entity: {} } },
      { name: 'humidity', selector: { entity: { domain: 'sensor' } } },

      // Display options in grid
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'show_efficiency', default: true, selector: { boolean: {} } },
          { name: 'show_profile', default: true, selector: { boolean: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'show_co2', default: true, selector: { boolean: {} } },
          { name: 'show_cell_state', default: true, selector: { boolean: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'show_post_heater', default: true, selector: { boolean: {} } },
          { name: 'compact', default: false, selector: { boolean: {} } },
        ],
      },

      // Temperature color settings
      { name: 'enable_temp_colors', default: true, selector: { boolean: {} } },
      
      // Temperature color keyframes in grid layout
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'temp_color_cold', default: '#0000FF', selector: { color_rgb: {} } },
          { name: 'temp_color_freeze', default: '#00FFFF', selector: { color_rgb: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'temp_color_neutral', default: '#8892E3', selector: { color_rgb: {} } },
          { name: 'temp_color_warm', default: '#FFA500', selector: { color_rgb: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'temp_color_hot', default: '#FF4500', selector: { color_rgb: {} } },
        ],
      },
    ],
    computeLabel: (schema: { name: string }) => {
      return LABELS[schema.name] || schema.name;
    },
  };
}

/**
 * Stub config for card picker - shown when adding new card
 */
export function getStubConfig(): Partial<ValloxIvCardConfig> {
  return {
    type: 'custom:vallox-iv-card',
    title: 'Vallox Ventilation',
    show_efficiency: true,
    show_profile: true,
    show_fan_speed: true,
    show_cell_state: true,
    show_co2: true,
    show_post_heater: true,
  };
}
