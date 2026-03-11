import { expect, test } from '@playwright/test';

test.describe('What Percent Is X of Y Calculator', () => {
  test('WPXY-TEST-E2E-1: single-pane journey, formula output, and explanation migration contract', async ({
    page,
  }) => {
    await page.goto('/percentage-calculators/percentage-finder-calculator/');

    await expect(page.locator('h1').first()).toHaveText('What Percent Is X of Y');
    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('#wpxy-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#wpxy-explanation .wpxy-faq-item')).toHaveCount(10);
    await expect(page.locator('#wpxy-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#wpxy-explanation')).not.toContainText('Scenario Summary');
    await expect(page.locator('#wpxy-explanation')).toContainText('Worked Example');

    await page.fill('#wpxy-part', '25');
    await page.fill('#wpxy-whole', '200');
    await page.click('#wpxy-calc', { force: true });

    await expect(page.locator('#wpxy-result')).toContainText('25.00 is 12.50% of 200.00.');
    await expect(page.locator('#wpxy-result-detail')).toContainText(
      'Calculation: (25.00 ÷ 200.00) × 100 = 12.50%.'
    );
    await expect(page.locator('#wpxy-explanation [data-wpxy="percent"]').first()).toHaveText(
      '12.50%'
    );
  });

  test('WPXY-TEST-E2E-2: input validation and zero-division guard', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-finder-calculator/');

    await page.fill('#wpxy-part', '');
    await page.fill('#wpxy-whole', '200');
    await page.click('#wpxy-calc', { force: true });
    await expect(page.locator('#wpxy-result')).toContainText('Enter a valid part value (X).');

    await page.fill('#wpxy-part', '25');
    await page.fill('#wpxy-whole', '');
    await page.click('#wpxy-calc', { force: true });
    await expect(page.locator('#wpxy-result')).toContainText('Enter a valid whole value (Y).');

    await page.fill('#wpxy-part', '25');
    await page.fill('#wpxy-whole', '0');
    await page.click('#wpxy-calc', { force: true });
    await expect(page.locator('#wpxy-result')).toContainText(
      'Result is undefined when the whole (Y) is zero.'
    );
  });

  test('WPXY-TEST-E2E-3: responsive layout keeps answer card right on desktop and stacked on mobile', async ({
    page,
  }) => {
    await page.goto('/percentage-calculators/percentage-finder-calculator/');

    const formPanel = page.locator('.wpxy-form-panel');
    const answerPanel = page.locator('.wpxy-answer-panel');

    const desktopFormBox = await formPanel.boundingBox();
    const desktopAnswerBox = await answerPanel.boundingBox();
    expect(desktopFormBox).toBeTruthy();
    expect(desktopAnswerBox).toBeTruthy();
    expect((desktopAnswerBox?.x ?? 0) > (desktopFormBox?.x ?? 0)).toBeTruthy();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const mobileFormBox = await formPanel.boundingBox();
    const mobileAnswerBox = await answerPanel.boundingBox();
    expect(mobileFormBox).toBeTruthy();
    expect(mobileAnswerBox).toBeTruthy();
    expect((mobileAnswerBox?.y ?? 0) > (mobileFormBox?.y ?? 0)).toBeTruthy();
  });
});
