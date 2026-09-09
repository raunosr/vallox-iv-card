import { describe, expect, it } from 'vitest';
import { analyzeEnergy, HOUR } from '../src/data/energy';
import { insightsFor } from '../src/data/insights';
import { deriveCardState } from '../src/card/vallox-iv-card.logic';
import { config, hassWith, historyFixture } from './helpers';

const now = Date.parse('2026-01-20T12:00:00Z');
const settings = {...config, insights:{heating_system:'heat_pump' as const}};
const model = deriveCardState(hassWith(),settings);

describe('heater use and evidence', () => {
  it('separates heating and defrost, retaining whole-unit interval electricity', () => {
    const history = historyFixture(now,true);
    history['sensor.operation'] = [{time:now-24*HOUR,state:'Heat Recovery'}, {time:now-3*HOUR,state:'Defrosting'}, {time:now-HOUR,state:'Heat Recovery'}];
    const analysis = analyzeEnergy(history,settings,now);
    expect(analysis.heater24h).toMatchObject({coverage:1,activeMinutes:1440,heatingMinutes:1320,defrostMinutes:120,meanLift:2});
    expect(analysis.heater24h.heatingKwh).toBeCloseTo(13.2);
    expect(analysis.defrostKwh).toBeCloseTo(1.2);
    expect(analysis.heater6h.heatingMinutes).toBe(240);
  });
  it('uses exact state boundaries, even within one minute', () => {
    const history = historyFixture(now);
    history['binary_sensor.heater'] = [{time:now-24*HOUR,state:'off'}, {time:now-HOUR+10000,state:'on'}, {time:now-HOUR+30000,state:'off'}];
    const usage = analyzeEnergy(history,settings,now).heater24h;
    expect(usage.heatingMinutes).toBeCloseTo(1/3);
    expect(usage.heatingKwh).toBeCloseTo(.08/180);
  });
  it('reports consistently frequent heating without a budget or rising baseline', () => {
    const history = historyFixture(now);
    history['binary_sensor.heater'] = [{time:now-8*24*HOUR,state:'on'}];
    const analysis = analyzeEnergy(history,settings,now);
    expect(analysis.elevated).toBe(false);
    const finding = insightsFor(model,analysis,settings,'fi').find(i=>i.id === 'post_heat');
    expect(finding?.title).toBe('Kokeile alempaa tuloilman tavoitetta');
    expect(finding?.observation).toContain('360 min');
    expect(finding?.observation).toContain('0,48 kWh');
    expect(finding?.suggestion).toContain('vetona');
  });
  it('does not wait for a multi-day baseline when six hours of heater data exist', () => {
    const history = historyFixture(now,true);
    for (const id of Object.keys(history)) history[id] = history[id].filter(s=>s.time>now-6*HOUR);
    for (const [id,state,unit] of [['fan.vallox','on',''],['sensor.operation','Heat Recovery',''],['binary_sensor.heater','on','']]) history[id].unshift({time:now-6*HOUR,state,unit});
    const analysis = analyzeEnergy(history,settings,now);
    expect(analysis.baselineReady).toBe(false);
    expect(analysis.heater24h.heatingMinutes).toBeNull();
    expect(insightsFor(model,analysis,settings,'en').some(i=>i.id==='post_heat')).toBe(true);
  });
  it('reports runtime without inventing electricity during a meter outage', () => {
    const history = historyFixture(now,true);
    history['sensor.energy'] = [{time:now-24*HOUR,state:'unavailable',unit:'kWh'}];
    const analysis = analyzeEnergy(history,settings,now);
    expect(analysis.heater24h.heatingMinutes).toBe(1440);
    expect(analysis.heater24h.heatingKwh).toBeNull();
    const finding = insightsFor({...model,energy:null},analysis,settings,'en').find(i=>i.id==='post_heat');
    expect(finding?.observation).toContain('not sufficiently measured');
    expect(finding?.observation).not.toContain('kWh');
  });
  it('rejects gaps and counter resets during heating, not just across the whole day', () => {
    const history = historyFixture(now);
    history['binary_sensor.heater'] = [{time:now-24*HOUR,state:'off'}, {time:now-HOUR,state:'on'}];
    const samples = history['sensor.energy'];
    samples.splice(samples.findIndex(s=>s.time >= now-HOUR), 8);
    expect(analyzeEnergy(history,settings,now).heater24h.heatingKwh).toBeNull();
    const reset = historyFixture(now);
    reset['binary_sensor.heater'] = [{time:now-24*HOUR,state:'off'}, {time:now-300000,state:'on'}];
    reset['sensor.energy'].at(-1)!.state = '0';
    expect(analyzeEnergy(reset,settings,now).heater24h.heatingKwh).toBeNull();
  });
  it('distinguishes no heating from unknown state, and does not diagnose defrost as target heating', () => {
    const history = historyFixture(now,true);
    history['sensor.operation'] = [{time:now-24*HOUR,state:'Defrosting'}];
    const analysis = analyzeEnergy(history,settings,now);
    expect(analysis.heater24h.heatingMinutes).toBe(0);
    expect(analysis.heater24h.defrostMinutes).toBe(1440);
    expect(analysis.heaterShare).toBeNull();
    expect(insightsFor(model,analysis,settings,'en').some(i=>i.id==='post_heat')).toBe(false);
    history['binary_sensor.heater'] = [{time:now-24*HOUR,state:'unavailable'}];
    expect(analyzeEnergy(history,settings,now).heater24h.activeMinutes).toBeNull();
    expect(analyzeEnergy({},settings,now).heater24h.heatingMinutes).toBeNull();
    expect(analyzeEnergy(historyFixture(now),settings,now).heater24h.heatingMinutes).toBe(0);
  });
  it('rejects insufficient heater, core or fan state coverage for advice', () => {
    for (const id of ['binary_sensor.heater','sensor.operation','fan.vallox']) {
      const history = historyFixture(now,true);
      history[id].push({time:now-HOUR,state:'unavailable'});
      history[id].sort((a,b)=>a.time-b.time);
      expect(analyzeEnergy(history,settings,now).heaterShare,id).toBeNull();
    }
  });
  it('converts temperature differences and rejects a duplicated sensor', () => {
    const history = historyFixture(now,true);
    history['sensor.supply'] = [{time:now-24*HOUR,state:'53.6',unit:'°F'}];
    expect(analyzeEnergy(history,settings,now).heater24h.meanLift).toBeCloseTo(2);
    expect(analyzeEnergy(history,{...settings,supply_cell_temp:settings.supply_air_temp},now).heater24h.meanLift).toBeNull();
  });
});
