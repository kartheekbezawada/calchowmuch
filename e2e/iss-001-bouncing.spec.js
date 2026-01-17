/**
 * ISS-001 Regression Tests: Bouncing UI Elements
 *
 * Tests verify navigation between calculators does not introduce
 * layout shifts or "bouncing" UI elements.
 */
import { test, expect } from '@playwright/test';

// Calculator IDs from the navigation (matching navigation.json)
const MATH_CALCULATORS = ['basic', 'percentage-increase', 'fraction-calculator'];
const LOAN_CALCULATORS = [
  'home-loan',
  'how-much-can-borrow',
  'remortgage-switching',
  'buy-to-let',
  'overpayment-additional-payment',
  'offset-calculator',
  'interest-rate-change-calculator',
  'loan-to-value',
];

test.describe('ISS-001: Bouncing UI Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for navigation to load
    await page.waitForSelector('.left-nav .nav-item');
    // Wait for CSS animations to complete (0.6s max + buffer)
    await page.waitForTimeout(800);
  });

  test('layout shell maintains fixed dimensions during navigation', async ({ page }) => {
    // Get initial shell dimensions
    const pageEl = page.locator('.page');
    const initialBox = await pageEl.boundingBox();

    // Navigate between calculators and check dimensions don't change
    for (const calcId of MATH_CALCULATORS) {
      await page.click(`.nav-item[data-id="${calcId}"]`);
      await page.waitForTimeout(500); // Allow content to load

      const currentBox = await pageEl.boundingBox();
      expect(currentBox.height).toBeCloseTo(initialBox.height, 1);
      expect(currentBox.width).toBeCloseTo(initialBox.width, 1);
    }
  });

  test('center column panels maintain height during calculator switch', async ({ page }) => {
    const centerColumn = page.locator('.center-column');
    const calcPanel = page.locator('.center-column .panel:first-child');
    const explPanel = page.locator('.center-column .panel:last-child');

    // Get initial dimensions
    const initialCenterBox = await centerColumn.boundingBox();
    const initialCalcBox = await calcPanel.boundingBox();
    const initialExplBox = await explPanel.boundingBox();

    // Navigate through Math calculators
    for (const calcId of MATH_CALCULATORS) {
      await page.click(`.nav-item[data-id="${calcId}"]`);
      await page.waitForTimeout(500);

      const currentCenterBox = await centerColumn.boundingBox();
      const currentCalcBox = await calcPanel.boundingBox();
      const currentExplBox = await explPanel.boundingBox();

      // Check heights remain stable (within 2px tolerance)
      expect(Math.abs(currentCenterBox.height - initialCenterBox.height)).toBeLessThan(3);
      expect(Math.abs(currentCalcBox.height - initialCalcBox.height)).toBeLessThan(3);
      expect(Math.abs(currentExplBox.height - initialExplBox.height)).toBeLessThan(3);
    }
  });

  test('left nav position remains stable during navigation', async ({ page }) => {
    const leftNav = page.locator('.left-nav');
    const initialBox = await leftNav.boundingBox();

    // Click through calculators
    for (const calcId of MATH_CALCULATORS) {
      await page.click(`.nav-item[data-id="${calcId}"]`);
      await page.waitForTimeout(300);

      const currentBox = await leftNav.boundingBox();
      // Left nav should not shift position
      expect(Math.abs(currentBox.x - initialBox.x)).toBeLessThan(2);
      expect(Math.abs(currentBox.y - initialBox.y)).toBeLessThan(2);
      expect(Math.abs(currentBox.width - initialBox.width)).toBeLessThan(2);
    }
  });

  test('ads column position remains stable during navigation', async ({ page }) => {
    const adsColumn = page.locator('.ads-column');
    const initialBox = await adsColumn.boundingBox();

    for (const calcId of MATH_CALCULATORS) {
      await page.click(`.nav-item[data-id="${calcId}"]`);
      await page.waitForTimeout(300);

      const currentBox = await adsColumn.boundingBox();
      // Ads column should not shift position
      expect(Math.abs(currentBox.x - initialBox.x)).toBeLessThan(2);
      expect(Math.abs(currentBox.width - initialBox.width)).toBeLessThan(2);
    }
  });

  test('top nav buttons do not bounce when switching categories', async ({ page }) => {
    const topNav = page.locator('.top-nav');
    const topNavButtons = page.locator('.top-nav button');

    // Get initial top nav position
    const initialTopNavBox = await topNav.boundingBox();
    const firstButtonInitialBox = await topNavButtons.first().boundingBox();

    // Click on Loans category
    await page.click('.top-nav button:has-text("Loans")');
    await page.waitForTimeout(500);

    // Check top nav hasn't shifted
    const afterLoansTopNavBox = await topNav.boundingBox();
    expect(Math.abs(afterLoansTopNavBox.y - initialTopNavBox.y)).toBeLessThan(2);
    expect(Math.abs(afterLoansTopNavBox.height - initialTopNavBox.height)).toBeLessThan(2);

    // Click on Math category again
    await page.click('.top-nav button:has-text("Math")');
    await page.waitForTimeout(500);

    const finalTopNavBox = await topNav.boundingBox();
    expect(Math.abs(finalTopNavBox.y - initialTopNavBox.y)).toBeLessThan(2);
    expect(Math.abs(finalTopNavBox.height - initialTopNavBox.height)).toBeLessThan(2);
  });

  test('no Cumulative Layout Shift (CLS) during navigation', async ({ page }) => {
    // Wait for initial animations to complete
    await page.waitForTimeout(1000);

    // Collect CLS data using Performance Observer
    const layoutShifts = await page.evaluate(() => {
      return new Promise((resolve) => {
        const shifts = [];
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              shifts.push({
                value: entry.value,
                sources: entry.sources?.map(s => ({
                  node: s.node?.tagName,
                  currentRect: s.currentRect,
                  previousRect: s.previousRect,
                })),
              });
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });

        // Keep observing for 3 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(shifts);
        }, 3000);
      });
    });

    // Click through several calculators to trigger any layout shifts
    for (const calcId of MATH_CALCULATORS) {
      await page.click(`.nav-item[data-id="${calcId}"]`);
      await page.waitForTimeout(600);
    }

    // Get final CLS data
    const finalShifts = await page.evaluate(() => {
      return new Promise((resolve) => {
        const shifts = [];
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              shifts.push({ value: entry.value });
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(shifts);
        }, 500);
      });
    });

    // Total CLS should be very low (under 0.1 is good, under 0.25 needs improvement)
    const totalCLS = finalShifts.reduce((sum, shift) => sum + shift.value, 0);
    console.log(`Total CLS: ${totalCLS}`);
    expect(totalCLS).toBeLessThan(0.1);
  });

  test('scrollbars remain visible and stable in left nav', async ({ page }) => {
    const leftNav = page.locator('.left-nav');

    // Check overflow-y is scroll (not auto)
    const overflowY = await leftNav.evaluate(el => getComputedStyle(el).overflowY);
    expect(overflowY).toBe('scroll');

    // Check scrollbar-gutter is stable
    const scrollbarGutter = await leftNav.evaluate(el => getComputedStyle(el).scrollbarGutter);
    expect(scrollbarGutter).toContain('stable');
  });

  test('scrollbars remain visible and stable in panels', async ({ page }) => {
    const panelScroll = page.locator('.panel-scroll').first();

    // Wait for calculator to load
    await page.click('.nav-item[data-id="basic"]');
    await page.waitForTimeout(500);

    const overflowY = await panelScroll.evaluate(el => getComputedStyle(el).overflowY);
    expect(overflowY).toBe('scroll');

    const scrollbarGutter = await panelScroll.evaluate(el => getComputedStyle(el).scrollbarGutter);
    expect(scrollbarGutter).toContain('stable');
  });

  test('switching between Loans calculators does not cause bouncing', async ({ page }) => {
    // Switch to Loans category
    await page.click('.top-nav button:has-text("Loans")');
    await page.waitForSelector('.nav-item[data-id="home-loan"]');

    const pageEl = page.locator('.page');
    const centerColumn = page.locator('.center-column');

    const initialPageBox = await pageEl.boundingBox();
    const initialCenterBox = await centerColumn.boundingBox();

    // Navigate through loan calculators
    for (const calcId of LOAN_CALCULATORS.slice(0, 4)) {
      const navItem = page.locator(`.nav-item[data-id="${calcId}"]`);
      if (await navItem.count() > 0) {
        await navItem.click();
        await page.waitForTimeout(500);

        const currentPageBox = await pageEl.boundingBox();
        const currentCenterBox = await centerColumn.boundingBox();

        expect(Math.abs(currentPageBox.height - initialPageBox.height)).toBeLessThan(3);
        expect(Math.abs(currentCenterBox.height - initialCenterBox.height)).toBeLessThan(3);
      }
    }
  });

  test('button groups do not shift when calculator loads', async ({ page }) => {
    // Load a calculator with button groups (basic calculator)
    await page.click('.nav-item[data-id="basic"]');
    await page.waitForSelector('.calculator-button');

    // Get button positions
    const buttons = page.locator('.calculator-button');
    const buttonCount = await buttons.count();

    const initialPositions = [];
    for (let i = 0; i < buttonCount; i++) {
      const box = await buttons.nth(i).boundingBox();
      initialPositions.push(box);
    }

    // Wait a bit and check positions haven't changed
    await page.waitForTimeout(500);

    for (let i = 0; i < buttonCount; i++) {
      const currentBox = await buttons.nth(i).boundingBox();
      if (initialPositions[i] && currentBox) {
        expect(Math.abs(currentBox.x - initialPositions[i].x)).toBeLessThan(2);
        expect(Math.abs(currentBox.y - initialPositions[i].y)).toBeLessThan(2);
      }
    }
  });

  test('result sections maintain stable height', async ({ page }) => {
    await page.click('.nav-item[data-id="basic"]');
    await page.waitForSelector('.result');

    const result = page.locator('.result').first();

    // Check result has min-height
    const minHeight = await result.evaluate(el => getComputedStyle(el).minHeight);
    expect(parseInt(minHeight)).toBeGreaterThanOrEqual(50);

    const initialBox = await result.boundingBox();

    // Perform a calculation to populate result
    const num1Input = page.locator('#num1');
    const num2Input = page.locator('#num2');

    if (await num1Input.count() > 0 && await num2Input.count() > 0) {
      await num1Input.fill('10');
      await num2Input.fill('5');

      // Click calculate if there's a button
      const calcButton = page.locator('button:has-text("Calculate")').first();
      if (await calcButton.count() > 0) {
        await calcButton.click();
        await page.waitForTimeout(300);
      }

      // Check position hasn't shifted significantly
      const finalBox = await result.boundingBox();
      if (initialBox && finalBox) {
        expect(Math.abs(finalBox.y - initialBox.y)).toBeLessThan(5);
      }
    }
  });
});

