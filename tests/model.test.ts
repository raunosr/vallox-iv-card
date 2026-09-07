import { describe,expect,it } from 'vitest';
import { deriveCardState,operationOf } from '../src/card/vallox-iv-card.logic';
import { validateConfig } from '../src/shared/validation';
import { config,hassWith } from './helpers';

describe('sensor semantics',()=>{
  it('keeps a one-percent reading at one percent',()=>expect(deriveCardState(hassWith({'sensor.eff':['1',{unit_of_measurement:'%'}]}),{...config,efficiency:'sensor.eff'}).efficiency).toBe(1));
  it('requires an explicit ratio scale and never clamps bad readings',()=>{const h=hassWith({'sensor.eff':['1.2']});expect(deriveCardState(h,{...config,efficiency:'sensor.eff',efficiency_scale:'ratio'}).efficiency).toBe(120);expect(deriveCardState(h,{...config,efficiency:'sensor.eff',efficiency_scale:'ratio'}).issues).toContain('efficiency_range');});
  it('converts every temperature independently',()=>{const s=deriveCardState(hassWith({'sensor.outdoor':['50',{unit_of_measurement:'°F'}]}),config);expect(s.outdoorTemp).toBe(10);expect(s.supplyTemp).toBe(20);expect(s.tempUnit).toBe('°C');});
  it('keeps unknown heater state distinct from off',()=>expect(deriveCardState(hassWith({'binary_sensor.heater':['unavailable']}),config).postHeaterActive).toBeNull());
  it('does not parse numbers with trailing garbage or unknown units',()=>{const s=deriveCardState(hassWith({'sensor.outdoor':['20junk',{unit_of_measurement:'°C'}],'sensor.supply':['20',{unit_of_measurement:'invalid'}]}),config);expect(s.outdoorTemp).toBeNull();expect(s.supplyTemp).toBeNull();});
  it('uses core outlet instead of heated supply air for efficiency',()=>expect(deriveCardState(hassWith(),config).efficiency).toBe(50));
  it.each(['Bypass','Defrosting','Cool Recovery','unknown'])('does not estimate efficiency during %s',raw=>expect(deriveCardState(hassWith({'sensor.operation':[raw]}),config).efficiency).toBeNull());
  it('does not estimate at small temperature differences or duplicated sensors',()=>{expect(deriveCardState(hassWith({'sensor.outdoor':['19',{unit_of_measurement:'°C'}]}),config).efficiency).toBeNull();const s=deriveCardState(hassWith(),{...config,supply_cell_temp:config.supply_air_temp});expect(s.efficiency).toBeNull();expect(s.issues).toContain('same_sensor');});
  it('uses actual advertised presets instead of a firmware assumption',()=>expect(deriveCardState(hassWith(),{...config,modes:['Auto','Fireplace','Home']}).availableModes).toEqual(['Fireplace','Home']));
  it('normalizes all documented core state spellings',()=>{expect(operationOf('Heat Recovery')).toBe('heat_recovery');expect(operationOf('cool_recovery')).toBe('cool_recovery');expect(operationOf('Defrosting')).toBe('defrost');});
  it('supports a stopped fan without inventing an active airflow',()=>expect(deriveCardState(hassWith({'fan.vallox':['off']}),config).operation).toBe('stopped'));
  it('accepts legacy YAML and user-defined comfort limits below 12 °C',()=>{expect(validateConfig({...config,compact:true,insights:{comfort_floor:9}}).insights?.comfort_floor).toBe(9);expect(validateConfig(config).insights?.comfort_floor).toBeUndefined();});
  it.each([{modes:['Invalid']},{profile_action_script:'switch.mains'},{insights:{daily_budget_kwh:-1}},{energy:{energy_entity:123}}])('rejects invalid options %j',options=>expect(()=>validateConfig({...config,...options})).toThrow());
});
