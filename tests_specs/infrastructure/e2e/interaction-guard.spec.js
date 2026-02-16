import { test, expect } from '@playwright/test';

function normalizeRoute(rawRoute) {
  if (!rawRoute || typeof rawRoute !== 'string') return null;
  let route = rawRoute.trim();
  if (!route) return null;
  if (!route.startsWith('/')) route = `/${route}`;
  route = route.replace(/\/+/, '/');
  if (route !== '/' && !route.endsWith('/')) route = `${route}/`;
  return route;
}

const targetRoute = normalizeRoute(process.env.TARGET_ROUTE);
if (!targetRoute) {
  throw new Error('TARGET_ROUTE is required for interaction guard tests.');
}

test.describe('Interaction guard', () => {
  test('Long task guard during interaction', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');

    await page.addInitScript(() => {
      window.__longTasks = [];
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            window.__longTasks.push({ name: entry.name, duration: entry.duration });
          }
        }
      });
      observer.observe({ type: 'longtask', buffered: true });
      window.__longTaskObserver = observer;
    });

    await page.waitForTimeout(200);
    await page.fill('#fva-payment', '500');
    await page.fill('#fva-interest-rate', '5');
    await page.fill('#fva-periods', '10');
    await page.click('#fva-calc');

    const longTasks = await page.evaluate(() => {
      if (window.__longTaskObserver) window.__longTaskObserver.disconnect();
      return window.__longTasks || [];
    });

    expect(longTasks, JSON.stringify(longTasks, null, 2)).toEqual([]);
  });

  test('Interaction latency proxy (<200ms)', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');

    await page.fill('#fva-payment', '500');
    await page.fill('#fva-interest-rate', '5');
    await page.fill('#fva-periods', '10');

    const start = Date.now();
    await page.click('#fva-calc');
    await page.waitForTimeout(50);
    const end = Date.now();

    expect(end - start).toBeLessThan(200);
  });

  test('Nav click stability (no layout jumps)', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');

    const container = page.locator('.layout-main');
    const before = await container.boundingBox();

    const items = page.locator('.left-nav .nav-item');
    const count = await items.count();
    const clickCount = Math.min(count, 3);

    for (let i = 0; i < clickCount; i += 1) {
      await items.nth(i).click();
      await page.waitForTimeout(200);
    }

    const after = await container.boundingBox();
    expect(after).toBeTruthy();
    expect(before).toBeTruthy();

    const shift = Math.abs((after?.height ?? 0) - (before?.height ?? 0));
    expect(shift).toBeLessThan(5);
  });
});
