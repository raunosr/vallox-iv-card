// Vallox IV Card - Main custom element

import { LitElement, html, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant, ValloxIvCardConfig, ValloxIvCardState, GridOptions } from '../shared/types';
import { validateConfig } from '../shared/validation';
import { deriveCardState } from './vallox-iv-card.logic';
import { renderBackgroundSvg, prepareRenderData } from './vallox-iv-card.svg';
import { renderTextOverlay } from './vallox-iv-card.overlay';
import { cardStyles } from './vallox-iv-card.styles';
import { getStubConfig } from '../editor/vallox-iv-card.schema';
// Import editor to ensure it's bundled
import '../editor/vallox-iv-card-editor';

// Card registration info
const CARD_VERSION = '1.0.0';
const CARD_NAME = 'Vallox IV Card';
const CARD_DESCRIPTION = 'Visualizes Vallox IV airflow, temperatures, and heat recovery';

@customElement('vallox-iv-card')
export class ValloxIvCard extends LitElement {
  // Home Assistant will set this
  @property({ attribute: false }) public hass?: HomeAssistant;
  
  // Card configuration
  @state() private _config?: ValloxIvCardConfig;
  
  // Derived state for rendering
  @state() private _cardState?: ValloxIvCardState;

  // Error state
  @state() private _error?: string;

  static styles = cardStyles;

  /**
   * Set card configuration - called by Home Assistant
   */
  public setConfig(config: unknown): void {
    try {
      this._config = validateConfig(config);
      this._error = undefined;
    } catch (e) {
      this._error = e instanceof Error ? e.message : 'Unknown configuration error';
      throw e; // Re-throw for HA to show error card
    }
  }

  /**
   * Grid options for Sections view support
   */
  public getGridOptions(): GridOptions {
    return {
      columns: 4,
      rows: 3,
      min_columns: 2,
      min_rows: 2,
    };
  }

  /**
   * Return custom editor element
   */
  public static getConfigElement() {
    return document.createElement('vallox-iv-card-editor');
  }

  /**
   * Stub config for card picker
   */
  public static getStubConfig() {
    return getStubConfig();
  }

  /**
   * React to property changes
   */
  protected willUpdate(changedProps: PropertyValues): void {
    super.willUpdate(changedProps);

    // Derive card state when hass or config changes
    if (changedProps.has('hass') || changedProps.has('_config')) {
      if (this._config && this.hass) {
        this._cardState = deriveCardState(this.hass, this._config);
      }
    }
  }

  /**
   * Main render method
   */
  protected render(): TemplateResult {
    // Show error if configuration failed
    if (this._error) {
      return html`
        <ha-card>
          <div class="card-content">
            <ha-alert alert-type="error">${this._error}</ha-alert>
          </div>
        </ha-card>
      `;
    }

    // Show loading if not configured
    if (!this._config) {
      return html`
        <ha-card>
          <div class="card-content">
            <p>Card not configured</p>
          </div>
        </ha-card>
      `;
    }

    // Show placeholder if Home Assistant not ready
    if (!this.hass || !this._cardState) {
      return html`
        <ha-card>
          <div class="card-content">
            <p>Loading...</p>
          </div>
        </ha-card>
      `;
    }

    // Render the full card with layered SVG background + HTML text overlay
    const { model, labels, entities, dynamicColors, valueColor } = prepareRenderData(this._cardState, this._config);
    const handleEntityClick = (entityId: string) => {
      this.dispatchEvent(
        new CustomEvent('hass-more-info', {
          detail: { entityId },
          bubbles: true,
          composed: true,
        })
      );
    };

    return html`
      <ha-card>
        ${this._config.title
          ? html`<div class="card-header">${this._config.title}</div>`
          : ''
        }
        <div class="card-content">
          <div class="diagram-container">
            ${renderBackgroundSvg(this._cardState.fanSpeed)}
            ${renderTextOverlay(model, labels, entities, dynamicColors, valueColor, handleEntityClick)}
          </div>
        </div>
      </ha-card>
    `;
  }

  /**
   * Return card size for legacy Lovelace layout
   */
  public getCardSize(): number {
    return 4;
  }
}

// Register with Home Assistant's custom card registry
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'vallox-iv-card',
  name: CARD_NAME,
  description: CARD_DESCRIPTION,
  preview: true,
  documentationURL: 'https://github.com/your-repo/vallox-iv-card',
});

// Log registration
console.info(
  `%c ${CARD_NAME} %c v${CARD_VERSION} `,
  'color: white; background: #039be5; font-weight: 700;',
  'color: #039be5; background: white; font-weight: 700;'
);

// TypeScript declaration for custom element
declare global {
  interface HTMLElementTagNameMap {
    'vallox-iv-card': ValloxIvCard;
  }
}
