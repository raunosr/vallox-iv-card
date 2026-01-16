import { svg, SVGTemplateResult, nothing } from 'lit';
import type { ValloxIvCardState, ValloxIvCardConfig } from '../shared/types';
import {
  formatCellState,
  formatProfile,
  formatTemperature,
  formatPercentage,
  formatCO2,
  formatHumidity,
  getTemperatureColor,
  getCO2AlertState,
  TempColorOptions,
} from '../shared/format';

/**
 * Inputs should be pre-formatted display strings where possible
 */
export type ValloxDashboardTemplateModel = {
  cellState: string;
  profile: string;
  fanSpeed: string;
  efficiency: string;
  extractTemp: string;
  humidity: string;
  co2: string;
  supplyTemp: string;
  supplyCellTemp: string;
  outdoorTemp: string;
  exhaustTemp: string;
  postHeaterActive: boolean | undefined;  // undefined = hidden
};

export type ValloxDashboardEntities = {
  cellState?: string;
  profile?: string;
  fanSpeed?: string;
  efficiency?: string;
  extractTemp?: string;
  humidity?: string;
  co2?: string;
  supplyTemp?: string;
  supplyCellTemp?: string;
  outdoorTemp?: string;
  exhaustTemp?: string;
  postHeater?: string;
};

export type ValloxDashboardLabels = {
  cellStateTitle: string;
  extractAir: string;
  supplyAir: string;
  outdoorAir: string;
  exhaustAir: string;
  efficiency: string;
  profile: string;
  fanSpeed: string;
  humidity: string;
  co2: string;
};

export type ValloxDashboardColors = {
  extractTempColor?: string;
  supplyTempColor?: string;
  supplyCellTempColor?: string;
  outdoorTempColor?: string;
  exhaustTempColor?: string;
  co2Color?: string;
  co2ClassName?: string;
};

type ValloxTypographySettings = {
  valueFontSize: number;
  unitOpacity: number;
  fontWeight: number;
};

const W = 800;
const H = 500;
const CX = 400;
const CY = 250;

/**
 * Prepares all data needed for rendering - used by both SVG and overlay
 */
