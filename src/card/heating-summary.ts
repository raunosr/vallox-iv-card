import { html, nothing } from 'lit';
import type { EnergyAnalysis, Language } from '../shared/types';
import { numberText, tr } from '../shared/localize';

export function renderHeatingSummary(analysis: EnergyAnalysis, language: Language, energyAvailable: boolean) {
  const t = (fi: string, en: string) => tr(language,fi,en);
  const n = (value: number | null, decimals = 0) => numberText(value,language,decimals);
  const usage = analysis.heater24h;
  const duration = (minutes: number | null) => {
    if (minutes === null) return html`— <small>min</small>`;
    const total = Math.round(minutes), hours = Math.floor(total/60), rest = total%60;
    return html`${hours ? html`${n(hours)} <small>h</small> ` : nothing}${rest || !hours ? html`${n(rest)} <small>min</small>` : nothing}`;
  };
  return html`<section class="heating-summary" aria-label=${t('Jälkilämmityksen käyttö','Post-heater use')}>
    <h3>${t('Mihin vastusta käytettiin? · 24 h','When was the heater used? · 24 h')}</h3>
    <dl class="heating-readings">
      <div><dt>${t('Vastus käytössä yhteensä','Total heater runtime')}</dt><dd>${duration(usage.activeMinutes)}</dd></div>
      <div><dt>${t('Tuloilman lämmitys ilman sulatuksia','Supply heating outside defrost')}</dt><dd>${duration(usage.heatingMinutes)}</dd></div>
      <div><dt>${t('Vastus käytössä sulatusten aikana','Heater active during defrost')}</dt><dd>${duration(usage.defrostMinutes)}</dd></div>
      <div class="heating-electricity"><dt>${t('Laitteen sähkö tuloilman lämmitysjaksoilla','Unit electricity during supply heating')}</dt><dd>${energyAvailable ? n(usage.heatingKwh,2) : '—'} <small>kWh</small></dd></div>
      <div><dt>${t('Tuloilma − kennon jälkeen, keskimäärin','Supply − after core, average')}</dt><dd>${n(usage.meanLift,1)} <small>°C</small></dd></div>
    </dl>
    <p class="note">${t('Sähkö ja lämpötilaero koskevat vastuksen käyttöjaksoja sulatusten ulkopuolella. kWh-luku sisältää koko laitteen, myös puhaltimet. Lämpötilaero ei ole lämpötehon mittaus.', 'Electricity and temperature difference cover heater-active intervals outside defrost. The kWh value includes the whole unit, including fans. The temperature difference is not a heat-output measurement.')}</p>
    <p class="heating-recent">${t('Viimeiset 6 h: vastus käytössä','Last 6 h: heater active')} <strong>${n(analysis.heaterShare === null ? null : analysis.heaterShare*100)} %</strong> ${t('tunnetusta käyntiajasta ilman sulatuksia.','of known running time excluding defrost.')}</p>
    ${usage.coverage < .9 ? html`<p class="note">${t('Vastuksen ja toimintatilan 24 h historiakattavuus','24 h heater and operating-state coverage')}: ${n(usage.coverage*100)} %. ${t('Yhteenveto tarvitsee vähintään 90 %. Puuttuva tieto ei tarkoita, ettei vastus olisi lämmittänyt.', 'The summary needs at least 90%. Missing data does not mean the heater was off.')}</p>` : usage.heatingMinutes === 0 ? html`<p class="note">${t('Vastuksen käyttöä ei havaittu sulatusten ulkopuolella. Näiden lämmitysjaksojen sähköä tai lämpötilaeroa ei ole näytettäväksi.', 'No heater use was observed outside defrost. There are no such heating intervals to report electricity or temperature difference for.')}</p>` : usage.heatingKwh === null || !energyAvailable ? html`<p class="note">${t('Lämmitysjaksojen sähkönkulutukseen ei ole riittävää mittausta. Käyntiaika voidaan silti näyttää tilahistoriasta.', 'Electricity during heating intervals is not sufficiently measured. Runtime can still be shown from state history.')}</p>` : nothing}
  </section>`;
}
