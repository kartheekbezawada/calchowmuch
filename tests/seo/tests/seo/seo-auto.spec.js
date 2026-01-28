const IS_VITEST = typeof process.env.VITEST_WORKER_ID !== "undefined";

if (IS_VITEST) {
  globalThis.test.skip("SEO auto rules require Playwright", () => {});
} else {
  const { test, expect } = require("@playwright/test");
  const targets = require("./seo.targets.json");

/**
 * Run:
 *   npx playwright test tests/seo/seo-auto.spec.js
 *   REQ_ID=REQ-20260120-021 npx playwright test tests/seo/seo-auto.spec.js
 *   SEO_URLS="/a,/b" npx playwright test tests/seo/seo-auto.spec.js
 *
 * Requires: baseURL set in Playwright config.
 */

function getTargets(baseURL) {
  const envUrls = process.env.SEO_URLS
    ? process.env.SEO_URLS.split(",").map(s => s.trim()).filter(Boolean)
    : null;

  if (envUrls && envUrls.length) return envUrls.map(u => new URL(u, baseURL).toString());

  const reqId = process.env.REQ_ID;
  if (reqId && Array.isArray(targets[reqId])) {
    return targets[reqId].map(u => new URL(u, baseURL).toString());
  }

  return (targets.default || []).map(u => new URL(u, baseURL).toString());
}

function extractJsonLdCandidates(texts) {
  const out = [];
  for (const raw of texts) {
    const t = (raw || "").trim();
    if (!t) continue;
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) out.push(...parsed);
      else out.push(parsed);
    } catch {
      // ignore; handled by "must have at least one valid candidate"
    }
  }
  return out;
}

function hasRequiredJsonLdFields(obj) {
  if (!obj || typeof obj !== "object") return false;

  const nodes = [];
  if (Array.isArray(obj["@graph"])) nodes.push(...obj["@graph"]);
  nodes.push(obj);

  return nodes.some((n) => {
    if (!n || typeof n !== "object") return false;
    return (
      typeof n["@type"] === "string" &&
      typeof n["name"] === "string" &&
      typeof n["description"] === "string" &&
      typeof n["url"] === "string"
    );
  });
}

