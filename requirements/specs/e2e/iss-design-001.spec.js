/**
 * ISS-001 Layout Stability Tests
 *
 * These tests verify that navigating between calculators does not cause
 * layout shifts or "bouncing" UI elements.
 *
 * Test coverage per UNIVERSAL_REQUIREMENTS.md [TEST-1.3]:
 * - Verify navigation between calculators does not introduce layout shifts
 * - Confirm scrollbars remain visible and space is reserved during navigation
 */

import { test, expect } from '@playwright/test';

const BOX_TOLERANCE_PX = 3;

const navigateWithClick = async (page, locator) => {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    locator.click(),
  ]);
};

const waitForStableShell = async (page) => {
  // Wait until fonts and layout have settled before measuring dimensions.
  await page.evaluate(async () => {
    if (document.fonts?.status !== 'loaded') {
      await document.fonts.ready;
    }
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  await page.waitForTimeout(120);
};

const assertStableBox = (currentBox, initialBox) => {
  expect(Math.abs(currentBox.width - initialBox.width)).toBeLessThanOrEqual(BOX_TOLERANCE_PX);
  expect(Math.abs(currentBox.height - initialBox.height)).toBeLessThanOrEqual(BOX_TOLERANCE_PX);
  expect(Math.abs(currentBox.x - initialBox.x)).toBeLessThanOrEqual(BOX_TOLERANCE_PX);
  expect(Math.abs(currentBox.y - initialBox.y)).toBeLessThanOrEqual(BOX_TOLERANCE_PX);
};

test.describe('ISS-001: Layout Stability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loans/car-loan');
    await waitForStableShell(page);
  });

  test('page shell maintains fixed dimensions during navigation', async ({ page }) => {
    // Get initial page dimensions
    const pageElement = page.locator('.page');
    const initialBox = await pageElement.boundingBox();

    // Navigate to different calculators
    for (let i = 0; i < 5; i++) {
      const navItems = page.locator('.nav-item:not(.is-active)');
      const count = await navItems.count();
      if (!count) {
        break;
      }
      await navigateWithClick(page, navItems.nth(Math.min(i, count - 1)));
      await waitForStableShell(page);

      const currentBox = await pageElement.boundingBox();

      // Verify dimensions remain stable.
      assertStableBox(currentBox, initialBox);
    }
  });

  test('left navigation pane has stable dimensions during navigation', async ({ page }) => {
    const leftNav = page.locator('.left-nav');
    const initialBox = await leftNav.boundingBox();

    for (let i = 0; i < 5; i++) {
      const navItems = page.locator('.nav-item:not(.is-active)');
      const count = await navItems.count();
      if (!count) {
        break;
      }
      await navigateWithClick(page, navItems.nth(Math.min(i, count - 1)));
      await waitForStableShell(page);

      const currentBox = await leftNav.boundingBox();

      assertStableBox(currentBox, initialBox);
    }
  });

  test('center column has stable dimensions during navigation', async ({ page }) => {
    const centerColumn = page.locator('.center-column');
    const initialBox = await centerColumn.boundingBox();

    for (let i = 0; i < 5; i++) {
      const navItems = page.locator('.nav-item:not(.is-active)');
      const count = await navItems.count();
      if (!count) {
        break;
      }
      await navigateWithClick(page, navItems.nth(Math.min(i, count - 1)));
      await waitForStableShell(page);

      const currentBox = await centerColumn.boundingBox();

      assertStableBox(currentBox, initialBox);
    }
  });

  test('ads column has stable dimensions during navigation', async ({ page }) => {
    const adsColumn = page.locator('.ads-column');
    const initialBox = await adsColumn.boundingBox();

    for (let i = 0; i < 5; i++) {
      const navItems = page.locator('.nav-item:not(.is-active)');
      const count = await navItems.count();
      if (!count) {
        break;
      }
      await navigateWithClick(page, navItems.nth(Math.min(i, count - 1)));
      await waitForStableShell(page);

      const currentBox = await adsColumn.boundingBox();

      assertStableBox(currentBox, initialBox);
    }
  });

  test('scrollbars remain visible during navigation', async ({ page }) => {
    // Check that scrollbar-gutter: stable is applied
    const leftNav = page.locator('.left-nav');
    const panels = page.locator('.panel-scroll');

    // Check left nav scrollbar
    const leftNavOverflow = await leftNav.evaluate((el) => getComputedStyle(el).overflowY);
    expect(leftNavOverflow).toBe('scroll');

    const leftNavGutter = await leftNav.evaluate((el) => getComputedStyle(el).scrollbarGutter);
    expect(leftNavGutter).toBe('stable');

    // Check panels scrollbar
    const panelCount = await panels.count();
    for (let i = 0; i < panelCount; i++) {
      const panel = panels.nth(i);
      const overflow = await panel.evaluate((el) => getComputedStyle(el).overflowY);
      expect(overflow).toBe('scroll');

      const gutter = await panel.evaluate((el) => getComputedStyle(el).scrollbarGutter);
      expect(gutter).toBe('stable');
    }
  });

  test('buttons do not have transform transitions', async ({ page }) => {
    // Verify that buttons do not have transform in their transition property
    const topNavButtons = page.locator('.top-nav .top-nav-link');
    const navItems = page.locator('.nav-item');

    // Check top nav buttons
    const topNavCount = await topNavButtons.count();
    for (let i = 0; i < topNavCount; i++) {
      const transition = await topNavButtons.nth(i).evaluate((el) => getComputedStyle(el).transition);
      expect(transition).not.toContain('transform');
    }

    // Check nav items
    const navItemCount = await navItems.count();
    for (let i = 0; i < Math.min(navItemCount, 10); i++) {
      const transition = await navItems.nth(i).evaluate((el) => getComputedStyle(el).transition);
      expect(transition).not.toContain('transform');
    }
  });

  test('no layout shift when clicking nav items rapidly', async ({ page }) => {
    const pageElement = page.locator('.page');
    const initialBox = await pageElement.boundingBox();

    for (let i = 0; i < 3; i++) {
      const navItems = page.locator('.nav-item:not(.is-active)');
      const count = await navItems.count();
      if (!count) {
        break;
      }
      await navigateWithClick(page, navItems.nth(Math.min(i, count - 1)));
      await waitForStableShell(page);
    }

    const finalBox = await pageElement.boundingBox();
    assertStableBox(finalBox, initialBox);
  });

  test('category switching does not cause layout shift', async ({ page }) => {
    const pageElement = page.locator('.page');
    const leftNav = page.locator('.left-nav');
    const centerColumn = page.locator('.center-column');

    const initialPageBox = await pageElement.boundingBox();
    const initialLeftNavBox = await leftNav.boundingBox();
    const initialCenterBox = await centerColumn.boundingBox();

    // Switch categories
    for (let i = 0; i < 4; i++) {
      const topNavButtons = page.locator('.top-nav .top-nav-link:not(.is-active)');
      const categoryCount = await topNavButtons.count();
      if (!categoryCount) {
        break;
      }
      await navigateWithClick(page, topNavButtons.nth(Math.min(i, categoryCount - 1)));
      await waitForStableShell(page);

      const currentPageBox = await pageElement.boundingBox();
      const currentLeftNavBox = await leftNav.boundingBox();
      const currentCenterBox = await centerColumn.boundingBox();

      // Page shell should not move
      expect(Math.abs(currentPageBox.width - initialPageBox.width)).toBeLessThanOrEqual(BOX_TOLERANCE_PX);
      expect(Math.abs(currentPageBox.height - initialPageBox.height)).toBeLessThanOrEqual(
        BOX_TOLERANCE_PX
      );

      // Left nav position should not change
      expect(Math.abs(currentLeftNavBox.x - initialLeftNavBox.x)).toBeLessThanOrEqual(
        BOX_TOLERANCE_PX
      );
      expect(Math.abs(currentLeftNavBox.y - initialLeftNavBox.y)).toBeLessThanOrEqual(
        BOX_TOLERANCE_PX
      );

      // Center column position should not change
      expect(Math.abs(currentCenterBox.x - initialCenterBox.x)).toBeLessThanOrEqual(
        BOX_TOLERANCE_PX
      );
      expect(Math.abs(currentCenterBox.y - initialCenterBox.y)).toBeLessThanOrEqual(
        BOX_TOLERANCE_PX
      );
    }
  });

  test('visual regression - page layout stability', async ({ page }) => {
    // Take screenshot after initial load
    await waitForStableShell(page);
    await expect(page).toHaveScreenshot('layout-initial.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // Navigate and take screenshot
    const navItems = page.locator('.nav-item');
    if ((await navItems.count()) > 1) {
      await navigateWithClick(page, navItems.nth(1));
      await waitForStableShell(page);
      await expect(page).toHaveScreenshot('layout-after-navigation.png', {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });
});