test.describe('ISS-001: Element Position Tracking', () => {
  test('track all major element positions during navigation cycle', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.nav-item');
    // Wait for all CSS animations to complete (0.6s max + buffer)
    await page.waitForTimeout(1000);
    // Click the first calculator to ensure initial state is stable
    await page.click('.nav-item[data-id="basic"]');
    await page.waitForTimeout(500);

    const elements = {
      '.site-header': 'Site Header',
      '.top-nav': 'Top Navigation',
      '.left-nav': 'Left Navigation',
      '.center-column': 'Center Column',
      '.ads-column': 'Ads Column',
      '.site-footer': 'Site Footer',
    };

    // Record initial positions
    const initialPositions = {};
    for (const [selector, name] of Object.entries(elements)) {
      const el = page.locator(selector);
      if (await el.count() > 0) {
        initialPositions[selector] = await el.boundingBox();
        console.log(`Initial ${name}: y=${initialPositions[selector]?.y}, height=${initialPositions[selector]?.height}`);
      }
    }

    // Navigate through calculators
    const allCalcs = [...MATH_CALCULATORS];
    for (const calcId of allCalcs) {
      await page.click(`.nav-item[data-id="${calcId}"]`);
      await page.waitForTimeout(400);

      // Check positions
      for (const [selector, name] of Object.entries(elements)) {
        const el = page.locator(selector);
        if (await el.count() > 0) {
          const currentBox = await el.boundingBox();
          const initialBox = initialPositions[selector];

          if (initialBox && currentBox) {
            const yDiff = Math.abs(currentBox.y - initialBox.y);
            const heightDiff = Math.abs(currentBox.height - initialBox.height);

            if (yDiff > 2 || heightDiff > 2) {
              console.log(`SHIFT DETECTED in ${name} after loading ${calcId}:`);
              console.log(`  Y: ${initialBox.y} -> ${currentBox.y} (diff: ${yDiff})`);
              console.log(`  Height: ${initialBox.height} -> ${currentBox.height} (diff: ${heightDiff})`);
            }

            expect(yDiff).toBeLessThan(3);
            expect(heightDiff).toBeLessThan(3);
          }
        }
      }
    }
  });
});
