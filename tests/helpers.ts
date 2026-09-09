import type { History, HomeAssistant, ValloxIvCardConfig } from '../src/shared/types';
import { HOUR } from '../src/data/energy';
export const config: ValloxIvCardConfig = { type:'custom:vallox-iv-card',fan_entity:'fan.vallox',outdoor_air_temp:'sensor.outdoor',supply_air_temp:'sensor.supply',supply_cell_temp:'sensor.cell',extract_air_temp:'sensor.extract',cell_state:'sensor.operation',post_heater:'binary_sensor.heater',profile:'sensor.profile',fan_speed:'sensor.fan',energy:{power_entity:'sensor.power',energy_entity:'sensor.energy'} };
export function hassWith(values: Record<string, [string,Record<string,unknown>?]> = {}): HomeAssistant {
  return { states:Object.fromEntries(Object.entries({ 'fan.vallox':['on',{preset_mode:'Home',preset_modes:['Home','Away','Boost','Fireplace'],percentage:52}], 'sensor.outdoor':['0',{unit_of_measurement:'°C'}], 'sensor.extract':['20',{unit_of_measurement:'°C'}], 'sensor.supply':['20',{unit_of_measurement:'°C'}], 'sensor.cell':['10',{unit_of_measurement:'°C'}], 'sensor.operation':['Heat Recovery'], 'binary_sensor.heater':['off'], 'sensor.energy':['50',{unit_of_measurement:'kWh'}], ...values }).map(([entity_id,[state,attributes]])=>[entity_id,{entity_id,state,attributes:attributes??{},last_updated:new Date().toISOString(),last_changed:new Date().toISOString()}])), config:{time_zone:'UTC',unit_system:{temperature:'°C'}},language:'en' } as unknown as HomeAssistant;
}
export function historyFixture(now: number, high = false): History {
  const start=now-8*24*HOUR;
  const history: History={};
  history['fan.vallox']=[{time:start,state:'on'}];
  for (const [id,state,unit] of [['sensor.outdoor','-10','°C'],['sensor.supply','12','°C'],['sensor.cell','10','°C'],['sensor.profile','Home',''],['sensor.fan','52','%'],['sensor.operation','Heat Recovery',''],['binary_sensor.heater',high?'on':'off','']]) history[id]=[{time:start,state,unit},{time:now,state,unit}];
  let value=10;history['sensor.energy']=[];
  for(let time=start;time<=now;time+=5*60000){value+=(high&&time>=now-24*HOUR?.6:.08)/12;history['sensor.energy'].push({time,state:String(value),unit:'kWh'});}
  return history;
}