export function prepareRenderData(
  state: ValloxIvCardState,
  config: ValloxIvCardConfig
): {
  model: ValloxDashboardTemplateModel;
  labels: ValloxDashboardLabels;
  entities: ValloxDashboardEntities;
  dynamicColors: ValloxDashboardColors;
  valueColor?: string;
} {
  const tempUnit = state.tempUnit || '°C';
  const entities: ValloxDashboardEntities = {
    cellState: config.cell_state,
    profile: config.profile,
    fanSpeed: config.fan_speed,
    efficiency: config.efficiency,
    extractTemp: config.extract_air_temp,
    supplyTemp: config.supply_air_temp,
    supplyCellTemp: config.supply_cell_temp,
    outdoorTemp: config.outdoor_air_temp,
    exhaustTemp: config.exhaust_air_temp,
    humidity: config.humidity,
    co2: config.co2,
    postHeater: config.post_heater,
  };
  
  const model: ValloxDashboardTemplateModel = {
    cellState:
      config.show_cell_state === false || !entities.cellState ? '' : formatCellState(state.cellState),
    profile: config.show_profile === false || !entities.profile ? '' : formatProfile(state.profile),
    fanSpeed: config.show_fan_speed === false || !entities.fanSpeed ? '' : formatPercentage(state.fanSpeed),
    efficiency:
      config.show_efficiency === false || !entities.efficiency ? '' : formatPercentage(state.efficiency),
    extractTemp: entities.extractTemp ? formatTemperature(state.extractTemp, tempUnit) : '',
    humidity:
      config.show_humidity === false || !entities.humidity ? '' : formatHumidity(state.humidity),
    co2: config.show_co2 === false || !entities.co2 ? '' : formatCO2(state.co2),
    supplyTemp: entities.supplyTemp ? formatTemperature(state.supplyTemp, tempUnit) : '',
    supplyCellTemp: 
      config.show_supply_cell_temp === false || !entities.supplyCellTemp ? '' : formatTemperature(state.supplyCellTemp, tempUnit),
    outdoorTemp: entities.outdoorTemp ? formatTemperature(state.outdoorTemp, tempUnit) : '',
    exhaustTemp: entities.exhaustTemp ? formatTemperature(state.exhaustTemp, tempUnit) : '',
    postHeaterActive: config.show_post_heater === false || !entities.postHeater ? undefined : state.postHeaterActive,
  };

  const labels = getLabels(config);

  // Calculate dynamic colors for temperatures
  const enableTempColors = config.enable_temp_colors !== false;
  const dynamicColors: ValloxDashboardColors = {};
  
  if (enableTempColors) {
    // Build color options from config
    const colorOptions: TempColorOptions = {
      cold: config.temp_color_cold,
      freeze: config.temp_color_freeze,
      neutral: config.temp_color_neutral,
      warm: config.temp_color_warm,
      hot: config.temp_color_hot,
    };
    dynamicColors.extractTempColor = getTemperatureColor(state.extractTemp, tempUnit, colorOptions);
    dynamicColors.supplyTempColor = getTemperatureColor(state.supplyTemp, tempUnit, colorOptions);
    dynamicColors.supplyCellTempColor = getTemperatureColor(state.supplyCellTemp, tempUnit, colorOptions);
    dynamicColors.outdoorTempColor = getTemperatureColor(state.outdoorTemp, tempUnit, colorOptions);
    dynamicColors.exhaustTempColor = getTemperatureColor(state.exhaustTemp, tempUnit, colorOptions);
  }

  // Calculate CO2 alert state
  const co2Alert = getCO2AlertState(
    state.co2,
    config.co2_limit,
    config.co2_alert_color,
    config.enable_co2_blink
  );
  if (co2Alert.isAlert) {
    dynamicColors.co2Color = co2Alert.color;
    dynamicColors.co2ClassName = co2Alert.className;
  }

  return {
    model,
    labels: {
      ...labels,
      cellStateTitle: config.show_cell_state === false ? '' : labels.cellStateTitle,
      humidity: config.show_humidity === false || !entities.humidity ? '' : labels.humidity,
      co2: config.show_co2 === false || !entities.co2 ? '' : labels.co2,
    },
    entities,
    dynamicColors,
    valueColor: config.value_color,
  };
}

export function getLabels(config: ValloxIvCardConfig): ValloxDashboardLabels {
  return {
    cellStateTitle: config.label_cell_state_title || 'LTO-Cell State',
    extractAir: config.label_extract_air || 'Extract air',
    supplyAir: config.label_supply_air || 'Supply air',
    outdoorAir: config.label_outdoor_air || 'Outdoor air',
    exhaustAir: config.label_exhaust_air || 'Exhaust air',
    efficiency: config.label_efficiency || 'Efficiency',
    profile: config.label_profile || 'Profile',
    fanSpeed: config.label_fan_speed || 'Fan speed',
    humidity: config.label_humidity || 'Humidity',
    co2: config.label_co2 || 'CO₂',
  };
}

/**
 * Renders only the background SVG (no text) - glow, rings, arrows, badge box
 * @param fanSpeed - Optional fan speed (0-100) for airflow animation
 */
