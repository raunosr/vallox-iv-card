import { test, expect } from '@playwright/test';

for (const [language,width,height,theme] of [['fi',480,504,'dark'],['en',320,248,'light']] as const) {
  test(`heater summary and direct advice are readable and read-only (${language}, ${width})`, async ({page}) => {
    await page.clock.setFixedTime(new Date('2026-01-20T12:00:00Z'));
    await page.setViewportSize({width:width+40,height:900});
    await page.goto(`/?test=1&scenario=steady-heat&language=${language}&width=${width}&height=${height}&theme=${theme}`);
    await page.locator('.profile-chip').click();
    await page.getByRole('tab',{name:language==='fi'?'Havainnot':'Insights'}).click();
    await expect(page.getByRole('heading',{name:language==='fi'?'Kokeile alempaa tuloilman tavoitetta':'Try a lower supply-air target'})).toBeVisible();
    await expect(page.locator('.insight')).toHaveCount(1);
    await expect(page.locator('.insight')).toContainText(language==='fi'?'6,60 kWh':'6.60 kWh');
    await expect(page.locator('.insight button')).toHaveCount(0);
    await expect(page.locator('#calls')).toBeEmpty();
    await page.getByRole('tab',{name:language==='fi'?'Energia':'Energy',exact:true}).click();
    const summary = page.locator('.heating-summary');
    await expect(summary).toBeVisible();
    await expect(summary.locator('dd').nth(0)).toHaveText('24 h');
    await expect(summary.locator('dd').nth(1)).toHaveText('24 h');
    await expect(summary.locator('dd').nth(2)).toHaveText('0 min');
    await expect(summary.locator('.heating-electricity')).toContainText(language==='fi'?'26,40':'26.40');
    await expect(summary.locator('dd').nth(4)).toHaveText(language==='fi'?'8,0 °C':'8.0 °C');
    const fits = await summary.evaluate(el => {
      const panel = el.closest('.dialog-body')!, r = panel.getBoundingClientRect();
      return [...el.querySelectorAll('dt,dd')].every(n=>{const b=n.getBoundingClientRect(); return b.left>=r.left && b.right<=r.right;}) && panel.scrollWidth<=panel.clientWidth;
    });
    expect(fits).toBe(true);
    await summary.screenshot({path:`.cache/heating-${language}-${width}.png`});
    await page.getByRole('button',{name:language==='fi'?'Sulje':'Close',exact:true}).click();
    await page.locator('vallox-iv-card').screenshot({path:`.cache/heating-card-${width}.png`});
  });
}

test('defrost heater runtime is not shown as ordinary supply heating', async ({page}) => {
  await page.goto('/?test=1&scenario=defrost&width=390&height=376');
  await page.locator('.profile-chip').click();
  await page.getByRole('tab',{name:'Energia',exact:true}).click();
  const values = page.locator('.heating-summary dd');
  await expect(values.nth(0)).toHaveText('24 h');
  await expect(values.nth(1)).toHaveText('0 min');
  await expect(values.nth(2)).toHaveText('24 h');
  await expect(values.nth(3)).toHaveText('— kWh');
  await expect(values.nth(4)).toHaveText('— °C');
  await page.getByRole('tab',{name:'Havainnot'}).click();
  await expect(page.getByRole('heading',{name:'Kokeile alempaa tuloilman tavoitetta'})).toHaveCount(0);
});

test('unavailable heater history remains unknown in details', async ({page}) => {
  await page.goto('/?test=1&scenario=unknown');
  await page.locator('.footer').click();
  await page.getByRole('tab',{name:'Energia',exact:true}).click();
  await expect(page.locator('.heating-summary dd').nth(0)).toHaveText('— min');
  await expect(page.locator('.heating-summary')).toContainText('historiakattavuus: 0 %');
});
