// Visual tokens & CSS helpers

import { css } from 'lit';

/**
 * Main card styles using Home Assistant theme CSS variables
 */
export const cardStyles = css`
  :host {
    display: block;
    --vallox-value-color: var(--primary-text-color, #2a7ebf);
    --vallox-label-color: var(--secondary-text-color, #2c5e8c);
    --vallox-unit-opacity: 0.6;
  }

  ha-card {
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    display: flex;
    flex-direction: column;
    background: transparent;
  }

  .card-header {
    font-size: var(--ha-card-header-font-size, 24px);
    font-weight: normal;
    line-height: 1.2;
    color: var(--ha-card-header-color, var(--primary-text-color));
    padding: 8px 12px 4px;
  }

  .card-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    padding: 0;
  }

  /* SVG + Overlay Container */
  .diagram-container {
    position: relative;
    width: 100%;
    max-width: 100%;
    aspect-ratio: 800 / 500;
    height: 100%;
  }

  .diagram-container svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  /* ==========================================
     Airflow Animation
     ========================================== */
  @keyframes airflow {
    from { stroke-dashoffset: 30; }
    to { stroke-dashoffset: 0; }
  }

  .diagram-container svg.airflow-active .airflow-path {
    stroke-dasharray: 10, 20;
    animation: airflow var(--flow-duration, 2s) linear infinite;
  }

  .diagram-container svg.airflow-stopped .airflow-path {
    stroke-dasharray: none;
    animation: none;
  }

  /* ==========================================
     HTML Text Overlay
     ========================================== */
  .text-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    font-family: var(--ha-card-header-font-family, inherit);
    color: var(--vallox-label-color);
  }

  .text-overlay .clickable {
    pointer-events: auto;
    cursor: pointer;
  }

  .text-overlay .clickable:hover {
    text-decoration: underline;
  }

  /* Value styling - number + unit separation */
  .text-overlay .value {
    color: var(--vallox-value-color);
    font-weight: 500;
    font-size: 28px;
  }

  .text-overlay .value .num {
    font-weight: 400;
  }

  .text-overlay .value .unit {
    font-size: 16px;
    font-weight: 400;
    opacity: var(--vallox-unit-opacity);
  }

  .text-overlay .label {
    color: var(--vallox-label-color);
    font-weight: 400;
    font-size: 16px;
  }

  /* Cell State Header - top center */
  .cell-state-block {
    position: absolute;
    top: 6%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .cell-state-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--vallox-label-color);
  }

  .cell-state-value {
    font-size: 16px;
    color: var(--vallox-label-color);
    margin-top: 2px;
  }

  /* Efficiency Badge - center */
  .efficiency-block {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .efficiency-block .value {
    font-size: 28px;
    font-weight: 500;
  }

  /* Temperature Blocks - positioned in corners */
  .temp-block {
    position: absolute;
    text-align: center;
    width: 20%;
  }

  .temp-block .title {
    font-size: 16px;
    font-weight: 700;
    color: var(--vallox-label-color);
    margin-bottom: 0;
    line-height: 1.3;
  }

  .temp-block .value {
    display: block;
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 0;
    line-height: 1.2;
  }

  .temp-block .label-value {
    font-size: 14px;
    margin-top: 0;
    line-height: 1.3;
    text-align: center;
  }

  .temp-block .label-value .sensor-icon {
    --mdc-icon-size: 14px;
    vertical-align: -0.15em;
    margin-right: 2px;
    color: var(--vallox-label-color);
  }

  .temp-block .label-value .value {
    font-size: 14px;
    display: inline;
  }

  .temp-block .label-value .value .unit {
    font-size: 14px;
  }

  /* Extract air - left top */
  .temp-block.extract {
    top: 18%;
    left: 5%;
  }

  /* Supply air - left bottom */
  .temp-block.supply {
    top: 64%;
    left: 5%;
  }

  /* Outdoor air - right top */
  .temp-block.outdoor {
    top: 18%;
    right: 5%;
  }

  /* Exhaust air - right bottom */
  .temp-block.exhaust {
    top: 64%;
    right: 5%;
  }

  /* Supply Cell Temperature & Post-Heater - on supply arrow path */
  /* SVG path: M 490,165 C 440,165 360,335 310,335 
     Position: between efficiency badge (center) and Tuloilma label (bottom-left) */
  .supply-cell-block {
    position: absolute;
    top: 62%;
    left: 28%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    z-index: 10;
  }

  .supply-cell-block .supply-cell-temp {
    font-size: 14px;
    font-weight: 500;
    color: var(--vallox-value-color);
    white-space: nowrap;
    background: color-mix(in srgb, var(--vallox-badge-fill, var(--ha-card-background, var(--card-background-color, #ffffff))) 50%, transparent);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .supply-cell-block .supply-cell-temp.clickable {
    pointer-events: auto;
    cursor: pointer;
  }

  .supply-cell-block .supply-cell-temp.clickable:hover {
    background: color-mix(in srgb, var(--vallox-badge-fill, var(--ha-card-background, var(--card-background-color, #ffffff))) 70%, transparent);
  }

  .supply-cell-block .post-heater {
    display: flex;
    align-items: center;
  }

  .post-heater-icon {
    --mdc-icon-size: 20px;
  }

  .post-heater-icon.active {
    color: var(--success-color, #4CAF50);
  }

  .post-heater-icon.inactive {
    color: var(--disabled-color, #9E9E9E);
  }

  /* Profile & Fan Speed - bottom center */
  .profile-fan-block {
    position: absolute;
    bottom: 4%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-size: 16px;
    font-weight: 700;
    color: var(--vallox-value-color);
  }

  .profile-fan-block .profile,
  .profile-fan-block .fan-speed {
    display: inline-flex;
    align-items: center;
    gap: 0.15em;
  }

  .profile-fan-block .fan-speed {
    font-weight: 400;
  }

  .profile-fan-block .fan-icon {
    --mdc-icon-size: 0.9em;
    vertical-align: middle;
  }

  /* CO2 Alert Animation */
  @keyframes co2-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .text-overlay .co2-alert {
    animation: co2-pulse 1s ease-in-out infinite;
  }

  .text-overlay .co2-alert-static {
    /* No animation, just static alert styling */
  }

  /* Compact mode */
  :host([compact]) ha-card {
    padding: 0;
  }

  :host([compact]) .card-header {
    font-size: 16px;
    padding: 6px 8px 2px;
  }
`;

/**
 * Compact mode styles override
 */
export const compactStyles = css`
  .diagram-container {
    aspect-ratio: 800 / 450;
  }
`;
