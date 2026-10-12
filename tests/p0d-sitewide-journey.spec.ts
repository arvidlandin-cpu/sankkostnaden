import {test, expect} from '@playwright/test';

/**
 * P0D design QA: route family snapshots at owner-approved widths.
 * A screenshot's existence is evidence only; it still requires visual review.
 * No QA event is legitimate customer traffic and tests never open partner links.
 */
const routes = [
  {name: 'startsida', url: '/'},
  {name: 'kostnadskollen', url: '/app/'},
  {name: 'bredband', url: '/bredband/'},
  {name: 'bredband-guide', url: '/bredband/bredband-pa-min-adress/'},
  {name: 'mobil', url: '/mobil/'},
  {name: 'familjemobil-verktyg', url: '/mobil/lonar-sig-familjeabonnemang/'},
  {name: 'el', url: '/elavtal/'},
  {name: 'el-kvartspris-guide', url: '/elavtal/kvartspris/'},
  {name: 'forsakring', url: '/forsakring/'},
  {name: 'brf-guide', url: '/forsakring/hemforsakring-bostadsratt/'},
  {name: 'ekonomi', url: '/ekonomi/'},
  {name: 'sparguide', url: '/guide/sank-fasta-kostnader/'},
  {name: 'byteskalender-verktyg', url: '/verktyg/byteskalender/'},
  {name: 'elavtalskostnad-verktyg', url: '/verktyg/elavtalskostnad/'},
] as const;
const viewports = [360, 390, 430, 1024, 1440];

for (const width of viewports) {
  for (const route of routes) {
    test('P0D ' + route.name + ' @ ' + width + 'px', async ({page}, testInfo) => {
      await page.setViewportSize({width, height: 900});
      await page.goto(route.url, {waitUntil: 'networkidle'});
      await expect(page.locator('h1').first()).toBeVisible();
      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const style = getComputedStyle(root);
        return {
          overflow: Math.max(root.scrollWidth, document.body.scrollWidth) - root.clientWidth,
          ink: style.getPropertyValue('--sk-ink').trim(),
          action: style.getPropertyValue('--sk-action').trim(),
          canvas: style.getPropertyValue('--sk-canvas').trim(),
        };
      });
      expect(metrics.overflow, 'No horizontal overflow on real route').toBeLessThanOrEqual(1);
      expect(metrics.ink).toBe('#101d42');
      expect(metrics.action).toBe('#234bd1');
      expect(metrics.canvas).toBe('#faf9f5');
      await page.screenshot({
        path: 'test-results/screenshots/p0d-journey-' + testInfo.project.name + '-' + route.name + '-' + width + '.png',
        fullPage: true,
      });
    });
  }
}
