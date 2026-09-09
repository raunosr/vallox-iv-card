# Understanding heating and defrost observations

Source review: 9 September 2026. These sources explain the observations; they do not
establish a universal temperature target or a device-fault threshold.

## Supply heating

[Vallox: saving electricity](https://www.vallox.com/miten-ilmanvaihtokoneella-voi-saastaa-sahkoa/)
explains that lowering the supply target reduces post-heater electricity while moving
more heating demand to the home's main heating system. Cooler supply can cause drafts.
The MV heater functions must remain available for defrost. The card therefore suggests
a manual target comparison, with room comfort and electricity monitored together.
It does not suggest disabling the heater or calculate whole-home savings.

[Vallox's consumption calculator explanation](https://www.vallox.com/laskuri-ilmanvaihdon-energiankulutukseen-vallox/)
also identifies the supply target as an important influence on unit electricity.
This supports inspecting persistent heating even when the consumption baseline has
not increased. The six-hour / 50% runtime rule is a project observation threshold,
not a manufacturer's definition of excessive heating.

## Defrost

[Vallox: defrost settings](https://vallox.techmanuals.info/ValloxMV/FIN/help/webhelp/user_manual/topics/cloud/cloud_sulatusasetukset.html)
describes two methods: bypassing the supply side of the core, or stopping the supply
fan. Bypass defrost uses electric heat for incoming outdoor air; a high target relative
to outdoors may also reduce fan flows. Supply-stop defrost creates temporary negative
pressure. Humidity and cold conditions affect icing. The guide describes roughly
15–45-minute cycles, but this is not a hard fault boundary. It cautions against casual
changes to professional parameters, particularly the outdoor-temperature parameter.

The card keeps defrost heater time separate from ordinary supply heating. Repeated
cycles above the configurable duration threshold, or a sustained relative increase,
prompt inspection of readings, filters and conditions. It supplies no generic RH or
temperature-offset adjustments. Whole-unit kWh during defrost is not incremental
defrost energy and is not identical to heater electricity.

## User experience as context

[Vallox 110 MV: continuous defrost discussion, page 2](https://lampopumput.info/foorumi/threads/vallox-110-mv-sulattaa-jatkuvasti.26643/page-2)
contains first-person reports about long cycles after fireplace operation, questions
about fan balance, and a later report of 40-minute cycles together with measured
monthly electricity. Other participants question sensor or software behaviour.
This variety supports checking the event context and actual consumption. It does
not establish the cause of a different installation's symptoms. Some posts explicitly
describe their explanations as guesses; these are not firmware documentation.

[Vallox 121 SE experiences](https://lampopumput.info/foorumi/threads/vallox-121-se-kokemuksia.23615/)
also discusses measurement and cold-weather behaviour. Its different model and
control generation are reasons not to transfer individual settings to MV units.

Forum posts are used to identify useful investigation questions, not as authority
for control changes. Winter fixtures in this repository test software semantics;
they are not real-device evidence that a setting is safe, efficient or correct.
