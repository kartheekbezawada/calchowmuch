import { expect, test } from "@playwright/test";

function parseNumber(text) {
  return Number(String(text || "").replace(/[^0-9.-]+/g, ""));
}

test.describe("Compound Interest Calculator", () => {
  test("CI-TEST-E2E-1: user journey and projection table frequency toggle", async ({
    page,
  }) => {
    await page.goto("/finance-calculators/compound-interest-calculator/");

    await expect(page.locator("h1").first()).toHaveText(
      "Compound Interest Calculator",
    );
    await expect(page.locator(".top-nav")).toHaveCount(0);
    await expect(page.locator(".left-nav")).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://calchowmuch.com/finance-calculators/compound-interest-calculator/",
    );

    await expect(
      page.locator("#ci-explanation .mtg-exp-section h3", {
        hasText: "How to Guide",
      }),
    ).toHaveCount(1);
    await expect(
      page.locator("#ci-explanation .mtg-exp-section h3", {
        hasText: "Growth Projection Table",
      }),
    ).toHaveCount(1);
    await expect(
      page.locator("#ci-explanation .mtg-exp-section h3", {
        hasText: "Growth Visualization",
      }),
    ).toHaveCount(1);

    await page.fill("#ci-principal", "10000");
    await page.fill("#ci-rate", "6");
    await page.fill("#ci-time", "2");
    await page.fill("#ci-contribution", "100");
    await page.click("#ci-calc");

    await expect(
      page.locator(
        '[data-button-group="ci-table-frequency"] button[data-value="annual"]',
      ),
    ).toHaveClass(/is-active/);

    const resultText = await page.locator("#ci-result").textContent();
    const resultValue = parseNumber(resultText);
    expect(resultValue).toBeGreaterThan(10000);

    await expect(page.locator("#ci-projection-body tr")).toHaveCount(2);
    await expect(
      page.locator("#ci-projection-body tr").first().locator("td").first(),
    ).toHaveText("Year 1");

    await page.click(
      '[data-button-group="ci-compounding"] button[data-value="quarterly"]',
    );
    await expect(
      page.locator(
        '[data-button-group="ci-compounding"] button[data-value="quarterly"]',
      ),
    ).toHaveClass(/is-active/);

    await page.click(
      '[data-button-group="ci-table-frequency"] button[data-value="semiannual"]',
    );
    await expect(page.locator("#ci-projection-body tr")).toHaveCount(4);
    await expect(
      page.locator("#ci-projection-body tr").first().locator("td").first(),
    ).toHaveText("Half-Year 1");
    await expect(
      page.locator(
        '[data-button-group="ci-compounding"] button[data-value="quarterly"]',
      ),
    ).toHaveClass(/is-active/);

    await page.click(
      '[data-button-group="ci-table-frequency"] button[data-value="quarterly"]',
    );
    await expect(page.locator("#ci-projection-body tr")).toHaveCount(8);
    await expect(
      page.locator("#ci-projection-body tr").first().locator("td").first(),
    ).toHaveText("Quarter 1");
    await expect(
      page.locator(
        '[data-button-group="ci-compounding"] button[data-value="quarterly"]',
      ),
    ).toHaveClass(/is-active/);

    await expect(page.locator("#ci-growth-chart-section")).toBeVisible();
    await expect(
      page.locator(
        '[data-button-group="ci-chart-scale"] button[data-value="linear"]',
      ),
    ).toHaveClass(/is-active/);
    await page.click(
      '[data-button-group="ci-chart-scale"] button[data-value="log"]',
    );
    await expect(
      page.locator(
        '[data-button-group="ci-chart-scale"] button[data-value="log"]',
      ),
    ).toHaveClass(/is-active/);
  });
});
