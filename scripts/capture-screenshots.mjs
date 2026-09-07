import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Use only local demo fixtures: these screenshots must never expose a live home.
const base = 'http://127.0.0.1:5173';
const output = new URL('../docs/images/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 800, height: 650 }, deviceScaleFactor: 2 });
  await page.clock.setFixedTime(new Date('2026-01-15T12:00:00Z'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [name, scenario, theme] of [['heat-recovery', 'winter', 'dark'], ['defrost', 'defrost', 'light']]) {
    await page.goto(`${base}/?test=1&scenario=${scenario}&theme=${theme}&language=en&width=480&height=504`);
    const card = page.locator('vallox-iv-card');
    await card.locator('.core-frame').waitFor({ state: 'visible' });
    await card.locator('.footer').filter({ hasText: 'kWh' }).waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);
    await card.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)), animations: 'disabled' });
    console.log(`Captured ${name}.png`);
  }
} finally {
  await browser.close();
}
