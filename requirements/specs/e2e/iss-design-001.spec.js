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

const navigateWithClick = async (page, locator) => {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    locator.click(),
  ]);
};

test.describe('ISS-001: Layout Stability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for animations to complete
    await page.waitForTimeout(800);
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
      await page.waitForTimeout(800);

      const currentBox = await pageElement.boundingBox();

      // Verify dimensions remain stable
      expect(currentBox.width).toBeCloseTo(initialBox.width, 0);
      expect(currentBox.height).toBeCloseTo(initialBox.height, 0);
      expect(currentBox.x).toBeCloseTo(initialBox.x, 0);
      expect(currentBox.y).toBeCloseTo(initialBox.y, 0);
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
      await page.waitForTimeout(800);

      const currentBox = await leftNav.boundingBox();

      expect(currentBox.width).toBeCloseTo(initialBox.width, 0);
      expect(currentBox.height).toBeCloseTo(initialBox.height, 0);
      expect(currentBox.x).toBeCloseTo(initialBox.x, 0);
      expect(currentBox.y).toBeCloseTo(initialBox.y, 0);
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
      await page.waitForTimeout(800);

      const currentBox = await centerColumn.boundingBox();

      expect(currentBox.width).toBeCloseTo(initialBox.width, 0);
      expect(currentBox.height).toBeCloseTo(initialBox.height, 0);
      expect(currentBox.x).toBeCloseTo(initialBox.x, 0);
      expect(currentBox.y).toBeCloseTo(initialBox.y, 0);
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
      await page.waitForTimeout(800);

      const currentBox = await adsColumn.boundingBox();

      expect(currentBox.width).toBeCloseTo(initialBox.width, 0);
      expect(currentBox.height).toBeCloseTo(initialBox.height, 0);
      expect(currentBox.x).toBeCloseTo(initialBox.x, 0);
      expect(currentBox.y).toBeCloseTo(initialBox.y, 0);
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
      await page.waitForTimeout(800);
    }

    const finalBox = await pageElement.boundingBox();
    expect(finalBox.width).toBeCloseTo(initialBox.width, 0);
    expect(finalBox.height).toBeCloseTo(initialBox.height, 0);
    expect(finalBox.x).toBeCloseTo(initialBox.x, 0);
    expect(finalBox.y).toBeCloseTo(initialBox.y, 0);
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
      await page.waitForTimeout(800);

      const currentPageBox = await pageElement.boundingBox();
      const currentLeftNavBox = await leftNav.boundingBox();
      const currentCenterBox = await centerColumn.boundingBox();

      // Page shell should not move
      expect(currentPageBox.width).toBeCloseTo(initialPageBox.width, 0);
      expect(currentPageBox.height).toBeCloseTo(initialPageBox.height, 0);

      // Left nav position should not change
      expect(currentLeftNavBox.x).toBeCloseTo(initialLeftNavBox.x, 0);
      expect(currentLeftNavBox.y).toBeCloseTo(initialLeftNavBox.y, 0);

      // Center column position should not change
      expect(currentCenterBox.x).toBeCloseTo(initialCenterBox.x, 0);
      expect(currentCenterBox.y).toBeCloseTo(initialCenterBox.y, 0);
    }
  });

  test('visual regression - page layout stability', async ({ page }) => {
    // Take screenshot after initial load
    await page.waitForTimeout(1000); // Wait for animations
    await expect(page).toHaveScreenshot('layout-initial.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // Navigate and take screenshot
    const navItems = page.locator('.nav-item');
    if ((await navItems.count()) > 1) {
      await navigateWithClick(page, navItems.nth(1));
      await page.waitForTimeout(800);
      await expect(page).toHaveScreenshot('layout-after-navigation.png', {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });
});