export function renderBackgroundSvg(fanSpeed?: number | null): SVGTemplateResult {
  const glowStart = 'var(--vallox-glow-start, #e1f0ff)';
  const ringStroke = 'var(--vallox-ring-stroke, #dcdcdc)';
  const ringStrokeInner = 'var(--vallox-ring-stroke-inner, #e6e6e6)';
  const arrowDark = 'var(--vallox-arrow-dark, #2a7ebf)';
  const arrowLight = 'var(--vallox-arrow-light, #5cb8ff)';
  const badgeStroke = 'var(--vallox-badge-stroke, var(--divider-color, #d1e8ff))';
  const badgeFill = 'var(--vallox-badge-fill, var(--ha-card-background, var(--card-background-color, rgba(255,255,255,0.72))))';

  // Calculate animation duration based on fan speed
  // Higher speed = faster animation (shorter duration)
  // Speed range: 0-100%, Duration range: 4s (fast) to 0 (stopped)
  const isRunning = fanSpeed !== null && fanSpeed !== undefined && fanSpeed > 0;
  const animationDuration = isRunning ? Math.max(0.5, 4 - (fanSpeed / 100) * 3.5) : 0;
  const flowStyle = isRunning 
    ? `--flow-duration: ${animationDuration}s;`
    : '';

  return svg`
    <svg
      viewBox="0 0 ${W} ${H}"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style="${flowStyle}"
      class="${isRunning ? 'airflow-active' : 'airflow-stopped'}"
    >
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${glowStart}" stop-opacity="0.45"/>
          <stop offset="60%" stop-color="${glowStart}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Center glow -->
      <circle cx="${CX}" cy="${CY}" r="200" fill="url(#centerGlow)"/>

      <!-- Rotated square rings -->
      <g transform="translate(${CX}, ${CY}) rotate(45)">
        <rect x="-100" y="-100" width="200" height="200" fill="none" stroke="${ringStroke}" stroke-width="7" rx="2"/>
        <rect x="-82" y="-82" width="164" height="164" fill="none" stroke="${ringStrokeInner}" stroke-width="4" rx="1"/>
      </g>

      <!-- Dark arrow base (extract to exhaust) -->
      <path d="M 310,165 C 360,165 440,335 490,335" fill="none" stroke="${arrowDark}" stroke-width="15" stroke-linecap="round" opacity="0.3"/>
      <!-- Dark arrow animated flow -->
      <path class="airflow-path airflow-extract" d="M 310,165 C 360,165 440,335 490,335" fill="none" stroke="${arrowDark}" stroke-width="15" stroke-linecap="round"/>
      <path d="M 490,325 L 520,335 L 490,345 Z" fill="${arrowDark}" />

      <!-- Light arrow base (outdoor to supply) -->
      <path d="M 490,165 C 440,165 360,335 310,335" fill="none" stroke="${arrowLight}" stroke-width="15" stroke-linecap="round" opacity="0.3"/>
      <!-- Light arrow animated flow -->
      <path class="airflow-path airflow-supply" d="M 490,165 C 440,165 360,335 310,335" fill="none" stroke="${arrowLight}" stroke-width="15" stroke-linecap="round"/>
      <path d="M 310,325 L 280,335 L 310,345 Z" fill="${arrowLight}" />

      <!-- Efficiency badge box -->
      <g transform="translate(${CX}, ${CY})">
        <rect x="-60" y="-28" width="120" height="56" rx="10" fill="${badgeFill}" fill-opacity="0.5" stroke="${badgeStroke}" stroke-width="2"/>
      </g>
    </svg>
  `;
}

/**
 * Renders the complete SVG diagram (legacy - for backwards compatibility)
 */
