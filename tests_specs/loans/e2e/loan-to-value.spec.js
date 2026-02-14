import { expect, test } from '@playwright/test';

const CALCULATOR_URL = '/loans/loan-to-value/';

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

test.describe('Loan-to-Value calculator route contract', () => {
  test('LTV-E2E-1: single-pane route with merged calculator and explanation', async ({ page }) => {
    await page.goto(CALCULATOR_URL);

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);

    const panel = centerPanels.first();
    await expect(panel).toHaveClass(/panel-span-all/);
    await expect(panel.locator('#calc-loan-to-value')).toBeVisible();
    await expect(panel.locator('#loan-ltv-explanation')).toBeVisible();
    await expect(panel.locator('h3:has-text("Explanation")')).toHaveCount(0);
  });

  test('LTV-E2E-2: calculates outputs and toggles LTV table views', async ({ page }) => {
    await page.goto(CALCULATOR_URL);

    await setSliderValue(page, '#ltv-property', 500000);
    await setSliderValue(page, '#ltv-loan', 350000);
    await page.click('#ltv-calculate');

    await expect(page.locator('#ltv-result')).toContainText('Current LTV');
    await expect(page.locator('[data-ltv="snapshot-ltv"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-ltv="snapshot-bucket"]')).not.toHaveText('--');
    await expect(page.locator('[data-ltv="snapshot-risk"]')).not.toHaveText('--');

    const bandsWrap = page.locator('#ltv-table-bands-wrap');
    const targetsWrap = page.locator('#ltv-table-targets-wrap');

    await expect(bandsWrap).not.toHaveClass(/is-hidden/);
    await expect(targetsWrap).toHaveClass(/is-hidden/);

    await page.click('#ltv-view-targets');
    await expect(targetsWrap).not.toHaveClass(/is-hidden/);
    await expect(bandsWrap).toHaveClass(/is-hidden/);

    const targetRows = await page.locator('#ltv-target-body tr').count();
    expect(targetRows).toBeGreaterThan(0);

    await page.click('#ltv-view-bands');
    await expect(bandsWrap).not.toHaveClass(/is-hidden/);
    await expect(targetsWrap).toHaveClass(/is-hidden/);

    await expect(page.locator('#loan-ltv-explanation .bor-faq-card')).toHaveCount(10);
  });
});
