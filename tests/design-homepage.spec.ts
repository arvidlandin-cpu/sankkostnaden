import { expect, test } from '@playwright/test';

const route='/?qa=1';
const widths=[360,390,430,1024,1440];

test('homepage first action is clear, honest and visually dominant',async({page})=>{
  await page.goto(route);
  const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
  await expect(hero.getByRole('heading',{name:'Sänk dina fasta kostnader'})).toBeVisible();
  await expect(hero.getByText(/en första startpunkt efter en enkel fråga/i)).toBeVisible();
  const first=hero.getByRole('link',{name:/Starta Kostnadskollen/});
  await expect(first).toHaveAttribute('href','/app/');
  await expect(first).toBeVisible();
  await expect(first).toContainText('Första vägledning efter en fråga');
  for(const href of ['/bredband/','/elavtal/','/mobil/','/forsakring/','/ekonomi/']){
    await expect(hero.locator(`a[href="${href}"]`)).toBeVisible();
  }
  const styles=await first.evaluate(el=>{
    const link=getComputedStyle(el);
    const desc=el.querySelector('small');
    const small=desc?getComputedStyle(desc):null;
    return {background:link.backgroundColor,labelSize:small?parseFloat(small.fontSize):0};
  });
  expect(styles.background).toBe('rgb(223, 244, 106)');
  expect(styles.labelSize).toBeGreaterThanOrEqual(12);
});

for(const width of widths){
  test(`home v1 at ${width}px: legible, responsive, keyboard-ready`,async({page},testInfo)=>{
    await page.setViewportSize({width,height:width<=430?844:900});
    await page.goto(route,{waitUntil:'networkidle'});
    const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
    const first=hero.getByRole('link',{name:/Starta Kostnadskollen/});
    await expect(first).toBeVisible();
    if(width<=430){
      const quickBar=page.getByRole('navigation',{name:'Snabbnavigering'});
      await expect(quickBar).toBeVisible();
      for(const href of ['/bredband/','/elavtal/','/mobil/','/forsakring/','/ekonomi/']){
        await expect(quickBar.locator(`a[href="${href}"]`)).toBeVisible();
        await expect(hero.locator(`a[href="${href}"]`)).toBeHidden();
      }
      await expect(hero.getByText(/Välj det direkt i menyn längst ned/i)).toBeVisible();
    }
    const data=await page.evaluate(()=>{
      const hero=document.querySelector('section[aria-label="Hitta rätt jämförelse"]');
      if(!hero)throw new Error('HomeHero missing');
      const tiny=[...hero.querySelectorAll('small')]
        .filter(el=>getComputedStyle(el).display!=='none')
        .map(el=>({text:el.textContent,px:parseFloat(getComputedStyle(el).fontSize)}));
      return {
        overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth,
        tiny,
        brandAccent:getComputedStyle(document.documentElement).getPropertyValue('--sk-accent').trim(),
      };
    });
    expect(data.overflow).toBeLessThanOrEqual(1);
    expect(data.brandAccent).toBe('#dff46a');
    expect(data.tiny,JSON.stringify(data.tiny)).not.toEqual([]);
    for(const item of data.tiny)expect(item.px,item.text||'unnamed').toBeGreaterThanOrEqual(12);
    await first.focus();
    const focus=await first.evaluate(el=>({width:parseFloat(getComputedStyle(el).outlineWidth),style:getComputedStyle(el).outlineStyle}));
    expect(focus.style).toBe('solid');
    expect(focus.width).toBeGreaterThanOrEqual(3);
    await page.screenshot({path:`test-results/screenshots/design-v1-home-${testInfo.project.name}-${width}.png`,fullPage:true});
  });
}
