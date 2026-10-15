import { test, expect } from '@playwright/test';
import { getActivePartners, type PartnerIntent } from '../lib/partners';

test.beforeEach(async ({ context, baseURL }) => {
  const origin = new URL(baseURL || 'https://sankkostnaden.se').origin;
  await context.route('**/*', route => {
    if (route.request().isNavigationRequest() && new URL(route.request().url()).origin !== origin) return route.abort();
    return route.continue();
  });
});

const choices: { filter: string; intent?: PartnerIntent; path: string; text: string }[] = [
  { filter: 'all', path: '/forsakring/jamfor-forsakring/', text: 'Hjälp mig jämföra försäkringar' },
  { filter: 'home', intent: 'home', path: '/forsakring/jamfor-hemforsakring/', text: 'Så jämför du hemförsäkring' },
  { filter: 'pet', intent: 'pet', path: '/forsakring/djurforsakring/', text: 'Så jämför du djurförsäkring' },
  { filter: 'travel', intent: 'travel', path: '/forsakring/reseforsakring/', text: 'Förstå reseskyddet' },
  { filter: 'income', intent: 'income-protection', path: '/forsakring/trygghetsforsakring/', text: 'Förstå trygghetsförsäkringens villkor' },
  { filter: 'claims', intent: 'claims', path: '/forsakring/forsakringsersattning/', text: 'Förstå försäkringsersättning' },
];

for (const choice of choices) {
  test(`Insurance ${choice.filter}: relevant help and unchanged partner eligibility`, async ({ page }) => {
    await page.goto('/?qa=1');
    await page.getByTestId('v10-category-forsakring').click();
    await page.getByTestId(`v10-filter-${choice.filter}`).click();
    const help = page.getByTestId('v11-route-guide');
    await expect(help).toHaveText(choice.text);
    await expect(help).toHaveAttribute('href', choice.path);
    const links = page.getByTestId('cost-map-journey').getByTestId('v10-partner-card');
    const partners = getActivePartners('forsakring', choice.intent, Infinity);
    await expect(links).toHaveCount(partners.length);
    for (const partner of partners) {
      const link = links.filter({ has: page.locator('strong', { hasText: new RegExp('^' + partner.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }) });
      await expect(link).toHaveAttribute('href', partner.trackingUrl);
      await expect(link).toHaveAttribute('rel', /sponsored/);
    }
    const tool = page.getByTestId('v11-route-tool');
    await expect(tool).toHaveAttribute('href', choice.intent && choice.intent !== 'home' ? '/verktyg/hushallskostnadskollen/' : '/forsakring/hemforsakring-skyddskoll/');
    // Follow the real internal destination with QA enabled; never follow a sponsor.
    await page.goto(choice.path + '?qa=1');
    await expect(page.locator('main h1')).toHaveCount(1);
    if (choice.intent === 'pet' || choice.intent === 'travel') {
      const gatewayHelp = page.locator('.decisionGateway a.gatewayPath').last();
      await expect(gatewayHelp).toHaveAttribute('href', choice.path + '#guide-summary');
      await expect(page.locator('#guide-summary')).toHaveCount(1);
    }
  });
}

test('Changing insurance intent preserves home click attribution without outgoing navigation', async ({ page }) => {
  await page.addInitScript(() => { (window as any).dataLayer = []; });
  await page.goto('/?qa=1');
  await page.getByTestId('v10-category-forsakring').click();
  await page.getByTestId('v10-filter-travel').click();
  await expect(page.getByTestId('v11-route-guide')).toHaveAttribute('href', '/forsakring/reseforsakring/');
  await page.getByTestId('v10-filter-home').click();
  await expect(page.getByTestId('v11-route-guide')).toHaveAttribute('href', '/forsakring/jamfor-hemforsakring/');
  const partner = getActivePartners('forsakring', 'home', Infinity).find(item => item.name === 'Hedvig')!;
  const link = page.getByTestId('v10-partner-card').filter({ has: page.locator('strong', { hasText: /^Hedvig$/ }) });
  await expect(link).toHaveAttribute('href', partner.trackingUrl);
  await expect(link).toHaveAttribute('data-intent', 'home');
  await link.evaluate(node => {
    node.addEventListener('click', event => event.preventDefault(), { once: true });
    (node as HTMLAnchorElement).click();
  });
  const events = await page.evaluate(() => (window as any).dataLayer || []);
  const clicks = events.filter((event: any) => event.event === 'affiliate_click');
  expect(clicks).toHaveLength(1);
  expect(clicks[0].intent).toBe('home');
  expect(clicks[0].local_click_id).toMatch(/^clk_/);
  expect(new URL((await link.getAttribute('href'))!).searchParams.get('r')).toBe(clicks[0].local_click_id);
  await expect(page).toHaveURL(/\/\?qa=1$/);
});
