import type { HomeAssistant, Language, Operation, ValloxIvCardConfig } from './types';

export const tr = (language: Language, fi: string, en: string): string => language === 'fi' ? fi : en;
export function languageOf(hass?: HomeAssistant, config?: ValloxIvCardConfig): Language {
  return config?.language ?? (hass?.language?.startsWith('fi') ? 'fi' : 'en');
}
const operations: Record<Operation, [string, string, string, string]> = {
  heat_recovery: ['Lämmöntalteenotto', 'Heat recovery', 'Poistoilman lämpö siirtyy tuloilmaan.', 'Heat from extracted air warms the incoming air.'],
  bypass: ['Kennon ohitus', 'Core bypass', 'Tuloilma kulkee kennon ohitse. Ohituksen aste ei ole tiedossa.', 'Incoming air bypasses the core. The bypass position is not measured.'],
  cool_recovery: ['Viileyden talteenotto', 'Cool recovery', 'Viileämpi poistoilma jäähdyttää kuumaa ulkoilmaa.', 'Cooler extracted air tempers the hot outdoor air.'],
  defrost: ['Kennon sulatus', 'Defrosting', 'Poistoilman lämpö sulattaa kennoa. Lisälämmitys voi olla käytössä.', 'Extracted air warms the core. Supplemental heating may be active.'],
  stopped: ['Pysäytetty', 'Stopped', 'Ilmanvaihto on pysäytetty.', 'Ventilation is stopped.'],
  unknown: ['Tila ei tiedossa', 'State unavailable', 'Kennon toimintatilaa ei saada laitteelta.', 'The unit is not reporting its core state.'],
};
export const operationName = (operation: Operation, lang: Language): string => operations[operation][lang === 'fi' ? 0 : 1];
export const operationDescription = (operation: Operation, lang: Language): string => operations[operation][lang === 'fi' ? 2 : 3];
export function profileName(profile: string | null, lang: Language): string {
  const names: Record<string, string> = { home: 'Kotona', away: 'Poissa', boost: 'Tehostus', fireplace: 'Takka', extra: 'Extra', auto: 'Auto' };
  return profile ? lang === 'fi' ? names[profile.toLowerCase()] ?? profile : profile[0].toUpperCase() + profile.slice(1).toLowerCase() : '—';
}
export function numberText(value: number | null | undefined, lang: Language, digits = 1): string {
  return value === null || value === undefined || !Number.isFinite(value) ? '—' : new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

export function seasonStatus(raw: string | null, lang: Language, zone: string): string {
  const messages: Record<string, [string,string]> = {
    off:['Kausiohjaus on pois käytöstä.','Seasonal control is off.'],
    winter:['Talvilukko on käytössä.','The winter lock is enabled.'],
    summer:['Lukko on vapaa. Vallox valitsee kennon toimintatavan.','The lock is released. Vallox chooses the core operation.'],
    warming_up:['Odotetaan riittävää ja tuoretta vuorokauden mittaushistoriaa.','Waiting for sufficient, fresh 24-hour measurements.'],
    manual_override:['Käsiohitus: automaatti on pysäytetty. Voit palauttaa Auto-ohjauksen itse.','Manual override: automatic control is paused. Select Auto to resume.'],
    command_failed:['Lukon muutosta ei vahvistettu. Ohjaus on pysäytetty.','The lock change was not confirmed. Control is paused.'],
    unavailable:['Ohjaus odottaa puuttuvaa laite- tai apuritietoa.','Control is waiting for unavailable unit or helper data.'],
    invalid_config:['Tarkista kausiohjauksen tilavaihtoehdot ja lämpötilarajat.','Check the controller mode options and temperature thresholds.'],
  };
  const parts = raw?.split('|') ?? [];
  if (['waiting_summer','waiting_winter'].includes(parts[0]) && Number.isFinite(Number(parts[1])) && Number(parts[2]) > 0) {
    const date = new Intl.DateTimeFormat(lang,{timeZone:zone,day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'}).format(Number(parts[2])*1000);
    return parts[0] === 'waiting_summer' ? tr(lang,`Kesä aikaisintaan ${date}, jos vuorokauden keskiarvo pysyy yli ${parts[1]} °C.`,`Summer no earlier than ${date}, if the daily mean stays above ${parts[1]} °C.`) : tr(lang,`Talvi aikaisintaan ${date}, jos vuorokauden keskiarvo pysyy alle ${parts[1]} °C.`,`Winter no earlier than ${date}, if the daily mean stays below ${parts[1]} °C.`);
  }
  return messages[parts[0]]?.[lang === 'fi' ? 0 : 1] ?? raw ?? tr(lang,'Ohjauksen tila ei saatavilla.','Controller status unavailable.');
}
