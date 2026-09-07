import { test,expect } from '@playwright/test';
for(const theme of ['dark','light','slate']) test(`temperature values and active profile have readable contrast in ${theme}`,async({page})=>{
  await page.goto(`/?test=1&theme=${theme}`);
  await expect(page.locator('.air-value').first()).toBeVisible();
  for(const profile of ['Kotona','Tehostus']) {
  await page.getByRole('button',{name:profile,exact:true}).click();
  const contrasts=await page.locator('vallox-iv-card').evaluate(el=>{
    const root=el.shadowRoot!;
    const rgb=(color:string)=>{
      const numbers=color.match(/[\d.]+/g)!.slice(0,3).map(Number);
      return numbers.map(x=>color.startsWith('color(')?x:x/255);
    };
    const luminance=(color:number[])=>{
      const values=color.map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
      return values[0]*.2126+values[1]*.7152+values[2]*.0722;
    };
    const cardColor=rgb(getComputedStyle(root.querySelector('ha-card')!).backgroundColor);
    return [...root.querySelectorAll('.air-value,.mode[aria-pressed=true]')].map(node=>{
      const style=getComputedStyle(node),fill=style.backgroundColor;
      const alpha=Number(fill.match(/\/\s*([\d.]+)\)/)?.[1] ?? fill.match(/rgba\(.+,\s*([\d.]+)\)/)?.[1] ?? 1);
      const background=luminance(rgb(fill).map((c,i)=>c*alpha+cardColor[i]*(1-alpha)));
      const foreground=luminance(rgb(style.color));
      return (Math.max(background,foreground)+.05)/(Math.min(background,foreground)+.05);
    });
  });
  for(const contrast of contrasts)expect(contrast).toBeGreaterThanOrEqual(4.5);
  }
});

test('core, arrowheads and active Boost remain legible in a Sections card with energy',async({page})=>{
  await page.goto('/?test=1&scenario=missing&width=464&height=376&theme=slate');
  await page.getByRole('button',{name:'Tehostus',exact:true}).click();
  await expect(page.locator('.mode[aria-pressed=true]')).toHaveText('Tehostus');
  const geometry=await page.locator('vallox-iv-card').evaluate(el=>{
    const root=el.shadowRoot!,rect=(selector:string)=>root.querySelector(selector)!.getBoundingClientRect();
    const svg=root.querySelector('svg.core-svg') as SVGSVGElement;
    const marker=svg.querySelector('marker')!;
    const arrowWidth=Number(marker.getAttribute('markerHeight'))*svg.getScreenCTM()!.a;
    const strokeWidth=parseFloat(getComputedStyle(svg.querySelector('.air-route')!).strokeWidth)*svg.getScreenCTM()!.a;
    const label=rect('.efficiency-label');
    return {core:rect('.core-frame').height,arrowWidth,strokeWidth,footer:rect('.footer').height,
      captionSeparate:label.top>=rect('.core-frame').bottom-1,
      energyVisible:rect('.footer').bottom<el.getBoundingClientRect().bottom};
  });
  expect(geometry.core).toBeGreaterThan(100);
  expect(geometry.arrowWidth).toBeGreaterThan(18);
  expect(geometry.arrowWidth).toBeGreaterThan(geometry.strokeWidth*2);
  expect(geometry.captionSeparate).toBe(true);
  expect(geometry.energyVisible).toBe(true);
  expect(geometry.footer).toBe(44);
  await expect(page.locator('.footer')).toContainText('Energiamittaus puuttuu');
  await page.goto('/?test=1&width=464&height=376&theme=slate');
  await expect(page.locator('.footer')).toContainText('84 W');
  expect((await page.locator('.footer').boundingBox())!.height).toBe(geometry.footer);
});
test('fan percentage, extract-air quality and supply heater stay distinct in a compact card',async({page})=>{
  await page.goto('/?test=1&width=320&height=248');
  const card=page.locator('vallox-iv-card');
  await expect(card.locator('.fan-readout')).toContainText('Puhallin 52 %');
  await expect(card.locator('.fan-readout svg')).toBeVisible();
  await expect(card.locator('.extract')).toContainText('CO₂');
  await expect(card.locator('.extract')).toContainText('Kosteus 38 %');
  await expect(card.locator('.supply')).not.toContainText('CO₂');
  await expect(card.locator('.supply')).toContainText('Vastus pois');
  await expect(card.locator('.heater-symbol')).toBeVisible();
  await expect(card.locator('.core-value')).toHaveText('74%');
});

