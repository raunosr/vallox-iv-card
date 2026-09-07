import { describe,expect,it } from 'vitest';
import { analyzeEnergy,consumption,energySegments,HOUR,midnight } from '../src/data/energy';
import { insightsFor } from '../src/data/insights';
import { deriveCardState } from '../src/card/vallox-iv-card.logic';
import { normalizeHistory } from '../src/data/history';
import { config,hassWith,historyFixture } from './helpers';

const now=Date.parse('2026-01-20T12:00:00Z');
describe('energy integrity',()=>{
  it('keeps unknown heater history distinct from zero active minutes',()=>{
    const h=historyFixture(now);
    h['binary_sensor.heater']=[{time:now-8*24*HOUR,state:'unavailable'}];
    expect(analyzeEnergy(h,config,now).hours.at(-1)?.heaterActiveMinutes).toBeNull();
    expect(analyzeEnergy(historyFixture(now),config,now).hours.at(-1)?.heaterActiveMinutes).toBe(0);
  });
  it('compares defrost time with its own history and rejects missing state coverage',()=>{
    const h=historyFixture(now);
    h['sensor.operation']=[];
    for(let time=now-8*24*HOUR;time<now;time+=HOUR) {
      const minutes=time>=now-3*HOUR?30:10;
      h['sensor.operation'].push({time,state:'Defrosting'},{time:time+minutes*60000,state:'Heat Recovery'});
    }
    const analysis=analyzeEnergy(h,config,now);
    expect(analysis.defrostIncreaseRatio).toBeCloseTo(3);
    expect(analysis.longDefrosts).toBe(0);
    h['sensor.operation'].push({time:now-HOUR/2,state:'unavailable'});
    expect(analyzeEnergy(h,config,now).defrostIncreaseRatio).toBeNull();
    expect(analyzeEnergy(historyFixture(now),config,now).defrostIncreaseRatio).toBeNull();
  });
  it('does not bridge an unavailable reading or counter reset',()=>{const samples=['10','10.1','unavailable','10.5','0','.1'].map((state,i)=>({time:i*300000,state,unit:'kWh'}));const total=consumption(energySegments(samples),0,1500000);expect(total.kwh).toBeCloseTo(.2);expect(total.coverage).toBeCloseTo(.4);});
  it('does not interpolate across long gaps or a unit change',()=>{expect(energySegments([{time:0,state:'1',unit:'kWh'},{time:HOUR,state:'2',unit:'kWh'}])).toEqual([]);expect(energySegments([{time:0,state:'1',unit:'kWh'},{time:300000,state:'1100',unit:'Wh'}])).toEqual([]);});
  it('retains measured zero and treats absent energy as unknown',()=>{expect(consumption(energySegments([{time:0,state:'1',unit:'kWh'},{time:300000,state:'1',unit:'kWh'}]),0,300000).kwh).toBe(0);expect(analyzeEnergy({},config,now).today).toBeNull();});
  it('uses Home Assistant timezone on DST transition days',()=>{expect(new Date(midnight(Date.parse('2026-03-29T12:00:00Z'),'Europe/Helsinki')).toISOString()).toBe('2026-03-28T22:00:00.000Z');expect(new Date(midnight(Date.parse('2026-10-25T12:00:00Z'),'Europe/Helsinki')).toISOString()).toBe('2026-10-24T21:00:00.000Z');});
  it('decodes compressed history including attribute-only profile changes',()=>{const h=normalizeHistory({'fan.vallox':[{s:'on',lu:1,a:{preset_mode:'Home'}},{s:'on',lu:2,a:{preset_mode:'Away'}}]},hassWith());expect(h['fan.vallox'][1].attributes?.preset_mode).toBe('Away');expect(h['fan.vallox'][1].time).toBe(2000);});
  it('requires six comparable hours on three days and three elevated hours',()=>{const a=analyzeEnergy(historyFixture(now,true),config,now);expect(a.baselineReady).toBe(true);expect(a.elevated).toBe(true);expect(a.today).toBeCloseTo(7.2,1);const missing=historyFixture(now,true);missing['sensor.profile']=[];expect(analyzeEnergy(missing,config,now).elevated).toBe(false);});
  it('distinguishes defrost timing from heater operation outside defrost',()=>{const h=historyFixture(now,true);h['sensor.operation']=[{time:now-8*24*HOUR,state:'Heat Recovery'},{time:now-4*HOUR,state:'Defrosting'},{time:now-2.5*HOUR,state:'Heat Recovery'},{time:now-2*HOUR,state:'Defrosting'},{time:now-.5*HOUR,state:'Heat Recovery'}];const a=analyzeEnergy(h,config,now);expect(a.longDefrosts).toBe(2);expect(a.defrostMinutes).toBe(180);expect(a.defrostKwh).toBeCloseTo(1.8);expect(a.heaterShare).toBe(1);});
  it('has no universal supply target or lower bound in advice',()=>{const c={...config,insights:{heating_system:'heat_pump' as const,daily_budget_kwh:3,comfort_floor:9}};const findings=insightsFor(deriveCardState(hassWith(),c),analyzeEnergy(historyFixture(now,true),c,now),c,'fi');const text=JSON.stringify(findings);expect(findings.some(i=>i.id==='post_heat')).toBe(true);expect(text).not.toContain('17 °C');expect(text).not.toContain('nosta');expect(text).toContain('9 °C');});
  it('suspends energy advice when a meter is broken even with old history',()=>{const c={...config,insights:{heating_system:'heat_pump' as const,daily_budget_kwh:3}};const findings=insightsFor(deriveCardState(hassWith({'sensor.energy':['unavailable',{unit_of_measurement:'kWh'}]}),c),analyzeEnergy(historyFixture(now,true),c,now),c,'en');expect(findings.some(i=>i.id==='meter_missing')).toBe(true);expect(findings.some(i=>['post_heat','daily_budget','elevated'].includes(i.id))).toBe(false);});
});
