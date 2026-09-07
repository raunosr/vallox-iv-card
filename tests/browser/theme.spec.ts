import { test, expect } from '@playwright/test';

test('HA owns the frame, including zero/thick borders and theme changes', async ({page}) => {
  await page.goto('/?test=1');
  await expect(page.locator('.core-frame')).toBeVisible();
  await page.evaluate(() => {
    const reference = document.createElement('ha-card');
    reference.id = 'native-reference';
    document.getElementById('slot')!.append(reference);
  });
  for (const width of ['0px','4px']) {
    await page.evaluate(width => {
      const slot = document.getElementById('slot')!;
      for (const [key,value] of Object.entries({
        '--ha-card-border-width':width, '--ha-card-border-radius':'9px',
        '--ha-card-background':'rgba(33,45,67,0.3)', '--ha-card-border-color':'rgb(123,100,190)',
        '--ha-card-box-shadow':'0 3px 12px rgba(0,0,0,0.4)', '--ha-card-backdrop-filter':'blur(7px)',
      })) slot.style.setProperty(key,value);
    },width);
    const frames = await page.evaluate(() => {
      const style = (node:Element) => {
        const s = getComputedStyle(node);
        return [s.background,s.border,s.borderRadius,s.boxShadow,s.backdropFilter];
      };
      return {actual:style(document.querySelector('vallox-iv-card')!.shadowRoot!.querySelector('ha-card')!),
        native:style(document.getElementById('native-reference')!)};
    });
    expect(frames.actual).toEqual(frames.native);
  }
});

for (const [width,height] of [[320,248],[480,504]]) test(`glass theme remains transparent at ${width}×${height}`, async ({page}) => {
  await page.goto(`/?test=1&theme=glass&width=${width}&height=${height}`);
  await expect(page.locator('.core-frame')).toBeVisible();
  const appearance = await page.locator('vallox-iv-card').evaluate(el => {
    const root = el.shadowRoot!,frame = root.querySelector('ha-card')!,surface=root.querySelector('.surface')!;
    const s=getComputedStyle(frame),before=getComputedStyle(frame,'::before');
    return {background:s.backgroundColor,layer:before.backgroundColor,blur:before.backdropFilter,
      overlay:getComputedStyle(surface).backgroundImage,overflow:surface.scrollHeight>surface.clientHeight+1};
  });
  expect(appearance).toEqual({background:'rgba(0, 0, 0, 0)',layer:'rgba(28, 29, 33, 0.18)',
    blur:'blur(10px) saturate(1.2)',overlay:'none',overflow:false});
  // Changing the selected theme must update the same card without a reload.
  await page.evaluate(() => document.body.classList.replace('glass','light'));
  await expect(page.locator('vallox-iv-card ha-card')).toHaveCSS('background-color','rgb(251, 253, 252)');
});

test('controls follow the theme primary colour and retain a Vallox override', async ({page}) => {
  await page.goto('/?test=1');
  await expect(page.locator('.mode[aria-pressed=true]')).toBeVisible();
  for (const color of ['rgb(106, 116, 211)','rgb(185, 71, 146)']) {
    await page.locator('vallox-iv-card').evaluate((el,color)=>(el as HTMLElement).style.setProperty('--primary-color',color),color);
    await expect(page.locator('.mode[aria-pressed=true] svg')).toHaveCSS('color',color);
    await expect(page.locator('.profile-chip svg')).toHaveCSS('color',color);
  }
  await page.locator('vallox-iv-card').evaluate(el=>(el as HTMLElement).style.setProperty('--vallox-accent','rgb(0, 130, 110)'));
  await expect(page.locator('.mode[aria-pressed=true] svg')).toHaveCSS('color','rgb(0, 130, 110)');
});

test('a gradient card background does not erase SVG channel separation', async ({page}) => {
  await page.goto('/?test=1&scenario=bypass');
  await page.locator('vallox-iv-card').evaluate(el=>(el as HTMLElement).style.setProperty('--ha-card-background','linear-gradient(120deg, #243553, #39324a)'));
  await expect(page.locator('.air-track').first()).not.toHaveCSS('stroke','none');
  await expect(page.locator('.gate-seat')).not.toHaveCSS('stroke','none');
});
