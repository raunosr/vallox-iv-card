import type { EnergyAnalysis, Language, ValloxIvCardConfig, ValloxIvCardState } from '../shared/types';
import { numberText, tr } from '../shared/localize';

export interface Insight { id: string; level: 'info' | 'notice'; title: string; observation: string; suggestion: string; limitation: string; source?: string }
export const SOURCES = {
  energy: 'https://www.vallox.com/laskuri-ilmanvaihdon-energiankulutukseen-vallox/',
  defrost: 'https://vallox.techmanuals.info/ValloxMV/FIN/help/webhelp/user_manual/topics/cloud/cloud_sulatusasetukset.html',
  forum: 'https://lampopumput.info/foorumi/threads/vallox-110-mv-sulattaa-jatkuvasti.26643/page-2',
};
/** Read-only, deterministic rules. No temperature target is inferred from a generic guideline. */
export function insightsFor(model: ValloxIvCardState, analysis: EnergyAnalysis | undefined, config: ValloxIvCardConfig, language: Language): Insight[] {
  if (config.insights?.enabled === false) return [];
  const t = (fi: string, en: string) => tr(language, fi, en);
  const result: Insight[] = [];
  for (const issue of model.issues) {
    result.push({ id: issue, level: 'notice', title: t('Tarkista mittauksen määritys', 'Check the sensor binding'),
      observation: issue === 'same_sensor' ? t('Kennon jälkeinen ja lopullinen tuloilma käyttävät samaa anturia.', 'Core outlet and final supply air use the same sensor.') : issue === 'efficiency_range' ? t('Hyötysuhde on alueen 0–100 % ulkopuolella.', 'Efficiency is outside 0–100%.') : t('Energia- tai tehoanturin yksikköä ei tunnisteta.', 'The energy or power sensor unit is unsupported.'),
      suggestion: t('Tarkista kortin anturivalinnat ja yksiköt.', 'Check the card’s sensor selections and units.'), limitation: t('Tämä on havainto mittauksesta, ei laitevian diagnoosi.', 'This concerns measurement, not a diagnosis of a unit fault.') });
  }
  if (!config.energy?.energy_entity || model.energy === null) {
    result.push({ id: 'meter_missing', level: 'info', title: t('Energiamittaus puuttuu', 'Energy measurement unavailable'), observation: t('Kulutukseen perustuvat päätelmät odottavat toimivaa kWh-anturia.', 'Consumption findings need a working kWh sensor.'),
      suggestion: config.energy?.power_entity && !config.energy.energy_entity ? t('Luo HA:ssa tehoanturista integraalianturi ja valitse se kortin energia-anturiksi.', 'Create an Integral helper from the power sensor in HA, then select it as the energy sensor.') : t('Valitse toimiva energiamittari kortin asetuksista, kun se on käytettävissä.', 'Select a working energy meter in the card settings when available.'),
      limitation: t('Puuttuva mittaus ei tarkoita nollakulutusta. Vastuksen nimellistehosta ei arvioida kulutusta.', 'Missing readings are not zero consumption. Heater ratings are not used to estimate electricity.') });
  } else if (analysis) {
    const budget = config.insights?.daily_budget_kwh;
    const overBudget = budget !== undefined && analysis.today !== null && analysis.today > budget;
    if (overBudget) result.push({ id: 'daily_budget', level: 'notice', title: t('Oma kulutustavoite ylittyi', 'Your daily energy budget was exceeded'),
      observation: `${numberText(analysis.today, language)} / ${numberText(budget, language)} kWh`, suggestion: t('Tarkastele aikajanalta, liittyikö kulutus sulatukseen vai lämmitykseen sen ulkopuolella.', 'Use the timeline to check whether consumption coincided with defrosting or heating outside defrost.'),
      limitation: t('Raja on itse määrittämäsi tavoite, ei Valloxin vikakriteeri.', 'This is your budget, not a Vallox fault threshold.'), source: SOURCES.energy });
    if (analysis.elevated) result.push({ id: 'elevated', level: 'notice', title: t('Kulutus ylittää oman vertailutason', 'Consumption is above your baseline'),
      observation: t('Kolme peräkkäistä tuntia ylittää vastaavien olosuhteiden vertailutason.', 'Three consecutive hours exceed the baseline for comparable conditions.'),
      suggestion: t('Vertaa profiilia, ulkolämpötilaa, sulatusjaksoja ja jälkilämmitystä aikajanalla.', 'Compare profile, outdoor temperature, defrost cycles and post-heating on the timeline.'),
      limitation: t('Vertailu ei yksin osoita vikaa tai koko talon energiansäästöä.', 'This comparison alone does not establish a fault or whole-home energy savings.') });
    const efficient = ['heat_pump', 'district_heating', 'other_efficient'].includes(config.insights?.heating_system ?? '');
    if (efficient && (overBudget || analysis.elevated) && analysis.heaterShare !== null && analysis.heaterShare > .5) result.push({
      id: 'post_heat', level: 'notice', title: t('Vastus lämmittää myös sulatusten ulkopuolella', 'The heater runs outside defrost cycles'),
      observation: t('Vastus on ollut aktiivinen yli puolet kelvollisesta sulatusten ulkopuolisesta ajasta viimeisen kuuden tunnin aikana. Myös kulutus on koholla.', 'The heater was active for over half of the valid non-defrost time in the last six hours, with elevated consumption.'),
      suggestion: t('Tarkista, voisiko talon tehokkaampi lämmitysjärjestelmä hoitaa lämmittämisen. Voit itse vertailla alempaa tuloilman tavoitetta sekä seurata kulutusta, huonelämpöä ja vetoa.', 'Check whether your more efficient heating system could supply this heat. You can manually compare a lower supply target while monitoring consumption, room temperature and drafts.') + (config.insights?.comfort_floor === undefined ? '' : t(` Itse määrittämäsi mukavuusraja on ${config.insights.comfort_floor} °C.`, ` Your own comfort limit is ${config.insights.comfort_floor} °C.`)),
      limitation: t('Kortti ei muuta asetuksia eikä aseta yleistä minimilämpötilaa. Sulatuksen tarvitsema lisälämmitys on eri asia.', 'The card does not change settings or impose a general minimum temperature. Supplemental heat needed for defrost is a separate function.'), source: SOURCES.energy });
    if (!analysis.baselineReady) result.push({ id: 'learning', level: 'info', title: t('Vertailutaso muodostuu', 'Building a baseline'), observation: t('Vastaavia mittaustunteja tarvitaan vähintään kuusi kolmelta päivältä.', 'At least six comparable hours from three days are required.'), suggestion: t('Jatka mittausta. Oma kulutustavoite toimii jo ilman vertailuhistoriaa.', 'Continue measuring. Your daily budget works without a baseline.'), limitation: t('Puutteellinen historia ei tarkoita, että kulutus olisi normaali.', 'Insufficient history does not mean consumption is normal.') });
    if (analysis.todayCoverage < .9) result.push({ id: 'coverage', level: 'info', title: t('Kulutushistoriassa on aukkoja', 'Energy history has gaps'), observation: t('Tämän päivän mittauskattavuus jää alle 90 prosentin.', 'Today’s measurement coverage is below 90%.'), suggestion: t('Tarkista mittarin saatavuus ja historian tallennus.', 'Check meter availability and history recording.'), limitation: t('Aukkoja ei täytetä nollilla eikä koko päivän lukua esitetä täydellisenä.', 'Gaps are not filled with zeros or presented as a complete daily total.') });
  }
  if (analysis && analysis.longDefrosts >= 2) result.push({ id: 'long_defrost', level: 'notice', title: t('Toistuvia pitkiä sulatusjaksoja', 'Repeated long defrost cycles'), observation: t(`${analysis.longDefrosts} sulatusjaksoa ylitti asetetun ${config.insights?.defrost_minutes ?? 60} minuutin havaintorajan viimeisen vuorokauden aikana.`, `${analysis.longDefrosts} defrost cycles exceeded the configured ${config.insights?.defrost_minutes ?? 60} minute observation threshold in the last day.`),
    suggestion: t('Tarkista suodattimet, anturilukemat ja valmistajan ohjeet. Ilmavirtojen ja sulatusasetusten arviointi voi vaatia LVI-ammattilaisen.', 'Check filters, sensor readings and manufacturer instructions. Airflow and defrost settings may need an HVAC professional’s assessment.'),
    limitation: t('Kesto yksin ei todista vikaa. Kortti ei ehdota yleisiä muutoksia jäätymisenestoon.', 'Duration alone does not prove a fault. The card does not suggest universal frost-protection changes.'), source: SOURCES.defrost });
  if (analysis?.defrostIncreaseRatio != null) result.push({ id: 'defrost_increase', level: 'notice', title: t('Sulatusaika lisääntyi', 'Time spent defrosting increased'),
    observation: t(`Sulatuksiin käytetty aika on ollut kolmella peräkkäisellä tunnilla vähintään ${numberText((analysis.defrostIncreaseRatio - 1) * 100, language, 0)} % omaa vertailutasoa suurempi.`, `Time spent defrosting was at least ${numberText((analysis.defrostIncreaseRatio - 1) * 100, language, 0)}% above your baseline for three consecutive hours.`),
    suggestion: t('Vertaa sulatusjaksoja aikajanalla ja tarkista suodattimet, ilmavirrat sekä anturilukemat valmistajan ohjeiden mukaan.', 'Compare defrost intervals on the timeline and check filters, airflow and sensor readings using the manufacturer’s instructions.'),
    limitation: t('Vertailussa on sama profiili ja samankaltaiset ulkolämpötila sekä puhallinpyyntö. Muutos ei yksin osoita vikaa tai sulatuksen lisäenergiankulutusta.', 'The comparison uses the same profile and similar outdoor temperature and fan demand. An increase alone does not establish a fault or additional defrost electricity.'), source: SOURCES.defrost });
  return result;
}
