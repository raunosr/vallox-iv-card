import type { EnergyAnalysis, HeaterUsage, History, Hour, Operation, Sample, ValloxIvCardConfig } from '../shared/types';
import { booleanState, energyValue, operationOf, powerValue, temperature } from '../card/vallox-iv-card.logic';

export const HOUR = 3600000;
const MINUTE = 60000;
const MAX_METER_GAP = 15 * MINUTE;
export function numeric(state?: string): number | null {
  if (state === undefined || state.trim() === '') return null;
  const value = Number(state);
  return Number.isFinite(value) ? value : null;
}
export function at(samples: Sample[], time: number): Sample | undefined {
  let lo = 0, hi = samples.length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (samples[mid].time <= time) lo = mid + 1; else hi = mid; }
  return samples[lo - 1];
}
export function dayKey(time: number, zone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(time);
}
export function midnight(time: number, zone: string): number {
  const date = dayKey(time, zone);
  let candidate = Date.parse(`${date}T00:00:00Z`);
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  for (let i = 0; i < 4; i++) {
    const p = Object.fromEntries(parts.formatToParts(candidate).map(x => [x.type, x.value]));
    const rendered = Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);
    candidate += Date.parse(`${date}T00:00:00Z`) - rendered;
  }
  return candidate;
}

interface Segment { start: number; end: number; kwh: number }
/** Do not allocate counter jumps over gaps, unit changes, resets or unavailable readings. */
export function energySegments(samples: Sample[]): Segment[] {
  const segments: Segment[] = [];
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1], b = samples[i];
    const av = energyValue(numeric(a.state), a.unit ?? ''), bv = energyValue(numeric(b.state), b.unit ?? '');
    if (av === null || bv === null || b.time <= a.time || b.time - a.time > MAX_METER_GAP || a.unit !== b.unit || bv < av) continue;
    segments.push({ start: a.time, end: b.time, kwh: bv - av });
  }
  return segments;
}
export function consumption(segments: Segment[], start: number, end: number): { kwh: number | null; coverage: number } {
  if (end <= start) return { kwh: null, coverage: 0 };
  let sum = 0, covered = 0;
  for (const segment of segments) {
    if (segment.end <= start || segment.start >= end) continue;
    const span = Math.min(segment.end, end) - Math.max(segment.start, start);
    covered += span; sum += segment.kwh * span / (segment.end - segment.start);
  }
  const coverage = Math.min(1, covered / (end - start));
  return { kwh: covered ? sum : null, coverage };
}

/** Split at recorded state boundaries, never infer heater electricity from its rating.
 * Energy is the whole unit's measured electricity DURING non-defrost heating.
 * Temperature lift is a measured difference, not heat output or heater-only energy.
 */
function heaterUsage(history: History, config: ValloxIvCardConfig, meter: Segment[], start: number, end: number): HeaterUsage {
  const ids = [config.post_heater, config.cell_state, config.fan_entity, config.supply_cell_temp, config.supply_air_temp];
  const read = (id: string | undefined, time: number) => at(id ? history[id] ?? [] : [], time);
  const boundaries = [...new Set([start, end, ...ids.flatMap(id => id ? (history[id] ?? []).filter(s => s.time > start && s.time < end).map(s => s.time) : [])])].sort((a,b) => a-b);
  let known = 0, active = 0, heating = 0, defrost = 0, normal = 0, kwh = 0, energyCovered = 0, lift = 0, liftCovered = 0;
  for (let i = 1; i < boundaries.length; i++) {
    const a = boundaries[i-1], b = boundaries[i], span = b-a;
    const heater = booleanState(read(config.post_heater,a)?.state ?? null);
    const fan = read(config.fan_entity,a);
    const running = booleanState(fan?.state ?? null);
    const operation = running === false ? 'stopped' : operationOf(read(config.cell_state,a)?.state ?? null);
    if (heater === null || operation === 'unknown' || (config.fan_entity && running === null)) continue;
    known += span;
    if (heater) active += span;
    if (operation === 'defrost') { if (heater) defrost += span; continue; }
    if (operation === 'stopped') continue;
    normal += span;
    if (!heater) continue;
    heating += span;
    const energy = consumption(meter,a,b);
    kwh += energy.kwh ?? 0; energyCovered += span * energy.coverage;
    const c = read(config.supply_cell_temp,a), s = read(config.supply_air_temp,a);
    const cell = temperature(numeric(c?.state),c?.unit ?? ''), supply = temperature(numeric(s?.state),s?.unit ?? '');
    if (config.supply_cell_temp !== config.supply_air_temp && cell !== null && supply !== null) {
      lift += (supply-cell) * span; liftCovered += span;
    }
  }
  const coverage = known / (end-start), ready = coverage >= .9;
  const energyCoverage = heating > 0 ? energyCovered/heating : 0;
  return { coverage, activeMinutes: ready ? active/MINUTE : null, heatingMinutes: ready ? heating/MINUTE : null,
    defrostMinutes: ready ? defrost/MINUTE : null, heatingShare: ready && normal >= HOUR ? heating/normal : null,
    heatingKwh: ready && heating > 0 && energyCoverage >= .9 ? kwh : null, heatingEnergyCoverage: energyCoverage,
    meanLift: ready && heating > 0 && liftCovered/heating >= .9 ? lift/liftCovered : null };
}