export function renderDiagram(
  state: ValloxIvCardState,
  config: ValloxIvCardConfig,
  onEntityClick?: (entityId: string) => void
): SVGTemplateResult {
  const labels = getLabels(config);
  const tempUnit = state.tempUnit || '°C';
  const valueColor = config.value_color;
  const entities: ValloxDashboardEntities = {
    cellState: config.cell_state,
    profile: config.profile,
    fanSpeed: config.fan_speed,
    efficiency: config.efficiency,
    extractTemp: config.extract_air_temp,
    supplyTemp: config.supply_air_temp,
    supplyCellTemp: config.supply_cell_temp,
    outdoorTemp: config.outdoor_air_temp,
    exhaustTemp: config.exhaust_air_temp,
    humidity: config.humidity,
    co2: config.co2,
    postHeater: config.post_heater,
  };
  const model: ValloxDashboardTemplateModel = {
    cellState:
      config.show_cell_state === false || !entities.cellState ? '' : formatCellState(state.cellState),
    profile: config.show_profile === false || !entities.profile ? '' : formatProfile(state.profile),
    fanSpeed: config.show_fan_speed === false || !entities.fanSpeed ? '' : formatPercentage(state.fanSpeed),
    efficiency:
      config.show_efficiency === false || !entities.efficiency ? '' : formatPercentage(state.efficiency),
    extractTemp: entities.extractTemp ? formatTemperature(state.extractTemp, tempUnit) : '',
    humidity:
      config.show_humidity === false || !entities.humidity ? '' : formatHumidity(state.humidity),
    co2: config.show_co2 === false || !entities.co2 ? '' : formatCO2(state.co2),
    supplyTemp: entities.supplyTemp ? formatTemperature(state.supplyTemp, tempUnit) : '',
    supplyCellTemp:
      config.show_supply_cell_temp === false || !entities.supplyCellTemp ? '' : formatTemperature(state.supplyCellTemp, tempUnit),
    outdoorTemp: entities.outdoorTemp ? formatTemperature(state.outdoorTemp, tempUnit) : '',
    exhaustTemp: entities.exhaustTemp ? formatTemperature(state.exhaustTemp, tempUnit) : '',
    postHeaterActive: config.show_post_heater === false || !entities.postHeater ? undefined : state.postHeaterActive,
  };

  // Calculate dynamic colors for temperatures
  const enableTempColors = config.enable_temp_colors !== false;
  const dynamicColors: ValloxDashboardColors = {};
  
  if (enableTempColors) {
    // Build color options from config
    const colorOptions: TempColorOptions = {
      cold: config.temp_color_cold,
      freeze: config.temp_color_freeze,
      neutral: config.temp_color_neutral,
      warm: config.temp_color_warm,
      hot: config.temp_color_hot,
    };
    dynamicColors.extractTempColor = getTemperatureColor(state.extractTemp, tempUnit, colorOptions);
    dynamicColors.supplyTempColor = getTemperatureColor(state.supplyTemp, tempUnit, colorOptions);
    dynamicColors.supplyCellTempColor = getTemperatureColor(state.supplyCellTemp, tempUnit, colorOptions);
    dynamicColors.outdoorTempColor = getTemperatureColor(state.outdoorTemp, tempUnit, colorOptions);
    dynamicColors.exhaustTempColor = getTemperatureColor(state.exhaustTemp, tempUnit, colorOptions);
  }

  // Calculate CO2 alert state
  const co2Alert = getCO2AlertState(
    state.co2,
    config.co2_limit,
    config.co2_alert_color,
    config.enable_co2_blink
  );
  if (co2Alert.isAlert) {
    dynamicColors.co2Color = co2Alert.color;
    dynamicColors.co2ClassName = co2Alert.className;
  }

  // Typography settings
  const typography: ValloxTypographySettings = {
    valueFontSize: config.value_font_size ?? 48,
    unitOpacity: config.unit_opacity ?? 0.6,
    fontWeight: config.font_weight ?? 500,
  };

  return renderValloxTemplate(
    model,
    {
      ...labels,
      humidity: config.show_humidity === false || !entities.humidity ? '' : labels.humidity,
      co2: config.show_co2 === false || !entities.co2 ? '' : labels.co2,
    },
    valueColor,
    entities,
    onEntityClick,
    dynamicColors,
    typography
  );
}

