import { test, expect } from "@playwright/test";

test("ISS-DESIGN-001: tagline + hierarchy contract", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // 1) Assert global tagline exists EXACTLY (no rewording) - HEADER-001
  const taglineText = "Clear answers, without the guesswork";
  const tagline = page.locator('.site-tagline-global');
  await expect(tagline).toBeVisible();
  await expect(tagline).toHaveText(taglineText);

  // 2) Assert tagline appears below site title
  const title = page.getByText("Calculate How Much", { exact: true });
  await expect(title).toBeVisible();

  const titleBox = await title.boundingBox();
  const taglineBox = await tagline.boundingBox();
  expect(titleBox && taglineBox).toBeTruthy();
  expect(taglineBox.y).toBeGreaterThan(titleBox.y);

  // 3) Assert calculator area has border OR background container
  // The calculator uses .panel or .calculator-ui classes
  const calcContainer = page.locator(".center-column .panel, .center-column .calculator-ui").first();
  await expect(calcContainer).toBeVisible();

  const calcStyles = await calcContainer.evaluate(el => {
    const cs = getComputedStyle(el);
    return { 
      bg: cs.backgroundColor, 
      border: cs.borderTopWidth,
      borderColor: cs.borderTopColor
    };
  });

  const calcHasBg = calcStyles.bg !== "rgba(0, 0, 0, 0)" && calcStyles.bg !== "transparent";
  const calcHasBorder = parseFloat(calcStyles.border) > 0;
  expect(calcHasBg || calcHasBorder).toBeTruthy();

  // 4) Assert left nav remains flat (no border/background container)
  const leftNav = page.locator(".left-nav").first();
  await expect(leftNav).toBeVisible();

  const navStyles = await leftNav.evaluate(el => {
    const cs = getComputedStyle(el);
    return { 
      bg: cs.backgroundColor, 
      border: cs.borderTopWidth 
    };
  });

  const navHasBg = navStyles.bg !== "rgba(0, 0, 0, 0)" && navStyles.bg !== "transparent";
  const navHasBorder = parseFloat(navStyles.border) > 0;
  expect(navHasBg || navHasBorder).toBeFalsy();

  // 5) Add screenshot baseline test
  await expect(page).toHaveScreenshot("iss-design-001-home.png", {
    fullPage: false
  });
});