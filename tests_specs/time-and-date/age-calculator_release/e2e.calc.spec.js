import { expect, test } from '@playwright/test';

test.describe('Age Calculator', () => {
  test('AGE-TEST-E2E-1: single-pane journey, explicit calculate, and copy summary', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/time-and-date/age-calculator/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Age Calculator'
    );

    const headline = page.locator('#age-headline');
    const initialHeadline = (await headline.textContent())?.trim();
    expect(initialHeadline).toBeTruthy();

    await page.locator('#age-dob').fill('1990-06-15');
    await page.locator('#age-as-of').fill('2025-09-01');
    await expect(headline).toHaveText(initialHeadline || '');

    await page.locator('#age-calculate').click();
    await expect(headline).toHaveText('35 years, 2 months, 17 days');
    await expect(page.locator('#age-summary')).toHaveText('As of Sep 1, 2025. Born on Friday.');
    await expect(page.locator('#age-total-months')).toHaveText('422');
    await expect(page.locator('#age-born-weekday')).toHaveText('Friday');
    await expect(page.locator('#age-next-birthday-detail')).toContainText('Jun 15, 2026');

    await page.locator('#age-copy-summary').click();
    await expect(page.locator('#age-copy-summary')).toHaveText('Copied');

    const clipboardText = await page.evaluate(async () => navigator.clipboard.readText());
    expect(clipboardText).toContain('exact age is 35 years, 2 months, 17 days');
  });

  test('AGE-TEST-E2E-2: helper action, validation, and mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/time-and-date/age-calculator/');

    await page.locator('#age-dob').fill('1990-06-15');
    await page.locator('#age-as-of').fill('2025-09-01');
    await page.locator('#age-use-today').click();

    const todayValue = await page.evaluate(() => {
      const now = new Date();
      const pad = (value) => String(value).padStart(2, '0');
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    });
    await expect(page.locator('#age-as-of')).toHaveValue(todayValue);

    await page.locator('#age-dob').fill('2025-10-01');
    await page.locator('#age-as-of').fill('2025-09-01');
    await page.locator('#age-calculate').click();
    await expect(page.locator('#age-error')).toContainText(
      'Date of birth must be on or before the as-of date.'
    );

    await expect(page.locator('#age-explanation h2')).toHaveText(
      'How old am I on a specific date?'
    );
    await expect(page.locator('#age-explanation h3').first()).toHaveText('How to Guide');
    await expect(page.locator('#age-explanation .age-notes')).toContainText('Last updated:');

    const workbench = page.locator('.age-workbench');
    const fieldCard = page.locator('.age-input-card');
    const answerCard = page.locator('.age-answer-card');
    const workbenchBox = await workbench.boundingBox();
    const fieldBox = await fieldCard.boundingBox();
    const answerBox = await answerCard.boundingBox();

    expect(workbenchBox).not.toBeNull();
    expect(fieldBox).not.toBeNull();
    expect(answerBox).not.toBeNull();
    expect((answerBox?.y ?? 0) > (fieldBox?.y ?? 0)).toBeTruthy();

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    );
    expect(hasOverflow).toBeFalsy();
  });
});
