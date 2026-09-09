import type { HomeAssistant, Sample, ValloxIvCardConfig } from '../src/shared/types';
export const demoConfig: ValloxIvCardConfig = { type:'custom:vallox-iv-card',language:'fi',fan_entity:'fan.vallox',outdoor_air_temp:'sensor.outdoor',extract_air_temp:'sensor.extract',supply_air_temp:'sensor.supply',exhaust_air_temp:'sensor.exhaust',supply_cell_temp:'sensor.cell',cell_state:'sensor.operation',post_heater:'binary_sensor.heater',profile:'sensor.profile',fan_speed:'sensor.fan',humidity:'sensor.humidity',co2:'sensor.co2',profile_duration:'sensor.duration',energy:{power_entity:'sensor.power',energy_entity:'sensor.energy'},insights:{heating_system:'heat_pump'},filter_remaining:'sensor.filter',seasonal:{mode_entity:'input_select.season',status_entity:'input_text.status',mean_entity:'sensor.mean',bypass_lock_entity:'switch.lock'} };
export function fixture(scenario = 'winter', now = Date.now()): { hass: HomeAssistant; config: ValloxIvCardConfig } {
  const states: HomeAssistant['states'] = {};
  const set = (id: string, state: string | number, attributes: Record<string,unknown> = {}) => { states[id] = { entity_id:id,state:String(state),attributes,last_changed:new Date(now).toISOString(),last_updated:new Date(now).toISOString(),context:{id:'demo',parent_id:null,user_id:null} }; };
  const values: Record<string,[number,number,number,number,number,string,number,string]> = { winter:[-12,22,14,13,-3,'Heat Recovery',84,'off'],bypass:[16,25,16,16,24,'Bypass',72,'off'],cool:[31,23,25,25,29,'Cool Recovery',80,'off'],defrost:[-18,22,13,2,4,'Defrosting',1850,'on'],stopped:[5,22,18,18,10,'Heat Recovery',0,'off'],missing:[13.5,22.2,21,21,16.3,'Heat Recovery',84,'off'],unknown:[5,22,18,18,10,'unknown',84,'off'],high:[-18,22,15,7,-8,'Heat Recovery',1100,'on'] };
  const [out,ext,sup,cell,exh,op,power,heater] = values[scenario === 'steady-heat' ? 'high' : scenario] ?? values.winter;
  for (const [id,value] of Object.entries({outdoor:out,extract:ext,supply:sup,cell,exhaust:exh,mean:out})) set(`sensor.${id}`,scenario === 'unknown' ? 'unavailable' : value,{unit_of_measurement:'°C'});
  set('fan.vallox',scenario === 'stopped' ? 'off' : scenario === 'unknown' ? 'unavailable' : 'on',{percentage:52,preset_mode:'Home',preset_modes:['Home','Away','Boost','Fireplace','Extra','Auto'],supported_features:57});
  set('sensor.operation',op);set('sensor.profile','Home');set('sensor.fan',52,{unit_of_measurement:'%'});set('binary_sensor.heater',scenario === 'unknown' ? 'unavailable' : heater);
  set('sensor.power',scenario === 'missing' ? 'unavailable' : power,{unit_of_measurement:'W'});set('sensor.energy',scenario === 'missing' ? 'unavailable' : 100,{unit_of_measurement:'kWh',state_class:'total_increasing'});
  set('sensor.humidity',38,{unit_of_measurement:'%'});set('sensor.co2',582,{unit_of_measurement:'ppm'});set('sensor.duration','unknown',{unit_of_measurement:'min'});set('sensor.filter',104,{unit_of_measurement:'d',friendly_name:'Suodattimien vaihtoon'});
  set('input_select.season','Off',{options:['Off','Auto','Winter','Summer']});set('input_text.status','Ohjaus pois käytöstä');set('switch.lock','on');
  const history: Record<string,Sample[]> = Object.fromEntries(Object.entries(states).map(([id,s])=>[id,[{time:now-9*86400000,state:s.state,attributes:s.attributes,unit:s.attributes.unit_of_measurement}]]));
  const start = Math.floor((now-8*86400000)/3600000)*3600000;
  let kwh = 50;
  history['sensor.energy']=[];history['sensor.power']=[];
  for (let time=start; time<=now;time+=300000) {
    const recent = time > now-24*3600000;
    const watts = scenario === 'steady-heat' || scenario === 'high' && recent ? power : 80 + 15*Math.sin(time/3600000);
    kwh += watts/1000/12;
    history['sensor.energy'].push({time,state:scenario === 'missing' ? 'unavailable' : String(kwh),unit:'kWh'});
    history['sensor.power'].push({time,state:scenario === 'missing' ? 'unavailable' : String(watts),unit:'W'});
  }
  states['sensor.energy'].state = scenario === 'missing' ? 'unavailable' : String(kwh);
  const hass = { states,language:'fi',config:{time_zone:'Europe/Helsinki',unit_system:{temperature:'°C'}},connection:{},
    callWS: async () => Object.fromEntries(Object.entries(history).map(([id,rows])=>[id,rows.map(r=>({s:r.state,lu:r.time/1000,a:r.attributes ?? {unit_of_measurement:r.unit}}))])),
    callService: async (domain: string,service: string,data: Record<string,unknown>) => {
      document.getElementById('calls')!.textContent=`Testikomento: ${domain}.${service} ${JSON.stringify(data)}`;
      if (domain === 'fan' && service === 'set_preset_mode') { states['fan.vallox'].attributes.preset_mode=String(data.preset_mode);states['sensor.profile'].state=String(data.preset_mode);states['sensor.duration'].state=['Boost','Fireplace'].includes(String(data.preset_mode))?'30':'unknown'; }
      if (domain === 'fan' && ['turn_on','turn_off'].includes(service)) states['fan.vallox'].state=service === 'turn_on'?'on':'off';
      if (domain === 'input_select') states['input_select.season'].state=String(data.option);
      window.dispatchEvent(new Event('demo-state-changed')); return {};
    } } as unknown as HomeAssistant;
  return {hass,config:{...demoConfig,defrost_mode:'bypass'}};
}
