import { svg } from 'lit';
import type { Language, ValloxIvCardConfig, ValloxIvCardState } from '../shared/types';
import { numberText, operationName } from '../shared/localize';
import { getTemperatureColor } from '../shared/format';

export function airColor(value: number | null, model: ValloxIvCardState, config: ValloxIvCardConfig, surface: 'text' | 'flow' = 'text'): string {
  if (config.value_color) return config.value_color;
  if (config.enable_temp_colors === false) return 'var(--primary-text-color, #dce7ef)';
  if (value === null) return 'var(--secondary-text-color, #8293a3)';
  const custom = [config.temp_color_cold, config.temp_color_freeze, config.temp_color_neutral, config.temp_color_warm, config.temp_color_hot].some(color => color !== undefined);
  const defaults = { cold: '#559cff', freeze: '#30b5ff', neutral: '#ffb34d', warm: '#ff9353', hot: '#ff685b' };
  let color: string;
  if (custom) {
    // Preserve the existing temperature keyframes for configured palettes.
    color = getTemperatureColor(value, model.tempUnit, { cold: config.temp_color_cold ?? defaults.cold, freeze: config.temp_color_freeze ?? defaults.freeze, neutral: config.temp_color_neutral ?? defaults.neutral, warm: config.temp_color_warm ?? defaults.warm, hot: config.temp_color_hot ?? defaults.hot })!;
  } else {
    // Keep mild outdoor air visibly cool instead of blending blue and orange into grey.
    // The same temperature palette is used for all four streams; these are visual
    // keyframes, not recommended temperature setpoints.
    const celsius = model.tempUnit === '°F' ? (value - 32) * 5 / 9 : value;
    const stops: [number, string][] = [[-10, defaults.cold], [0, defaults.freeze], [15, '#36c8ec'], [22, defaults.neutral], [25, defaults.warm], [30, defaults.hot]];
    const upper = stops.findIndex(([temperature]) => celsius <= temperature);
    if (upper < 0) color = defaults.hot;
    else if (upper === 0) color = defaults.cold;
    else {
      const [low, lowColor] = stops[upper - 1], [high, highColor] = stops[upper];
      color = `color-mix(in srgb, ${lowColor}, ${highColor} ${100 * (celsius - low) / (high - low)}%)`;
    }
  }
  // Text follows the HA foreground for legibility on both light and dark cards.
  // Paths keep their saturation so the moving air remains easy to follow.
  return surface === 'flow' ? color : `color-mix(in srgb, ${color} 45%, var(--primary-text-color, #dce7ef))`;
}

