import { expect, test } from '@playwright/test';

test.describe('Energy-Based Nap Selector', () => {
  test('ENAP-TEST-E2E-1: route journey and deterministic behavior', async ({ page }) => {
    await page.goto('/time-and-date/energy-based-nap-selector/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Energy-Based Nap Selector'
    );

    await expect(page.locator('select')).toHaveCount(0);

    const goalButtons = page.locator('[data-button-group="energy-goal"] button');
    await expect(goalButtons).toHaveCount(3);
    await expect(goalButtons.nth(2)).toHaveClass(/is-active/);

    await page.locator('#energy-nap-start-time').fill('23:30');
    await page.locator('#energy-nap-calculate').click();

    await expect(page.locator('#energy-nap-primary')).toContainText('25 min');
    await expect(page.locator('#energy-nap-warning')).toContainText('downgraded');

    await page.locator('[data-button-group="energy-goal"] button[data-value="full"]').click();
    await page.locator('#energy-nap-calculate').click();
    await expect(page.locator('#energy-nap-primary')).toContainText('90 min');
    await expect(page.locator('#energy-nap-warning')).toContainText('90-minute');

    const beforeEdit = (await page.locator('#energy-nap-primary').innerText()).trim();
    await page.locator('#energy-nap-start-time').fill('13:00');
    await expect(page.locator('#energy-nap-primary')).toHaveClass(/is-hidden/);
    await expect(page.locator('#energy-nap-placeholder')).toBeVisible();

    await page.locator('#energy-nap-calculate').click();
    await expect(page.locator('#energy-nap-primary')).toBeVisible();
    await expect(page.locator('#energy-nap-primary')).not.toHaveText(beforeEdit);
  });

  test('ENAP-TEST-E2E-2: explanation pane and FAQ count', async ({ page }) => {
    await page.goto('/time-and-date/energy-based-nap-selector/');

    const explanation = page.locator('#energy-nap-explanation');
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation.locator('h2')).toHaveText('Which nap length matches the energy you need?');
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.faq-box')).toHaveCount(10);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');
  });

  test('ENAP-TEST-E2E-3: primary recommendation stays visually differentiated', async ({
    page,
  }) => {
    await page.goto('/time-and-date/energy-based-nap-selector/');

    await page.locator('#energy-nap-start-time').fill('23:30');
    await page.locator('#energy-nap-calculate').click();

    const primaryCard = page.locator('#energy-nap-primary');
    await expect(primaryCard).toBeVisible();
    await expect(primaryCard.locator('h4')).toContainText('Primary recommendation');

    const primaryBackground = await primaryCard.evaluate((card) => {
      const styles = getComputedStyle(card);
      return {
        image: styles.backgroundImage,
        color: styles.backgroundColor,
      };
    });
    const alternativeBackground = await page
      .locator('#energy-nap-alternatives .energy-alt-row')
      .first()
      .evaluate((row) => {
        const styles = getComputedStyle(row);
        return {
          image: styles.backgroundImage,
          color: styles.backgroundColor,
        };
      });

    expect(primaryBackground.image !== 'none' || primaryBackground.color !== alternativeBackground.color).toBeTruthy();
    expect(primaryBackground).not.toEqual(alternativeBackground);
  });
});
