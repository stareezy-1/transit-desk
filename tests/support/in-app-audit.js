// CUA REPL audit helpers. Requires browser, qa, control, and audit bindings.
// Start tests/support/fixture-server.mjs and the isolated QA app as documented in README.
// Run runVariant and verifyFailures for each theme/width pair. For polling: beginAuto, wait 30s, finishAuto.
const requireCheck = (condition, label) => {
  if (!condition) throw new Error(label);
};
const scenario = async (name) => {
  await control.playwright.getByRole('button', { name, exact: true }).click();
  requireCheck(
    (await control.playwright.getByRole('status').textContent({})).includes(name),
    'scenario switch',
  );
};
const visibleText = async (t, text) =>
  t.playwright.getByText(text, { exact: true }).waitFor({ state: 'visible', timeoutMs: 12000 });
const dismissOptions = async (t) =>
  t.playwright.getByRole('button', { name: 'Done', exact: true }).press('Enter');
const verifyCore = async (t) => {
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  requireCheck((await t.playwright.locator('article').count()) === 6, 'cards');
  for (const [button, text] of [
    ['Next page', 'Showing 7–12 of 16 vehicles'],
    ['Page 3', 'Showing 13–16 of 16 vehicles'],
    ['Previous page', 'Showing 7–12 of 16 vehicles'],
  ]) {
    if (
      button.startsWith('Page ') &&
      (await t.playwright.getByRole('combobox', { name: 'Page number' }).isVisible())
    ) {
      await t.playwright
        .getByRole('combobox', { name: 'Page number' })
        .selectOption(button.slice(5));
    } else {
      await t.playwright.getByRole('button', { name: button, exact: true }).click();
    }
    await visibleText(t, text);
  }
  for (const [size, end] of [
    ['12', 12],
    ['24', 16],
    ['6', 6],
  ]) {
    await t.playwright.getByRole('combobox', { name: 'Vehicles per page' }).selectOption(size);
    await visibleText(t, `Showing 1–${end} of 16 vehicles`);
  }
  for (const [name, total] of [
    ['In transit', 6],
    ['At stop', 5],
    ['Arriving', 5],
  ]) {
    await t.playwright.getByRole('button', { name, exact: true }).click();
    await visibleText(t, `Showing 1–${total} of ${total} vehicles`);
  }
  await t.playwright.getByRole('button', { name: 'Reset', exact: true }).click();
  for (const [search, range] of [
    ['4101', 'Showing 1–1 of 1 vehicles'],
    ['Harvard', 'Showing 1–6 of 8 vehicles'],
    ['missing-vehicle', 'Showing 0–0 of 0 vehicles'],
  ]) {
    await t.playwright.getByRole('textbox', { name: 'Search vehicles' }).fill(search);
    await visibleText(t, range);
  }
  requireCheck(
    !(await t.playwright.getByRole('button', { name: 'Next page' }).isEnabled()),
    'empty next',
  );
  await t.playwright.getByRole('button', { name: 'Reset filters', exact: true }).click();
};
const verifyFilters = async (t) => {
  await t.playwright.getByRole('button', { name: 'Filter routes' }).click();
  for (const n of [1, 2, 25])
    await t.playwright
      .getByRole('checkbox', { name: `Route ${n} Route destination ${n}`, exact: true })
      .check();
  await visibleText(t, '3 selected · 50 loaded');
  await t.playwright
    .getByRole('checkbox', { name: 'Route 25 Route destination 25', exact: true })
    .uncheck();
  await t.playwright.getByRole('textbox', { name: 'Search loaded routes' }).fill('Route 50');
  requireCheck((await t.playwright.getByRole('checkbox').count()) === 1, 'option search');
  await dismissOptions(t);
  await t.playwright.getByRole('button', { name: 'Filter trips' }).click();
  for (const n of [0, 1, 24])
    await t.playwright
      .getByRole('checkbox', { name: `Scheduled trip ${n} Trip t${n}`, exact: true })
      .check();
  await visibleText(t, '3 selected · 50 loaded');
  await t.playwright
    .getByRole('checkbox', { name: 'Scheduled trip 24 Trip t24', exact: true })
    .uncheck();
  await dismissOptions(t);
  await visibleText(t, 'Showing 1–2 of 2 vehicles');
  await t.playwright.getByRole('button', { name: 'Filter routes' }).click();
  await t.playwright
    .getByRole('checkbox', { name: 'Route 2 Route destination 2', exact: true })
    .uncheck();
  await dismissOptions(t);
  await visibleText(t, 'Showing 1–6 of 8 vehicles');
  requireCheck(
    (await t.playwright.getByRole('button', { name: 'Filter trips' }).textContent({})).includes(
      'All trips',
    ),
    'trip reset',
  );
  await t.playwright.getByRole('button', { name: 'Reset', exact: true }).click();
};
const verifyDetail = async (t) => {
  await t.playwright.getByRole('button', { name: 'View vehicle 4101', exact: true }).click();
  await t.playwright
    .getByRole('link', { name: 'Open in OpenStreetMap' })
    .waitFor({ state: 'visible' });
  const text = await t.playwright.getByRole('dialog').innerText({});
  for (const v of [
    'Vehicle 4101',
    'In transit',
    '42.36000',
    '-71.06000',
    'Test route 1',
    't0',
    'Park Street',
    '25.2 km/h',
    '2026',
    'ET',
  ])
    requireCheck(text.includes(v), 'detail ' + v);
  await t.playwright.locator('.leaflet-container').waitFor({ state: 'visible' });
  await t.playwright.getByRole('button', { name: 'Close vehicle details' }).press('Shift+Tab');
  requireCheck(
    await t.playwright.evaluate(() => !!document.activeElement.closest('[role="dialog"]')),
    'focus trap',
  );
  await t.playwright.getByRole('button', { name: 'Close vehicle details' }).press('Escape');
  requireCheck(
    await t.playwright.evaluate(() => document.activeElement.id === 'vehicle-trigger-v0'),
    'focus return',
  );
};
const verifyTheme = async (t, theme) => {
  await t.playwright.getByRole('button', { name: 'Pause bus animation' }).click();
  requireCheck(
    (await t.playwright
      .locator('.bus-body-motion')
      .evaluate((el) => getComputedStyle(el).animationPlayState)) === 'paused',
    'pause',
  );
  await t.playwright.getByRole('button', { name: 'Play bus animation' }).click();
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  requireCheck(
    (await t.playwright.evaluate(() => document.documentElement.dataset.theme)) === theme,
    'theme persistence',
  );
  requireCheck(
    await t.playwright.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'fleet overflow',
  );
  await t.playwright.getByRole('link', { name: 'Field guide', exact: true }).click();
  await t.playwright.getByRole('heading', { name: /Read the feed/ }).waitFor({ state: 'visible' });
  requireCheck(
    await t.playwright.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'guide overflow',
  );
  requireCheck(
    (await t.playwright.evaluate(() => document.documentElement.dataset.theme)) === theme,
    'guide theme',
  );
  requireCheck(
    await t.playwright.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]')).some((el) =>
        el.textContent.includes('FAQPage'),
      ),
    ),
    'schema',
  );
  await t.playwright.getByRole('link', { name: /Back to fleet/ }).click();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
};
const runVariant = async (t, theme, width) => {
  await scenario('normal');
  await (await browser.capabilities.get('viewport')).set({ width, height: 900 });
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  requireCheck((await t.playwright.evaluate(() => innerWidth)) === width, 'viewport');
  await t.playwright.getByRole('combobox', { name: 'Color theme' }).selectOption(theme);
  await verifyCore(t);
  await verifyFilters(t);
  await verifyDetail(t);
  await verifyTheme(t, theme);
  const r = { theme, width, group: 'core', passed: true };
  audit.push(r);
  return r;
};
const verifyFailures = async (t, theme, width) => {
  await scenario('normal');
  await (await browser.capabilities.get('viewport')).set({ width, height: 900 });
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  requireCheck((await t.playwright.evaluate(() => innerWidth)) === width, 'failure viewport');
  await t.playwright.getByRole('combobox', { name: 'Color theme' }).selectOption(theme);
  await scenario('vehicles-error');
  await t.playwright.getByRole('button', { name: 'Refresh feed', exact: true }).click();
  await t.playwright
    .getByRole('region', { name: /The fleet/ })
    .getByRole('alert')
    .waitFor({ state: 'visible' });
  requireCheck(
    (
      await t.playwright
        .getByRole('region', { name: /The fleet/ })
        .getByRole('alert')
        .textContent({})
    ).includes('last successful snapshot'),
    'stale data message',
  );
  requireCheck((await t.playwright.locator('article').count()) === 6, 'stale cards retained');
  await scenario('normal');
  await t.playwright.getByRole('button', { name: 'Try again', exact: true }).click();
  await t.playwright
    .getByRole('region', { name: /The fleet/ })
    .getByRole('alert')
    .waitFor({ state: 'hidden' });
  for (const kind of ['routes', 'trips']) {
    await scenario(`${kind}-error`);
    await t.reload();
    await visibleText(t, 'Showing 1–6 of 16 vehicles');
    await t.playwright.getByRole('button', { name: `Filter ${kind}` }).click();
    await t.playwright.getByRole('dialog').getByRole('alert').waitFor({ state: 'visible' });
    await scenario('normal');
    await t.playwright.getByRole('button', { name: `Retry ${kind}`, exact: true }).click();
    await t.playwright.getByRole('checkbox').first().waitFor({ state: 'visible' });
    await dismissOptions(t);
  }
  await scenario('detail-error');
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  await t.playwright.getByRole('button', { name: 'View vehicle 4101' }).click();
  await t.playwright.getByRole('dialog').getByRole('alert').waitFor({ state: 'visible' });
  await scenario('normal');
  await t.playwright
    .getByRole('dialog')
    .getByRole('button', { name: 'Try again', exact: true })
    .click();
  await t.playwright
    .getByRole('link', { name: 'Open in OpenStreetMap' })
    .waitFor({ state: 'visible' });
  await t.playwright.getByRole('button', { name: 'Close vehicle details' }).press('Escape');
  await scenario('slow');
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  await t.playwright.getByRole('button', { name: 'Refresh feed', exact: true }).click();
  await t.playwright
    .getByRole('button', { name: 'Checking the feed…', exact: true })
    .waitFor({ state: 'visible' });
  requireCheck(
    !(await t.playwright
      .getByRole('button', { name: 'Checking the feed…', exact: true })
      .isEnabled()),
    'refresh busy',
  );
  await t.playwright
    .getByRole('button', { name: 'Refresh feed', exact: true })
    .waitFor({ state: 'visible' });
  for (const kind of ['routes', 'trips']) {
    await t.playwright.getByRole('button', { name: `Filter ${kind}` }).click();
    await t.playwright
      .getByRole('status', { name: `Loading ${kind}`, exact: true })
      .waitFor({ state: 'visible' });
    await t.playwright.getByRole('checkbox').first().waitFor({ state: 'visible' });
    await dismissOptions(t);
  }
  await t.playwright.getByRole('button', { name: 'View vehicle 4101' }).click();
  await t.playwright
    .getByRole('status', { name: 'Loading vehicle details', exact: true })
    .waitFor({ state: 'visible' });
  await t.playwright
    .getByRole('link', { name: 'Open in OpenStreetMap' })
    .waitFor({ state: 'visible' });
  await t.playwright.getByRole('button', { name: 'Close vehicle details' }).press('Escape');
  await scenario('empty');
  await t.playwright.getByRole('button', { name: 'Refresh feed', exact: true }).click();
  await visibleText(t, 'Showing 0–0 of 0 vehicles');
  await visibleText(t, 'No vehicles are reporting right now');
  await scenario('missing-position');
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  requireCheck(
    (await t.playwright.locator('article').first().textContent({})).includes('Unavailable'),
    'card missing position',
  );
  await t.playwright.getByRole('button', { name: 'View vehicle 4101' }).click();
  await visibleText(t, 'Position is unavailable for this vehicle.');
  requireCheck(
    (await t.playwright.locator('.leaflet-container').count()) === 0,
    'missing map omitted',
  );
  await t.playwright.getByRole('button', { name: 'Close vehicle details' }).press('Escape');
  await scenario('malformed');
  await t.reload();
  await t.playwright
    .getByRole('button', { name: 'Try again', exact: true })
    .waitFor({ state: 'visible', timeoutMs: 15000 });
  let error = await t.playwright
    .getByRole('region', { name: /The fleet/ })
    .getByRole('alert')
    .innerText({});
  requireCheck(
    !/SyntaxError|Unexpected token|JSON\.parse/.test(error),
    'friendly malformed response',
  );
  await scenario('normal');
  await t.playwright.getByRole('button', { name: 'Try again', exact: true }).click();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  requireCheck(
    await t.playwright.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'error-state overflow',
  );
  const r = { theme, width, group: 'loading-errors-empty-missing-position', passed: true };
  audit.push(r);
  return r;
};
const beginAuto = async (t, theme, width) => {
  await scenario('normal');
  await (await browser.capabilities.get('viewport')).set({ width, height: 900 });
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  await t.playwright.getByRole('combobox', { name: 'Color theme' }).selectOption(theme);
  if (await t.playwright.getByRole('combobox', { name: 'Page number' }).isVisible()) {
    await t.playwright.getByRole('combobox', { name: 'Page number' }).selectOption('3');
  } else {
    await t.playwright.getByRole('button', { name: 'Page 3', exact: true }).click();
  }
  await visibleText(t, 'Showing 13–16 of 16 vehicles');
  await scenario('shrunk');
  return { theme, width, waitingFor: '30-second refresh' };
};
const finishAuto = async (t, theme, width) => {
  await visibleText(t, 'Showing 1–1 of 1 vehicles');
  await scenario('normal');
  await t.playwright.getByRole('button', { name: 'Refresh feed', exact: true }).click();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  const r = { theme, width, group: 'automatic-refresh-and-page-clamp', passed: true };
  audit.push(r);
  return r;
};
const verifyExtras = async (t, theme, width) => {
  await scenario('normal');
  await (await browser.capabilities.get('viewport')).set({ width, height: 900 });
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  await t.playwright.getByRole('combobox', { name: 'Color theme' }).selectOption('system');
  requireCheck(
    await t.playwright.evaluate(
      () =>
        document.documentElement.dataset.theme ===
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    ),
    'system theme',
  );
  await t.playwright.getByRole('combobox', { name: 'Color theme' }).selectOption(theme);
  const card = await t.playwright.locator('article').first().innerText({});
  for (const field of ['4101', 'IN TRANSIT', '42.36000', '-71.06000', '23:00:00 ET'])
    requireCheck(card.toLowerCase().includes(field.toLowerCase()), 'card ' + field);
  await t.playwright.getByRole('link', { name: 'Field guide', exact: true }).press('Enter');
  await t.playwright.getByText('What is Transit Desk?', { exact: true }).press('Enter');
  requireCheck(
    (await t.playwright.locator('details').first().getAttribute('open', {})) !== null,
    'FAQ opens',
  );
  await t.playwright.getByText('What is Transit Desk?', { exact: true }).press('Enter');
  requireCheck(
    (await t.playwright.locator('details').first().getAttribute('open', {})) === null,
    'FAQ closes',
  );
  await t.playwright
    .getByRole('link', { name: '03 / Common questions', exact: true })
    .press('Enter');
  requireCheck((await t.url()).endsWith('#questions'), 'guide anchor');
  await t.playwright.getByRole('link', { name: /Back to fleet/ }).press('Enter');
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  await scenario('missing-position');
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  await t.playwright.getByRole('button', { name: 'View vehicle 4101' }).click();
  await visibleText(t, 'Position is unavailable for this vehicle.');
  requireCheck(
    (await t.playwright
      .getByText('Position is unavailable for this vehicle.', { exact: true })
      .evaluate((el) => getComputedStyle(el).animationName)) === 'none',
    'unavailable position is not loading',
  );
  await t.playwright.getByRole('button', { name: 'Close vehicle details' }).press('Escape');
  await scenario('normal');
  await t.reload();
  await visibleText(t, 'Showing 1–6 of 16 vehicles');
  const r = {
    theme,
    width,
    group: 'card-fields-system-theme-guide-disclosures-static-fallback',
    passed: true,
  };
  audit.push(r);
  return r;
};
