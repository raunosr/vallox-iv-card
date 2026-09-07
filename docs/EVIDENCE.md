# Evidence used for v2

Reviewed 2026-09-06. Actual HA entity capabilities take precedence over generic integration
documentation. Forum posts are user experiences, not universal parameter recommendations.

| Source | Supported decision |
|---|---|
| [HA Vallox integration](https://www.home-assistant.io/integrations/vallox/) | Use exposed presets and sensors; detect capabilities per installation |
| [HA profile action](https://www.home-assistant.io/actions/vallox.set_profile/) | No target support; guard timed commands to one registered Vallox fan |
| [Vallox API](https://github.com/yozik04/vallox_websocket_api/blob/master/vallox_websocket_api/vallox.py) | Native timer and base-profile behavior; no competing browser timer |
| [HA custom cards](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/) | Sections sizing and editor support |
| [HA history API](https://github.com/home-assistant/core/blob/dev/homeassistant/components/history/websocket_api.py) | Compressed history and attribute preservation |
| [Vallox summer behavior](https://www.vallox.com/viilentaako-ilmanvaihtokone-kesakuumalla/) | Allow native bypass and cool recovery |
| [Bypass controls](https://vallox.techmanuals.info/ValloxMV/FIN/help/webhelp/user_manual/topics/touch/touch_ltokennon_ohitus.html) | Winter lock differs from measured damper position |
| [Defrost settings](https://vallox.techmanuals.info/ValloxMV/FIN/help/webhelp/user_manual/topics/cloud/cloud_sulatusasetukset.html) | Different defrost methods, heating and pressure consequences |
| [Energy calculator](https://www.vallox.com/laskuri-ilmanvaihdon-energiankulutukseen-vallox/) | Target temperature affects electricity; other heating changes interpretation |
| [Supply temperatures](https://www.vallox.com/mita-tuloilman-lampotilasta-on-hyva-tietaa-mita-jateilman-lampotila-kertoo/) | Distinguish defrost temperature changes from faults; generic examples are not enforced minimums |
| [Vallox 145 MV](https://www.vallox.com/tuote/vallox-145-mv/) | Stationary counterflow core; heater ratings do not measure actual electricity |
| [User reports](https://lampopumput.info/foorumi/threads/vallox-110-mv-sulattaa-jatkuvasti.26643/page-2) | Phenomena to inspect on a measured timeline, not universal tuning recipes |

The 50% excess, repeated 60-minute defrost and 90% coverage thresholds are transparent
product defaults, not Vallox fault criteria. User reports of 10–20 kWh/day motivated
house-specific measured comparisons and are not used as a universal baseline.
