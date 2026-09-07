import { test, expect, type Page } from '@playwright/test';
import { demoConfig } from '../../demo/fixtures';
import type { ValloxIvCard } from '../../src/card/vallox-iv-card';

async function recordHistoryEvents(page: Page) {
  await page.evaluate(() => {
    const output = document.createElement('output');
    output.id = 'history-events';
    output.hidden = true;
    document.body.append(output);
    document.addEventListener('hass-more-info', event => {
      const detail = (event as CustomEvent).detail;
      output.textContent += `${detail.entityId}\n`;
    });
  });
}

async function configureEfficiency(page: Page, language: 'fi' | 'en' = 'fi', options = {}) {
  await page.locator('vallox-iv-card').evaluate(async (el, config) => {
    const card = el as ValloxIvCard, hass = card.hass!;
    card.hass = { ...hass, states: { ...hass.states, 'sensor.efficiency': {
      ...hass.states['sensor.humidity'], entity_id: 'sensor.efficiency', state: '72',
      attributes: { unit_of_measurement: '%' },
    } } };
    card.setConfig(config);
    await card.updateComplete;
  }, { ...demoConfig, efficiency: 'sensor.efficiency', efficiency_kind: 'extract', language, ...options });
}

for (const language of ['fi', 'en'] as const) test(`efficiency and heater open their own HA history with pointer and keyboard (${language})`, async ({ page }) => {
  await page.goto('/?test=1&width=390&height=376');
  await configureEfficiency(page, language);
  await recordHistoryEvents(page);
  const calls = await page.locator('#calls').textContent();
  const efficiency = page.getByRole('button', { name: language === 'fi' ? 'Poistoilman hyötysuhde 72 % · Avaa historia' : 'Extract efficiency 72 % · Open history' });
  const heater = page.getByRole('button', { name: language === 'fi' ? 'Vastus pois · Avaa historia' : 'Heater off · Open history' });
  const entities: string[] = [];
  for (const [button, entity] of [[efficiency, 'sensor.efficiency'], [heater, 'binary_sensor.heater']] as const) {
    await button.click();
    entities.push(entity);
    await expect(page.locator('#history-events')).toHaveText(entities.join('\n'));
    await button.focus();
    for (const key of ['Enter', 'Space']) {
      await button.press(key);
      entities.push(entity);
      await expect(page.locator('#history-events')).toHaveText(entities.join('\n'));
      await expect(button).toBeFocused();
      expect(await button.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
    }
  }
  // Inspecting history must not operate the unit or open the card's control dialog.
  await expect(page.locator('#calls')).toHaveText(calls!);
  await expect(page.getByRole('button', { name: language === 'fi' ? 'Kotona' : 'Home', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('an estimated efficiency has no unrelated entity action; unknown heater state still opens history', async ({ page }) => {
  await page.goto('/?test=1&width=320&height=248');
  await recordHistoryEvents(page);
  await expect(page.locator('.core-value')).toHaveText('74%');
  await expect(page.locator('.efficiency-history')).toHaveCount(0);
  await page.locator('.core-value').click();
  await expect(page.locator('#history-events')).toBeEmpty();
  await page.goto('/?test=1&scenario=defrost-stop&width=320&height=248');
  await recordHistoryEvents(page);
  await page.getByRole('button', { name: 'Vastus ei tiedossa · Avaa historia' }).click();
  await expect(page.locator('#history-events')).toHaveText('binary_sensor.heater');
});

test('hidden or unavailable readings do not leave invisible history targets', async ({ page }) => {
  await page.goto('/?test=1');
  await configureEfficiency(page, 'fi', { show_efficiency: false, show_post_heater: false });
  await expect(page.locator('.core-history')).toHaveCount(0);
  await configureEfficiency(page, 'fi', { post_heater: undefined });
  await expect(page.locator('.heater-history')).toHaveCount(0);
  await page.locator('vallox-iv-card').evaluate(async el => {
    const card = el as ValloxIvCard, hass = card.hass!;
    card.hass = { ...hass, states: { ...hass.states, 'sensor.efficiency': { ...hass.states['sensor.efficiency'], state: 'unavailable' } } };
    await card.updateComplete;
  });
  await expect(page.locator('.efficiency-history')).toHaveCount(0);
  await page.goto('/?test=1&scenario=bypass');
  await configureEfficiency(page);
  await expect(page.locator('.efficiency-history')).toHaveCount(0);
  await expect(page.locator('.heater-history')).toBeVisible();
});

test('history touch targets stay aligned, at least 44px and separate across card sizes', async ({ page }) => {
  for (const width of [320, 390, 480, 768]) for (const height of [248, 376, 504]) {
    await page.goto(`/?test=1&width=${width}&height=${height}`);
    await configureEfficiency(page);
    await expect.poll(() => page.locator('vallox-iv-card').evaluate(el => {
      const root = el.shadowRoot!, rect = (selector: string) => root.querySelector(selector)!.getBoundingClientRect();
      const efficiency = rect('.efficiency-history'), heater = rect('.heater-history'), scene = rect('.scene');
      const hit = (selector: string, target: string) => {
        const r = rect(selector);
        return root.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.matches(target) ?? false;
      };
      return {
        touch: [efficiency, heater].every(r => r.width >= 43.9 && r.height >= 43.9),
        separate: efficiency.bottom <= heater.top + .1 || efficiency.left >= heater.right || efficiency.right <= heater.left,
        inside: [efficiency, heater].every(r => r.top >= scene.top && r.bottom <= scene.bottom + 1 && r.left >= scene.left && r.right <= scene.right),
        aligned: hit('.core-value', '.efficiency-history') && hit('.heater-symbol', '.heater-history'),
      };
    }), { message: `${width}×${height}` }).toEqual({ touch: true, separate: true, inside: true, aligned: true });
  }
});
