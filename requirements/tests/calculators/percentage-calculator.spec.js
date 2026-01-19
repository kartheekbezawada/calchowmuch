import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const SCREENSHOT_DIR = path.join(
  process.cwd(),
  'tests',
  'calculator_results',
  'percentage-calculator',
  'screenshots'
);
const HASH_URL = '/#/calculators/percentage-increase';
const DIRECT_URL = '/calculators/math/percentage-increase/';

function trackConsoleErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  return errors;
}

async function capture(page, name) {
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, name), fullPage: true });
}

async function selectMode(page, mode) {
  await page.click(`[data-button-group="percent-mode"] [data-value="${mode}"]`);
  await expect(page.locator(`.input-section[data-mode="${mode}"]`)).toHaveClass(/active/);
}

async function calculateMode(page, mode) {
  await page.click(`[data-calc="${mode}"]`);
}

test.describe('Percentage Calculator Requirements', () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  test('PERC-TEST-E2E-LOAD: calculator loads without console errors', async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await page.goto(DIRECT_URL);
    await page.waitForSelector('#calc-percentage-increase');
    await expect(page.locator('[data-button-group="percent-mode"]')).toBeVisible();
    await expect(page.locator('#percent-result')).toBeVisible();
    expect(errors).toEqual([]);
    await capture(page, 'perc-e2e-load.png');
  });

  test('PERC-TEST-E2E-NAV: navigation and deep-linking', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.nav-item[data-id="percentage-increase"]');
    await page.click('.nav-item[data-id="percentage-increase"]');
    await page.waitForSelector('#calc-percentage-increase');
    await expect(page.locator('.nav-item[data-id="percentage-increase"]')).toHaveClass(/is-active/);

    await page.goto(HASH_URL);
    await page.waitForSelector('#calc-percentage-increase');
    await expect(page.locator('.nav-item[data-id="percentage-increase"]')).toHaveClass(/is-active/);

    await page.click('.nav-item[data-id="basic"]');
    await page.waitForSelector('#calc-basic');
    await page.goBack();
    await page.waitForSelector('#calc-percentage-increase');
  });

  test('PERC-TEST-E2E-WORKFLOW: full calculation workflow', async ({ page }) => {
    await page.goto(HASH_URL);
    await page.waitForSelector('#calc-percentage-increase');

    await selectMode(page, 'change');
    await page.fill('#percent-change-start', '0');
    await page.fill('#percent-change-end', '150');
    await calculateMode(page, 'change');
    await expect(page.locator('#percent-result')).toContainText('Starting value must be above 0.');

    await page.fill('#percent-change-start', '100');
    await page.fill('#percent-change-end', '150');
    await calculateMode(page, 'change');
    await expect(page.locator('#percent-result')).toContainText('50.00%');
    await expect(page.locator('#percent-details')).toContainText('Formula');

    await selectMode(page, 'percent-of');
    await page.fill('#percent-of-rate', '25');
    await page.fill('#percent-of-value', '200');
    await calculateMode(page, 'percent-of');
    await expect(page.locator('#percent-result')).toContainText('Result: 50');

    await page.fill('#percent-of-value', '400');
    await calculateMode(page, 'percent-of');
    await expect(page.locator('#percent-result')).toContainText('Result: 100');

    await selectMode(page, 'increase');
    await page.fill('#percent-increase-base', '100');
    await page.fill('#percent-increase-rate', '20');
    await calculateMode(page, 'increase');
    await expect(page.locator('#percent-result')).toContainText('Result: 120');

    await selectMode(page, 'decrease');
    await page.fill('#percent-decrease-base', '100');
    await page.fill('#percent-decrease-rate', '20');
    await calculateMode(page, 'decrease');
    await expect(page.locator('#percent-result')).toContainText('Result: 80');

    await selectMode(page, 'what-percent');
    await page.fill('#percent-what-part', '25');
    await page.fill('#percent-what-total', '0');
    await calculateMode(page, 'what-percent');
    await expect(page.locator('#percent-result')).toContainText('Total value must be above 0.');

    await page.fill('#percent-what-total', '100');
    await calculateMode(page, 'what-percent');
    await expect(page.locator('#percent-result')).toContainText('25.00%');

    await capture(page, 'perc-e2e-workflow.png');
  });

  test('PERC-TEST-E2E-MOBILE: mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(HASH_URL);
    await page.waitForSelector('#calc-percentage-increase');
    await expect(page.locator('[data-button-group="percent-mode"]')).toBeVisible();

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);

    await capture(page, 'perc-e2e-mobile.png');
  });

  test('PERC-TEST-E2E-A11Y: labels, aria-live, and keyboard access', async ({ page }) => {
    await page.goto(HASH_URL);
    await page.waitForSelector('#calc-percentage-increase');

    const inputIds = [
      'percent-change-start',
      'percent-change-end',
      'percent-of-rate',
      'percent-of-value',
      'percent-increase-base',
      'percent-increase-rate',
      'percent-decrease-base',
      'percent-decrease-rate',
      'percent-what-part',
      'percent-what-total',
    ];

    for (const id of inputIds) {
      await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
    }

    await expect(page.locator('#percent-result')).toHaveAttribute('aria-live', 'polite');

    await page.keyboard.press('Tab');
    const focusedId = await page.evaluate(() => document.activeElement?.id || '');
    expect(focusedId).not.toBe('');

    await capture(page, 'perc-e2e-a11y.png');
  });
});
