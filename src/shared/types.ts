// TODO (Milestone 1): Define configuration types

import type { HomeAssistant } from 'custom-card-helpers';

/**
 * Configuration interface for the Vallox IV Card
 */
export interface ValloxIvCardConfig {
  type: string;
  
  // Temperature entities (required)
  outdoor_air_temp?: string;      // Outside air coming in
  supply_air_temp?: string;       // Air going to rooms
  extract_air_temp?: string;      // Air from rooms
  exhaust_air_temp?: string;      // Air going outside
  
  // Heat recovery
  efficiency?: string;            // Heat recovery efficiency sensor
  cell_state?: string;            // Heat cell state entity
  supply_cell_temp?: string;      // Supply air after heat exchanger (before post-heater)
  
  // Optional metrics
  profile?: string;               // Current ventilation profile
  fan_speed?: string;             // Fan speed sensor
  co2?: string;                   // CO₂ sensor
  humidity?: string;              // Humidity sensor
  post_heater?: string;           // Post-heater state
  
  // Display options
  title?: string;
  show_efficiency?: boolean;
  show_profile?: boolean;
  show_fan_speed?: boolean;
  show_cell_state?: boolean;
  show_co2?: boolean;
  show_humidity?: boolean;
  show_post_heater?: boolean;
  show_supply_cell_temp?: boolean;

  // Labels (localized display names)
  label_cell_state_title?: string;
  label_extract_air?: string;
  label_supply_air?: string;
  label_outdoor_air?: string;
  label_exhaust_air?: string;
  label_efficiency?: string;
  label_profile?: string;
  label_fan_speed?: string;
  label_humidity?: string;
  label_co2?: string;

  // Visual overrides (deprecated - use temperature color keyframes instead)
  value_color?: string;

  // Temperature color keyframes (for linear interpolation)
  // Accepts hex string (#RRGGBB) or RGB array [r, g, b] from HA color picker
  temp_color_cold?: string | [number, number, number];       // Color at ≤-10°C (default: #0000FF Deep Blue)
  temp_color_freeze?: string | [number, number, number];     // Color at 0°C (default: #00FFFF Cyan)
  temp_color_neutral?: string | [number, number, number];    // Color at 22°C (default: #8892E3 Theme Default)
  temp_color_warm?: string | [number, number, number];       // Color at 25°C (default: #FFA500 Orange)
  temp_color_hot?: string | [number, number, number];        // Color at ≥25°C (default: #FF4500 Soft Red)

  // Alert & dynamic color settings
  enable_temp_colors?: boolean;   // Enable dynamic temperature color scaling
  co2_limit?: number;             // CO2 threshold in ppm that triggers alert
  co2_alert_color?: string;       // Color for CO2 alert state
  enable_co2_blink?: boolean;     // Enable pulsating animation for CO2 alert

  // Typography settings
  value_font_size?: number;       // Base font size for values (SVG units, default: 48)
  unit_opacity?: number;          // Opacity for units (0-1, default: 0.6)
  font_weight?: number;           // Font weight for values (500 or 600, default: 500)
}

/**
 * Internal card state derived from Home Assistant
 */
export interface ValloxIvCardState {
  outdoorTemp: number | null;
  supplyTemp: number | null;
  supplyCellTemp: number | null;
  extractTemp: number | null;
  exhaustTemp: number | null;
  efficiency: number | null;
  cellState: string | null;
  profile: string | null;
  fanSpeed: number | null;
  co2: number | null;
  humidity: number | null;
  postHeaterActive: boolean;
  tempUnit: string;
}

/**
 * Grid options for Home Assistant Sections view
 */
export interface GridOptions {
  columns?: number;
  rows?: number;
  min_columns?: number;
  min_rows?: number;
}

/**
 * Extended Window interface for custom card registration
 */
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

export type { HomeAssistant };
