import { css, html, LitElement } from 'lit';

// Demo-only HA frame. Keeping the styles in its shadow root reproduces the
// cascade used by HA (including themes that add a translucent ::before layer).
// Contract: home-assistant/frontend/src/components/ha-card.ts.
class DemoHaCard extends LitElement {
  static styles = css`
    :host {
      display:block; position:relative; box-sizing:border-box;
      background:var(--ha-card-background,var(--card-background-color,white));
      backdrop-filter:var(--ha-card-backdrop-filter,none);
      box-shadow:var(--ha-card-box-shadow,none);
      border-radius:var(--ha-card-border-radius,var(--ha-border-radius-lg,12px));
      border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color,#e0e0e0));
      color:var(--primary-text-color);
    }
    :host-context(.glass) { background:transparent; isolation:isolate; }
    :host-context(.glass)::before {
      content:''; position:absolute; inset:0; z-index:-1; pointer-events:none;
      border-radius:inherit; background:rgba(28,29,33,.18);
      backdrop-filter:blur(10px) saturate(1.2);
    }
  `;
  protected render() { return html`<slot></slot>`; }
}
customElements.define('ha-card', DemoHaCard);
