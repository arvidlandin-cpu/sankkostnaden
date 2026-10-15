import { expect, test, type Page } from '@playwright/test';

const route = '/verktyg/forstaarskostnad-bredband/?qa=1';

async function openPrices(page: Page, exact = true) {
  await page.goto(route);
  await page.getByRole('button', { name: 'Ja, jämför mina priser', exact: true }).click();
  if (exact) await page.getByRole('button', { name: 'Exakt med kampanjer och avgifter', exact: true }).click();
}

async function offer(page: Page, which: 'a' | 'b', values: { campaign?: string; months?: string; regular: string; extras?: string; fees?: string }) {
  const card = page.getByTestId(`offer-${which}`);
  await card.getByLabel('Kampanjpris / mån').fill(values.campaign || '0');
  await card.getByLabel('Kampanjmånader').fill(values.months || '0');
  await card.getByLabel('Ordinarie pris / mån').fill(values.regular);
  await card.getByLabel('Övrigt per månad').fill(values.extras || '0');
  await card.getByLabel('Engångsavgifter totalt').fill(values.fees || '0');
}

async function sample(page: Page, extras = '0') {
  await offer(page, 'a', { campaign: '199', months: '6', regular: '449', extras, fees: '299' });
  await offer(page, 'b', { campaign: '349', months: '12', regular: '499' });
}

function digits(value: string | null) { return (value || '').replace(/[^0-9]/g, ''); }

// Reconcile the rendered monthly series with independently known annual costs,
// rather than testing a second implementation of the calculation function.
test('twelve months reconcile campaign, ordinary price and separately charged fee', async ({ page }) => {
  await openPrices(page);
  await expect(page.getByTestId('first-year-timeline')).toHaveCount(0);
  await offer(page, 'a', { campaign: '199', months: '6', regular: '449', fees: '299' });
  await expect(page.getByTestId('first-year-timeline')).toHaveCount(0);
  await offer(page, 'b', { campaign: '349', months: '12', regular: '499' });
  const timeline = page.getByTestId('first-year-timeline');
  await expect(timeline).toBeVisible();
  await expect(page.locator('[data-testid^="timeline-month-0-"]')).toHaveCount(12);
  await expect(page.locator('[data-testid^="timeline-month-1-"]')).toHaveCount(12);
  await expect(page.locator('[data-testid^="timeline-month-0-"][data-period="campaign"]')).toHaveCount(6);
  expect(digits(await page.getByTestId('timeline-total-0').textContent())).toBe('4187');
  expect(digits(await page.getByTestId('timeline-total-1').textContent())).toBe('4188');
  await expect(page.getByTestId('timeline-month-0-12')).toHaveAttribute('data-base', '449');
  await expect(page.getByTestId('timeline-fee-0')).toContainText('299');
  await timeline.getByText('Visa beloppen månad för månad', { exact: true }).click();
  await expect(page.getByTestId('timeline-table-0').getByRole('rowheader', { name: 'Månad 1 Kampanj', exact: true })).toBeVisible();
  await expect(page.getByTestId('timeline-table-0').getByRole('rowheader', { name: 'Månad 12 Ordinarie', exact: true })).toBeVisible();
  const monthly = await page.locator('[data-testid^="timeline-month-0-"]').evaluateAll(elements => elements.reduce((sum, element) => sum + Number(element.getAttribute('data-base')) + Number(element.getAttribute('data-extras')), 0));
  expect(monthly).toBe(3888);
  expect(monthly + 299).toBe(4187);
  await expect(page.getByTestId('first-year-commercial-cta')).toHaveAttribute('href', '#commercial-broadband-options');
});

