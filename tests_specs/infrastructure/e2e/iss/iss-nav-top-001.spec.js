import { test, expect } from '@playwright/test';

test('ISS-NAV-TOP-001: Top Navigation Visual Regression Contract', async ({ page }) => {
  await page.goto('/loan-calculators/mortgage-calculator/', { waitUntil: 'networkidle' });

  // Wait for navigation to render
  await page.waitForSelector('.top-nav');

  // Verify container markup
  const topNav = page.locator('.top-nav');
  await expect(topNav).toBeVisible();

  // Verify 4 canonical category links exist
  const mathBtn = page.locator('.top-nav .top-nav-link[href="/math/basic/"]');
  const homeLoanBtn = page.locator('.top-nav .top-nav-link[href="/loan-calculators/mortgage-calculator/"]');
  const creditCardsBtn = page.locator(
    '.top-nav .top-nav-link[href="/credit-card-calculators/credit-card-payment-calculator/"]'
  );
  const autoLoansBtn = page.locator(
    '.top-nav .top-nav-link[href="/car-loan-calculators/car-loan-calculator/"]'
  );

  await expect(mathBtn).toBeVisible();
  await expect(homeLoanBtn).toBeVisible();
  await expect(creditCardsBtn).toBeVisible();
  await expect(autoLoansBtn).toBeVisible();

  // Verify consistency: all buttons have same border-radius
  const mathRadius = await mathBtn.evaluate((el) => getComputedStyle(el).borderRadius);
  const homeLoanRadius = await homeLoanBtn.evaluate((el) => getComputedStyle(el).borderRadius);
  const creditCardsRadius = await creditCardsBtn.evaluate((el) => getComputedStyle(el).borderRadius);
  const autoLoansRadius = await autoLoansBtn.evaluate((el) => getComputedStyle(el).borderRadius);

  expect(mathRadius).toBe(homeLoanRadius);
  expect(mathRadius).toBe(creditCardsRadius);
  expect(mathRadius).toBe(autoLoansRadius);
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

});
