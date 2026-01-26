// HTML Text Overlay for Vallox IV Card
// Renders all text elements as positioned HTML divs on top of SVG background

import { html, TemplateResult, nothing } from 'lit';
import type {
  ValloxDashboardTemplateModel,
  ValloxDashboardLabels,
  ValloxDashboardEntities,
  ValloxDashboardColors,
} from './vallox-iv-card.svg';
import { parseValueAndUnit } from '../shared/format';

/**
 * Renders a clickable value with optional color override
 */
function renderValue(
  value: string,
  entityId?: string,
  onEntityClick?: (entityId: string) => void,
  colorOverride?: string,
  className?: string
): TemplateResult {
  if (!value) return html``;
  
  const parsed = parseValueAndUnit(value);
  const clickable = Boolean(entityId && onEntityClick);
  const style = colorOverride ? `color: ${colorOverride}` : '';
  const classes = ['value', clickable ? 'clickable' : '', className || ''].filter(Boolean).join(' ');
  
  const content = parsed.unit
    ? html`<span class="num">${parsed.value}</span><span class="unit">${parsed.unit}</span>`
    : html`${value}`;
  
  if (clickable && entityId && onEntityClick) {
    return html`
      <span
        class="${classes}"
        style="${style}"
        role="button"
        tabindex="0"
        aria-label="View ${entityId} details"
        @click=${() => onEntityClick(entityId)}
        @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && onEntityClick(entityId)}
      >
        ${content}
      </span>
    `;
  }
  
  return html`<span class="${classes}" style="${style}">${content}</span>`;
}

/**
 * Humidity icon using Home Assistant's built-in ha-icon component
 */
function renderHumidityIcon(): TemplateResult {
  return html`<ha-icon icon="mdi:water-percent" class="sensor-icon humidity-icon"></ha-icon>`;
}

/**
 * CO2 icon using Home Assistant's built-in ha-icon component
 */
function renderCO2Icon(): TemplateResult {
  return html`<ha-icon icon="mdi:molecule-co2" class="sensor-icon co2-icon"></ha-icon>`;
}

/**
 * Renders a label + value pair (for humidity, CO2)
 * If useIcon is specified, renders icon instead of text label
 */
function renderLabelValue(
  label: string,
  value: string,
  entityId?: string,
  onEntityClick?: (entityId: string) => void,
  colorOverride?: string,
  className?: string,
  useIcon?: 'humidity' | 'co2'
): TemplateResult {
  if (!value) return html``;
  
  const parsed = parseValueAndUnit(value);
  const clickable = Boolean(entityId && onEntityClick);
  const valueStyle = colorOverride ? `color: ${colorOverride}` : '';
  const classes = ['label-value', clickable ? 'clickable' : '', className || ''].filter(Boolean).join(' ');
  
  let labelContent;
  if (useIcon === 'humidity') {
    labelContent = html`${renderHumidityIcon()}`;
  } else if (useIcon === 'co2') {
    labelContent = html`${renderCO2Icon()}`;
  } else {
    labelContent = label ? html`<span class="label">${label}: </span>` : '';
  }
  
  const content = html`
    ${labelContent}
    <span class="value" style="${valueStyle}">
      <span class="num">${parsed.value}</span>${parsed.unit ? html`<span class="unit">${parsed.unit}</span>` : ''}
    </span>
  `;
  
  if (clickable && entityId && onEntityClick) {
    return html`
      <div
        class="${classes}"
        role="button"
        tabindex="0"
        aria-label="View ${entityId} details"
        @click=${() => onEntityClick(entityId)}
        @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && onEntityClick(entityId)}
      >
        ${content}
      </div>
    `;
  }
  
  return html`<div class="${classes}">${content}</div>`;
}

/**
 * Renders a temperature block (title + temp value + optional humidity/CO2)
 */
function renderTempBlock(args: {
  position: 'extract' | 'supply' | 'outdoor' | 'exhaust';
  title: string;
  temp: string;
  tempEntityId?: string;
  tempColor?: string;
  humidity?: string;
  humidityLabel?: string;
  humidityEntityId?: string;
  co2?: string;
  co2Label?: string;
  co2EntityId?: string;
  co2Color?: string;
  co2ClassName?: string;
  onEntityClick?: (entityId: string) => void;
}): TemplateResult {
  const {
    position,
    title,
    temp,
    tempEntityId,
    tempColor,
    humidity,
    humidityLabel,
    humidityEntityId,
    co2,
    co2Label,
    co2EntityId,
    co2Color,
    co2ClassName,
    onEntityClick,
  } = args;

  return html`
    <div class="temp-block ${position}">
      <div class="title">${title}</div>
      ${renderValue(temp, tempEntityId, onEntityClick, tempColor)}
      ${humidity ? renderLabelValue(humidityLabel || '', humidity, humidityEntityId, onEntityClick, undefined, undefined, 'humidity') : ''}
      ${co2 ? renderLabelValue(co2Label || '', co2, co2EntityId, onEntityClick, co2Color, co2ClassName, 'co2') : ''}
    </div>
  `;
}

/**
 * Fan icon using Home Assistant's built-in ha-icon component
 */
function renderFanIcon(): TemplateResult {
  return html`<ha-icon icon="mdi:fan" class="fan-icon"></ha-icon>`;
}

/**
 * Post-heater icon using Home Assistant's built-in ha-icon component
 * Green when active, grey when inactive
 */