export function renderValloxTemplate(
  model: ValloxDashboardTemplateModel,
  labels: ValloxDashboardLabels,
  valueColor?: string,
  entities?: ValloxDashboardEntities,
  onEntityClick?: (entityId: string) => void,
  dynamicColors?: ValloxDashboardColors,
  typography?: ValloxTypographySettings
): SVGTemplateResult {
  const {
    cellState,
    profile,
    fanSpeed,
    efficiency,
    extractTemp,
    humidity,
    co2,
    supplyTemp,
    outdoorTemp,
    exhaustTemp,
  } = model;

  const ink = 'var(--secondary-text-color, #2c5e8c)';
  const inkSoft = 'var(--secondary-text-color, #2c5e8c)';
  const valueInk = valueColor || 'var(--vallox-value-color, var(--primary-text-color, #2a7ebf))';
  const line = 'var(--vallox-line-color, #d1e8ff)';
  const arrowDark = 'var(--vallox-arrow-dark, #2a7ebf)';
  const arrowLight = 'var(--vallox-arrow-light, #5cb8ff)';
  const glowStart = 'var(--vallox-glow-start, #e1f0ff)';
  const ringStroke = 'var(--vallox-ring-stroke, #dcdcdc)';
  const ringStrokeInner = 'var(--vallox-ring-stroke-inner, #e6e6e6)';
  const badgeStroke = 'var(--vallox-badge-stroke, var(--divider-color, #d1e8ff))';
  const badgeFill = 'var(--vallox-badge-fill, var(--ha-card-background, var(--card-background-color, rgba(255,255,255,0.72))))';

  return svg`
    <svg
      viewBox="0 0 ${W} ${H}"
      xmlns="http://www.w3.org/2000/svg"
      style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
      aria-label="Vallox ventilation dashboard"
    >
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${glowStart}" stop-opacity="0.45"/>
          <stop offset="60%" stop-color="${glowStart}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <circle cx="${CX}" cy="${CY}" r="200" fill="url(#centerGlow)"/>

      <g transform="translate(${CX}, ${CY}) rotate(45)">
        <rect x="-100" y="-100" width="200" height="200" fill="none" stroke="${ringStroke}" stroke-width="7" rx="2"/>
        <rect x="-82" y="-82" width="164" height="164" fill="none" stroke="${ringStrokeInner}" stroke-width="4" rx="1"/>
      </g>

      <path d="M 310,165 C 360,165 440,335 490,335" fill="none" stroke="${arrowDark}" stroke-width="15" stroke-linecap="round"/>
      <path d="M 490,325 L 520,335 L 490,345 Z" fill="${arrowDark}" />

      <path d="M 490,165 C 440,165 360,335 310,335" fill="none" stroke="${arrowLight}" stroke-width="15" stroke-linecap="round"/>
      <path d="M 310,325 L 280,335 L 310,345 Z" fill="${arrowLight}" />

      <g transform="translate(${CX}, ${CY})">
        <rect x="-60" y="-28" width="120" height="56" rx="10" fill="${badgeFill}" stroke="${badgeStroke}" stroke-width="2"/>
        ${renderValueText({
          value: efficiency,
          x: 0,
          y: 12,
          fontSize: typography?.valueFontSize ?? 48,
          fontWeight: typography?.fontWeight ?? 500,
          fill: valueInk,
          textAnchor: 'middle',
          entityId: entities?.efficiency,
          onEntityClick,
          unitOpacity: typography?.unitOpacity ?? 0.6,
        })}
      </g>

      <g fill="${ink}">
        <text x="${CX}" y="50" text-anchor="middle" font-size="30" font-weight="700" fill="${ink}">
          ${labels.cellStateTitle}
        </text>
        ${cellState
          ? renderValueText({
              value: cellState,
              x: CX,
              y: 78,
              fontSize: 22,
              fill: inkSoft,
              textAnchor: 'middle',
              textDecoration: 'underline',
              entityId: entities?.cellState,
              onEntityClick,
            })
          : ''}

        ${renderLeftBlock({
          x: 140,
          y: 135,
          title: labels.extractAir,
          value: extractTemp,
          humidity,
          humidityLabel: labels.humidity,
          co2,
          co2Label: labels.co2,
          line,
          ink,
          inkSoft,
          valueInk,
          valueEntityId: entities?.extractTemp,
          humidityEntityId: entities?.humidity,
          co2EntityId: entities?.co2,
          onEntityClick,
          valueColorOverride: dynamicColors?.extractTempColor,
          co2ColorOverride: dynamicColors?.co2Color,
          co2ClassName: dynamicColors?.co2ClassName,
          typography,
        })}

        ${renderLeftSimple({
          x: 140,
          y: 340,
          title: labels.supplyAir,
          value: supplyTemp,
          line,
          ink,
          valueInk,
          valueEntityId: entities?.supplyTemp,
          onEntityClick,
          valueColorOverride: dynamicColors?.supplyTempColor,
          typography,
        })}

        ${renderRightSimple({
          x: 660,
          y: 135,
          title: labels.outdoorAir,
          value: outdoorTemp,
          line,
          ink,
          valueInk,
          valueEntityId: entities?.outdoorTemp,
          onEntityClick,
          valueColorOverride: dynamicColors?.outdoorTempColor,
          typography,
        })}

        ${renderRightSimple({
          x: 660,
          y: 340,
          title: labels.exhaustAir,
          value: exhaustTemp,
          line,
          ink,
          valueInk,
          valueEntityId: entities?.exhaustTemp,
          onEntityClick,
          valueColorOverride: dynamicColors?.exhaustTempColor,
          typography,
        })}

        ${renderProfileFanLine({
          x: CX,
          y: 470,
          profile,
          fanSpeed,
          profileEntityId: entities?.profile,
          fanSpeedEntityId: entities?.fanSpeed,
          valueInk,
          onEntityClick,
        })}
      </g>
    </svg>
  `;
}

