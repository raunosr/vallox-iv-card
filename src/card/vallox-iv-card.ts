import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { EnergyAnalysis, GridOptions, HomeAssistant, Language, ValloxIvCardConfig } from '../shared/types';
import { validateConfig } from '../shared/validation';
import { getState } from '../shared/hass';
import { languageOf, numberText, operationDescription, operationName, profileName, seasonStatus, tr } from '../shared/localize';
import { deriveCardState } from './vallox-iv-card.logic';
import { airColor, renderCore } from './core';
import { icon } from './icons';
import { cardStyles } from './vallox-iv-card.styles';
import { renderTimeline } from './timeline';
import { loadHistory } from '../data/history';
import { analyzeEnergy } from '../data/energy';
import { insightsFor } from '../data/insights';
import { selectProfile, setRunning } from '../data/actions';
import { version } from '../../package.json';
import { CARD_TAG, EDITOR_TAG } from '../shared/tags';
import '../editor/vallox-iv-card-editor';

let instance = 0;
@customElement(CARD_TAG)
export class ValloxIvCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: ValloxIvCardConfig;
  @state() private _height = 376;
  @state() private _width = 400;
  @state() private _analysis?: EnergyAnalysis;
  @state() private _historyError = false;
  @state() private _busy = false;
  @state() private _actionError = '';
  @state() private _tab: 'energy' | 'insights' | 'controls' = 'energy';
  @state() private _minutes = 30;
  private _id = `vallox-${++instance}`;
  private _observer?: ResizeObserver;
  private _interval?: ReturnType<typeof setInterval>;
  private _fetchedAt = 0;
  private _generation = 0;
  private _loading = false;
  static styles = cardStyles;

  public setConfig(config: unknown): void { this._config = validateConfig(config); }
  public getGridOptions(): GridOptions { return { columns: 12, rows: this._config?.compact ? 4 : 6, min_columns: 6, min_rows: 4 }; }
  public getCardSize(): number { return this._config?.compact ? 4 : 6; }
  public static getConfigElement() { return document.createElement(EDITOR_TAG); }
  public static getStubConfig() { return { type: `custom:${CARD_TAG}`, config_version: 2 }; }
  public connectedCallback(): void {
    super.connectedCallback();
    this._observer = new ResizeObserver(entries => { const rect = entries[0].contentRect; if (rect.height > 0) this._height = rect.height; this._width = rect.width; });
    this._observer.observe(this);
    this._interval = setInterval(() => { if (document.visibilityState === 'visible') void this._refresh(); }, 300000);
    document.addEventListener('visibilitychange', this._visibilityChanged);
  }
  public disconnectedCallback(): void { super.disconnectedCallback(); this._observer?.disconnect(); clearInterval(this._interval); document.removeEventListener('visibilitychange', this._visibilityChanged); this._generation++; this._loading = false; }
  private _visibilityChanged = () => { if (document.visibilityState === 'visible') void this._refresh(); };
  protected willUpdate(changes: PropertyValues): void {
    if (changes.has('_config')) { this._generation++; this._fetchedAt = 0; this._loading = false; this._analysis = undefined; this._historyError = false; }
    if (changes.has('hass') || changes.has('_config')) void this._refresh();
  }
  private async _refresh(force = false): Promise<void> {
    if (!this.hass || !this._config || this._loading || (!force && Date.now() - this._fetchedAt < 300000)) return;
    this._loading = true;
    const generation = this._generation, now = Date.now(), config = this._config, hass = this.hass;
    try {
      const history = await loadHistory(hass, config, now);
      if (generation !== this._generation || !this.isConnected) return;
      this._analysis = analyzeEnergy(history, config, now, hass.config?.time_zone ?? 'UTC');
      this._historyError = false;
    } catch { if (generation === this._generation) this._historyError = true; }
    finally { if (generation === this._generation) { this._loading = false; this._fetchedAt = now; } }
  }
  private get _language(): Language { return languageOf(this.hass, this._config); }
  private _t(fi: string, en: string): string { return tr(this._language, fi, en); }
  private _n(value: number | null | undefined, digits = 1): string { return numberText(value, this._language, digits); }
  private _moreInfo(entity?: string): void { if (entity) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: entity }, bubbles: true, composed: true })); }
  private async _open(tab: 'energy' | 'insights' | 'controls' = 'energy'): Promise<void> {
    this._tab = tab; await this.updateComplete;
    const dialog = this.renderRoot.querySelector('dialog');
    if (dialog && !dialog.open) dialog.showModal();
  }
  private async _command(action: () => Promise<unknown>): Promise<void> {
    if (this._busy) return;
    this._busy = true; this._actionError = '';
    try { await action(); }
    catch (error) { this._actionError = this._t('Ohjaus epäonnistui. Tarkista laitteen ja ohjausskriptin saatavuus.', 'The command failed. Check unit and control script availability.'); await this._open('controls'); console.warn('Vallox IV Card command failed', error); }
    finally { this._busy = false; }
  }
  private async _tabKey(event: KeyboardEvent): Promise<void> {
    const tabs = ['energy', 'insights', 'controls'] as const;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = tabs.indexOf(this._tab);
    this._tab = tabs[event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3];
    await this.updateComplete;
    this.renderRoot.querySelector<HTMLButtonElement>(`#${this._id}-${this._tab}`)?.focus();
  }

  protected render() {
    if (!this._config || !this.hass) return html`<ha-card><div class="surface"><p>${this._t('Valitse Valloxin anturit kortin asetuksista.', 'Select your Vallox sensors in the card settings.')}</p></div></ha-card>`;
    const config = this._config, hass = this.hass, model = deriveCardState(hass, config), lang = this._language;
    const insights = insightsFor(model, this._analysis, config, lang);
    const notice = insights.some(i => i.level === 'notice');
    const compact = config.compact || this._height < 330 || (this._width < 360 && model.availableModes.length > 3 && this._height < 430);
    const tiny = this._height < 210 || (this._width < 360 && model.availableModes.length > 3 && this._height < 310);
    const profile = profileName(model.profile, lang);
    const timed = ['boost','fireplace','extra'].includes(model.profile?.toLowerCase() ?? '');
    const description = model.operation === 'defrost' ? model.defrostMethod === 'bypass' ? this._t('Poistoilma sulattaa kennoa. Tuloilma kulkee ohituksen ja lämmittimen kautta.', 'Extracted air thaws the core. Supply air takes the bypass and heater route.') : model.defrostMethod === 'supply_stop' ? this._t('Poistoilma sulattaa kennoa. Tuloilmapuhallin on pysäytetty sulatuksen ajaksi.', 'Extracted air thaws the core. The supply fan is stopped during defrost.') : this._t('Poistoilma sulattaa kennoa. Tuloilman kulkua ei ole varmennettu: valitse puhaltimien kierroslukuanturit.', 'Extracted air thaws the core. Supply airflow is unconfirmed: select the fan RPM sensors.') : operationDescription(model.operation,lang);
    const efficiencyLabel = config.label_efficiency ?? (model.efficiencyKind === 'supply' ? this._t('Tuloilman lämpötilahyötysuhde', 'Supply temperature efficiency') : model.efficiencyKind === 'extract' ? this._t('Poistoilman hyötysuhde', 'Extract efficiency') : this._t('Hyötysuhde · anturi', 'Efficiency · sensor'));
    const heaterState = model.postHeaterActive === null ? '?' : model.postHeaterActive ? this._t('lämmittää','heating') : this._t('pois','off');
    const reading = (label: string, value: string, alert = '') => html`<span class=${`reading ${alert}`} title=${`${label} ${value}`}><span class="reading-label">${label}</span> <span class="reading-value">${value}</span></span>`;
    const air = (key: string, label: string, value: number | null, id?: string, helper?: string) => html`<button class=${`air ${key} ${['outdoor','exhaust'].includes(key) ? 'right' : ''}`} @click=${() => this._moreInfo(id)} aria-label=${`${label} ${this._n(value)} ${model.tempUnit}`}><span class="air-label">${label}</span><span class="air-value" style=${styleMap({ color: airColor(value,model,config) })}>${this._n(value)}<span class="unit">${value !== null ? model.tempUnit : ''}</span></span>${helper ? html`<span class="air-helper">${helper}</span>` : nothing}
      ${key === 'extract' ? html`<span class="air-quality">${config.show_co2 !== false && config.co2 ? reading('CO₂',`${this._n(model.co2,0)} ppm`,model.co2 !== null && model.co2 > (config.co2_limit ?? 1000) ? `co2-high ${config.enable_co2_blink ? 'co2-blink' : ''}` : '') : nothing}${config.show_humidity !== false && config.humidity ? reading(config.label_humidity ?? this._t('Kosteus','Humidity'),`${this._n(model.humidity,0)} %`) : nothing}</span>` : nothing}
      ${key === 'supply' ? html`<span class=${`supply-chain ${model.postHeaterActive ? 'heater-on' : ''}`}>${config.show_supply_cell_temp !== false && config.supply_cell_temp ? reading(this._t('Kennolta','After core'),`${this._n(model.supplyCellTemp)}°`) : nothing}${config.show_post_heater !== false && config.post_heater ? reading(this._t('Vastus','Heater'),heaterState) : nothing}</span>` : nothing}
    </button>`;
    const energyAvailable = model.energy !== null;
    return html`<ha-card>
      <div class=${`surface ${compact ? 'compact' : ''} ${this._height < 480 ? 'dense' : ''} ${tiny ? 'tiny' : ''} ${model.availableModes.length > 3 ? 'many' : ''} ${model.operation}`} style=${styleMap({ '--value-scale': String((config.value_font_size ?? 48)/48), '--unit-opacity': String(config.unit_opacity ?? .65), '--value-weight': String(config.font_weight ?? 600), '--mode-count': String(Math.max(1,model.availableModes.length)), '--co2-color': config.co2_alert_color ?? '#e6ae75' })}>
        <header class="top"><div class="identity"><div class="eyebrow"><span class="dot"></span>${config.title ?? 'VALLOX'} ${config.show_fan_speed !== false && model.fanSpeed !== null ? html`<span class="fan-readout">${icon('fan')} ${config.label_fan_speed ?? this._t('Puhallin','Fan')} ${this._n(model.fanSpeed,0)} %</span>` : nothing}</div><h2>${config.show_cell_state !== false ? operationName(model.operation,lang) : this._t('Ilmanvaihto','Ventilation')}</h2></div>
          <button class="profile-chip" data-profile=${model.profile?.toLowerCase() ?? ''} data-running=${String(model.running === true)} aria-label=${this._t('Avaa ohjaus ja lisätiedot','Open controls and details')} @click=${() => this._open('controls')}>${icon(model.profile ?? 'info')}${config.show_profile !== false ? profile : this._t('Lisää','More')}${timed ? html`<span>· ${model.duration === 65535 ? '∞' : model.duration === null ? '—' : `${this._n(model.duration,0)}′`}</span>` : nothing}</button></header>
        ${config.show_cell_state !== false ? html`<p class="description" title=${description}>${description}</p>` : nothing}
        <div class="scene">
          ${air('extract',config.label_extract_air ?? this._t('Poistoilma','Extract air'),model.extractTemp,config.extract_air_temp,this._t('Huoneista →','From rooms →'))}
          ${air('outdoor',config.label_outdoor_air ?? this._t('Ulkoilma','Outdoor air'),model.outdoorTemp,config.outdoor_air_temp,this._t('← Ulkoa','← From outside'))}
          <div class="core">${renderCore(model,config,lang,this._id)}<span class="efficiency-label" aria-hidden=${config.show_efficiency === false || model.operation !== 'heat_recovery' ? 'true' : 'false'}>${efficiencyLabel}${model.efficiencyEstimated ? this._t(' · arvio',' · estimate') : ''}</span></div>
          ${air('supply',config.label_supply_air ?? this._t('Tuloilma','Supply air'),model.supplyTemp,config.supply_air_temp,this._t('← Huoneisiin','← To rooms'))}
          ${air('exhaust',config.label_exhaust_air ?? this._t('Jäteilma','Exhaust air'),model.exhaustTemp,config.exhaust_air_temp,this._t('Ulos →','To outside →'))}
        </div>
        ${model.availableModes.length ? html`<nav class="modes" aria-label=${this._t('Ilmanvaihdon profiili','Ventilation profile')}>${model.availableModes.map(mode => html`<button class="mode" data-profile=${mode.toLowerCase()} aria-pressed=${String(model.running !== false && model.profile?.toLowerCase() === mode.toLowerCase())} ?disabled=${this._busy || model.running === null} @click=${() => this._command(() => selectProfile(hass,config,mode))}>${icon(mode)}<span>${profileName(mode,lang)}</span></button>`)}</nav>` : nothing}
        <button class="footer" @click=${() => this._open(notice ? 'insights' : 'energy')} aria-label=${this._t('Avaa energia ja havainnot','Open energy and insights')}>${icon('energy')}${model.power !== null ? html`<span class="energy-value">${this._n(model.power,0)} W</span>` : nothing}<span class="footer-text">${energyAvailable && this._analysis?.today !== null && this._analysis?.today !== undefined ? html`<span class="energy-value">${this._n(this._analysis.today)} kWh</span> ${this._t('tänään','today')}` : !energyAvailable ? this._t('Energiamittaus puuttuu','Energy measurement unavailable') : this._historyError ? this._t('Historiaa ei saatu','History unavailable') : !this._analysis ? this._t('Ladataan historiaa…','Loading history…') : this._t('Kulutushistoria ei vielä riitä','More energy history needed')}</span>${notice ? html`<span class="notice-dot"></span>` : nothing}<span class="arrow">↗</span></button>
      </div>
    </ha-card>
    <dialog @click=${(event: MouseEvent) => { if (event.target === event.currentTarget) (event.currentTarget as HTMLDialogElement).close(); }}>
      <header class="dialog-header"><h2>${config.title ?? this._t('Vallox · ilmanvaihto','Vallox · ventilation')}</h2><button class="close" aria-label=${this._t('Sulje','Close')} @click=${() => this.renderRoot.querySelector('dialog')?.close()}>×</button></header>
      <div class="tabs" role="tablist" @keydown=${this._tabKey}>${(['energy','insights','controls'] as const).map(tab => html`<button role="tab" tabindex=${this._tab === tab ? 0 : -1} id=${`${this._id}-${tab}`} aria-controls=${`${this._id}-panel`} aria-selected=${String(this._tab === tab)} @click=${() => this._tab = tab}>${tab === 'energy' ? this._t('Energia','Energy') : tab === 'insights' ? this._t('Havainnot','Insights') : this._t('Ohjaus','Controls')}${tab === 'insights' && notice ? ' ·' : ''}</button>`)}</div>
      <div class="dialog-body" id=${`${this._id}-panel`} role="tabpanel" aria-labelledby=${`${this._id}-${this._tab}`}>
        ${this._actionError ? html`<p class="error-inline" role="alert">${this._actionError}</p>` : nothing}
        ${this._tab === 'energy' ? html`
          <div class="stat-grid"><div class="stat"><small>${this._t('Teho nyt','Power now')}</small><b>${this._n(model.power,0)}</b> W</div><div class="stat"><small>${this._t('Tänään','Today')}</small><b>${energyAvailable ? this._n(this._analysis?.today) : '—'}</b> kWh</div><div class="stat"><small>24 h</small><b>${energyAvailable ? this._n(this._analysis?.last24h) : '—'}</b> kWh</div></div>
          ${!energyAvailable ? html`<p class="note">${this._t('Energiamittaus puuttuu. Kulutusta ei arvioida vastuksen tilasta.','Energy measurement is unavailable. Consumption is not estimated from heater state.')}</p>` : nothing}
          ${this._historyError ? html`<p class="note">${this._t('Historiaa ei saatu Home Assistantista. Tarkista Recorder ja käyttöoikeudet.','History could not be loaded. Check Recorder and access permissions.')}</p><button class="action" @click=${() => this._refresh(true)}>${this._t('Yritä uudelleen','Retry')}</button>` : this._analysis ? renderTimeline(this._analysis,lang,hass.config?.time_zone ?? 'UTC') : html`<p class="note">${this._t('Ladataan historiaa…','Loading history…')}</p>`}
          ${this._analysis ? html`<p class="note">${this._t('Sulatusten aikana (24 h)','During defrost (24 h)')}: ${this._n(this._analysis.defrostMinutes,0)} min · ${energyAvailable ? this._n(this._analysis.defrostKwh,2) : '—'} kWh. ${this._t('Tämä on koko laitteen sähkö kyseisiltä jaksoilta, ei sulatuksen erillinen lisäkulutus.','This is whole-unit electricity during those intervals, not the incremental cost of defrost.')}</p>` : nothing}
        ` : this._tab === 'insights' ? html`
          <p class="note">${this._t('Havainnot ovat ehdotuksia omaa harkintaasi varten. Kortti ei muuta lämpötila- tai sulatusasetuksia.','Findings are suggestions for your own assessment. The card does not change temperature or defrost settings.')}</p>
          ${insights.length ? insights.map(i => html`<article class=${`insight ${i.level}`}><h3>${i.title}</h3><p>${i.observation}</p><p>${i.suggestion}</p><p class="limitation">${i.limitation}</p>${i.source ? html`<a href=${i.source} target="_blank" rel="noopener noreferrer">${this._t('Valmistajan ohje ↗','Manufacturer guidance ↗')}</a>` : nothing}</article>`) : html`<p class="note">${this._t('Ei näytettäviä ehdotuksia. Tämä ei yksin vahvista laitteen kuntoa.','No suggestions to display. This alone does not establish the condition of the unit.')}</p>`}
        ` : html`
          <div class="status-box">${operationName(model.operation,lang)}<br>${description}<br>${this._t('Kennon jälkeen','After the core')}: ${this._n(model.supplyCellTemp)} ${model.tempUnit} → ${this._t('Vastus','Heater')} ${heaterState} → ${this._n(model.supplyTemp)} ${model.tempUnit}</div>
          ${timed ? html`<p class="note">${this._t('Laitteen ajastinta jäljellä','Unit timer remaining')}: ${model.duration === 65535 ? '∞' : `${this._n(model.duration,0)} min`}. ${this._t('Ajastus toimii myös kortin ollessa suljettuna.','The timer runs even when the card is closed.')}</p>` : nothing}
          ${config.profile_action_script ? html`<div class="control-row"><label for="duration">${this._t('Kesto (min)','Duration (min)')}</label><input id="duration" type="number" min="1" max="65534" step="1" .value=${String(this._minutes)} @change=${(e: Event) => this._minutes = Number((e.target as HTMLInputElement).value)}>${model.availableModes.filter(m => ['boost','fireplace'].includes(m.toLowerCase())).map(m => html`<button class="action" ?disabled=${this._busy || model.running === null || !Number.isInteger(this._minutes) || this._minutes < 1 || this._minutes > 65534} @click=${() => this._command(() => selectProfile(hass,config,m,true,this._minutes))}>${profileName(m,lang)} · ${this._t('aloita alusta','restart')}</button>`)}</div>` : html`<p class="note">${this._t('Tehostus ja takkaprofiili käyttävät laitteen tallentamaa kestoa. Vapaavalintainen kesto vaatii ohjausblueprintin.','Boost and fireplace use the duration stored in the unit. A custom duration requires the control blueprint.')}</p>`}
          ${this._renderSeasonal()}
          ${config.filter_remaining ? html`<h3>${this._t('Suodattimet','Filters')}</h3><button class="action" @click=${() => this._moreInfo(config.filter_remaining)}>${hass.states[config.filter_remaining]?.attributes.friendly_name ?? this._t('Suodattimien tila','Filter status')}: ${getState(hass,config.filter_remaining) ?? '—'} ${hass.states[config.filter_remaining]?.attributes.unit_of_measurement ?? ''}</button>` : nothing}
          ${config.fan_entity ? html`<h3>${this._t('Laitteen ohjaus','Unit control')}</h3><button class="action" ?disabled=${this._busy || model.running === null} @click=${() => this._command(() => setRunning(hass,config,!model.running))}>${model.running === false ? this._t('Käynnistä ilmanvaihto','Start ventilation') : this._t('Pysäytä ilmanvaihto','Stop ventilation')}</button><button class="action" @click=${() => this._moreInfo(config.fan_entity)}>${this._t('Avaa laitteen tiedot','Open unit details')}</button>` : nothing}
        `}
      </div>
    </dialog>`;
  }
  private _renderSeasonal() {
    const config = this._config!, hass = this.hass!, seasonal = config.seasonal;
    if (!seasonal?.mode_entity) return nothing;
    const mode = hass.states[seasonal.mode_entity];
    const options: string[] = Array.isArray(mode?.attributes.options) ? mode.attributes.options : [];
    const names: Record<string,string> = { Off: this._t('Pois käytöstä','Off'), Auto: this._t('Automaatti','Automatic'), Winter: this._t('Talvi','Winter'), Summer: this._t('Kesä','Summer') };
    const status = getState(hass,seasonal.status_entity);
    return html`<h3>${this._t('Kausiohjaus','Seasonal control')}</h3><div class="control-row"><label for="season">${this._t('Ohjaustapa','Control mode')}</label><select id="season" .value=${mode?.state ?? ''} ?disabled=${this._busy || !getState(hass,seasonal.mode_entity)} @change=${(e: Event) => this._command(() => hass.callService('input_select','select_option',{ entity_id: seasonal.mode_entity, option: (e.target as HTMLSelectElement).value }))}>${options.map(o => html`<option value=${o}>${names[o] ?? o}</option>`)}</select></div><p class="note">${this._t('Ulkolämpötilan 24 h keskiarvo','24 h mean outdoor temperature')}: ${getState(hass,seasonal.mean_entity) ?? '—'} °C<br>${this._t('Talvilukko','Winter lock')}: ${getState(hass,seasonal.bypass_lock_entity) ?? '—'}<br>${seasonStatus(status,this._language,hass.config?.time_zone ?? 'UTC')}</p><p class="note">${this._t('Kesä vapauttaa lukon. Vallox päättää kennon ohituksesta ja viileyden talteenotosta.','Summer releases the lock. Vallox decides when to bypass the core or recover cool air.')}</p>`;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({ type: CARD_TAG, name: 'Vallox IV Card', description: 'Airflow, controls and measured energy — locally in Home Assistant', preview: true, documentationURL: 'https://github.com/raunosr/vallox-iv-card' });
console.info(`Vallox IV Card ${version}`);
declare global { interface HTMLElementTagNameMap { 'vallox-iv-card': ValloxIvCard } }
