import {test, expect} from '@playwright/test';
import {readdirSync} from 'node:fs';
import {join, relative, sep} from 'node:path';

/**
 * P0D full-page audit: capture EVERY ordinary static page in source at mobile
 * and desktop dimensions. Exclude deliberately noindex /experiments and Next
 * special files; the noindex pilots get their own commercial tests.
 * Owner's strict visual acceptance still requires reviewing saved PNGs.
 */
function walk(directory: string): string[] {
  return readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}
const slugs = [...new Set(walk(join(process.cwd(), 'pages'))
  .filter(file => file.endsWith('.tsx'))
  .map(file => relative(join(process.cwd(), 'pages'), file).split(sep).join('/'))
  .filter(file => !file.startsWith('_') && !file.startsWith('experiments/'))
  .map(file => '/' + file.replace(/\.tsx$/, '').replace(/(^|\/)index$/, ''))
  .map(file => file === '/' ? '/' : file.replace(/\/+$/, '') + '/')
)].sort();
const widths = [390, 1440];

for (const width of widths) for (const slug of slugs) {
  test('sitewide P0D audit ' + width + 'px ' + slug, async ({page}, testInfo) => {
    await page.setViewportSize({width, height: 900});
    // Never use real visitor tracking for QA.
    const url = slug + (slug.includes('?') ? '&' : '?') + 'qa=1';
    await page.goto(url, {waitUntil: 'networkidle'});
    await expect(page.locator('h1').first(), 'Each user-facing page must have a visible title').toBeVisible();
    const result = await page.evaluate(() => {
      const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      return {
        documentWidth,
        viewportWidth: document.documentElement.clientWidth,
        background: getComputedStyle(document.documentElement).getPropertyValue('--sk-canvas').trim(),
        action: getComputedStyle(document.documentElement).getPropertyValue('--sk-action').trim(),
      };
    });
    expect(result.documentWidth - result.viewportWidth, 'horizontal page overflow').toBeLessThanOrEqual(1);
    expect(result.background).toBe('#f9fafc');
    expect(result.action).toBe('#234bd1');
    await page.screenshot({
      path: 'test-results/screenshots/p0d-all-pages-' + width + '-' + slug.replace(/\W+/g, '-').replace(/^-|-$/g, '') + '.png',
      fullPage: true,
    });
    await testInfo.attach('route', {body: slug, contentType: 'text/plain'});
  });
}
