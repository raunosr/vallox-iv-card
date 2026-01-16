// Custom visual editor element for Vallox IV Card

import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, ValloxIvCardConfig } from '../shared/types';

@customElement('vallox-iv-card-editor')
export class ValloxIvCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: ValloxIvCardConfig;

  static styles = css`
    .form-row {
      margin-bottom: 16px;
    }
    .form-row ha-selector {
      width: 100%;
    }
    ha-textfield {
      width: 100%;
    }
    ha-select {
      width: 100%;
    }
    .section-title {
      font-weight: 500;
      margin: 16px 0 8px 0;
      color: var(--primary-text-color);
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 4px;
    }
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }
    .toggle-row span {
      flex: 1;
    }
    .color-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .color-row ha-textfield {
      flex: 1;
    }
    .color-picker {
      width: 40px;
      height: 40px;
      padding: 0;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      cursor: pointer;
      background: transparent;
    }
    .color-picker::-webkit-color-swatch-wrapper {
      padding: 2px;
    }
    .color-picker::-webkit-color-swatch {
      border-radius: 4px;
      border: none;
    }
  `;

  public setConfig(config: ValloxIvCardConfig): void {
    this._config = { ...config };
  }

  private _renderEntitySelector(label: string, configKey: string, domains: string[]): TemplateResult {
    const config = this._config || {} as ValloxIvCardConfig;
    const value = (config as unknown as Record<string, unknown>)[configKey] as string || '';
    
    return html`
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{ entity: { domain: domains } }}
          .value=${value}
          .label=${label}
          @value-changed=${(e: CustomEvent) => this._valueChanged(configKey, e.detail.value)}
        ></ha-selector>
      </div>
    `;
  }

  private _renderLabelInput(label: string, configKey: string, placeholder: string): TemplateResult {
    const config = this._config || {} as ValloxIvCardConfig;
    const value = (config as unknown as Record<string, unknown>)[configKey] as string || '';

    return html`
      <div class="form-row">
        <ha-textfield
          .label=${label}
          .value=${value}
          .placeholder=${placeholder}
          @input=${(e: Event) => this._valueChanged(configKey, (e.target as HTMLInputElement).value)}
        ></ha-textfield>
      </div>
    `;
  }

  private _renderColorSelector(label: string, configKey: string, placeholder: string): TemplateResult {
    const config = this._config || {} as ValloxIvCardConfig;
    const rawValue = (config as unknown as Record<string, unknown>)[configKey];
    
    // Normalize value: handle both hex strings and RGB arrays
    let value = '';
    if (typeof rawValue === 'string') {
      value = rawValue;
    } else if (Array.isArray(rawValue) && rawValue.length === 3) {
      // Convert RGB array [r, g, b] to hex
      const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
      value = `#${toHex(rawValue[0])}${toHex(rawValue[1])}${toHex(rawValue[2])}`;
    }
    
    const swatch = value || placeholder;

    return html`
      <div class="form-row color-row">
        <ha-textfield
          .label=${label}
          .value=${value}
          .placeholder=${placeholder}
          @input=${(e: Event) => this._valueChanged(configKey, (e.target as HTMLInputElement).value)}
        ></ha-textfield>
        <input
          type="color"
          class="color-picker"
          .value=${swatch}
          @input=${(e: Event) => this._valueChanged(configKey, (e.target as HTMLInputElement).value)}
        />
      </div>
    `;
  }

  private _renderNumberInput(label: string, configKey: string, defaultValue: number): TemplateResult {
    const config = this._config || {} as ValloxIvCardConfig;
    const value = (config as unknown as Record<string, unknown>)[configKey] as number | undefined;
    const displayValue = value !== undefined ? String(value) : '';

    return html`
      <div class="form-row">
        <ha-textfield
          .label=${label}
          .value=${displayValue}
          .placeholder=${String(defaultValue)}
          type="number"
          @input=${(e: Event) => {
            const inputValue = (e.target as HTMLInputElement).value;
            const numValue = inputValue ? Number(inputValue) : undefined;
            this._valueChanged(configKey, numValue);
          }}
        ></ha-textfield>
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this.hass) {
      return html`<div>Loading...</div>`;
    }

    const config = this._config || { type: 'custom:vallox-iv-card' } as ValloxIvCardConfig;

    return html`
      <div class="form-row">
        <ha-textfield
          label="Card Title"
          .value=${config.title || ''}
          @input=${(e: Event) => this._valueChanged('title', (e.target as HTMLInputElement).value)}
        ></ha-textfield>
      </div>

      <div class="section-title">Temperature Sensors</div>
      ${this._renderEntitySelector('Outdoor Air Temperature', 'outdoor_air_temp', ['sensor'])}
      ${this._renderEntitySelector('Supply Air Temperature', 'supply_air_temp', ['sensor'])}
      ${this._renderEntitySelector('Extract Air Temperature', 'extract_air_temp', ['sensor'])}
      ${this._renderEntitySelector('Exhaust Air Temperature', 'exhaust_air_temp', ['sensor'])}

      <div class="section-title">Heat Recovery</div>
      ${this._renderEntitySelector('Efficiency Sensor', 'efficiency', ['sensor'])}
      ${this._renderEntitySelector('Cell State', 'cell_state', ['sensor', 'select'])}
      ${this._renderEntitySelector('Supply Cell Temperature', 'supply_cell_temp', ['sensor'])}
      ${this._renderEntitySelector('Post-Heater', 'post_heater', ['binary_sensor', 'sensor', 'switch'])}

      <div class="section-title">Additional Sensors</div>
      ${this._renderEntitySelector('Ventilation Profile', 'profile', ['sensor', 'select'])}
      ${this._renderEntitySelector('Fan Speed', 'fan_speed', ['sensor'])}
      ${this._renderEntitySelector('CO₂ Sensor', 'co2', ['sensor'])}
      ${this._renderEntitySelector('Humidity Sensor', 'humidity', ['sensor'])}

      <div class="section-title">Labels (optional)</div>
      ${this._renderLabelInput('Cell State Title', 'label_cell_state_title', 'LTO-Cell State')}
      ${this._renderLabelInput('Extract Air Label', 'label_extract_air', 'Extract air')}
      ${this._renderLabelInput('Supply Air Label', 'label_supply_air', 'Supply air')}
      ${this._renderLabelInput('Outdoor Air Label', 'label_outdoor_air', 'Outdoor air')}
      ${this._renderLabelInput('Exhaust Air Label', 'label_exhaust_air', 'Exhaust air')}
      ${this._renderLabelInput('Efficiency Label', 'label_efficiency', 'Efficiency')}
      ${this._renderLabelInput('Profile Label', 'label_profile', 'Profile')}
      ${this._renderLabelInput('Fan Speed Label', 'label_fan_speed', 'Fan speed')}

      <div class="section-title">Colors (optional)</div>

      <div class="toggle-row">
        <span>Enable Temperature Color Scaling</span>
        <ha-switch
          .checked=${config.enable_temp_colors !== false}
          @change=${(e: Event) => this._valueChanged('enable_temp_colors', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>

      ${config.enable_temp_colors !== false ? html`
        ${this._renderColorSelector('Cold (≤-10°C)', 'temp_color_cold', '#0000FF')}
        ${this._renderColorSelector('Freeze (0°C)', 'temp_color_freeze', '#00FFFF')}
        ${this._renderColorSelector('Neutral (22°C)', 'temp_color_neutral', '#8892E3')}
        ${this._renderColorSelector('Warm (25°C)', 'temp_color_warm', '#FFA500')}
        ${this._renderColorSelector('Hot (≥25°C)', 'temp_color_hot', '#FF4500')}
      ` : ''}

      <div class="section-title">Alert Settings</div>

      ${this._renderNumberInput('CO₂ Alert Threshold (ppm)', 'co2_limit', 1000)}
      ${this._renderColorSelector('CO₂ Alert Color', 'co2_alert_color', '#ff4444')}

      <div class="toggle-row">
        <span>Enable CO₂ Alert Animation</span>
        <ha-switch
          .checked=${config.enable_co2_blink !== false}
          @change=${(e: Event) => this._valueChanged('enable_co2_blink', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>

      <div class="section-title">Display Options</div>

      <div class="toggle-row">
        <span>Show Efficiency</span>
        <ha-switch
          .checked=${config.show_efficiency !== false}
          @change=${(e: Event) => this._valueChanged('show_efficiency', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Profile</span>
        <ha-switch
          .checked=${config.show_profile !== false}
          @change=${(e: Event) => this._valueChanged('show_profile', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Fan Speed</span>
        <ha-switch
          .checked=${config.show_fan_speed !== false}
          @change=${(e: Event) => this._valueChanged('show_fan_speed', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show CO₂</span>
        <ha-switch
          .checked=${config.show_co2 !== false}
          @change=${(e: Event) => this._valueChanged('show_co2', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Humidity</span>
        <ha-switch
          .checked=${config.show_humidity !== false}
          @change=${(e: Event) => this._valueChanged('show_humidity', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Cell State</span>
        <ha-switch
          .checked=${config.show_cell_state !== false}
          @change=${(e: Event) => this._valueChanged('show_cell_state', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Supply Cell Temperature</span>
        <ha-switch
          .checked=${config.show_supply_cell_temp !== false}
          @change=${(e: Event) => this._valueChanged('show_supply_cell_temp', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Post-Heater</span>
        <ha-switch
          .checked=${config.show_post_heater !== false}
          @change=${(e: Event) => this._valueChanged('show_post_heater', (e.target as HTMLInputElement).checked)}
        ></ha-switch>
      </div>
    `;
  }

  private _valueChanged(key: string, value: unknown): void {
    const config = this._config || { type: 'custom:vallox-iv-card' };
    
    const newConfig = {
      ...config,
      [key]: value,
    };

    // Remove empty/undefined values
    if (value === '' || value === undefined) {
      delete (newConfig as Record<string, unknown>)[key];
    }

    this._config = newConfig as ValloxIvCardConfig;

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vallox-iv-card-editor': ValloxIvCardEditor;
  }
}
