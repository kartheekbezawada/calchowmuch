import { test, expect } from '@playwright/test';

test('ISS-NAV-TOP-001: Top Navigation Visual Regression Contract', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  // Wait for navigation to render
  await page.waitForSelector('[data-testid="top-nav"]');

  // Verify container markup
  const topNav = page.locator('[data-testid="top-nav"]');
  await expect(topNav).toBeVisible();

  // Verify all 4 canonical buttons exist with correct data-nav-id
  const mathBtn = page.locator('[data-testid="top-nav-btn"][data-nav-id="math"]');
  const homeLoanBtn = page.locator('[data-testid="top-nav-btn"][data-nav-id="home-loan"]');
  const creditCardsBtn = page.locator('[data-testid="top-nav-btn"][data-nav-id="credit-cards"]');
  const autoLoansBtn = page.locator('[data-testid="top-nav-btn"][data-nav-id="auto-loans"]');

  await expect(mathBtn).toBeVisible();
  await expect(homeLoanBtn).toBeVisible();
  await expect(creditCardsBtn).toBeVisible();
  await expect(autoLoansBtn).toBeVisible();

  // HEADER-001: Verify button background is #0B0B0B for default (non-active) state
  const buttonBlack = 'rgb(11, 11, 11)'; // #0B0B0B
  // Check a non-active button (Math is likely active on page load)
  const homeLoanBg = await homeLoanBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(homeLoanBg).toBe(buttonBlack);

  // HEADER-001: Verify active state has blue background (#2563EB)
  const activeBtn = page.locator('[data-testid="top-nav-btn"].is-active');
  await expect(activeBtn).toBeVisible();
  const activeBg = await activeBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(activeBg).toBe('rgb(37, 99, 235)'); // #2563EB

  // HEADER-001: Verify active state has blue border (#2563EB)
  const activeBorder = await activeBtn.evaluate((el) => getComputedStyle(el).borderTopColor);
  expect(activeBorder).toBe('rgb(37, 99, 235)'); // #2563EB

  // Verify consistency: all buttons have same border-radius
  const mathRadius = await mathBtn.evaluate((el) => getComputedStyle(el).borderRadius);
  const homeLoanRadius = await homeLoanBtn.evaluate((el) => getComputedStyle(el).borderRadius);
  const creditCardsRadius = await creditCardsBtn.evaluate((el) => getComputedStyle(el).borderRadius);
  const autoLoansRadius = await autoLoansBtn.evaluate((el) => getComputedStyle(el).borderRadius);

  expect(mathRadius).toBe(homeLoanRadius);
  expect(mathRadius).toBe(creditCardsRadius);
  expect(mathRadius).toBe(autoLoansRadius);
  expect(mathRadius).toBe('10px');

  // HEADER-001: Verify consistency and specifications - all buttons have same font-size (13px)
  const mathFontSize = await mathBtn.evaluate((el) => getComputedStyle(el).fontSize);
  const homeLoanFontSize = await homeLoanBtn.evaluate((el) => getComputedStyle(el).fontSize);
  const creditCardsFontSize = await creditCardsBtn.evaluate((el) => getComputedStyle(el).fontSize);
  const autoLoansFontSize = await autoLoansBtn.evaluate((el) => getComputedStyle(el).fontSize);

  expect(mathFontSize).toBe(homeLoanFontSize);
  expect(mathFontSize).toBe(creditCardsFontSize);
  expect(mathFontSize).toBe(autoLoansFontSize);
  // Verify font-size is 13px as per HEADER-001
  expect(mathFontSize).toMatch(/^13(\.\d+)?px$/);

  // HEADER-001: Verify consistency and specifications - all buttons have same font-weight (600)
  const mathFontWeight = await mathBtn.evaluate((el) => getComputedStyle(el).fontWeight);
  const homeLoanFontWeight = await homeLoanBtn.evaluate((el) => getComputedStyle(el).fontWeight);
  const creditCardsFontWeight = await creditCardsBtn.evaluate((el) => getComputedStyle(el).fontWeight);
  const autoLoansFontWeight = await autoLoansBtn.evaluate((el) => getComputedStyle(el).fontWeight);

  expect(mathFontWeight).toBe(homeLoanFontWeight);
  expect(mathFontWeight).toBe(creditCardsFontWeight);
  expect(mathFontWeight).toBe(autoLoansFontWeight);
  // Verify font-weight is 600 as per HEADER-001
  expect(mathFontWeight).toBe('600');

  // Visual regression snapshot
  await expect(page).toHaveScreenshot('iss-nav-top-001.png', {
    fullPage: false,
    animations: 'disabled',
  });
});
