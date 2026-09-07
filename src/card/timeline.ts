import { html, svg } from 'lit';
import type { EnergyAnalysis, Language, Operation } from '../shared/types';
import { numberText, operationName, profileName, tr } from '../shared/localize';
import { HOUR } from '../data/energy';

const stateColors: Record<Operation, string> = { heat_recovery: '#80cabb', bypass: '#7aaff0', cool_recovery: '#b499e2', defrost: '#e7ad6f', stopped: '#677885', unknown: '#39444b' };
export function renderTimeline(analysis: EnergyAnalysis, language: Language, zone: string) {
  const t = (fi: string, en: string) => tr(language, fi, en);
  const hours = analysis.hours.slice(-24);
  const profiles = [...new Set(hours.map(h => h.profile).filter((p): p is string => p !== null))];
  const profileCode = (profile: string | null) => profile === null ? '—' : profileName(profile,language).slice(0,2);
  const time = (value: number) => new Intl.DateTimeFormat(language, { timeZone: zone, hour: '2-digit', minute: '2-digit' }).format(value);
  const temps = hours.flatMap(h => [h.outdoor, h.supply, h.cell]).filter((v): v is number => v !== null);
  const min = Math.floor(Math.min(0, ...temps) / 5) * 5, max = Math.ceil(Math.max(20, ...temps) / 5) * 5;
  const powerMax = Math.max(100, ...hours.map(h => h.power ?? 0));
  const path = (values: (number | null)[], lower: number, upper: number) => {
    let connected = false;
    return values.map((value, i) => {
      if (value === null) { connected = false; return ''; }
      const command = connected ? 'L' : 'M'; connected = true;
      return `${command}${32 + i * 496 / Math.max(1, values.length - 1)} ${134 - (value - lower) / (upper - lower) * 112}`;
    }).join(' ');
  };
  const maxDay = Math.max(1, ...analysis.daily.map(d => d.kwh ?? 0));
  return html`
    <h3>${t('Lämpötilat ja teho · 24 h', 'Temperatures and power · 24 h')}</h3>
    <svg class="chart" viewBox="0 0 560 158" role="img" aria-label=${t('Tuntikeskiarvot. Tarkat luvut avattavassa taulukossa.', 'Hourly means. Values are available in the expandable table.')}>
      ${[0, .5, 1].map(r => svg`<line class="chart-grid" x1="32" y1=${134-r*112} x2="528" y2=${134-r*112}/><text x="0" y=${138-r*112}>${Math.round(min+r*(max-min))}°</text><text text-anchor="end" x="560" y=${138-r*112}>${Math.round(r*powerMax)}</text>`)}
      ${([{ key: 'outdoor', color: '#7aaff0' }, { key: 'cell', color: '#80cabb' }, { key: 'supply', color: '#e7ad6f' }] as const).map(line => svg`<path fill="none" stroke=${line.color} stroke-width="2" d=${path(hours.map(h => h[line.key]), min, max)}/>`)}
      <path fill="none" stroke="#b499e2" stroke-dasharray="4 3" stroke-width="1.7" d=${path(hours.map(h => h.power), 0, powerMax)}/>
      ${[0, 6, 12, 18, 23].filter(i => hours[i]).map(i => svg`<text x=${32+i*496/Math.max(1,hours.length-1)} y="155" text-anchor="middle">${time(hours[i].start)}</text>`)}
    </svg>
    <div class="legend"><span style="--swatch:#7aaff0">${t('Ulkoilma', 'Outdoor')} °C</span><span style="--swatch:#80cabb">${t('Kennon jälkeen', 'After core')} °C</span><span style="--swatch:#e7ad6f">${t('Tuloilma', 'Supply')} °C</span><span style="--swatch:#b499e2">${t('Teho (oikea asteikko)', 'Power (right axis)')} W</span></div>
    <div class="state-band" aria-label=${t('Kennon pääasiallinen tila tunneittain', 'Dominant core state by hour')}>${hours.map(h => html`<span style=${`--state-color:${stateColors[h.operation]}`} title=${`${time(h.start)} · ${operationName(h.operation, language)}`}></span>`)}</div>
    <div class="legend">${(['heat_recovery','bypass','cool_recovery','defrost','stopped','unknown'] as Operation[]).map(s => html`<span style=${`--swatch:${stateColors[s]}`}>${operationName(s,language)}</span>`)}</div>
    <p class="timeline-label">${t('Profiili','Profile')}</p>
    <div class="hour-band" aria-label=${t('Profiili tunneittain','Profile by hour')}>${hours.map(h => html`<span title=${`${time(h.start)} · ${profileName(h.profile,language)}`}>${profileCode(h.profile)}</span>`)}</div>
    <p class="timeline-label">${profiles.map(p => `${profileCode(p)} = ${profileName(p,language)}`).join(' · ')}</p>
    <p class="timeline-label">${t('Vastus aktiivinen · min/tunti, sisältää sulatukset','Heater active · minutes/hour, including defrost')}</p>
    <div class="hour-band heater-band" aria-label=${t('Vastuksen käyntiminuutit tunneittain','Heater active minutes by hour')}>${hours.map(h => html`<span class=${h.heaterActiveMinutes ? 'heater-on' : ''} title=${`${time(h.start)} · ${numberText(h.heaterActiveMinutes,language,0)} min`}>${numberText(h.heaterActiveMinutes,language,0)}</span>`)}</div>
    <h3>${t('Päivittäinen sähkö · 7 vrk', 'Daily electricity · 7 days')}</h3>
    <div class="day-bars">${analysis.daily.map(d => html`<div class="day"><span>${d.coverage >= .9 ? numberText(d.kwh, language) : '—'}</span><div class="bar" style=${`height:${d.coverage >= .9 && d.kwh !== null ? d.kwh/maxDay*68 : 2}px;opacity:${d.coverage >= .9 ? 1 : .25}`}></div><span>${d.date.slice(8)}.${d.date.slice(5,7)}</span></div>`)}</div>
    <p class="note">kWh · ${t('Puuttuvat tai vajaat päivät merkitään viivalla. Teho ja lämpötilat ovat tuntikeskiarvoja.', 'Missing or incomplete days are shown as dashes. Power and temperatures are hourly means.')}</p>
    <details><summary>${t('Avaa mittaustaulukko', 'Open measurement table')}</summary><div class="table-scroll"><table><thead><tr><th>${t('Aika','Time')}</th><th>${t('Tila','State')}</th><th>${t('Profiili','Profile')}</th><th>${t('Vastus min','Heater min')}</th><th>°C ${t('ulko','out')}</th><th>°C ${t('tulo','supply')}</th><th>W</th><th>kWh</th></tr></thead><tbody>${hours.map(h => html`<tr><td>${time(h.start)}–${time(h.start+HOUR)}</td><td>${operationName(h.operation,language)}</td><td>${profileName(h.profile,language)}</td><td>${numberText(h.heaterActiveMinutes,language,0)}</td><td>${numberText(h.outdoor,language)}</td><td>${numberText(h.supply,language)}</td><td>${numberText(h.power,language,0)}</td><td>${h.coverage >= .9 ? numberText(h.kwh,language,2) : '—'}</td></tr>`)}</tbody></table></div></details>`;
}
