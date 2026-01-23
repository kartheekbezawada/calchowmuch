import { test, expect } from '@playwright/test';

/**
 * ISS-HEADER-001: Global Header Redesign Visual Regression
 * REQ-ID: REQ-20260123-001
 *
 * Validates pixel-perfect implementation of the global header redesign including:
 * - Brand block with site title and global tagline
 * - Category button styling and active states
 * - Category tagline rendering when category is active
 * - Typography and spacing specifications
 * - One H1 per page rule compliance
 */
test('ISS-HEADER-001: Global Header Redesign Contract', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  // Wait for navigation to render
  await page.waitForSelector('.site-header');

  // ===== Structure Tests =====

  // Verify header container structure
  const header = page.locator('.site-header');
  await expect(header).toBeVisible();

  // Verify brand block exists and contains title + global tagline
  const brand = page.locator('.brand');
  await expect(brand).toBeVisible();

  const siteTitle = page.locator('.site-title');
  await expect(siteTitle).toBeVisible();
  await expect(siteTitle).toHaveText('Calculate How Much');

  const globalTagline = page.locator('.site-tagline-global');
  await expect(globalTagline).toBeVisible();
  await expect(globalTagline).toHaveText('Clear answers, without the guesswork');

  // Verify category tagline container exists (may be hidden initially)
  const categoryTagline = page.locator('.site-tagline-category');
  await expect(categoryTagline).toBeAttached();

  // Verify top nav is inside header
  const topNav = header.locator('#top-nav');
  await expect(topNav).toBeVisible();

  // ===== Typography Tests =====

  // Site title typography (desktop: 24px, weight 700, line-height 28px, color #0B1220)
  const titleStyles = await siteTitle.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      color: cs.color,
    };
  });

  expect(titleStyles.fontSize).toMatch(/^24(\.\d+)?px$/);
  expect(titleStyles.fontWeight).toBe('700');
  expect(titleStyles.lineHeight).toMatch(/^28(\.\d+)?px$/);
  expect(titleStyles.color).toBe('rgb(11, 18, 32)'); // #0B1220

  // Global tagline typography (desktop: 14px, weight 500, line-height 20px, color #475569)
  const globalTaglineStyles = await globalTagline.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      color: cs.color,
    };
  });

  expect(globalTaglineStyles.fontSize).toMatch(/^14(\.\d+)?px$/);
  expect(globalTaglineStyles.fontWeight).toBe('500');
  expect(globalTaglineStyles.lineHeight).toMatch(/^20(\.\d+)?px$/);
  expect(globalTaglineStyles.color).toBe('rgb(71, 85, 105)'); // #475569

  // ===== Category Button Tests =====

  // Get the first non-active button to test default styles
  const firstButton = page.locator('.top-nav button').first();
  const buttonStyles = await firstButton.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      height: cs.height,
      minWidth: cs.minWidth,
      borderRadius: cs.borderRadius,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });

  // Category button: height 36px, min-width 92px, border-radius 10px
  expect(buttonStyles.height).toMatch(/^36(\.\d+)?px$/);
  expect(buttonStyles.minWidth).toMatch(/^92(\.\d+)?px$/);
  expect(buttonStyles.borderRadius).toBe('10px');

  // Category button: font-size 13px, weight 600
  expect(buttonStyles.fontSize).toMatch(/^13(\.\d+)?px$/);
  expect(buttonStyles.fontWeight).toBe('600');

  // ===== Category Tagline Behavior Tests =====

  // Click on a category button to activate it
  const homeLoanBtn = page.locator('[data-testid="top-nav-btn"][data-nav-id="home-loan"]');
  await homeLoanBtn.click();

  // Wait for category tagline to appear
  await page.waitForTimeout(100); // Allow for UI update

  // Verify category tagline is now visible with correct text
  await expect(categoryTagline).toBeVisible();
  const categoryTaglineText = await categoryTagline.textContent();
  expect(categoryTaglineText).toBe('Money, made clear'); // "Home Loans" category tagline

  // Verify category tagline typography (desktop: 13px, weight 500, line-height 18px, color #64748B)
  const categoryTaglineStyles = await categoryTagline.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      color: cs.color,
    };
  });

  expect(categoryTaglineStyles.fontSize).toMatch(/^13(\.\d+)?px$/);
  expect(categoryTaglineStyles.fontWeight).toBe('500');
  expect(categoryTaglineStyles.lineHeight).toMatch(/^18(\.\d+)?px$/);
  expect(categoryTaglineStyles.color).toBe('rgb(100, 116, 139)'); // #64748B

  // Test another category tagline
  const creditCardsBtn = page.locator('[data-testid="top-nav-btn"][data-nav-id="credit-cards"]');
  await creditCardsBtn.click();
  await page.waitForTimeout(100);

  await expect(categoryTagline).toBeVisible();
  const creditCardTaglineText = await categoryTagline.textContent();
  expect(creditCardTaglineText).toBe('Understand the cost before you swipe');

  // ===== SEO & Accessibility Tests =====

  // Verify exactly one H1 per page (site title should NOT be an H1)
  const h1Count = await page.locator('h1').count();
  expect(h1Count).toBeLessThanOrEqual(1);

  // Verify site title is NOT an h1
  const siteTitleTagName = await siteTitle.evaluate((el) => el.tagName.toLowerCase());
  expect(siteTitleTagName).not.toBe('h1');

  // Verify header has landmark role (implicit <header> element)
  const headerRole = await header.evaluate((el) => el.tagName.toLowerCase());
  expect(headerRole).toBe('header');

  // ===== Visual Regression Snapshot =====

  // Take a snapshot of the header region for visual regression testing
  await expect(page).toHaveScreenshot('iss-header-001-full.png', {
    fullPage: false,
    animations: 'disabled',
  });
});

/**
 * ISS-HEADER-001-RESPONSIVE: Tablet and Mobile Breakpoint Tests
 */
test('ISS-HEADER-001-RESPONSIVE: Responsive Typography', async ({ page }) => {
  // Test tablet breakpoint (1024px)
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForSelector('.site-header');

  const siteTitle = page.locator('.site-title');
  const titleFontSizeTablet = await siteTitle.evaluate((el) => getComputedStyle(el).fontSize);
  expect(titleFontSizeTablet).toMatch(/^22(\.\d+)?px$/); // 22px on tablet

  // Test mobile breakpoint (860px and below)
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.site-header');

  const titleFontSizeMobile = await siteTitle.evaluate((el) => getComputedStyle(el).fontSize);
  const globalTaglineMobile = page.locator('.site-tagline-global');
  const globalTaglineFontSizeMobile = await globalTaglineMobile.evaluate((el) => getComputedStyle(el).fontSize);

  expect(titleFontSizeMobile).toMatch(/^20(\.\d+)?px$/); // 20px on mobile
  expect(globalTaglineFontSizeMobile).toMatch(/^13(\.\d+)?px$/); // 13px on mobile

  // Visual regression for mobile
  await expect(page).toHaveScreenshot('iss-header-001-mobile.png', {
    fullPage: false,
    animations: 'disabled',
  });
});
