import type { Language } from '../shared/types';
import { tr } from '../shared/localize';

export interface Field { name: string; fi: string; en: string; selector: Record<string, unknown> }
export interface Section { key?: 'energy' | 'insights' | 'seasonal'; fi: string; en: string; fields: Field[] }
const entity = (name: string, fi: string, en: string, domain = 'sensor'): Field => ({ name, fi, en, selector: { entity: { domain } } });
const select = (name: string, fi: string, en: string, options: string[]): Field => ({ name, fi, en, selector: { select: { options } } });
const number = (name: string, fi: string, en: string, min: number, max: number, step = 1): Field => ({ name, fi, en, selector: { number: { min, max, step, mode: 'box' } } });
const bool = (name: string, fi: string, en: string): Field => ({ name, fi, en, selector: { boolean: {} } });
const text = (name: string, fi: string, en: string): Field => ({ name, fi, en, selector: { text: {} } });
export const SECTIONS: Section[] = [
  { fi: 'Laite ja käyttötilat', en: 'Unit and profiles', fields: [text('title','Otsikko','Title'), entity('fan_entity','Valloxin puhallin','Vallox fan','fan'),
    { name:'modes',fi:'Näytettävät profiilit',en:'Visible profiles',selector:{select:{multiple:true,options:['Home','Away','Boost','Fireplace','Extra','Auto']}} },
    entity('profile_duration','Profiilin jäljellä oleva aika','Remaining profile duration'), entity('profile_action_script','Valinnainen ajastuksen ohjausskripti','Optional timer control script','script'),
    number('boost_duration','Tehostuksen kesto skriptille (min)','Boost duration for script (min)',1,65534), number('fireplace_duration','Takkaprofiilin kesto skriptille (min)','Fireplace duration for script (min)',1,65534)] },
  { fi:'Ilmavirrat ja kenno',en:'Airflow and core',fields:[entity('outdoor_air_temp','Ulkoilma','Outdoor air'),entity('extract_air_temp','Poistoilma huoneista','Extract air from rooms'),entity('supply_air_temp','Tuloilma huoneisiin','Supply air to rooms'),entity('exhaust_air_temp','Jäteilma ulos','Exhaust air outside'),entity('supply_cell_temp','Tuloilma kennon jälkeen, ennen vastusta','Supply air after core, before heater'),entity('cell_state','Kennon toimintatila','Core state'),entity('post_heater','Jälkilämmittimen tila','Post-heater state','binary_sensor'),entity('efficiency','Valinnainen hyötysuhdeanturi','Optional efficiency sensor'),select('efficiency_kind','Anturin hyötysuhteen laji','Sensor efficiency kind',['custom','supply','extract']),select('efficiency_scale','Anturin asteikko','Sensor scale',['percent','ratio']),select('temperature_unit','Näytettävä lämpötilayksikkö','Display temperature unit',['°C','°F'])] },
  { fi:'Muut anturit',en:'Other sensors',fields:[entity('profile','Profiili historiavertailuun','Profile for history comparison'),entity('fan_speed','Puhallinpyyntö (%)','Fan request (%)'),entity('supply_fan_speed','Tulopuhaltimen kierrosluku','Supply fan RPM'),entity('extract_fan_speed','Poistopuhaltimen kierrosluku','Extract fan RPM'),select('defrost_mode','Sulatustapa (auto = kierroslukujen perusteella)','Defrost method (auto = from fan RPM)',['auto','bypass','supply_stop']),entity('co2','Hiilidioksidi','Carbon dioxide'),entity('humidity','Kosteus','Humidity'),entity('filter_remaining','Suodattimien tila / jäljellä olevat päivät','Filter status / days remaining')] },
  { key:'energy',fi:'Energiamittaus',en:'Energy measurement',fields:[entity('power_entity','Teho (W tai kW)','Power (W or kW)'),entity('energy_entity','Kertyvä energia (Wh tai kWh)','Cumulative energy (Wh or kWh)')] },
  { key:'insights',fi:'Ehdotukset',en:'Suggestions',fields:[bool('enabled','Näytä ehdotukset','Show suggestions'),select('heating_system','Talon lämmitystapa','Home heating system',['unknown','heat_pump','district_heating','other_efficient','electric']),number('daily_budget_kwh','Oma kulutustavoite (kWh/vrk), valinnainen','Your daily energy budget (kWh), optional',.1,1000,.1),number('comfort_floor','Oma tuloilman mukavuustoive (°C), valinnainen','Your supply-air comfort preference (°C), optional',-50,50,.5),number('excess_ratio','Poikkeama omasta historiasta (0,5 = +50 %)','Deviation from your history (0.5 = +50%)',.01,10,.01),number('defrost_minutes','Pitkän sulatuksen havaintoraja (min)','Long defrost observation threshold (min)',1,1440)] },
  { key:'seasonal',fi:'Valinnainen kausiohjaus',en:'Optional seasonal control',fields:[entity('mode_entity','Blueprintin ohjaustapa','Blueprint control mode','input_select'),entity('status_entity','Blueprintin tilatieto','Blueprint status','input_text'),entity('mean_entity','Ulkolämpötilan 24 h keskiarvo','24 h mean outdoor temperature'),entity('bypass_lock_entity','Valloxin talvilukko','Vallox winter lock','switch')] },
  { fi:'Ulkoasu',en:'Appearance',fields:[select('language','Kieli','Language',['fi','en']),bool('compact','Tiivis näkymä','Compact view'),bool('show_efficiency','Näytä hyötysuhde','Show efficiency'),bool('show_cell_state','Näytä kennon tila','Show core state'),bool('show_profile','Näytä profiili','Show profile'),bool('show_fan_speed','Näytä puhallinpyyntö','Show fan request'),bool('show_co2','Näytä CO₂','Show CO₂'),bool('show_humidity','Näytä kosteus','Show humidity'),bool('show_post_heater','Näytä vastuksen tila','Show heater state'),bool('show_supply_cell_temp','Näytä kennon jälkeinen lämpötila','Show core outlet temperature'),bool('enable_temp_colors','Lämpötilojen värit','Temperature colours'),number('value_font_size','Lukujen suhteellinen koko (48 = oletus)','Relative value size (48 = default)',10,100),number('font_weight','Lukujen fonttipaino','Value font weight',400,700,100),number('unit_opacity','Yksikön peittävyys','Unit opacity',0,1,.05),number('co2_limit','CO₂-korostuksen raja (ppm)','CO₂ highlight threshold (ppm)',0,10000),bool('enable_co2_blink','CO₂-huomion animointi','Animate CO₂ attention')] },
  { fi:'Omat tekstit ja värit',en:'Custom labels and colours',fields:[...['extract_air','outdoor_air','supply_air','exhaust_air','efficiency','humidity'].map(key=>text(`label_${key}`,`Oma teksti: ${key}`,`Custom label: ${key}`)),...['cold','freeze','neutral','warm','hot'].map(key=>({name:`temp_color_${key}`,fi:`Lämpötilaväri: ${key}`,en:`Temperature colour: ${key}`,selector:{color_rgb:{}}}))] },
];
export function fieldLabel(language: Language, field: { name: string }): string {
  const entry = SECTIONS.flatMap(s=>s.fields).find(f=>f.name === field.name);
  return entry ? tr(language,entry.fi,entry.en) : field.name;
}
export function fieldSelector(field: Field, language: Language): Record<string, unknown> {
  const selection = field.selector.select as { options: string[] } | undefined;
  if (!selection || field.name === 'modes') return field.selector;
  const labels: Record<string, [string, string]> = {
    unknown:['Ei määritetty','Not specified'], heat_pump:['Lämpöpumppu / maalämpö','Heat pump / ground source'],
    district_heating:['Kaukolämpö','District heating'], other_efficient:['Muu tehokkaampi lämmitystapa','Other more efficient heating'], electric:['Suora sähkölämmitys','Direct electric heating'],
    custom:['Anturin oma hyötysuhde','Sensor-defined efficiency'], supply:['Tuloilman lämpötilahyötysuhde','Supply temperature efficiency'], extract:['Poistoilman hyötysuhde','Extract efficiency'],
    percent:['Prosentti (1 = 1 %)','Percent (1 = 1%)'], ratio:['Suhdeluku (1 = 100 %)','Ratio (1 = 100%)'],
    auto:['Tunnista kierrosluvuista','Detect from fan RPM'], bypass:['Ohitussulatus','Bypass defrost'], supply_stop:['Tulopuhaltimen pysäytys','Supply fan stop'],
    fi:['Suomi','Finnish'], en:['English','English'],
  };
  return { select: { ...selection, options: selection.options.map(value => ({ value, label: labels[value] ? tr(language,...labels[value]) : value })) } };
}