export function renderCore(model: ValloxIvCardState, config: ValloxIvCardConfig, language: Language, id: string) {
  const bypass = model.operation === 'bypass' || (model.operation === 'defrost' && model.defrostMethod !== 'supply_stop');
  const knownBypass = model.operation === 'bypass' || (model.operation === 'defrost' && model.defrostMethod === 'bypass');
  const active = model.operation !== 'unknown' && model.operation !== 'stopped';
  // All modes share the same inlet, outlet, heater and core geometry.
  const supply = bypass ? 'M190 24 H159 Q146 24 146 37 Q146 42 152 48 L170 66 Q187 83 171 101 L121 153 Q108 167 90 167 H66 Q55 167 50 156 Q45 144 32 144 H10' : 'M190 24 H151 Q139 24 130 36 L53 133 Q44 144 28 144 H10';
  const extract = 'M10 24 L29 24 Q41 24 50 36 L127 133 Q137 144 151 144 L174 144';
  const colors = [model.extractTemp, model.exhaustTemp, model.outdoorTemp, model.supplyCellTemp].map(v => airColor(v, model, config, 'flow'));
  const efficiency = config.show_efficiency !== false && model.operation === 'heat_recovery' ? model.efficiency : null;
  const heaterX = 42, heaterY = 144;
  const frame = 'M88 13 L145 69 Q158 82 145 95 L88 153 L32 97 Q18 83 32 69 Z';
  return svg`<svg class="core-svg ${active ? 'flowing' : 'resting'} ${model.operation}" viewBox="0 0 208 190" role="img" aria-label=${operationName(model.operation, language)}>
    <defs>
      <linearGradient id=${`${id}-extract`} x1="0" y1="0" x2="1" y2="1"><stop stop-color=${colors[0]}/><stop offset="1" stop-color=${colors[1]}/></linearGradient>
      <linearGradient id=${`${id}-supply`} x1="1" y1="0" x2="0" y2="1"><stop stop-color=${colors[2]}/><stop offset="1" stop-color=${colors[3]}/></linearGradient>
      <linearGradient id=${`${id}-plate`} x1="0" y1="0" x2="1" y2="1"><stop stop-color=${model.operation === 'defrost' ? 'color-mix(in srgb, #c5eeff 25%, var(--core-plate-start, #253944))' : 'var(--core-plate-start, #253944)'}/><stop offset="1" stop-color=${model.operation === 'defrost' ? 'color-mix(in srgb, #85c5e2 12%, var(--core-plate-end, #14232d))' : 'var(--core-plate-end, #14232d)'}/></linearGradient>
      <marker id=${`${id}-arrow`} markerUnits="userSpaceOnUse" markerWidth="26" markerHeight="26" refX="19" refY="13" orient="auto"><path d="M0 0 L26 13 L0 26 L6 13 Z" fill="context-stroke"/></marker>
    </defs>
    <path class="core-frame" d=${frame} fill=${`url(#${id}-plate)`}/>
    ${Array.from({ length: 8 }, (_, i) => svg`<path class="fin" d=${`M${42 + i * 7} ${65 - i * 5} l48 49`}/>`)}
    ${knownBypass ? svg`<g class="bypass-gate">
      <title>${language === 'fi' ? 'Ohituksen reittimerkki. Pellin asentoa ei mitata.' : 'Bypass routing symbol. Damper position is not measured.'}</title>
      <path class="closed-channel" d="M140 30 L120 55"/>
      <path class="gate-seat" d="M124 36 L136 46"/>
      <path class="gate-bar" d="M124 36 L136 46"/>
    </g>` : ''}
    <g class="supply-channel">
      <path class="air-track" d=${supply}/>
      <path class=${`air-route supply-route ${model.supplyFlow ? '' : 'no-flow'}`} d=${supply} stroke=${`url(#${id}-supply)`} marker-end=${`url(#${id}-arrow)`}/>
      ${model.supplyFlow ? svg`<path class="air-motion supply-motion" d=${supply}/>` : ''}
    </g>
    <!-- The outlined extract channel passes over the supply route; the streams stay separate. -->
    <g class="extract-channel">
      <path class="air-track crossing-track" d=${extract}/>
      <path class=${`air-route extract-route ${model.extractFlow ? '' : 'no-flow'}`} d=${extract} stroke=${`url(#${id}-extract)`} marker-end=${`url(#${id}-arrow)`}/>
      ${model.extractFlow ? svg`<path class="air-motion extract-motion" d=${extract}/>` : ''}
    </g>
    ${config.show_post_heater !== false && config.post_heater ? svg`<g class=${`heater-symbol ${model.postHeaterActive === true ? 'active' : model.postHeaterActive === false ? 'inactive' : 'unavailable'}`} role="img" aria-label=${language === 'fi' ? `Vastus ${model.postHeaterActive === null ? 'ei tiedossa' : model.postHeaterActive ? 'lämmittää' : 'pois'}` : `Heater ${model.postHeaterActive === null ? 'unknown' : model.postHeaterActive ? 'heating' : 'off'}`}>
      <rect x=${heaterX-17} y=${heaterY-12} width="34" height="24" rx="6"/>
      ${model.postHeaterActive === null ? svg`<text x=${heaterX} y=${heaterY+5} text-anchor="middle">?</text>` : svg`<path d=${`M${heaterX-12} ${heaterY} l3 -5 4 10 4 -10 4 10 4 -10 3 5`}/>`}
    </g>` : ''}
    ${efficiency !== null ? svg`<rect class="efficiency-glass" x="51" y="63" width="78" height="41" rx="15"/><text class="core-value" x="90" y="90" text-anchor="middle">${numberText(efficiency, language, 0)}<tspan class="core-unit">%</tspan></text>` : model.operation !== 'defrost' ? svg`<circle class="core-center" cx="89" cy="83" r="15"/><path class="core-symbol" d=${model.operation === 'stopped' ? 'M84 77 L84 89 M94 77 L94 89' : 'M81 87 L97 79 M81 79 L97 87'}/>` : ''}
    ${model.operation === 'defrost' ? svg`<g class="thaw">
      <title>${language === 'fi' ? 'Jäinen sävy ja vesipisarat havainnollistavat sulatusta, eivät mitattua jäämäärää tai edistymistä.' : 'The icy tint and water drops illustrate defrost, not measured ice quantity or progress.'}</title>
      ${[[64,132],[88,156],[116,128]].map(([x,y],i) => svg`<g transform=${`translate(${x} ${y})`}><path class="melt-drop" style=${`animation-delay:${-i*1.45}s`} d="M0-7 C-1-3-4 0-4 3 A4 4 0 0 0 4 3 C4 0 1-3 0-7 Z"/></g>`)}
    </g>` : ''}
  </svg>`;
}
