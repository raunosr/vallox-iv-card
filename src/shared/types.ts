
/** The public Home Assistant frontend surface used by the card. */
export interface HomeAssistant {
  states: Record<string, {
    entity_id: string;
    state: string;
    attributes: Record<string, unknown> & {
      unit_of_measurement?: string; friendly_name?: string; percentage?: number;
      preset_mode?: string; preset_modes?: string[]; options?: string[];
    };
    last_updated?: string;
    last_changed?: string;
    context?: { id: string; parent_id: string | null; user_id: string | null };
  }>;
  language?: string;
  config?: { time_zone?: string; unit_system?: { temperature?: string } };
  connection?: object;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
}

/**
 * Configuration interface for the Vallox IV Card
 */
export interface ValloxIvCardConfig {
  type: string;
  config_version?: 2;
  language?: 'fi' | 'en';
  fan_entity?: string;
  modes?: string[];
  profile_action_script?: string;
  profile_duration?: string;
  boost_duration?: number;
  fireplace_duration?: number;
  filter_remaining?: string;
  supply_fan_speed?: string;
  extract_fan_speed?: string;
  defrost_mode?: 'auto' | 'bypass' | 'supply_stop';
  compact?: boolean;
  temperature_unit?: '°C' | '°F';
  efficiency_kind?: 'supply' | 'extract' | 'custom';
  efficiency_scale?: 'percent' | 'ratio';
  energy?: { power_entity?: string; energy_entity?: string };
  insights?: {
    enabled?: boolean;
    heating_system?: 'unknown' | 'heat_pump' | 'district_heating' | 'other_efficient' | 'electric';
    daily_budget_kwh?: number;
    comfort_floor?: number;
    excess_ratio?: number;
    defrost_minutes?: number;
  };
  seasonal?: { mode_entity?: string; status_entity?: string; mean_entity?: string; bypass_lock_entity?: string };
  
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
  font_weight?: number;           // Font weight for values (400, 500, 600 or 700; default: 600)
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
  postHeaterActive: boolean | null;
  tempUnit: string;
  operation: Operation;
  running: boolean | null;
  supportedModes: string[];
  availableModes: string[];
  duration: number | null;
  efficiencyEstimated: boolean;
  efficiencyKind: 'supply' | 'extract' | 'custom';
  power: number | null;
  energy: number | null;
  issues: string[];
  supplyFlow: boolean | null;
  extractFlow: boolean | null;
  defrostMethod: 'unknown' | 'bypass' | 'supply_stop';
}

export type Operation = 'heat_recovery' | 'bypass' | 'cool_recovery' | 'defrost' | 'stopped' | 'unknown';
export type Language = 'fi' | 'en';
export interface Sample { time: number; state: string; unit?: string; attributes?: Record<string, unknown> }
export type History = Record<string, Sample[]>;
export interface Hour {
  start: number;
  kwh: number | null;
  coverage: number;
  outdoor: number | null;
  supply: number | null;
  cell: number | null;
  power: number | null;
  profile: string | null;
  fan: number | null;
  operation: Operation;
  defrostMinutes: number;
  heaterMinutes: number;
  heaterActiveMinutes: number | null;
  normalMinutes: number;
  contextCoverage: number;
  operationCoverage: number;
}
export interface EnergyAnalysis {
  today: number | null;
  last24h: number | null;
  todayCoverage: number;
  hours: Hour[];
  daily: { date: string; kwh: number | null; coverage: number }[];
  defrostKwh: number | null;
  defrostMinutes: number;
  longDefrosts: number;
  defrostIncreaseRatio: number | null;
  heaterShare: number | null;
  elevated: boolean;
  baselineReady: boolean;
  historyAvailable: boolean;
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