for(const [width,height] of [[320,248],[320,376],[390,376]]) test(`localized heater and quality readings fit with wider fonts at ${width}×${height}`,async({page})=>{
  for(const language of ['fi','en']) {
    await page.goto(`/?test=1&scenario=defrost&width=${width}&height=${height}&language=${language}`);
    await page.addStyleTag({content:'vallox-iv-card { font-family:Verdana,sans-serif; letter-spacing:.035em; }'});
    await expect(page.locator('.reading-value')).toHaveCount(4);
    await expect(page.locator('.supply-chain')).toContainText(language==='fi'?'lämmittää':'heating');
    const bounds=await page.locator('vallox-iv-card').evaluate(el=>{
      const root=el.shadowRoot!,scene=root.querySelector('.scene')!.getBoundingClientRect();
      const extract=root.querySelector('.extract')!.getBoundingClientRect(),supply=root.querySelector('.supply')!.getBoundingClientRect();
      return {separate:extract.bottom<=supply.top+1,inside:extract.top>=scene.top-1&&supply.bottom<=scene.bottom+1,
        valuesFit:[...root.querySelectorAll('.reading-value')].every(node=>{
          const value=node.getBoundingClientRect(),air=node.closest('.air')!.getBoundingClientRect();
          return value.right<=air.right+1&&value.left>=air.left-1&&node.scrollWidth<=node.clientWidth+1;
        })};
    });
    expect(bounds,language).toEqual({separate:true,inside:true,valuesFit:true});
  }
});
test('detail tabs support arrow keys without leaving the tab list',async({page})=>{
  await page.goto('/?test=1');
  await page.getByRole('button',{name:'Avaa ohjaus ja lisätiedot'}).click();
  await page.getByRole('tab',{name:'Ohjaus'}).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab',{name:'Energia'})).toBeFocused();
  await expect(page.getByRole('tab',{name:'Energia'})).toHaveAttribute('aria-selected','true');
});
for(const width of [320,390,480,768]) for(const height of [248,376,504]) for(const theme of ['dark','light']) {
  test(`fits ${width}×${height} ${theme}`,async({page})=>{
    await page.goto(`/?test=1&width=${width}&height=${height}&theme=${theme}`);
    const card=page.locator('vallox-iv-card');
    await expect(card.getByRole('heading',{name:'Lämmöntalteenotto'})).toBeVisible();
    await expect.poll(async()=>card.evaluate(el=>{
      const root=el.shadowRoot!,surface=root.querySelector('.surface')!,scene=root.querySelector('.scene')!.getBoundingClientRect(),bounds=el.getBoundingClientRect();
      const rects=[...root.querySelectorAll('.top,.scene,.modes,.footer')].filter(n=>n.getBoundingClientRect().height>0).map(n=>n.getBoundingClientRect());
      const buttons=[...root.querySelectorAll('.surface button')].filter(n=>n.getBoundingClientRect().height>0);
      return {overflow:surface.scrollHeight>surface.clientHeight+1||surface.scrollWidth>surface.clientWidth+1,
        inside:rects.every(r=>r.bottom<=bounds.bottom+1&&r.right<=bounds.right+1),
        overlap:rects.some((r,i)=>i>0&&r.top<rects[i-1].bottom-1),
        airFits:[...root.querySelectorAll('.air')].every(n=>n.getBoundingClientRect().bottom<=scene.bottom+1),
        touch:buttons.every(n=>n.getBoundingClientRect().height>=43.9)};
    })).toEqual({overflow:false,inside:true,overlap:false,airFits:true,touch:true});
  });
}
test('masonry has a natural height and contains its children',async({page})=>{await page.goto('/?test=1&width=390&layout=masonry');await expect(page.getByRole('heading',{name:'Lämmöntalteenotto'})).toBeVisible();const bounds=await page.locator('vallox-iv-card').boundingBox();expect(bounds!.height).toBeGreaterThan(300);expect(bounds!.height).toBeLessThan(600);});
test('profile buttons send a targeted command with keyboard and dialog closes with Escape',async({page})=>{await page.goto('/?test=1');const away=page.getByRole('button',{name:'Poissa',exact:true});await away.focus();await page.keyboard.press('Space');await expect(away).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'Avaa ohjaus ja lisätiedot'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();});
test('all modes remain inside a small card',async({page})=>{await page.goto('/?width=320&height=248');await page.getByRole('button',{name:'Kaikki profiilit'}).click();await expect(page.getByRole('button',{name:'Takka',exact:true})).toBeVisible();const overflow=await page.locator('vallox-iv-card').evaluate(el=>{const r=el.shadowRoot!.querySelector('.surface')!;return r.scrollHeight>r.clientHeight+1;});expect(overflow).toBe(false);});
test('a broken meter never displays zero energy or an energy-saving claim',async({page})=>{await page.goto('/?test=1&scenario=missing');await page.getByRole('button',{name:'Avaa energia ja havainnot'}).click();await expect(page.getByRole('dialog')).toContainText('Energiamittaus puuttuu');await page.getByRole('tab',{name:'Havainnot'}).click();await expect(page.getByRole('dialog')).toContainText('Puuttuva mittaus ei tarkoita nollakulutusta');});
test('different operating states have different airflow paths',async({page})=>{await page.goto('/?test=1');const heat=await page.locator('.supply-route').getAttribute('d');await page.goto('/?test=1&scenario=bypass');const bypass=await page.locator('.supply-route').getAttribute('d');expect(bypass).not.toBe(heat);await expect(page.locator('.core-svg')).toHaveClass(/bypass/);});
test('reduced motion is respected',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?test=1');await expect(page.locator('.core-svg')).toBeVisible();expect(await page.locator('.air-motion').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');});

