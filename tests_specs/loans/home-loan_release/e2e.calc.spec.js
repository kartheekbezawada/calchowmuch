import { test, expect } from '@playwright/test';

async function setTextFieldValue(page, selector, value) {
  const field = page.locator(selector);
  await field.fill(String(value));
  await field.blur();
}

test.describe('Home Loan calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loan-calculators/mortgage-calculator/');
    await page.waitForSelector('#mtg-calculate');
  });

  test('HOME-LOAN-TEST-E2E-1: calculates and populates merged snapshot outputs', async ({ page }) => {
    await page.$eval('#mtg-price', (el) => {
      el.value = 400000;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.locator('[data-button-group="mtg-down-type"] button[data-value="percent"]').click();

    const downLabel = page.locator('#mtg-down-value-label');
    await expect(downLabel).toHaveText('Down Payment Percent');

    const advancedTitle = page.locator('.advanced-options .advanced-summary-title');
    await expect(advancedTitle).toHaveText('Advanced Options - Optional');

    const advancedSummary = page.locator('.advanced-options summary');
    const expandState = page.locator('.advanced-options .summary-state-expand');
    const closeState = page.locator('.advanced-options .summary-state-close');
    await expect(expandState).toContainText('Expand');
    await expect(expandState).toBeVisible();
    await expect(closeState).toBeHidden();
    await advancedSummary.click();
    await expect(expandState).toBeHidden();
    await expect(closeState).toContainText('Close');
    await expect(closeState).toBeVisible();

    await expect(page.locator('label[for="mtg-tax"]')).toHaveText('Property Tax');
    await expect(page.locator('label[for="mtg-insurance"]')).toHaveText('Home Insurance');

    await page.$eval('#mtg-down-value', (el) => {
      el.value = 20;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.$eval('#mtg-term', (el) => {
      el.value = 30;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.$eval('#mtg-rate', (el) => {
      el.value = 6.5;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.fill('#mtg-extra', '200');

    await page.click('#mtg-calculate');

    await expect(page.locator('#mtg-result')).toContainText('Monthly Payment');
    await expect(page.locator('[data-mtg="price"]')).not.toHaveText('');
    const totalPaidValue = page.locator('[data-mtg="total-paid"]');
    await expect(totalPaidValue).toContainText(/[0-9]/);
    await expect(totalPaidValue).not.toContainText(/[£$€]/);

    const resultCard = page.locator('#mtg-result');
    await expect(resultCard).not.toContainText(/[£$€]/);

    const tableRows = page.locator('#mtg-table-monthly-body tr');
    expect(await tableRows.count()).toBeGreaterThan(0);
  });

  test('HOME-LOAN-TEST-E2E-2: view toggle switches table visibility and header remains sticky', async ({ page }) => {
    await page.click('#mtg-calculate');

    const yearlyButton = page.locator('#mtg-view-yearly');
    const monthlyButton = page.locator('#mtg-view-monthly');
    const yearlyWrap = page.locator('#mtg-table-yearly-wrap');
    const monthlyWrap = page.locator('#mtg-table-monthly-wrap');

    await expect(yearlyWrap).toHaveClass(/is-hidden/);
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);

    await yearlyButton.click();
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    await monthlyButton.click();
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);

    const stickyHeader = page.locator('#mtg-table-monthly thead th').first();
    await expect(stickyHeader).toHaveCSS('position', 'sticky');
    await expect(stickyHeader).toHaveCSS('top', '0px');
  });

  test('HOME-LOAN-TEST-E2E-2A: exact-value fields sync without pre-click recalculation', async ({
    page,
  }) => {
    const beforeText = await page.locator('#mtg-result').innerText();

    await setTextFieldValue(page, '#mtg-price-field', 500000);
    await expect(page.locator('#mtg-price')).toHaveValue('500000');

    const afterEditText = await page.locator('#mtg-result').innerText();
    expect(afterEditText.trim()).toBe(beforeText.trim());

    await page.click('#mtg-calculate');
    await expect(page.locator('#mtg-result')).toContainText('Monthly Payment');

    const afterCalcText = await page.locator('#mtg-result').innerText();
    expect(afterCalcText.trim()).not.toBe(beforeText.trim());
  });

  test('HOME-LOAN-TEST-E2E-3: renders as single center panel with aligned advanced fields', async ({ page }) => {
    const clusterPanel = page.locator('.hl-cluster-panel');
    await expect(clusterPanel).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);

    await expect(page.locator('#loan-mtg-explanation h3', { hasText: 'Current Inputs' })).toHaveCount(0);
    await expect(page.locator('#calc-home-loan .mtg-preview-label')).toHaveText(
      'Estimated Monthly Payment'
    );

    await page.locator('.advanced-options summary').click();

    const alignment = await page.evaluate(() => {
      const taxInput = document.querySelector('#mtg-tax');
      const insInput = document.querySelector('#mtg-insurance');
      const taxLabel = document.querySelector('label[for="mtg-tax"]');
      const insLabel = document.querySelector('label[for="mtg-insurance"]');
      if (!taxInput || !insInput || !taxLabel || !insLabel) {
        return null;
      }
      const taxInputRect = taxInput.getBoundingClientRect();
      const insInputRect = insInput.getBoundingClientRect();
      const taxLabelRect = taxLabel.getBoundingClientRect();
      const insLabelRect = insLabel.getBoundingClientRect();

      return {
        inputTopDiff: Math.abs(taxInputRect.top - insInputRect.top),
        inputHeightDiff: Math.abs(taxInputRect.height - insInputRect.height),
        labelTopDiff: Math.abs(taxLabelRect.top - insLabelRect.top),
      };
    });

    expect(alignment).not.toBeNull();
    expect(alignment.inputTopDiff).toBeLessThanOrEqual(1.5);
    expect(alignment.inputHeightDiff).toBeLessThanOrEqual(1.5);
    expect(alignment.labelTopDiff).toBeLessThanOrEqual(1.5);

    const faqItems = page.locator('#loan-mtg-explanation .bor-faq-card');
    await expect(faqItems).toHaveCount(13);

    const graphCanvas = page.locator('#mtg-balance-canvas');
    await expect(graphCanvas).toBeVisible();

    const practicalGuide = page.locator('#mtg-section-practical-guide');
    await expect(practicalGuide).toBeVisible();

    const practicalGuideLinks = page.locator('#mtg-section-practical-guide a');
    expect(await practicalGuideLinks.count()).toBeGreaterThan(0);

    await expect(page.locator('#mtg-summary')).toHaveCount(0);

    const trustBlock = page.locator('#mtg-section-trust');
    await expect(trustBlock).toBeVisible();
    await expect(trustBlock).toContainText('For educational purposes only; not financial advice.');

    const sectionOrderIsCorrect = await page.evaluate(() => {
      const sectionIds = [
        'mtg-section-lifetime',
        'mtg-section-amortization',
        'mtg-section-graph',
        'mtg-section-practical-guide',
        'mtg-section-how-to-guide',
        'mtg-section-trust',
        'mtg-section-faq',
      ];
      const positions = sectionIds.map((id) => {
        const element = document.getElementById(id);
        return element ? element.getBoundingClientRect().top + window.scrollY : -1;
      });
      if (positions.some((value) => value < 0)) {
        return false;
      }
      for (let index = 1; index < positions.length; index += 1) {
        if (positions[index] <= positions[index - 1]) {
          return false;
        }
      }
      return true;
    });
    expect(sectionOrderIsCorrect).toBe(true);

    const hasHorizontalScroll = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > root.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('HOME-LOAN-TEST-E2E-4: mobile calculate reveals the result snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('#mtg-calculate');
    await page.waitForTimeout(350);

    const previewBox = await page.locator('#mtg-preview').boundingBox();
    expect(previewBox).toBeTruthy();
    expect(previewBox.y).toBeLessThan(220);

    await expect(page.locator('#mtg-result .mtg-result-value')).toBeFocused();
    await expect(page.locator('#mtg-result-note')).toContainText(/baseline monthly payment|overpayment plan/i);
  });
});
