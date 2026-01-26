// TODO (Milestone 1): Implement value formatting helpers

/**
 * Value/unit pair for separate rendering with different styles
 */
export interface FormattedValue {
  value: string;
  unit: string;
  combined: string;
}

/**
 * Parses a formatted value string to separate the numeric part from the unit
 * Handles formats like "21.5°C", "85%", "450 ppm"
 */
export function parseValueAndUnit(formatted: string): { value: string; unit: string } {
  if (!formatted || formatted === '—') {
    return { value: formatted, unit: '' };
  }
  
  // Match number (with optional decimal) followed by unit
  const match = formatted.match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);
  if (match) {
    return { value: match[1], unit: match[2] };
  }
  
  return { value: formatted, unit: '' };
}

/**
 * Formats a temperature value with unit
 * @returns Formatted string like "21.5°C" or "—" if null
 */
export function formatTemperature(
  value: number | null,
  unit: string = '°C',
  decimals: number = 1
): string {
  if (value === null) {
    return '—';
  }
  return `${value.toFixed(decimals)}${unit}`;
}

/**
 * Formats a temperature value returning value and unit separately
 */
export function formatTemperatureParts(
  value: number | null,
  unit: string = '°C',
  decimals: number = 1
): FormattedValue {
  if (value === null) {
    return { value: '—', unit: '', combined: '—' };
  }
  const numStr = value.toFixed(decimals);
  return { value: numStr, unit, combined: `${numStr}${unit}` };
}

/**
 * Formats a percentage value
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 0)
 * @param isAlreadyNormalized - If true, value is already 0-100; if false, value is 0-1 and needs normalization (default: true)
 * @returns Formatted string like "85%" or "—" if null
 */
export function formatPercentage(
  value: number | null,
  decimals: number = 0,
  isAlreadyNormalized: boolean = true
): string {
  if (value === null) {
    return '—';
  }
  // Only normalize if explicitly told value is 0-1 range
  const normalized = isAlreadyNormalized ? value : value * 100;
  return `${normalized.toFixed(decimals)}%`;
}

/**
 * Formats a percentage value returning value and unit separately
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 0)
 * @param isAlreadyNormalized - If true, value is already 0-100; if false, value is 0-1 and needs normalization (default: true)
 */
export function formatPercentageParts(
  value: number | null,
  decimals: number = 0,
  isAlreadyNormalized: boolean = true
): FormattedValue {
  if (value === null) {
    return { value: '—', unit: '', combined: '—' };
  }
  // Only normalize if explicitly told value is 0-1 range
  const normalized = isAlreadyNormalized ? value : value * 100;
  const numStr = normalized.toFixed(decimals);
  return { value: numStr, unit: '%', combined: `${numStr}%` };
}

/**
 * Formats CO₂ value with unit
 * @returns Formatted string like "450 ppm" or "—" if null
 */
export function formatCO2(value: number | null): string {
  if (value === null) {
    return '—';
  }
  return `${Math.round(value)} ppm`;
}

/**
 * Formats CO₂ value returning value and unit separately
 */
export function formatCO2Parts(value: number | null): FormattedValue {
  if (value === null) {
    return { value: '—', unit: '', combined: '—' };
  }
  const numStr = String(Math.round(value));
  return { value: numStr, unit: ' ppm', combined: `${numStr} ppm` };
}

/**
 * Formats humidity value
 * @returns Formatted string like "45%" or "—" if null
 */
export function formatHumidity(value: number | null): string {
  if (value === null) {
    return '—';
  }
  return `${Math.round(value)}%`;
}

/**
 * Formats humidity value returning value and unit separately
 */
export function formatHumidityParts(value: number | null): FormattedValue {
  if (value === null) {
    return { value: '—', unit: '', combined: '—' };
  }
  const numStr = String(Math.round(value));
  return { value: numStr, unit: '%', combined: `${numStr}%` };
}