for(const [width,height] of [[320,248],[390,376],[420,440],[768,504]]) test(`core and heater stay fixed across states at ${width}×${height}`,async({page})=>{
  let baseline: number[] | undefined;
  for(const scenario of ['winter','bypass','cool','defrost','defrost-stop','stopped','unknown']) {
    await page.goto(`/?test=1&scenario=${scenario}&width=${width}&height=${height}`);
    await expect(page.locator('.core-frame')).toBeVisible();
    await expect.poll(async()=>page.locator('vallox-iv-card').evaluate(el=>el.getBoundingClientRect().height)).toBe(height);
    const geometry=await page.locator('vallox-iv-card').evaluate(el=>{
      const root=el.shadowRoot!;
      const rect=(selector:string)=>root.querySelector(selector)!.getBoundingClientRect();
      const scene=rect('.scene'),extract=rect('.extract'),supply=rect('.supply');
      return {fixed:['.core-frame','.heater-symbol'].flatMap(selector=>{const r=rect(selector);return [r.x,r.y,r.width,r.height];}),
        separate:extract.bottom<=supply.top+1,
        contained:extract.top>=scene.top-1&&supply.bottom<=scene.bottom+1};
    });
    expect(geometry.separate,scenario).toBe(true);
    expect(geometry.contained,scenario).toBe(true);
    if(baseline)geometry.fixed.forEach((value,i)=>expect(Math.abs(value-baseline![i]),`${scenario}, coordinate ${i}`).toBeLessThan(.6));
    else baseline=geometry.fixed;
  }
});
test('bypass enters from outdoors, exits left and passes under a separate extract channel',async({page})=>{
  await page.goto('/?test=1&scenario=bypass');
  const route=await page.locator('.supply-route').evaluate(node=>{
    const path=node as SVGPathElement,length=path.getTotalLength();
    const start=path.getPointAtLength(0),inlet=path.getPointAtLength(8),beforeEnd=path.getPointAtLength(length-8),end=path.getPointAtLength(length);
    const group=path.parentElement!,overpass=group.nextElementSibling!;
    const points=Array.from({length:101},(_,i)=>path.getPointAtLength(i*length/100));
    return {inletLeft:inlet.x<start.x&&Math.abs(inlet.y-start.y)<.01,outletLeft:end.x<beforeEnd.x&&Math.abs(end.y-beforeEnd.y)<.01,
      beginsOutdoors:start.x>170&&start.y<30,endsAtSupply:end.x<20&&end.y>130,
      insideViewBox:points.every(p=>p.x>=0&&p.x<=208&&p.y>=0&&p.y<=190),
      separated:overpass.classList.contains('extract-channel')&&Number.parseFloat(getComputedStyle(overpass.querySelector('.crossing-track')!).strokeWidth)>Number.parseFloat(getComputedStyle(path).strokeWidth)+6};
  });
  expect(route).toEqual({inletLeft:true,outletLeft:true,beginsOutdoors:true,endsAtSupply:true,insideViewBox:true,separated:true});
  await expect(page.locator('.bypass-gate')).toBeVisible();
  await expect(page.locator('.thaw')).toHaveCount(0);
});
test('defrost ice respects reduced motion and supply-stop does not animate incoming air',async({page})=>{
  await page.goto('/?test=1&scenario=defrost');
  await expect(page.locator('.melt-drop')).toHaveCount(3);
  await expect(page.locator('.core-center,.core-symbol,.frost-patch,.ice-crystal')).toHaveCount(0);
  expect(await page.locator('.melt-drop').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('melt-drop');
  await expect(page.locator('.supply-motion')).toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const selector of ['.melt-drop','.air-motion'])expect(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  await page.goto('/?test=1&scenario=defrost-stop');
  await expect(page.locator('.thaw')).toBeVisible();
  await expect(page.locator('.supply-motion')).toHaveCount(0);
  await expect(page.locator('.supply-route')).toHaveClass(/no-flow/);
  await expect(page.locator('.bypass-gate')).toHaveCount(0);
  await expect(page.locator('.extract-motion')).toBeVisible();
});
