import { expect, test } from '@playwright/test';

// Runs against Playwright WebKit on Linux with narrow iPhone-like viewports.
// This is useful Safari-engine regression, NOT a real iPhone / BrowserStack pass.
const pages=[
 {href:'/',heading:/Sänk dina fasta kostnader/},
 {href:'/elavtal/',heading:/Jämför elavtal utan att gissa/},
 {href:'/bredband/',heading:/Hitta bredband som passar ditt hem/},
 {href:'/mobil/',heading:/Jämför mobilabonnemang utan att betala/},
 {href:'/forsakring/',heading:/Välj rätt försäkringsskydd/},
 {href:'/ekonomi/',heading:/Jämför hela lånekostnaden/},
 {href:'/app/',heading:/Vilket avtal bör du kontrollera först/},
];
for(const width of [360,390,430]){
 for(const target of pages){
  test('WebKit iPhone-width '+width+' '+target.href+' maintains a usable first screen',async({page})=>{
   await page.setViewportSize({width,height:844});
   await page.goto(target.href+'?qa=1',{waitUntil:'domcontentloaded'});
   await expect(page.getByRole('heading',{level:1,name:target.heading})).toBeVisible();
   const gap=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
   expect(gap).toBeLessThanOrEqual(1);
   if(target.href==='/app/'){
    const question=page.getByRole('group',{name:'Vad stämmer bäst om ditt elavtal?'});
    await expect(question.getByRole('button')).toHaveCount(3);
   }else{
    await expect(page.locator('a[href^="/"]').first()).toBeVisible();
   }
  });
 }
}
test('WebKit mobile browser supports keyboard navigation, affiliate labels and real-price fallback',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/elavtal/?qa=1');
 await expect(page.locator('a[data-placement="electricity_hub_comparison"]')).toHaveAttribute('rel',/sponsored/);
 await expect(page.locator('a[data-partner="Tibber"]')).toHaveAttribute('href',/go\.adt242\.com/);
 await expect(page.getByTestId('electricity-spot-prices')).toBeVisible();
 const nav=page.getByRole('navigation',{name:'Snabbnavigering'});
 await expect(nav).toBeVisible();
 const first=nav.getByRole('link').first();
 await first.focus();
 await expect(first).toBeFocused();
});
