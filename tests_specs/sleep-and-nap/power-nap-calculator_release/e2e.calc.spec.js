import { expect, test } from '@playwright/test';

test.describe('Power Nap Calculator', () => {
  test('POWER-NAP-TEST-E2E-1: user journey and outputs', async ({ page }) => {
    await page.goto('/time-and-date/power-nap-calculator/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Power Nap Calculator'
    );

    await page.locator('#power-nap-start-time').fill('13:00');
    await page.locator('#power-nap-calculate').click();

    const results = page.locator('#power-nap-results-list .result-row');
    await expect(results).toHaveCount(5);
    await expect(results.nth(0)).toContainText('Micro Nap (10 min)');
    await expect(results.nth(1)).toContainText('Power Nap (20 min)');
    await expect(results.nth(2)).toContainText('Power Nap (30 min)');
    await expect(results.nth(3)).toContainText('Recovery Nap (60 min)');
    await expect(results.nth(4)).toContainText('Full Cycle (90 min)');

    const recommended = page.locator('#power-nap-results-list .result-row.is-recommended');
    await expect(recommended).toHaveCount(2);

    await page.locator('#power-nap-start-time').fill('14:00');
    await expect(page.locator('#power-nap-results-list')).toBeHidden();
    await expect(page.locator('#power-nap-placeholder')).toBeVisible();

    await page.locator('#power-nap-calculate').click();
    await expect(page.locator('#power-nap-results-list')).toBeVisible();
  });

  test('POWER-NAP-TEST-E2E-2: explanation content and FAQs', async ({ page }) => {
    await page.goto('/time-and-date/power-nap-calculator/');

    const explanation = page.locator('#power-nap-explanation');
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation.locator('h2')).toHaveText('When should you wake up from a power nap?');
    await expect(explanation.locator('h3')).toHaveCount(3);
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.power-nap-faq-item')).toHaveCount(10);
    await expect(explanation.locator('.power-nap-notes li')).toHaveCount(5);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');
  });

  test('POWER-NAP-TEST-E2E-2B: recommended rows stay visually differentiated', async ({
    page,
  }) => {
    await page.goto('/time-and-date/power-nap-calculator/');

    await page.locator('#power-nap-start-time').fill('13:00');
    await page.locator('#power-nap-calculate').click();

    const recommended = page.locator('#power-nap-results-list .result-row.is-recommended');
    await expect(recommended).toHaveCount(2);
    await expect(page.locator('#power-nap-results-list .recommend-badge')).toHaveCount(2);

    const recommendedBackground = await recommended.first().evaluate((row) => {
      const styles = getComputedStyle(row);
      return {
        image: styles.backgroundImage,
        color: styles.backgroundColor,
      };
    });
    const regularBackground = await page.locator('#power-nap-results-list .result-row').first().evaluate((row) => {
      const styles = getComputedStyle(row);
      return {
        image: styles.backgroundImage,
        color: styles.backgroundColor,
      };
    });

    expect(recommendedBackground.image !== 'none' || recommendedBackground.color !== regularBackground.color).toBeTruthy();
    expect(recommendedBackground).not.toEqual(regularBackground);
  });

  test('POWER-NAP-TEST-E2E-3: evening warning for late start', async ({ page }) => {
    await page.goto('/time-and-date/power-nap-calculator/');

    await page.locator('#power-nap-start-time').fill('19:00');
    await page.locator('#power-nap-calculate').click();

    const warning = page.locator('#power-nap-warning');
    await expect(warning).toBeVisible();
    await expect(warning).toContainText('Long naps in the evening');
  });
});