function renderLeftBlock(args: {
  x: number;
  y: number;
  title: string;
  value: string;
  humidity: string;
  humidityLabel: string;
  co2: string;
  co2Label: string;
  line: string;
  ink: string;
  inkSoft: string;
  valueInk: string;
  valueEntityId?: string;
  humidityEntityId?: string;
  co2EntityId?: string;
  onEntityClick?: (entityId: string) => void;
  valueColorOverride?: string;
  co2ColorOverride?: string;
  co2ClassName?: string;
  typography?: ValloxTypographySettings;
}): SVGTemplateResult {
  const {
    x,
    y,
    title,
    value,
    humidity,
    humidityLabel,
    co2,
    co2Label,
    line,
    ink,
    inkSoft,
    valueInk,
    valueEntityId,
    humidityEntityId,
    co2EntityId,
    onEntityClick,
    valueColorOverride,
    co2ColorOverride,
    co2ClassName,
    typography,
  } = args;

  const valueFontSize = typography?.valueFontSize ?? 48;
  const fontWeight = typography?.fontWeight ?? 500;
  const unitOpacity = typography?.unitOpacity ?? 0.6;

  return svg`
    <g transform="translate(${x}, ${y})">
      <text x="0" y="0" text-anchor="middle" font-size="26" font-weight="700" fill="${ink}">${title}</text>
      <line x1="-60" y1="12" x2="60" y2="12" stroke="${line}" stroke-width="1.5"/>
      ${renderValueText({
        value,
        x: 0,
        y: 48,
        fontSize: valueFontSize,
        fontWeight,
        fill: valueColorOverride || valueInk,
        textAnchor: 'middle',
        entityId: valueEntityId,
        onEntityClick,
        unitOpacity,
      })}
      ${renderLabelValue({ label: humidityLabel, value: humidity, y: 80, inkSoft, valueInk, entityId: humidityEntityId, onEntityClick, unitOpacity })}
      ${renderLabelValue({ label: co2Label, value: co2, y: 104, inkSoft, valueInk: co2ColorOverride || valueInk, entityId: co2EntityId, onEntityClick, className: co2ClassName, unitOpacity })}
    </g>
  `;
}

function renderLeftSimple(args: {
  x: number;
  y: number;
  title: string;
  value: string;
  line: string;
  ink: string;
  valueInk: string;
  valueEntityId?: string;
  onEntityClick?: (entityId: string) => void;
  valueColorOverride?: string;
  typography?: ValloxTypographySettings;
}): SVGTemplateResult {
  const { x, y, title, value, line, ink, valueInk, valueEntityId, onEntityClick, valueColorOverride, typography } = args;

  const valueFontSize = typography?.valueFontSize ?? 48;
  const fontWeight = typography?.fontWeight ?? 500;
  const unitOpacity = typography?.unitOpacity ?? 0.6;

  return svg`
    <g transform="translate(${x}, ${y})">
      <text x="0" y="0" text-anchor="middle" font-size="26" font-weight="700" fill="${ink}">${title}</text>
      <line x1="-60" y1="12" x2="60" y2="12" stroke="${line}" stroke-width="1.5"/>
      ${renderValueText({
        value,
        x: 0,
        y: 48,
        fontSize: valueFontSize,
        fontWeight,
        fill: valueColorOverride || valueInk,
        textAnchor: 'middle',
        entityId: valueEntityId,
        onEntityClick,
        unitOpacity,
      })}
    </g>
  `;
}

function renderRightSimple(args: {
  x: number;
  y: number;
  title: string;
  value: string;
  line: string;
  ink: string;
  valueInk: string;
  valueEntityId?: string;
  onEntityClick?: (entityId: string) => void;
  valueColorOverride?: string;
  typography?: ValloxTypographySettings;
}): SVGTemplateResult {
  const { x, y, title, value, line, ink, valueInk, valueEntityId, onEntityClick, valueColorOverride, typography } = args;

  const valueFontSize = typography?.valueFontSize ?? 48;
  const fontWeight = typography?.fontWeight ?? 500;
  const unitOpacity = typography?.unitOpacity ?? 0.6;

  return svg`
    <g transform="translate(${x}, ${y})">
      <text x="0" y="0" text-anchor="middle" font-size="26" font-weight="700" fill="${ink}">${title}</text>
      <line x1="-60" y1="12" x2="60" y2="12" stroke="${line}" stroke-width="1.5"/>
      ${renderValueText({
        value,
        x: 0,
        y: 48,
        fontSize: valueFontSize,
        fontWeight,
        fill: valueColorOverride || valueInk,
        textAnchor: 'middle',
        entityId: valueEntityId,
        onEntityClick,
        unitOpacity,
      })}
    </g>
  `;
}

