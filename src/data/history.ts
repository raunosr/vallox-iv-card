import type { History, HomeAssistant, Sample, ValloxIvCardConfig } from '../shared/types';

type WireState = { s?: string; state?: string; lu?: number; lc?: number; last_updated?: string; last_changed?: string; a?: Record<string, unknown>; attributes?: Record<string, unknown> };
export function normalizeHistory(raw: Record<string, WireState[]>, hass: HomeAssistant): History {
  return Object.fromEntries(Object.entries(raw).map(([id, rows]) => {
    let attributes: Record<string, unknown> = {};
    const samples: Sample[] = [];
    for (const row of rows) {
      attributes = row.a ?? row.attributes ?? attributes;
      const time = row.lu !== undefined ? row.lu * 1000 : row.lc !== undefined ? row.lc * 1000 : Date.parse(row.last_updated ?? row.last_changed ?? '');
      const state = row.s ?? row.state;
      if (Number.isFinite(time) && typeof state === 'string') samples.push({ time, state, unit: String(attributes.unit_of_measurement ?? hass.states[id]?.attributes.unit_of_measurement ?? ''), attributes });
    }
    return [id, samples.sort((a, b) => a.time - b.time)];
  }));
}

const cache = new WeakMap<object, Map<string, { until: number; promise: Promise<History> }>>();
export function loadHistory(hass: HomeAssistant, config: ValloxIvCardConfig, now = Date.now()): Promise<History> {
  const ids = [...new Set([config.energy?.energy_entity, config.energy?.power_entity, config.outdoor_air_temp, config.supply_air_temp,
    config.supply_cell_temp, config.extract_air_temp, config.cell_state, config.post_heater, config.profile, config.fan_speed, config.fan_entity].filter((x): x is string => !!x))].sort();
  if (!ids.length) return Promise.resolve({});
  const owner = hass.connection ?? hass;
  const entries = cache.get(owner) ?? new Map();
  cache.set(owner, entries);
  const key = ids.join('|');
  const previous = entries.get(key);
  if (previous && previous.until > now) return previous.promise;
  const start = Math.floor((now - 8 * 86400000) / 3600000) * 3600000;
  const promise = hass.callWS<Record<string, WireState[]>>({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(now).toISOString(), entity_ids: ids,
    include_start_time_state: true, significant_changes_only: false, minimal_response: false, no_attributes: false }).then(raw => {
    const result = normalizeHistory(raw, hass);
    // A current reading closes the last interval; unavailable is an explicit boundary.
    for (const id of ids) {
      const entity = hass.states[id];
      if (entity) (result[id] ??= []).push({ time: now, state: entity.state, unit: entity.attributes.unit_of_measurement ?? '', attributes: entity.attributes });
    }
    return result;
  }).catch(error => { entries.delete(key); throw error; });
  entries.set(key, { until: now + 300000, promise });
  // Bound entries when an editor changes bindings repeatedly.
  if (entries.size > 12) entries.delete(entries.keys().next().value!);
  return promise;
}
