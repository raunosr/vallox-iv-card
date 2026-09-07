import '../src/index';
import { fixture } from './fixtures';
import type { ValloxIvCard } from '../src/card/vallox-iv-card';
import type { HomeAssistant, ValloxIvCardConfig } from '../src/shared/types';
const params=new URLSearchParams(location.search);
if(params.has('test')) document.body.classList.add('test-mode');
const slot=document.getElementById('slot')!;
const card=document.createElement('vallox-iv-card') as ValloxIvCard;
slot.append(card);
let current:{hass:HomeAssistant;config:ValloxIvCardConfig};
let allModes=false;
const input=(id:string)=>document.getElementById(id) as HTMLInputElement;
const apply=()=>{
  const scenario=input('scenario').value;
  current=fixture(scenario === 'defrost-stop' ? 'defrost' : scenario);
  if (scenario === 'defrost-stop') {
    current.config.defrost_mode='supply_stop';
    current.hass.states['binary_sensor.heater'].state='unknown';
  }
  current.config.language=input('language').value as 'fi'|'en';
  current.config.modes=allModes?['Home','Away','Boost','Fireplace','Extra','Auto']:['Home','Away','Boost'];
  card.setConfig(current.config);card.hass=current.hass;
  slot.style.width=`${input('width').value}px`;slot.style.height=params.get('layout')==='masonry'?'auto':`${input('height').value}px`;
  document.body.classList.toggle('light',input('theme').value==='light');
  document.body.classList.toggle('slate',input('theme').value==='slate');
};
for(const id of ['scenario','width','height','theme','language']) { if(params.has(id))input(id).value=params.get(id)!; input(id).addEventListener(['width','height'].includes(id)?'input':'change',apply); }
document.getElementById('all-modes')!.addEventListener('click',()=>{allModes=!allModes;apply();});
window.addEventListener('demo-state-changed',()=>{card.hass={...current.hass};});
apply();