function renderLabelValue(args: {
  label: string;
  value: string;
  y: number;
  inkSoft: string;
  valueInk: string;
  entityId?: string;
  onEntityClick?: (entityId: string) => void;
  className?: string;
  unitOpacity?: number;
}): SVGTemplateResult {
  const { label, value, y, inkSoft, valueInk, entityId, onEntityClick, className, unitOpacity = 0.6 } = args;
  if (!value) return svg``;

  const clickable = Boolean(entityId && onEntityClick);
  const classes = [clickable ? 'clickable' : '', className || ''].filter(Boolean).join(' ');

  // Parse value and unit for separate styling
  const parsed = parseValueAndUnit(value);
  const baseFontSize = 18;
  const unitFontSize = Math.round(baseFontSize * 0.75);

  const textNode = svg`
    <text x="0" y="${y}" text-anchor="middle" font-size="${baseFontSize}">
      ${label ? svg`<tspan fill="${inkSoft}">${label}: </tspan>` : ''}
      <tspan font-weight="700" fill="${valueInk}">${parsed.value}</tspan>${parsed.unit ? svg`<tspan font-size="${unitFontSize}" font-weight="400" fill="${valueInk}" opacity="${unitOpacity}">${parsed.unit}</tspan>` : ''}
    </text>
  `;

  if (!clickable && !className) return textNode;

  if (clickable && entityId && onEntityClick) {
    return svg`<g class="${classes}" @click=${() => onEntityClick(entityId)}>${textNode}</g>`;
  }

  return svg`<g class="${classes}">${textNode}</g>`;
}

function renderValueText(args: {
  value: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight?: number;
  fill: string;
  textAnchor?: 'start' | 'middle' | 'end';
  textDecoration?: 'underline' | 'none';
  entityId?: string;
  onEntityClick?: (entityId: string) => void;
  unitOpacity?: number;
}): SVGTemplateResult {
  const {
    value,
    x,
    y,
    fontSize,
    fontWeight,
    fill,
    textAnchor = 'middle',
    textDecoration,
    entityId,
    onEntityClick,
    unitOpacity = 0.6,
  } = args;

  if (!value) {
    return svg``;
  }

  // Parse value to separate number from unit
  const parsed = parseValueAndUnit(value);
  const clickable = Boolean(entityId && onEntityClick);
  
  const textNode = parsed.unit
    ? svg`
        <text
          x="${x}"
          y="${y}"
          text-anchor="${textAnchor}"
          font-size="${fontSize}"
          font-weight=${fontWeight ?? nothing}
          fill="${fill}"
          text-decoration=${textDecoration ?? nothing}
        ><tspan>${parsed.value}</tspan><tspan fill-opacity="${unitOpacity}" font-size="${Math.round(fontSize * 0.55)}">${parsed.unit}</tspan></text>
      `
    : svg`
        <text
          x="${x}"
          y="${y}"
          text-anchor="${textAnchor}"
          font-size="${fontSize}"
          font-weight=${fontWeight ?? nothing}
          fill="${fill}"
          text-decoration=${textDecoration ?? nothing}
        >${value}</text>
      `;

  if (!clickable || !entityId || !onEntityClick) {
    return textNode;
  }

  return svg`
    <g class="clickable" @click=${() => onEntityClick(entityId)}>
      ${textNode}
    </g>
  `;
}