/**
 * Formats a generic numeric value
 * @returns Formatted string or "—" if null
 */
export function formatNumber(
  value: number | null,
  unit: string = '',
  decimals: number = 0
): string {
  if (value === null) {
    return '—';
  }
  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string | null): string {
  if (!str) {
    return '—';
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formats cell state for display
 */
export function formatCellState(state: string | null): string {
  if (!state) {
    return '—';
  }
  
  // Common Vallox cell states
  const stateMap: Record<string, string> = {
    'heat_recovery': 'Heat Recovery',
    'cool_recovery': 'Cool Recovery',
    'bypass': 'Bypass',
    'defrost': 'Defrost',
  };

  return stateMap[state.toLowerCase()] || capitalize(state);
}

/**
 * Formats profile name for display
 */
export function formatProfile(profile: string | null): string {
  if (!profile) {
    return '—';
  }

  // Common Vallox profiles
  const profileMap: Record<string, string> = {
    'home': 'Home',
    'away': 'Away',
    'boost': 'Boost',
    'fireplace': 'Fireplace',
    'extra': 'Extra',
  };

  return profileMap[profile.toLowerCase()] || capitalize(profile);
}

// Default temperature color keyframes
const DEFAULT_TEMP_COLORS = {
  cold: '#0000FF',     // ≤-10°C: Deep Blue
  freeze: '#00FFFF',   // 0°C: Cyan
  neutral: '#8892E3',  // 22°C: Theme Default / Lavender
  warm: '#FFA500',     // 25°C: Orange
  hot: '#FF4500',      // ≥25°C: Soft Red (OrangeRed)
};

// Temperature thresholds in Celsius
const TEMP_THRESHOLDS = {
  cold: -10,    // Below this: solid cold color
  freeze: 0,    // Freeze point
  neutral: 22,  // Comfortable room temp
  warm: 25,     // Getting warm
};

/**
 * Parse hex color to RGB components
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Handle both 3 and 6 character hex
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;
  
  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convert RGB to hex color string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Normalize color input to hex string
 * Accepts hex string (#RRGGBB) or RGB array [r, g, b] from HA color picker
 */
function normalizeColor(color: string | [number, number, number] | undefined): string | undefined {
  if (!color) return undefined;
  if (typeof color === 'string') return color;
  if (Array.isArray(color) && color.length === 3) {
    return rgbToHex(color[0], color[1], color[2]);
  }
  return undefined;
}

/**
 * Linear interpolation between two colors
 * @param color1 Starting color (hex)
 * @param color2 Ending color (hex)
 * @param ratio Progress between colors (0-1)
 */
function interpolateColor(color1: string, color2: string, ratio: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  // Clamp ratio to [0, 1]
  const t = Math.max(0, Math.min(1, ratio));
  
  const r = c1.r + (c2.r - c1.r) * t;
  const g = c1.g + (c2.g - c1.g) * t;
  const b = c1.b + (c2.b - c1.b) * t;
  
  return rgbToHex(r, g, b);
}

// Color value type: hex string or RGB array from HA color picker
type ColorValue = string | [number, number, number];

/**
 * Temperature color options for customization
 * Accepts hex strings (#RRGGBB) or RGB arrays [r, g, b] from Home Assistant color picker
 */
export interface TempColorOptions {
  cold?: ColorValue;      // Color at ≤-10°C
  freeze?: ColorValue;    // Color at 0°C
  neutral?: ColorValue;   // Color at 22°C
  warm?: ColorValue;      // Color at 25°C
  hot?: ColorValue;       // Color at ≥25°C
}

/**
 * Temperature color scaling with smooth linear interpolation
 * Smoothly transitions between keyframe colors based on temperature
 * 
 * Color zones:
 * - ≤-10°C: Solid cold color (Deep Blue)
 * - -10°C to 0°C: Cold → Freeze (Deep Blue → Cyan)
 * - 0°C to 22°C: Freeze → Neutral (Cyan → Theme Default)
 * - 22°C to 25°C: Neutral → Warm (Theme Default → Orange)
 * - ≥25°C: Solid hot color (Soft Red)
 * 
 * @param temp Temperature value
 * @param unit Temperature unit ('°C' or '°F')
 * @param colors Optional custom color keyframes
 * @returns Interpolated color string
 */
export function getTemperatureColor(
  temp: number | null,
  unit: string = '°C',
  colors?: TempColorOptions
): string | undefined {
  if (temp === null) return undefined;
  
  // Convert to Celsius if needed
  const celsius = unit === '°F' ? (temp - 32) * 5 / 9 : temp;
  
  // Resolve colors with defaults (normalize RGB arrays to hex)
  const c = {
    cold: normalizeColor(colors?.cold) || DEFAULT_TEMP_COLORS.cold,
    freeze: normalizeColor(colors?.freeze) || DEFAULT_TEMP_COLORS.freeze,
    neutral: normalizeColor(colors?.neutral) || DEFAULT_TEMP_COLORS.neutral,
    warm: normalizeColor(colors?.warm) || DEFAULT_TEMP_COLORS.warm,
    hot: normalizeColor(colors?.hot) || DEFAULT_TEMP_COLORS.hot,
  };
  
  // Zone 1: Very cold (≤-10°C) - solid cold color
  if (celsius <= TEMP_THRESHOLDS.cold) {
    return c.cold;
  }
  
  // Zone 2: Cold to freeze (-10°C to 0°C) - interpolate cold → freeze
  if (celsius < TEMP_THRESHOLDS.freeze) {
    const ratio = (celsius - TEMP_THRESHOLDS.cold) / (TEMP_THRESHOLDS.freeze - TEMP_THRESHOLDS.cold);
    return interpolateColor(c.cold, c.freeze, ratio);
  }
  
  // Zone 3: Freeze to neutral (0°C to 22°C) - interpolate freeze → neutral
  if (celsius < TEMP_THRESHOLDS.neutral) {
    const ratio = (celsius - TEMP_THRESHOLDS.freeze) / (TEMP_THRESHOLDS.neutral - TEMP_THRESHOLDS.freeze);
    return interpolateColor(c.freeze, c.neutral, ratio);
  }
  
  // Zone 4: Neutral to warm (22°C to 25°C) - interpolate neutral → warm
  if (celsius < TEMP_THRESHOLDS.warm) {
    const ratio = (celsius - TEMP_THRESHOLDS.neutral) / (TEMP_THRESHOLDS.warm - TEMP_THRESHOLDS.neutral);
    return interpolateColor(c.neutral, c.warm, ratio);
  }
  
  // Zone 5: Hot (≥25°C) - interpolate warm → hot (capped at 30°C for smooth transition)
  const hotCap = 30;
  if (celsius >= hotCap) {
    return c.hot;
  }
  
  // Between 25°C and 30°C, interpolate warm → hot
  const ratio = (celsius - TEMP_THRESHOLDS.warm) / (hotCap - TEMP_THRESHOLDS.warm);
  return interpolateColor(c.warm, c.hot, ratio);
}

/**
 * Checks if CO2 value exceeds the threshold
 * @returns Object with alert state and optional color/animation class
 */
export function getCO2AlertState(
  co2: number | null,
  limit: number | undefined,
  alertColor: string | undefined,
  enableBlink: boolean | undefined
): { isAlert: boolean; color?: string; className?: string } {
  if (co2 === null || limit === undefined) {
    return { isAlert: false };
  }
  
  const isAlert = co2 > limit;
  if (!isAlert) {
    return { isAlert: false };
  }
  
  return {
    isAlert: true,
    color: alertColor || '#ff4444',
    className: enableBlink !== false ? 'co2-alert' : 'co2-alert-static',
  };
}
