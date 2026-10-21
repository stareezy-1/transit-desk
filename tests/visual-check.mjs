import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
});
const errors = [];
try {
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  await page
    .getByRole('button', { name: /View vehicle/ })
    .first()
    .waitFor();
  await page.screenshot({ path: 'docs/screenshots/desktop.png', fullPage: true });
  console.log('Visible cards:', await page.locator('article').count());
  await page.getByRole('button', { name: 'Filter routes' }).click();
  await page.getByRole('checkbox').first().waitFor();
  console.log('Live route choices:', await page.getByRole('checkbox').count());
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Filter trips' }).click();
  await page.getByRole('checkbox').first().waitFor();
  console.log('Live trip choices:', await page.getByRole('checkbox').count());
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page
    .getByRole('button', { name: /View vehicle/ })
    .first()
    .click();
  await page.locator('.leaflet-container').waitFor();
  await page.screenshot({ path: 'docs/screenshots/vehicle-detail.png', fullPage: true });
  await page.keyboard.press('Escape');
  await page.getByRole('heading', { name: 'Boston, in service.' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'docs/screenshots/mobile.png', fullPage: true });
  console.log(
    'Mobile overflow:',
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  );
  await page.goto('http://127.0.0.1:3000/guide');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'docs/screenshots/guide.png', fullPage: true });
  console.log('Browser errors:', errors);
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
