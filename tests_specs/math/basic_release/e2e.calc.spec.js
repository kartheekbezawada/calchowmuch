import { expect, test } from '@playwright/test';

test.describe('math/basic e2e route guard', () => {
  test('keeps the answer-first flow and arithmetic behavior intact', async ({ page }) => {
    await page.goto('/math/basic/');

    await expect(page.locator('h1')).toHaveText('Basic Calculator');
    await expect(page.locator('#basic-result')).toContainText('32');

    await page.getByRole('button', { name: 'Multiply' }).click();
    await expect(page.locator('#basic-result')).toContainText('240');

    await page.getByRole('button', { name: 'Add Number' }).click();
    await page.locator('#basic-value-3').fill('8');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('#basic-result')).toContainText('40');

    await page.locator('.basic-memory-details summary').click();
    await page.getByRole('button', { name: 'MS' }).click();
    await expect(page.locator('#basic-memory-value')).toContainText('40');
  });
});
