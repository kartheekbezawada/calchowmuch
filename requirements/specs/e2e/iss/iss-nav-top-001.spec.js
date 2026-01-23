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

  // Verify cosmic black is used for default (non-active) state
  const cosmicBlack = 'rgb(11, 15, 20)'; // #0b0f14
  // Check a non-active button (Math is likely active on page load)
  const homeLoanBg = await homeLoanBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(homeLoanBg).toBe(cosmicBlack);

  // Verify active state has white background
  const activeBtn = page.locator('[data-testid="top-nav-btn"].is-active');
  await expect(activeBtn).toBeVisible();
  const activeBg = await activeBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(activeBg).toBe('rgb(255, 255, 255)'); // white

  // Verify active state has black border
  const activeBorder = await activeBtn.evaluate((el) => getComputedStyle(el).borderTopColor);
  expect(activeBorder).toBe(cosmicBlack);

  // Verify consistency: all buttons have same border-radius
  const mathRadius = await mathBtn.evaluate((el) => getComputedStyle(el).borderRadius);
  const homeLoanRadius = await homeLoanBtn.evaluate((el) => getComputedStyle(el).borderRadius);
  const creditCardsRadius = await creditCardsBtn.evaluate((el) => getComputedStyle(el).borderRadius);
  const autoLoansRadius = await autoLoansBtn.evaluate((el) => getComputedStyle(el).borderRadius);

  expect(mathRadius).toBe(homeLoanRadius);
  expect(mathRadius).toBe(creditCardsRadius);
  expect(mathRadius).toBe(autoLoansRadius);
  expect(mathRadius).toBe('10px');

  // Verify consistency: all buttons have same font-size
  const mathFontSize = await mathBtn.evaluate((el) => getComputedStyle(el).fontSize);
  const homeLoanFontSize = await homeLoanBtn.evaluate((el) => getComputedStyle(el).fontSize);
  const creditCardsFontSize = await creditCardsBtn.evaluate((el) => getComputedStyle(el).fontSize);
  const autoLoansFontSize = await autoLoansBtn.evaluate((el) => getComputedStyle(el).fontSize);

  expect(mathFontSize).toBe(homeLoanFontSize);
  expect(mathFontSize).toBe(creditCardsFontSize);
  expect(mathFontSize).toBe(autoLoansFontSize);

  // Verify consistency: all buttons have same font-weight
  const mathFontWeight = await mathBtn.evaluate((el) => getComputedStyle(el).fontWeight);
  const homeLoanFontWeight = await homeLoanBtn.evaluate((el) => getComputedStyle(el).fontWeight);
  const creditCardsFontWeight = await creditCardsBtn.evaluate((el) => getComputedStyle(el).fontWeight);
  const autoLoansFontWeight = await autoLoansBtn.evaluate((el) => getComputedStyle(el).fontWeight);

  expect(mathFontWeight).toBe(homeLoanFontWeight);
  expect(mathFontWeight).toBe(creditCardsFontWeight);
  expect(mathFontWeight).toBe(autoLoansFontWeight);

  // Visual regression snapshot
  await expect(page).toHaveScreenshot('iss-nav-top-001.png', {
    fullPage: false,
    animations: 'disabled',
  });
});