test('recurring extras belong to every month while fee stays outside month twelve', async ({ page }) => {
  await openPrices(page);
  await sample(page, '29');
  await expect(page.getByTestId('timeline-month-0-1')).toHaveAttribute('data-extras', '29');
  await expect(page.getByTestId('timeline-month-0-12')).toHaveAttribute('data-extras', '29');
  await expect(page.getByTestId('timeline-month-0-12')).toHaveAttribute('data-base', '449');
  expect(digits(await page.getByTestId('timeline-total-0').textContent())).toBe('4535');
  const sum = await page.locator('[data-testid^="timeline-month-0-"]').evaluateAll(elements => elements.reduce((total, element) => total + Number(element.getAttribute('data-base')) + Number(element.getAttribute('data-extras')), 0));
  expect(sum + 299).toBe(4535);
});

test('quick mode excludes hidden campaign, extras and fee and exact mode restores them', async ({ page }) => {
  await openPrices(page);
  await sample(page, '29');
  await page.getByRole('button', { name: 'Snabb jämförelse', exact: true }).click();
  await expect(page.locator('[data-testid^="timeline-month-0-"][data-period="campaign"]')).toHaveCount(0);
  await expect(page.getByTestId('timeline-month-0-1')).toHaveAttribute('data-base', '449');
  await expect(page.getByTestId('timeline-month-0-1')).toHaveAttribute('data-extras', '0');
  await expect(page.getByTestId('timeline-fee-0')).toContainText(/:\s*0(?:[,.]00)?\s*kr/);
  expect(digits(await page.getByTestId('timeline-total-0').textContent())).toBe('5388');
  await page.getByRole('button', { name: 'Exakt med kampanjer och avgifter', exact: true }).click();
  expect(digits(await page.getByTestId('timeline-total-0').textContent())).toBe('4535');
  await expect(page.locator('[data-testid^="timeline-month-0-"][data-period="campaign"]')).toHaveCount(6);
});

test('fractional prices reconcile before the shared whole-krona display rounding', async ({ page }) => {
  await openPrices(page);
  await offer(page, 'a', { campaign: '199.5', months: '6', regular: '449.5', extras: '29.25', fees: '299.25' });
  await offer(page, 'b', { regular: '349.5' });
  const recurring = await page.locator('[data-testid^="timeline-month-0-"]').evaluateAll(elements => elements.reduce((sum, element) => sum + Number(element.getAttribute('data-base')) + Number(element.getAttribute('data-extras')), 0));
  expect(recurring).toBe(4245);
  expect(recurring + 299.25).toBe(4544.25);
  expect(digits(await page.getByTestId('timeline-total-0').textContent())).toBe('4544');
  await expect(page.getByTestId('timeline-total-0')).toHaveText(await page.getByTestId('offer-a-total').innerText());
});

for (const [input, campaignCount, total] of [['0', 0, '4800'], ['12', 12, '1200'], ['6.6', 7, '2700'], ['19', 12, '1200']] as const) {
  test(`timeline uses normalized campaign duration ${input}`, async ({ page }) => {
    await openPrices(page);
    await offer(page, 'a', { campaign: '100', months: input, regular: '400' });
    await offer(page, 'b', { regular: '300' });
    await expect(page.locator('[data-testid^="timeline-month-0-"][data-period="campaign"]')).toHaveCount(campaignCount);
    expect(digits(await page.getByTestId('timeline-total-0').textContent())).toBe(total);
    await expect(page.locator('[data-testid^="timeline-month-0-"]')).toHaveCount(12);
  });
}

test('equal alternatives stay equal and chart fits 360px with accessible values', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openPrices(page, false);
  await page.getByTestId('offer-a').getByLabel('Ordinarie månadspris').fill('349');
  await expect(page.getByTestId('first-year-timeline')).toHaveCount(0);
  await page.getByTestId('offer-b').getByLabel('Ordinarie månadspris').fill('349');
  await expect(page.getByTestId('comparison-result')).toContainText('Alternativen kostar lika mycket');
  await expect(page.getByTestId('timeline-total-0')).toHaveText(await page.getByTestId('timeline-total-1').innerText());
  await page.getByTestId('first-year-timeline').getByText('Visa beloppen månad för månad', { exact: true }).click();
  await expect(page.getByTestId('timeline-table-0')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  const overflow = await page.getByTestId('first-year-timeline').evaluate(element => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