function validateHeadingHierarchy(levels) {
  // levels is like [1,2,2,3,2,...]
  // Rule: no jumps > 1 (e.g., 2 -> 4 is invalid)
  for (let i = 1; i < levels.length; i++) {
    const prev = levels[i - 1];
    const cur = levels[i];
    if (cur - prev > 1) return { ok: false, prev, cur, i };
  }
  return { ok: true };
}
 
  test.describe("SEO Auto Rules (1:1 with matrix)", () => {
    test("baseURL must be set", async ({ baseURL }) => {
    expect(baseURL, "Set baseURL in Playwright config").toBeTruthy();
  });

  test("SEO auto checks for all target URLs", async ({ page, request, baseURL }) => {
    const urls = getTargets(baseURL);
    expect(urls.length, "No SEO targets provided").toBeGreaterThan(0);

    // Fetch sitemap once
    const sitemapUrl = new URL("/sitemap.xml", baseURL).toString();
    const sitemapRes = await request.get(sitemapUrl);
    expect(sitemapRes.ok(), "sitemap.xml must be reachable").toBeTruthy();
    const sitemapXml = await sitemapRes.text();

    for (const fullUrl of urls) {
      const resp = await page.goto(fullUrl, { waitUntil: "domcontentloaded" });
      expect(resp && resp.ok(), `Page must load: ${fullUrl}`).toBeTruthy();

      const currentUrl = new URL(page.url());
      const path = currentUrl.pathname;

      // URL Structure → No Query Params
      expect(currentUrl.search, "No query parameters allowed").toBe("");
      expect(currentUrl.hash, "No hash routing allowed").toBe("");

      // URL Structure → URL Pattern
      expect(path, "URL must match /calculators/{category}/{slug}/").toMatch(
        /^\/calculators\/[a-z0-9-]+\/[a-z0-9-]+\/?$/
      );

      // URL Structure → URL Format
      expect(path, "URL path must be lowercase").toBe(path.toLowerCase());
      expect(path, "No underscores/spaces in URL").not.toMatch(/[_\s]/);

      // Titles & Meta → Title Tag
      const title = await page.title();
      expect(title, "Title must exist").toBeTruthy();
      expect(title.length, "Title too short").toBeGreaterThan(8);

      // Titles & Meta → Meta Description
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc, "Meta description must exist").toBeTruthy();
      const d = desc.trim();
      expect(d.length, "Meta description too short").toBeGreaterThanOrEqual(120);
      expect(d.length, "Meta description too long").toBeLessThanOrEqual(180);

      // Titles & Meta → Single H1
      const h1 = page.locator("h1");
      await expect(h1, "Exactly one H1 required").toHaveCount(1);
      await expect(h1, "H1 must not be empty").not.toHaveText("");

      // Indexing & Canonical → Canonical Present
      const canonicalEl = page.locator('link[rel="canonical"]');
      await expect(canonicalEl, "Exactly one canonical required").toHaveCount(1);
      const canonicalHref = await canonicalEl.getAttribute("href");
      expect(canonicalHref, "Canonical href must exist").toBeTruthy();

      // Indexing & Canonical → Canonical Accuracy (compare path only)
      const canonicalPath = new URL(canonicalHref).pathname;
      expect(canonicalPath, "Canonical path must match page path").toBe(path);

      // Structured Data → JSON-LD Present + Required Fields
      const ldTexts = await page.$$eval('script[type="application/ld+json"]', (els) =>
        els.map((e) => e.textContent || "")
      );
      const candidates = extractJsonLdCandidates(ldTexts);
      expect(candidates.length, "At least one valid JSON-LD block required").toBeGreaterThan(0);
      expect(
        candidates.some(hasRequiredJsonLdFields),
        "JSON-LD must include @type,name,description,url (directly or under @graph)"
      ).toBeTruthy();

      // Sitemap → Sitemap Inclusion
      expect(
        sitemapXml.includes(path),
        `sitemap.xml must include ${path}`
      ).toBeTruthy();

      // Sitemap → Sitemap Updated (best-effort: lastmod exists near URL entry)
      // If your sitemap uses <url><loc>...</loc><lastmod>...</lastmod></url>
      const locIndex = sitemapXml.indexOf(path);
      if (locIndex !== -1) {
        const windowStart = Math.max(0, locIndex - 300);
        const windowEnd = Math.min(sitemapXml.length, locIndex + 600);
        const snippet = sitemapXml.slice(windowStart, windowEnd);
        expect(snippet.includes("<lastmod>"), `sitemap entry should include <lastmod> for ${path}`).toBeTruthy();
      }

      // Content Structure → Heading Hierarchy (no jumps)
      const headingLevels = await page.$$eval("h1,h2,h3,h4,h5,h6", (els) =>
        els.map((e) => parseInt(e.tagName.replace("H", ""), 10))
      );
      const hh = validateHeadingHierarchy(headingLevels);
      expect(hh.ok, `Heading level jump detected (H${hh.prev} -> H${hh.cur})`).toBeTruthy();

      // Indexing & Canonical → HTTPS Enforcement (environment aware)
      // In local dev you might be http://localhost; in prod enforce https.
      const enforceHttps = process.env.ENFORCE_HTTPS === "1";
      if (enforceHttps) {
        expect(currentUrl.protocol, "Production must be HTTPS").toBe("https:");
      }

      // Mixed-content (only meaningful if page itself is https)
      // This checks outgoing requests for http: resources when enforceHttps is enabled.
      // Note: this is a light check; CSP/console checks are separate.
      if (enforceHttps) {
        const bad = [];
        page.on("request", (req) => {
          const u = req.url();
          if (u.startsWith("http://")) bad.push(u);
        });
        // small wait to let subresources load
        await page.waitForTimeout(300);
        expect(bad.length, `Mixed content detected: ${bad.join(", ")}`).toBe(0);
      }
    }
  });
});

}
