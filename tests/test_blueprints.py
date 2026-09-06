"""Execute the shipped YAML's conditions and actions against a deterministic HA stub.

This covers command decisions and persistent memory, not HA's scheduler/device I/O.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / '.cache' / 'python'))
import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
import re
import yaml
from jinja2 import StrictUndefined
from jinja2.nativetypes import NativeEnvironment

ROOT = Path(__file__).resolve().parents[1]
class Loader(yaml.SafeLoader):
    pass
Loader.add_constructor('!input', lambda loader, node: {'__input__': loader.construct_scalar(node)})

class Stopped(Exception):
    pass

class States:
    def __init__(self, runner):
        self.runner = runner
    def __call__(self, entity):
        return self.runner.state.get(entity, 'unknown')
    def __getitem__(self, entity):
        return SimpleNamespace(last_updated=datetime.fromtimestamp(self.runner.updated.get(entity, 0), timezone.utc))

class Runner:
    def __init__(self, path, inputs):
        self.doc = yaml.load((ROOT / path).read_text(encoding='utf-8'), Loader=Loader)
        self.inputs = inputs
        self.state = {}
        self.attributes = {}
        self.updated = {}
        self.calls = []
        self.time = 1760000000
        self.registered = ['fan.vallox']
        self.command_works = True
        self.env = NativeEnvironment(undefined=StrictUndefined)
        self.env.filters['bool'] = lambda v: str(v).lower() in ['true', '1', 'on', 'yes']
        self.env.tests['match'] = lambda value, pattern: re.match(pattern, value) is not None
        self.env.globals.update(states=States(self), state_attr=lambda e, a: self.attributes.get(e, {}).get(a),
                                has_value=lambda e: self.state.get(e, 'unknown') not in ['unknown', 'unavailable'],
                                is_number=lambda v: self.number(v), now=lambda: datetime.fromtimestamp(self.time, timezone.utc),
                                as_timestamp=lambda value, default=0: value.timestamp() if hasattr(value, 'timestamp') else default,
                                integration_entities=lambda domain: self.registered)

    @staticmethod
    def number(value):
        try:
            return float('-inf') < float(value) < float('inf')
        except (ValueError, TypeError):
            return False

    def render(self, value, context):
        if isinstance(value, dict):
            if '__input__' in value:
                return self.inputs[value['__input__']]
            return {k: self.render(v, context) for k, v in value.items()}
        if isinstance(value, list):
            return [self.render(v, context) for v in value]
        if isinstance(value, str) and ('{{' in value or '{%' in value):
            return self.env.from_string(value).render(**context)
        return value

    def conditions(self, condition, context):
        if isinstance(condition, list):
            return all(self.conditions(c, context) for c in condition)
        if isinstance(condition, dict):
            assert condition['condition'] == 'template'
            return bool(self.render(condition['value_template'], context))
        return bool(self.render(condition, context))

    def sequence(self, steps, context):
        for step in steps:
            if 'variables' in step:
                for key, value in step['variables'].items():
                    context[key] = self.render(value, context)
            elif 'if' in step:
                self.sequence(step.get('then', []) if self.conditions(step['if'], context) else step.get('else', []), context)
            elif 'choose' in step:
                choice = next((c for c in step['choose'] if self.conditions(c['conditions'], context)), None)
                self.sequence(choice['sequence'] if choice else step.get('default', []), context)
            elif 'stop' in step:
                if step.get('error'):
                    raise ValueError(step['stop'])
                raise Stopped()
            elif 'wait_template' in step:
                context['wait'] = SimpleNamespace(completed=bool(self.render(step['wait_template'], context)))
                if not context['wait'].completed and not step.get('continue_on_timeout', True):
                    raise Stopped()
            elif 'action' in step:
                action = self.render(step['action'], context)
                data = self.render(step.get('data', {}), context)
                target = self.render(step.get('target', {}), context)
                self.calls.append((action, target, data))
                entity = target.get('entity_id')
                if action == 'input_text.set_value':
                    assert isinstance(data['value'], str), data
                    self.state[entity] = data['value']
                elif action == 'input_select.select_option':
                    self.state[entity] = data['option']
                elif action in ['switch.turn_on', 'switch.turn_off'] and self.command_works:
                    self.state[entity] = 'on' if action.endswith('turn_on') else 'off'
                elif action == 'fan.set_preset_mode':
                    self.attributes.setdefault(entity, {})['preset_mode'] = data['preset_mode']
                elif action == 'vallox.set_profile':
                    self.attributes.setdefault('fan.vallox', {})['preset_mode'] = data['profile'].capitalize()
            else:
                raise AssertionError(f'Unhandled action: {step}')

    def run(self, trigger='tick', **fields):
        context = {'trigger': SimpleNamespace(id=trigger), **fields}
        for key, value in self.doc.get('variables', {}).items():
            context[key] = self.render(value, context)
        try:
            self.sequence(self.doc.get('actions', self.doc.get('sequence')), context)
        except Stopped:
            pass

    def equipment_calls(self):
        return [c for c in self.calls if c[0].startswith(('switch.', 'fan.', 'vallox.'))]

class SeasonalTests(unittest.TestCase):
    def setUp(self):
        self.r = Runner('blueprints/automation/vallox_season.yaml', {
            'bypass_lock':'switch.lock', 'mode_helper':'input_select.mode', 'sampled_outdoor':'sensor.sampled',
            'mean_sensor':'sensor.mean', 'count_sensor':'sensor.count', 'memory_helper':'input_text.memory',
            'status_helper':'input_text.status', 'summer_threshold':15, 'winter_threshold':12,
            'qualification_hours':6, 'minimum_interval_hours':24})
        self.r.state.update({'switch.lock':'on','input_select.mode':'Auto','sensor.sampled':'17','sensor.mean':'17',
                             'sensor.count':'288','input_text.memory':'','input_text.status':''})
        self.r.attributes['sensor.mean'] = {'unit_of_measurement':'°C','source_value_valid':True,'age_coverage_ratio':1}
        self.r.updated['sensor.sampled'] = self.r.time

    def advance(self, hours):
        self.r.time += hours * 3600
        self.r.updated['sensor.sampled'] = self.r.time

    def test_six_hours_before_summer(self):
        self.r.run()
        self.assertEqual(self.r.equipment_calls(), [])
        self.advance(5)
        self.r.run()
        self.assertEqual(self.r.equipment_calls(), [])
        self.advance(1)
        self.r.run()
        self.assertEqual(self.r.state['switch.lock'], 'off')
        self.assertEqual(len(self.r.equipment_calls()), 1)
        self.r.run()
        self.assertEqual(len(self.r.equipment_calls()), 1)

    def test_hysteresis_preserves_lock(self):
        self.r.state['sensor.mean'] = '13.5'
        self.r.run()
        self.assertEqual(self.r.equipment_calls(), [])

    def test_missing_data_resets_qualification(self):
        self.r.run()
        self.advance(5)
        self.r.state['sensor.count'] = '100'
        self.r.run()
        self.advance(2)
        self.r.state['sensor.count'] = '288'
        self.r.run()
        self.assertEqual(self.r.equipment_calls(), [])
        self.assertTrue(self.r.state['input_text.status'].startswith('waiting_summer'))

    def test_restart_does_not_reuse_an_unobserved_hold_period(self):
        self.r.run()
        self.advance(7)
        self.r.run(trigger='start')
        self.r.run()
        self.assertEqual(self.r.equipment_calls(), [])

    def test_manual_override_pauses_auto_without_reverting_user(self):
        self.r.run()
        self.r.state['switch.lock'] = 'off'
        self.r.run(trigger='lock')
        self.assertEqual(self.r.state['input_select.mode'], 'Off')
        self.r.run(trigger='mode')
        self.assertEqual(self.r.state['input_text.status'], 'manual_override')
        self.assertEqual(self.r.equipment_calls(), [])

    def test_switch_interval_survives_restart(self):
        self.r.state['switch.lock'] = 'off'
        self.r.state['input_text.memory'] = f'off||0|{self.r.time-3600}'
        self.r.state['sensor.mean'] = '8'
        self.r.run()
        self.advance(7)
        self.r.run()
        self.assertEqual(self.r.equipment_calls(), [])

    def test_failed_command_pauses_without_retry_storm(self):
        self.r.run()
        self.advance(6)
        self.r.command_works = False
        self.r.run()
        self.assertEqual(self.r.state['input_select.mode'], 'Off')
        self.r.run()
        self.assertEqual(len(self.r.equipment_calls()), 1)
        self.assertEqual(self.r.state['input_text.status'], 'command_failed')

    def test_manual_winter_does_not_depend_on_temperature_history(self):
        self.r.state.update({'input_select.mode':'Winter','switch.lock':'off','sensor.mean':'unavailable'})
        self.r.run()
        self.assertEqual(self.r.state['switch.lock'], 'on')

    def test_defaults_off_package_and_no_heater_commands(self):
        package = yaml.safe_load((ROOT/'examples/packages/vallox_companion.yaml').read_text())
        self.assertEqual(package['input_select']['vallox_season_mode']['options'][0], 'Off')
        for helper in package['input_text'].values():
            self.assertNotIn('initial', helper)
        self.r.run()
        self.advance(6)
        self.r.run()
        self.assertTrue(all(c[0] in ['switch.turn_on','switch.turn_off'] for c in self.r.equipment_calls()))

class ProfileTests(unittest.TestCase):
    def setUp(self):
        self.r = Runner('blueprints/script/vallox_profile.yaml', {'fan':'fan.vallox'})
        self.r.state['fan.vallox'] = 'on'
        self.r.attributes['fan.vallox'] = {'preset_mode':'Home','preset_modes':['Home','Away','Boost','Fireplace','Extra']}

    def test_timed_profile_uses_native_timer_and_is_idempotent(self):
        self.r.run(profile='boost')
        self.r.run(profile='boost')
        self.assertEqual(len(self.r.equipment_calls()), 1)
        self.assertEqual(self.r.equipment_calls()[0][2], {'profile':'boost','duration':30})

    def test_explicit_restart_and_fireplace_default(self):
        self.r.run(profile='fireplace')
        self.r.run(profile='fireplace',restart=True,duration=12)
        self.assertEqual([c[2]['duration'] for c in self.r.equipment_calls()], [15,12])

    def test_multiple_registered_units_block_global_timed_service(self):
        self.r.registered.append('fan.second_vallox')
        with self.assertRaises(ValueError):
            self.r.run(profile='boost',duration=30)
        self.assertEqual(self.r.equipment_calls(), [])
        self.r.run(profile='away')
        self.assertEqual(self.r.equipment_calls()[0][1], {'entity_id':'fan.vallox'})

    def test_unavailable_unsupported_or_invalid_duration_does_not_command(self):
        for fields in [{'profile':'auto'},{'profile':'boost','duration':0},{'profile':'boost','duration':1.5},{'profile':'boost','duration':65535}]:
            with self.assertRaises(ValueError):
                self.r.run(**fields)
        self.r.state['fan.vallox'] = 'unavailable'
        with self.assertRaises(ValueError):
            self.r.run(profile='away')
        self.assertEqual(self.r.equipment_calls(), [])

if __name__ == '__main__':
    unittest.main()
