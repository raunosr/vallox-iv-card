import type { EnergyAnalysis, Language, ValloxIvCardConfig, ValloxIvCardState } from '../shared/types';
import { numberText, tr } from '../shared/localize';

export interface Insight { id: string; level: 'info' | 'notice'; title: string; observation: string; suggestion: string; limitation: string; source?: string }
export const SOURCES = {
  energy: 'https://www.vallox.com/laskuri-ilmanvaihdon-energiankulutukseen-vallox/',
  heating: 'https://www.vallox.com/miten-ilmanvaihtokoneella-voi-saastaa-sahkoa/',
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
    if (!analysis.baselineReady) result.push({ id: 'learning', level: 'info', title: t('Vertailutaso muodostuu', 'Building a baseline'), observation: t('Vastaavia mittaustunteja tarvitaan vähintään kuusi kolmelta päivältä.', 'At least six comparable hours from three days are required.'), suggestion: t('Jatka mittausta. Vastuksen käytön havainto ei odota kulutustavoitetta tai vertailutasoa.', 'Continue measuring. Heater-use findings do not require a daily budget or a baseline.'), limitation: t('Oma historia ei määritä järkevää kulutusta: myös jatkuvasti suuri kulutus voi olla vertailutasolla.', 'Your history does not define sensible consumption: consistently high consumption can match the baseline.') });
    if (analysis.todayCoverage < .9) result.push({ id: 'coverage', level: 'info', title: t('Kulutushistoriassa on aukkoja', 'Energy history has gaps'), observation: t('Tämän päivän mittauskattavuus jää alle 90 prosentin.', 'Today’s measurement coverage is below 90%.'), suggestion: t('Tarkista mittarin saatavuus ja historian tallennus.', 'Check meter availability and history recording.'), limitation: t('Aukkoja ei täytetä nollilla eikä koko päivän lukua esitetä täydellisenä.', 'Gaps are not filled with zeros or presented as a complete daily total.') });
  }
  // Runtime is evidence in its own right: a consistently high baseline or an absent
  // user budget must not hide prolonged heating. Missing energy is stated explicitly.
  if (analysis && analysis.heaterShare !== null && analysis.heaterShare > .5) {
    const efficient = ['heat_pump', 'district_heating', 'other_efficient'].includes(config.insights?.heating_system ?? '');
    const usage = analysis.heater6h;
    const measured = model.energy !== null && config.energy?.energy_entity && usage.heatingKwh !== null;
    result.unshift({ id: 'post_heat', level: 'notice',
      title: efficient ? t('Kokeile alempaa tuloilman tavoitetta', 'Try a lower supply-air target') : t('Vastus lämmittää paljon tuloilmaa', 'Frequent supply-air heating'),
      observation: t(`Viimeisen 6 tunnin aikana vastus oli käytössä ${numberText(usage.heatingMinutes,language,0)} min sulatusten ulkopuolella (${numberText(analysis.heaterShare*100,language,0)} % tunnetusta käyntiajasta ilman sulatuksia).`, `In the last 6 hours, the heater was active for ${numberText(usage.heatingMinutes,language,0)} min outside defrost (${numberText(analysis.heaterShare*100,language,0)}% of known running time excluding defrost).`) + (measured ? t(` Koko laite kulutti näiden lämmitysjaksojen aikana ${numberText(usage.heatingKwh,language,2)} kWh.`, ` The whole unit used ${numberText(usage.heatingKwh,language,2)} kWh during these heating intervals.`) : t(' Näiden jaksojen sähkönkulutukseen ei ole riittävää mittausta.', 'Electricity during these intervals is not sufficiently measured.')),
      suggestion: (efficient ? t('Laske kokeeksi tuloilman tavoitelämpötilaa, jotta talon tehokkaampi lämmitysjärjestelmä hoitaa suuremman osan lämmityksestä Valloxin vastuksen sijaan.', 'Try lowering the supply-air temperature target so your more efficient home heating system supplies more of the heat instead of the Vallox heater.') : t('Tarkista tuloilman tavoite ja talon lämmitystapa. Jos käytössä on tehokkaampi lämmitystapa, kokeile alempaa tuloilman tavoitetta.', 'Check the supply-air target and your home heating system. If a more efficient heat source is available, try a lower supply-air target.')) + t(' Viileämpi tuloilma voi tuntua vetona. Etsi oma tasapainosi sähkönkulutuksen, huonelämpötilan ja vedon tunteen välillä seuraamalla muutoksen vaikutusta.', ' Cooler supply air can feel drafty. Monitor the change to find your own balance between electricity use, room temperature and drafts.') + (config.insights?.comfort_floor === undefined ? '' : t(` Oma mukavuustoiveesi: ${numberText(config.insights.comfort_floor,language)} °C.`, ` Your comfort preference: ${numberText(config.insights.comfort_floor,language)} °C.`)),
      limitation: t('Käyntiaika ei yksin osoita vikaa tai vastuksen erillistä kWh-kulutusta. Kortti ei muuta asetuksia tai määrää minimilämpötilaa. Jätä sulatuksen tarvitsema vastustoiminto käyttöön.', 'Runtime alone does not establish a fault or heater-only kWh. The card does not change settings or impose a minimum temperature. Keep the heater function needed for defrost available.'), source: SOURCES.heating });
  }
  if (analysis && analysis.longDefrosts >= 2) result.push({ id: 'long_defrost', level: 'notice', title: t('Toistuvia pitkiä sulatusjaksoja', 'Repeated long defrost cycles'), observation: t(`${analysis.longDefrosts} sulatusjaksoa ylitti asetetun ${config.insights?.defrost_minutes ?? 60} minuutin havaintorajan viimeisen vuorokauden aikana.`, `${analysis.longDefrosts} defrost cycles exceeded the configured ${config.insights?.defrost_minutes ?? 60} minute observation threshold in the last day.`),
    suggestion: t('Vertaa ulkolämpötilaa, kosteutta ja profiilia sulatusten ajalta; huomioi myös saunominen ja takkaprofiili. Tarkista suodattimet ja anturilukemat. Arvioi ilmavirrat ja sulatusasetukset valmistajan ohjeen sekä tarvittaessa LVI-ammattilaisen kanssa.', 'Compare outdoor temperature, humidity and profile during defrost, including sauna use and fireplace mode. Check filters and sensor readings. Assess airflow and defrost settings using manufacturer guidance and an HVAC professional where needed.'),
    limitation: t('Kesto yksin ei todista vikaa. Kortti ei ehdota yleisiä muutoksia jäätymisenestoon.', 'Duration alone does not prove a fault. The card does not suggest universal frost-protection changes.'), source: SOURCES.defrost });
  if (analysis?.defrostIncreaseRatio != null) result.push({ id: 'defrost_increase', level: 'notice', title: t('Sulatusaika lisääntyi', 'Time spent defrosting increased'),
    observation: t(`Sulatuksiin käytetty aika on ollut kolmella peräkkäisellä tunnilla vähintään ${numberText((analysis.defrostIncreaseRatio - 1) * 100, language, 0)} % omaa vertailutasoa suurempi.`, `Time spent defrosting was at least ${numberText((analysis.defrostIncreaseRatio - 1) * 100, language, 0)}% above your baseline for three consecutive hours.`),
    suggestion: t('Vertaa sulatusjaksoja aikajanalla ja tarkista suodattimet, ilmavirrat sekä anturilukemat valmistajan ohjeiden mukaan.', 'Compare defrost intervals on the timeline and check filters, airflow and sensor readings using the manufacturer’s instructions.'),
    limitation: t('Vertailussa on sama profiili ja samankaltaiset ulkolämpötila sekä puhallinpyyntö. Muutos ei yksin osoita vikaa tai sulatuksen lisäenergiankulutusta.', 'The comparison uses the same profile and similar outdoor temperature and fan demand. An increase alone does not establish a fault or additional defrost electricity.'), source: SOURCES.defrost });
  return result;
}
