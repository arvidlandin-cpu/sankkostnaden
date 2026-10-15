import { expect, test } from '@playwright/test';

const route = '/elavtal/hur-mycket-el-drar-mitt-hus/?qa=1';

test('house example explains its own assumptions and preserves SEO', async ({ page }) => {
  await page.goto(route);
  await expect(page).toHaveTitle('Hur mycket el drar ett hus? Räkna kWh per år 2026');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hur mycket el drar ditt hus?');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sankkostnaden.se/elavtal/hur-mycket-el-drar-mitt-hus/');
  await expect(page.getByText('FÖRENKLAT RÄKNEEXEMPEL', { exact: true })).toBeVisible();
  await expect(page.getByText(/egna schablonantaganden saknar verifierat källstöd/)).toBeVisible();
  await expect(page.getByTestId('house-example-total')).toHaveText(/10\s?700 kWh\/år/);
  await page.getByText('Se alla antaganden och uträkningen', { exact: true }).click();
  const breakdown = page.getByTestId('house-example-breakdown');
  await expect(breakdown).toContainText(/4\s?780 kWh\/år/);
  await expect(breakdown).toContainText(/5\s?880 kWh\/år/);
  await expect(breakdown).toContainText(/10\s?660 kWh\/år/);
  await expect(page.getByText(/Energimyndigheten anger/)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /elanvändning för profilen/ })).toHaveCount(0);
});

test('keyboard choices update disclosed arithmetic and never transfer private inputs', async ({ page }) => {
  await page.goto(route);
  const area = page.getByRole('slider', { name: /Boyta/ });
  await area.focus();
  await page.keyboard.press('Home');
  await expect(area).toHaveValue('40');
  const people = page.getByRole('slider', { name: /Personer i hushållet/ });
  await people.focus();
  await page.keyboard.press('Home');
  await expect(people).toHaveValue('1');
  await page.getByRole('button', { name: 'Fjärrvärme/ej el', exact: true }).click();
  await page.getByRole('button', { name: 'Elbil hemma', exact: true }).click();
  await page.getByRole('button', { name: 'Spa/pool', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Elbil hemma', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Värmepump', exact: true })).toHaveAttribute('aria-pressed', 'false');
  // 1800 + 40*12 + 0*40 + 2800 + 2200 = 7280 -> 7300.
  await expect(page.getByTestId('house-example-total')).toHaveText(/7\s?300 kWh\/år/);
  await page.getByText('Se alla antaganden och uträkningen', { exact: true }).click();
  await expect(page.getByTestId('house-example-breakdown')).toContainText(/7\s?280 kWh\/år/);
  await expect(page.getByText(/Noll för fjärrvärme betyder/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Räkna avtalskostnad med egna uppgifter', exact: true })).toHaveAttribute('href', '/verktyg/elavtalskostnad/');
  await expect(page).toHaveURL(/\?qa=1$/);
});