function renderPostHeaterIcon(active: boolean): TemplateResult {
  const colorClass = active ? 'active' : 'inactive';
  return html`<ha-icon icon="mdi:radiator" class="post-heater-icon ${colorClass}"></ha-icon>`;
}

/**
 * Renders the complete HTML text overlay
 */
export function renderTextOverlay(
  model: ValloxDashboardTemplateModel,
  labels: ValloxDashboardLabels,
  entities: ValloxDashboardEntities,
  dynamicColors: ValloxDashboardColors,
  valueColor?: string,
  onEntityClick?: (entityId: string) => void
): TemplateResult {
  const {
    cellState,
    profile,
    fanSpeed,
    efficiency,
    extractTemp,
    humidity,
    co2,
    supplyTemp,
    supplyCellTemp,
    outdoorTemp,
    exhaustTemp,
    postHeaterActive,
  } = model;

  const valueStyle = valueColor ? `--vallox-value-color: ${valueColor}` : '';

  return html`
    <div class="text-overlay" style="${valueStyle}">
      <!-- Cell State Header -->
      ${labels.cellStateTitle || cellState
        ? html`
            <div class="cell-state-block">
              ${labels.cellStateTitle ? html`<div class="cell-state-title">${labels.cellStateTitle}</div>` : ''}
              ${cellState
                ? html`
                    <div
                      class="cell-state-value ${entities.cellState && onEntityClick ? 'clickable' : ''}"
                      @click=${entities.cellState && onEntityClick ? () => onEntityClick(entities.cellState!) : nothing}
                    >
                      ${cellState}
                    </div>
                  `
                : ''
              }
            </div>
          `
        : ''
      }

      <!-- Efficiency Badge (center) -->
      <div class="efficiency-block">
        ${renderValue(efficiency, entities.efficiency, onEntityClick)}
      </div>

      <!-- Post-Heater & Supply Cell Temp (on supply arrow, between efficiency and supply label) -->
      ${supplyCellTemp || postHeaterActive !== undefined
        ? html`
            <div class="supply-cell-block">
              ${postHeaterActive !== undefined
                ? html`
                    <span
                      class="post-heater ${entities.postHeater && onEntityClick ? 'clickable' : ''}"
                      @click=${entities.postHeater && onEntityClick ? () => onEntityClick(entities.postHeater!) : nothing}
                    >
                      ${renderPostHeaterIcon(postHeaterActive)}
                    </span>
                  `
                : ''
              }
              ${supplyCellTemp
                ? html`
                    <div
                      class="supply-cell-temp ${entities.supplyCellTemp && onEntityClick ? 'clickable' : ''}"
                      style="${dynamicColors.supplyCellTempColor ? `color: ${dynamicColors.supplyCellTempColor}` : ''}"
                      @click=${entities.supplyCellTemp && onEntityClick ? () => onEntityClick(entities.supplyCellTemp!) : nothing}
                    >
                      ${supplyCellTemp}
                    </div>
                  `
                : ''
              }
            </div>
          `
        : ''
      }

      <!-- Extract Air (left top) -->
      ${renderTempBlock({
        position: 'extract',
        title: labels.extractAir,
        temp: extractTemp,
        tempEntityId: entities.extractTemp,
        tempColor: dynamicColors.extractTempColor,
        humidity,
        humidityLabel: labels.humidity,
        humidityEntityId: entities.humidity,
        co2,
        co2Label: labels.co2,
        co2EntityId: entities.co2,
        co2Color: dynamicColors.co2Color,
        co2ClassName: dynamicColors.co2ClassName,
        onEntityClick,
      })}

      <!-- Supply Air (left bottom) -->
      ${renderTempBlock({
        position: 'supply',
        title: labels.supplyAir,
        temp: supplyTemp,
        tempEntityId: entities.supplyTemp,
        tempColor: dynamicColors.supplyTempColor,
        onEntityClick,
      })}

      <!-- Outdoor Air (right top) -->
      ${renderTempBlock({
        position: 'outdoor',
        title: labels.outdoorAir,
        temp: outdoorTemp,
        tempEntityId: entities.outdoorTemp,
        tempColor: dynamicColors.outdoorTempColor,
        onEntityClick,
      })}

      <!-- Exhaust Air (right bottom) -->
      ${renderTempBlock({
        position: 'exhaust',
        title: labels.exhaustAir,
        temp: exhaustTemp,
        tempEntityId: entities.exhaustTemp,
        tempColor: dynamicColors.exhaustTempColor,
        onEntityClick,
      })}

      <!-- Profile & Fan Speed (bottom center) -->
      ${profile || fanSpeed
        ? html`
            <div class="profile-fan-block">
              ${profile
                ? html`
                    <span
                      class="profile ${entities.profile && onEntityClick ? 'clickable' : ''}"
                      @click=${entities.profile && onEntityClick ? () => onEntityClick(entities.profile!) : nothing}
                    >
                      ${profile}
                    </span>
                  `
                : ''
              }
              ${fanSpeed
                ? html`
                    <span
                      class="fan-speed ${entities.fanSpeed && onEntityClick ? 'clickable' : ''}"
                      @click=${entities.fanSpeed && onEntityClick ? () => onEntityClick(entities.fanSpeed!) : nothing}
                    >
                      (${renderFanIcon()}${fanSpeed})
                    </span>
                  `
                : ''
              }
            </div>
          `
        : ''
      }
    </div>
  `;
}
