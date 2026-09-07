import type { HomeAssistant, ValloxIvCardConfig } from '../shared/types';
import { deriveCardState } from '../card/vallox-iv-card.logic';

/** Only explicit user commands call this module. Insights never import it. */
export async function selectProfile(hass: HomeAssistant, config: ValloxIvCardConfig, profile: string, restart = false, minutes?: number): Promise<void> {
  const model = deriveCardState(hass, config);
  const preset = model.supportedModes.find(p => p.toLowerCase() === profile.toLowerCase());
  if (!preset || !config.fan_entity || model.running === null) throw new Error('unavailable');
  if (!restart && model.profile?.toLowerCase() === preset.toLowerCase()) return;
  if (config.profile_action_script) {
    const duration = minutes ?? (preset.toLowerCase() === 'boost' ? config.boost_duration ?? 30 : preset.toLowerCase() === 'fireplace' ? config.fireplace_duration ?? 15 : undefined);
    if (duration !== undefined && (!Number.isInteger(duration) || duration < 1 || duration > 65534)) throw new Error('duration_invalid');
    await hass.callService('script', config.profile_action_script.slice(7), { profile: preset.toLowerCase(), restart, ...(duration === undefined ? {} : { duration }) });
  } else {
    if (restart || minutes !== undefined) throw new Error('duration_requires_script');
    await hass.callService('fan', 'set_preset_mode', { entity_id: config.fan_entity, preset_mode: preset });
  }
}

export async function setRunning(hass: HomeAssistant, config: ValloxIvCardConfig, running: boolean): Promise<void> {
  if (!config.fan_entity || deriveCardState(hass, config).running === null) throw new Error('unavailable');
  await hass.callService('fan', running ? 'turn_on' : 'turn_off', { entity_id: config.fan_entity });
}