export function analyzeEnergy(history: History, config: ValloxIvCardConfig, now: number, zone = 'UTC'): EnergyAnalysis {
  const series = (id?: string) => id ? history[id] ?? [] : [];
  const meter = energySegments(series(config.energy?.energy_entity));
  const rawCell = series(config.cell_state), rawHeater = series(config.post_heater);
  const start = Math.floor((now - 8 * 24 * HOUR) / HOUR) * HOUR;
  const hours: Hour[] = [];
  const read = (id: string | undefined, time: number) => at(series(id), time);
  let defrostKwh = 0, defrostEnergyCovered = 0, defrostTotal = 0;
  for (let t = start; t < now; t += HOUR) {
    const end = Math.min(now, t + HOUR);
    let outdoor = 0, outdoorN = 0, supply = 0, supplyN = 0, cell = 0, cellN = 0, fan = 0, fanN = 0;
    let defrostMinutes = 0, heaterMinutes = 0, heaterActiveMinutes = 0, heaterKnownMinutes = 0, normalMinutes = 0, contextMinutes = 0, operationMinutes = 0, watts = 0, wattsN = 0;
    const profiles = new Map<string, number>(), operations = new Map<Operation, number>();
    for (let m = t; m < end; m += MINUTE) {
      const width = Math.min(MINUTE, end - m) / MINUTE;
      const time = m + width * MINUTE / 2;
      const f = read(config.fan_entity, time);
      const powerSample = read(config.energy?.power_entity, time);
      const power = powerValue(numeric(powerSample?.state), powerSample?.unit ?? '');
      if (power !== null) { watts += power * width; wattsN += width; }
      const raw = read(config.cell_state, time);
      const operation = f?.state === 'off' ? 'stopped' : operationOf(raw?.state ?? null);
      const heater = booleanState(read(config.post_heater, time)?.state ?? null);
      if (heater !== null) heaterKnownMinutes += width;
      if (heater === true) heaterActiveMinutes += width;
      operations.set(operation, (operations.get(operation) ?? 0) + width);
      const p = read(config.profile, time)?.state ?? (typeof f?.attributes?.preset_mode === 'string' ? f.attributes.preset_mode : undefined);
      if (p && !['unknown', 'unavailable'].includes(p)) profiles.set(p, (profiles.get(p) ?? 0) + width);
      const fanValue = numeric(read(config.fan_speed, time)?.state) ?? (typeof f?.attributes?.percentage === 'number' ? f.attributes.percentage : null);
      if (fanValue !== null) { fan += fanValue * width; fanN += width; }
      const temp = (id?: string) => { const r = read(id, time); return temperature(numeric(r?.state), r?.unit ?? ''); };
      const o = temp(config.outdoor_air_temp), s = temp(config.supply_air_temp), c = temp(config.supply_cell_temp);
      if (o !== null) { outdoor += o * width; outdoorN += width; }
      if (s !== null) { supply += s * width; supplyN += width; }
      if (c !== null) { cell += c * width; cellN += width; }
      if (operation !== 'unknown' && heater !== null) contextMinutes += width;
      if (operation !== 'unknown' && operation !== 'stopped') operationMinutes += width;
      if (operation === 'defrost') defrostMinutes += width;
      if (operation !== 'unknown' && operation !== 'defrost' && operation !== 'stopped' && heater !== null) {
        normalMinutes += width;
        if (heater) heaterMinutes += width;
      }
    }
    const span = (end - t) / MINUTE;
    const dominant = <T>(map: Map<T, number>): [T, number] | undefined => [...map.entries()].sort((a, b) => b[1] - a[1])[0];
    const profile = dominant(profiles);
    const consumptionValue = consumption(meter, t, end);
    hours.push({ start: t, ...consumptionValue, outdoor: outdoorN / span >= .9 ? outdoor / outdoorN : null,
      supply: supplyN / span >= .9 ? supply / supplyN : null, cell: cellN / span >= .9 ? cell / cellN : null, power: wattsN / span >= .9 ? watts / wattsN : null,
      fan: fanN / span >= .9 ? fan / fanN : null, profile: profile && profile[1] / span >= .9 ? profile[0] : null,
      operation: dominant(operations)?.[0] ?? 'unknown', defrostMinutes, heaterMinutes, heaterActiveMinutes: heaterKnownMinutes / span >= .9 ? heaterActiveMinutes : null, normalMinutes, contextCoverage: contextMinutes / span, operationCoverage: operationMinutes / span });
  }
  // Exact state interval boundaries for event length and electricity during defrost.
  let longDefrosts = 0;
  for (let i = 0; i < rawCell.length; i++) {
    if (operationOf(rawCell[i].state) !== 'defrost') continue;
    const runStart = rawCell[i].time;
    while (i + 1 < rawCell.length && operationOf(rawCell[i + 1].state) === 'defrost') i++;
    const runEnd = Math.min(now, rawCell[i + 1]?.time ?? now);
    if (runEnd <= now - 24 * HOUR) continue;
    const clippedStart = Math.max(runStart, now - 24 * HOUR);
    const e = consumption(meter, clippedStart, runEnd);
    defrostTotal += runEnd - clippedStart;
    defrostEnergyCovered += (runEnd - clippedStart) * e.coverage;
    defrostKwh += e.kwh ?? 0;
    if (runEnd - runStart > (config.insights?.defrost_minutes ?? 60) * MINUTE) longDefrosts++;
  }
  const recent = hours.filter(h => h.start + HOUR <= now).slice(-3);
  const comparable = (h: Hour, b: Hour) => b.start < h.start - 24 * HOUR && b.start >= h.start - 7 * 24 * HOUR && b.profile === h.profile && b.fan !== null && h.fan !== null && b.outdoor !== null && h.outdoor !== null && Math.abs(b.fan - h.fan) <= 5 && Math.abs(b.outdoor - h.outdoor) <= 2;
  const comparisons = recent.map(h => {
    if (h.kwh === null || h.coverage < .9 || h.profile === null || h.fan === null || h.outdoor === null) return null;
    const matches = hours.filter(b => comparable(h, b) && b.coverage >= .9 && b.kwh !== null);
    if (matches.length < 6 || new Set(matches.map(b => dayKey(b.start, zone))).size < 3) return null;
    const mean = matches.reduce((sum, b) => sum + b.kwh!, 0) / matches.length;
    return mean > 0 ? h.kwh / mean : null;
  });
  // Compare time spent defrosting independently of meter/heater availability.
  // A zero baseline cannot support a relative increase claim.
  const defrostComparisons = recent.map(h => {
    if (h.operationCoverage < .9 || h.profile === null || h.fan === null || h.outdoor === null) return null;
    const matches = hours.filter(b => comparable(h, b) && b.operationCoverage >= .9);
    if (matches.length < 6 || new Set(matches.map(b => dayKey(b.start, zone))).size < 3) return null;
    const mean = matches.reduce((sum, b) => sum + b.defrostMinutes, 0) / matches.length;
    return mean > 0 ? h.defrostMinutes / mean : null;
  });
  const defrostIncreaseRatio = defrostComparisons.length === 3 && defrostComparisons.every(r => r !== null && r > 1 + (config.insights?.excess_ratio ?? .5)) ? Math.min(...defrostComparisons as number[]) : null;
  const todayStart = midnight(now, zone), today = consumption(meter, todayStart, now), last24 = consumption(meter, now - 24 * HOUR, now);
  const daily = [];
  let cursor = todayStart;
  for (let i = 0; i < 7; i++) {
    const next = i === 0 ? now : cursor;
    const from = i === 0 ? cursor : midnight(cursor - 1, zone);
    daily.unshift({ date: dayKey(from, zone), ...consumption(meter, from, next) });
    cursor = from;
  }
  const heater6h = heaterUsage(history,config,meter,now-6*HOUR,now);
  const heater24h = heaterUsage(history,config,meter,now-24*HOUR,now);
  return { today: today.coverage >= .9 ? today.kwh : null, last24h: last24.coverage >= .9 ? last24.kwh : null,
    todayCoverage: today.coverage, hours, daily, defrostKwh: defrostTotal > 0 && defrostEnergyCovered / defrostTotal >= .9 ? defrostKwh : null,
    defrostMinutes: defrostTotal / MINUTE, longDefrosts, defrostIncreaseRatio, heaterShare: heater6h.heatingShare, heater6h, heater24h,
    elevated: comparisons.length === 3 && comparisons.every(r => r !== null && r > 1 + (config.insights?.excess_ratio ?? .5)),
    baselineReady: comparisons.length === 3 && comparisons.every(r => r !== null), historyAvailable: rawCell.length > 1 || meter.length > 0 || rawHeater.length > 1 };
}
