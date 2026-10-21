import { test, expect, type Page } from '@playwright/test';
const attributes = {
  label: '4101',
  current_status: 'IN_TRANSIT_TO',
  latitude: 42.36,
  longitude: -71.06,
  updated_at: '2026-10-15T03:00:00Z',
  bearing: 90,
  speed: 7,
  occupancy_status: 'MANY_SEATS_AVAILABLE',
  direction_id: 0,
  current_stop_sequence: 2,
};
const vehicles = Array.from({ length: 16 }, (_, index) => ({
  id: `v${index}`,
  type: 'vehicle',
  attributes: {
    ...attributes,
    label: String(4101 + index),
    current_status: index % 2 ? 'STOPPED_AT' : 'IN_TRANSIT_TO',
  },
  relationships: {
    route: { data: { id: index < 8 ? '1' : '2', type: 'route' } },
    trip: { data: { id: `t${index}`, type: 'trip' } },
    stop: { data: { id: 'stop1', type: 'stop' } },
  },
}));
const included = [
  ...['1', '2'].map((id) => ({
    id,
    type: 'route',
    attributes: {
      short_name: id,
      long_name: `Test route ${id}`,
      type: 3,
      direction_names: ['Outbound', 'Inbound'],
    },
  })),
  ...vehicles.map((_, index) => ({
    id: `t${index}`,
    type: 'trip',
    attributes: { headsign: index < 8 ? 'Harvard Square' : 'Central Station' },
  })),
  { id: 'stop1', type: 'stop', attributes: { name: 'Park Street' } },
];
async function mockFeed(page: Page) {
  await page.route('**/api/transit/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    if (path === '/api/transit/vehicles')
      return route.fulfill({ json: { data: vehicles, included } });
    if (path.startsWith('/api/transit/vehicles/'))
      return route.fulfill({
        json: { data: vehicles.find((v) => path.endsWith(`/${v.id}`)), included },
      });
    if (path === '/api/transit/routes') {
      const offset = Number(url.searchParams.get('page[offset]') || 0);
      return route.fulfill({
        json: {
          data: Array.from({ length: 25 }, (_, index) => ({
            id: String(offset + index + 1),
            type: 'route',
            attributes: {
              short_name: `Route ${offset + index + 1}`,
              long_name: `Route destination ${offset + index + 1}`,
            },
          })),
          links: offset === 0 ? { next: 'https://api-v3.mbta.com/routes?page[offset]=25' } : {},
        },
      });
    }
    return route.fulfill({
      json: {
        data: vehicles.slice(0, 8).map((_, index) => ({
          id: `t${index}`,
          type: 'trip',
          attributes: { headsign: `Harvard trip ${index}` },
        })),
      },
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Refresh feed', exact: true }).click();
  await expect(page.getByText('Showing 1–6 of 16 vehicles')).toBeVisible();
}
test('pagination, page size, search, status and empty state', async ({ page }) => {
  await mockFeed(page);
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByText('Showing 7–12 of 16 vehicles')).toBeVisible();
  await page.getByLabel('Vehicles per page').selectOption('12');
  await expect(page.getByText('Showing 1–12 of 16 vehicles')).toBeVisible();
  await page.getByRole('button', { name: 'At stop', exact: true }).click();
  await expect(page.getByText('Showing 1–8 of 8 vehicles')).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByLabel('Search vehicles').fill('4101');
  await expect(page.getByText('Showing 1–1 of 1 vehicles')).toBeVisible();
  await page.getByLabel('Search vehicles').fill('no matching bus');
  await expect(page.getByRole('heading', { name: 'No vehicles match this view' })).toBeVisible();
  await expect(page.getByText('Showing 0–0 of 0 vehicles')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled();
});
test('multiple route and trip filters, lazy loading and filter reset', async ({ page }) => {
  await mockFeed(page);
  await page.getByRole('button', { name: 'Filter routes' }).click();
  await page.getByRole('checkbox', { name: 'Route 1 Route destination 1', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Route 2 Route destination 2', exact: true }).check();
  await page.getByRole('checkbox').last().scrollIntoViewIfNeeded();
  await expect(page.getByText('2 selected · 50 loaded')).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Filter trips' }).click();
  await page.getByRole('checkbox', { name: 'Harvard trip 0 Trip t0' }).check();
  await page.getByRole('checkbox', { name: 'Harvard trip 1 Trip t1' }).check();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByText('Showing 1–2 of 2 vehicles')).toBeVisible();
  await page.getByRole('button', { name: 'Filter routes' }).click();
  await page.getByRole('checkbox', { name: 'Route 2 Route destination 2', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Filter trips' })).toContainText('All trips');
  await expect(page.getByText('Showing 1–6 of 8 vehicles')).toBeVisible();
});
test('vehicle popup, accessible dismissal and map', async ({ page }) => {
  await mockFeed(page);
  await page.getByRole('button', { name: 'View vehicle 4101' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Vehicle 4101' })).toBeVisible();
  await expect(dialog.getByText('Park Street')).toBeVisible();
  await expect(dialog.getByText('25.2 km/h')).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Open in OpenStreetMap' })).toHaveAttribute(
    'href',
    /mlat=42.36/,
  );
  await expect(dialog.locator('.leaflet-container')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'View vehicle 4101' })).toBeFocused();
});
test('failed refresh preserves last data and shows a retry action', async ({ page }) => {
  await mockFeed(page);
  await page.route('**/api/transit/vehicles?**', (route) =>
    route.fulfill({ status: 429, json: { error: 'Too many requests' } }),
  );
  await page.getByRole('button', { name: 'Refresh feed', exact: true }).click();
  await expect(page.getByRole('region', { name: /The fleet/ }).getByRole('alert')).toContainText(
    'Showing the last successful snapshot',
  );
  await expect(page.getByRole('button', { name: 'View vehicle 4101' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again', exact: true })).toBeVisible();
});
test('mobile layout and metadata, static guide and crawler routes', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockFeed(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: 'docs/screenshots/mobile.png', fullPage: true });
  await page.getByRole('link', { name: 'Field guide' }).click();
  await expect(page.getByRole('heading', { name: /Read the feed/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  const guide = await request.get('/guide');
  const html = await guide.text();
  expect(html).toContain('FAQPage');
  expect(html).toContain('What is Transit Desk?');
  expect(html).toContain('rel="canonical"');
  expect((await request.get('/robots.txt')).status()).toBe(200);
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  expect((await request.get('/llms.txt')).status()).toBe(200);
});
