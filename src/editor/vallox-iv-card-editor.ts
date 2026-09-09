import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, ValloxIvCardConfig } from '../shared/types';
import { languageOf, profileName, tr } from '../shared/localize';
import { validateConfig } from '../shared/validation';
import { fieldLabel, fieldSelector, SECTIONS, type Section } from './schema';
import { EDITOR_TAG } from '../shared/tags';

@customElement(EDITOR_TAG)
export class ValloxIvCardEditor extends LitElement {
  @property({attribute:false}) public hass?: HomeAssistant;
  @state() private _config?: ValloxIvCardConfig;
  @state() private _error = '';
  static styles = css`details{border:1px solid var(--divider-color,#8883);border-radius:12px;margin:12px 0;padding:0 14px 14px}summary{cursor:pointer;min-height:48px;display:flex;align-items:center;font-weight:500;font-size:14px}p{color:var(--secondary-text-color);font-size:13px;line-height:1.6}.error{color:var(--error-color,#f88)}`;
  public setConfig(config: ValloxIvCardConfig): void { this._config = { ...config }; }
  private _changed(section: Section, event: CustomEvent): void {
    event.stopPropagation();
    const data = Object.fromEntries(Object.entries(event.detail.value as Record<string,unknown>).filter(([,v])=>v !== undefined && v !== null && v !== ''));
    const current = this._config ?? { type:'custom:vallox-iv-card' };
    const config = section.key ? { ...current,[section.key]:data } : { ...current };
    if (!section.key) for (const field of section.fields) {
      if (field.name in data) (config as unknown as Record<string,unknown>)[field.name] = data[field.name];
      else delete (config as unknown as Record<string,unknown>)[field.name];
    }
    if (JSON.stringify(config) === JSON.stringify(current)) return;
    try { validateConfig(config); this._error = ''; }
    catch (error) { this._error = error instanceof Error ? error.message : String(error); return; }
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed',{ detail:{config},bubbles:true,composed:true }));
  }
  protected render() {
    if (!this.hass || !this._config) return nothing;
    const lang = languageOf(this.hass,this._config);
    const fan = this._config.fan_entity ? this.hass.states[this._config.fan_entity] : undefined;
    const supported: string[] = fan?.attributes.preset_modes ?? [];
    return html`<p>${tr(lang,'Valitse puhallin ja anturit. Takka on valinnainen. Ehdotukset eivät muuta laitteen asetuksia. Kausiohjaus tarvitsee erikseen käyttöönotettavan blueprintin.','Select the fan and sensors. Fireplace is optional. Suggestions never change settings. Seasonal control needs the separately installed blueprint.')}</p>
      ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}
      ${SECTIONS.map((section,i)=>html`<details ?open=${i === 0}><summary>${tr(lang,section.fi,section.en)}</summary>
        ${section.key === 'insights' ? html`<p>${tr(lang,'Valitse lämmitystapa. Muut rajat ovat valinnaisia: runsas vastuskäyttö havaitaan ilman omaa kulutustavoitetta tai vertailutasoa. Mukavuustoive on vain oma muistutuksesi, ei laitteen asetus tai lämpötilan alaraja.','Select your heating system. Other thresholds are optional: frequent heater use is detected without a daily budget or baseline. The comfort preference is only your reminder, not a device setting or minimum temperature.')}</p><p>${tr(lang,'Poikkeama omasta historiasta koskee kulutuksen ja sulatusajan muutoksia. Oletus 0,5 tarkoittaa yli 50 % nousua kolmella peräkkäisellä tunnilla saman profiilin ja samankaltaisen sään sekä puhallinpyynnön aikana. Se ei tarkoita, että aiempi kulutus olisi ollut järkevää.','Deviation from your history applies to changes in consumption and defrost time. The default 0.5 means an increase over 50% for three consecutive hours with the same profile and similar weather and fan request. It does not mean past consumption was sensible.')}</p>` : nothing}
        <ha-form .hass=${this.hass} .data=${section.key ? this._config![section.key] ?? {} : this._config}
        .schema=${section.fields.map(field=>({name:field.name,selector:field.name === 'modes' && supported.length ? {select:{multiple:true,options:supported.map(value=>({value,label:profileName(value,lang)}))}} : fieldSelector(field,lang)}))}
        .computeLabel=${(field:{name:string})=>fieldLabel(lang,field)} @value-changed=${(event:CustomEvent)=>this._changed(section,event)}></ha-form></details>`)}`;
  }
}
declare global { interface HTMLElementTagNameMap { 'vallox-iv-card-editor': ValloxIvCardEditor } }