function renderProfileFanLine(args: {
  x: number;
  y: number;
  profile: string;
  fanSpeed: string;
  profileEntityId?: string;
  fanSpeedEntityId?: string;
  valueInk: string;
  onEntityClick?: (entityId: string) => void;
}): SVGTemplateResult {
  const { x, y, profile, fanSpeed, profileEntityId, fanSpeedEntityId, valueInk, onEntityClick } = args;

  if (!profile && !fanSpeed) {
    return svg``;
  }

  return svg`
    <g>
      ${profile
        ? renderValueText({
            value: profile,
            x: x - 8,
            y,
            fontSize: 30,
            fontWeight: 700,
            fill: valueInk,
            textAnchor: 'end',
            entityId: profileEntityId,
            onEntityClick,
          })
        : ''}
      ${fanSpeed
        ? renderInlineFanSpeed({
            x: x + 8,
            y,
            value: fanSpeed,
            valueInk,
            entityId: fanSpeedEntityId,
            onEntityClick,
          })
        : ''}
    </g>
  `;
}

function renderInlineFanSpeed(args: {
  x: number;
  y: number;
  value: string;
  valueInk: string;
  entityId?: string;
  onEntityClick?: (entityId: string) => void;
}): SVGTemplateResult {
  const { x, y, value, valueInk, entityId, onEntityClick } = args;
  const clickable = Boolean(entityId && onEntityClick);
  const fanPath =
    'M12,12A2,2 0 0,0 10,10A2,2 0 0,0 12,12M16.59,11.42C19.76,9.1 21.5,5.5 20.9,2.5C20.8,2.1 20.4,1.9 20,2C19.6,2.1 19.4,2.5 19.5,2.9C20,5.4 18.5,8.4 15.6,10.4C15.4,10.5 15.3,10.7 15.3,10.9C15.3,11.1 15.4,11.3 15.6,11.4C15.9,11.6 16.3,11.6 16.59,11.42M7.41,12.58C4.24,14.9 2.5,18.5 3.1,21.5C3.2,21.9 3.6,22.1 4,22C4.4,21.9 4.6,21.5 4.5,21.1C4,18.6 5.5,15.6 8.4,13.6C8.6,13.5 8.7,13.3 8.7,13.1C8.7,12.9 8.6,12.7 8.4,12.6C8.1,12.4 7.7,12.4 7.41,12.58M12.58,7.41C14.9,4.24 18.5,2.5 21.5,3.1C21.9,3.2 22.1,3.6 22,4C21.9,4.4 21.5,4.6 21.1,4.5C18.6,4 15.6,5.5 13.6,8.4C13.5,8.6 13.3,8.7 13.1,8.7C12.9,8.7 12.7,8.6 12.6,8.4C12.4,8.1 12.4,7.7 12.58,7.41M11.42,16.59C9.1,19.76 5.5,21.5 2.5,20.9C2.1,20.8 1.9,20.4 2,20C2.1,19.6 2.5,19.4 2.9,19.5C5.4,20 8.4,18.5 10.4,15.6C10.5,15.4 10.7,15.3 10.9,15.3C11.1,15.3 11.3,15.4 11.4,15.6C11.6,15.9 11.6,16.3 11.42,16.59Z';

  const content = svg`
    <text x="${x}" y="${y}" text-anchor="start" font-size="30" font-weight="700" fill="${valueInk}">(</text>
    <g transform="translate(${x + 14}, ${y - 16}) scale(0.8)">
      <path d="${fanPath}" fill="${valueInk}" />
    </g>
    <text x="${x + 36}" y="${y}" text-anchor="start" font-size="30" font-weight="700" fill="${valueInk}">${value})</text>
  `;

  if (!clickable || !entityId || !onEntityClick) {
    return content;
  }

  return svg`
    <g class="clickable" @click=${() => onEntityClick(entityId)}>
      ${content}
    </g>
  `;
}

/**
 * Parses a formatted value string to separate the numeric part from the unit
 * Handles formats like "21.5°C", "85%", "450 ppm"
 */
function parseValueAndUnit(formatted: string): { value: string; unit: string } {
  if (!formatted || formatted === '—') {
    return { value: formatted, unit: '' };
  }
  
  // Match number (with optional decimal) followed by unit
  // Handles: "21.5°C", "85%", "450 ppm", "-5.2°C"
  const match = formatted.match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);
  if (match) {
    return { value: match[1], unit: match[2] };
  }
  
  // No match, return as-is (for text values like "Heat Recovery")
  return { value: formatted, unit: '' };
}
