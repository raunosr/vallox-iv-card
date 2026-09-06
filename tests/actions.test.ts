import { expect,it,vi } from 'vitest';
import { selectProfile,setRunning } from '../src/data/actions';
import { config,hassWith } from './helpers';
it('targets the selected fan without calling the untargeted Vallox service',async()=>{const hass=hassWith();hass.callService=vi.fn().mockResolvedValue({});await selectProfile(hass,config,'boost');expect(hass.callService).toHaveBeenCalledWith('fan','set_preset_mode',{entity_id:'fan.vallox',preset_mode:'Boost'});});
it('does not restart the currently active profile implicitly',async()=>{const hass=hassWith();hass.callService=vi.fn();await selectProfile(hass,config,'Home');expect(hass.callService).not.toHaveBeenCalled();});
it('passes explicit timing to the adapter only',async()=>{const hass=hassWith();hass.callService=vi.fn().mockResolvedValue({});await selectProfile(hass,{...config,profile_action_script:'script.vallox_profile'},'Boost',true,17);expect(hass.callService).toHaveBeenCalledWith('script','vallox_profile',{profile:'boost',restart:true,duration:17});});
it('rejects custom durations without an adapter and unsupported presets',async()=>{await expect(selectProfile(hassWith(),config,'Boost',true,30)).rejects.toThrow();await expect(selectProfile(hassWith(),config,'Auto')).rejects.toThrow();});
it('stops the fan, never a mains smart plug',async()=>{const hass=hassWith();hass.callService=vi.fn().mockResolvedValue({});await setRunning(hass,config,false);expect(hass.callService).toHaveBeenCalledWith('fan','turn_off',{entity_id:'fan.vallox'});});
