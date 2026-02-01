# Issue Tracker

This file documents known issues, investigations, and resolutions to help with future troubleshooting.

---

## Issue #001: URL Changes Auto-Reverting in navigation.json and sitemap.xml

**Date:** 2026-01-30
**Category:** Build System / URL Management
**Status:** RESOLVED
**Severity:** Medium (Blocks URL changes)

### Problem Description

When attempting to change calculator URLs by editing `navigation.json` and `sitemap.xml`, the changes were automatically reverted back to the old URLs after running `node scripts/generate-mpa-pages.js`.

**Symptoms:**
- Manual edits to `navigation.json` → Reverted
- Manual edits to `sitemap.xml` → Reverted
- Changes appeared to "stick" initially but were lost after page regeneration

**Example:**
- Wanted: `/loans/how-much-can-i-borrow`
- Got: `/loans/how-much-can-borrow` (kept reverting)

### Root Cause Analysis

The `generate-mpa-pages.js` script **auto-generates URLs from physical folder paths** and overwrites both configuration files:

**Key script behavior (lines 560-578, 657):**
```javascript
// 1. Scans all calculator folders
const calculatorDirs = findCalculatorDirs(CALC_DIR);

// 2. For each calculator in navigation.json...
navigation.categories.forEach((category) => {
  category.subcategories.forEach((subcategory) => {
    subcategory.calculators.forEach((calculator) => {

      // 3. Finds actual folder path by calculator.id
      const relPath = calculatorDirs.get(calculator.id);

      // 4. AUTO-GENERATES URL from folder path (overwrites existing URL!)
      calculator.url = `/${relPath}`;
    });
  });
});

// 5. OVERWRITES navigation.json with auto-generated URLs
writeFile(NAV_PATH, JSON.stringify(navigation, null, 2) + '\n');

// 6. Generates sitemap.xml from navigation.json
writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemapXml(navigation.categories));
```

**Root Cause:** The **physical folder structure is the source of truth** for URLs in this codebase. The script:
1. Uses folder basename as the calculator `id`
2. Generates URLs from folder paths
3. Overwrites `navigation.json` and `sitemap.xml` on every run

### Solution

To change a calculator URL, you must change the **folder structure** (the source of truth):

**Step 1: Rename the folder**
```bash
mv /public/calculators/[category]/old-url-name \
   /public/calculators/[category]/new-url-name
```

**Step 2: Update calculator ID in navigation.json**
```json
{
  "id": "new-url-name",  // Must match new folder name
  "name": "Display Name",
  "url": "/will/be/auto-generated"  // This will be overwritten
}
```

**Step 3: Regenerate pages**
```bash
node scripts/generate-mpa-pages.js
```

The script will then:
- Find the renamed folder
- Auto-generate the new URL
- Update `navigation.json` with the new URL
- Generate `sitemap.xml` with the new URL

### Example: how-much-can-borrow → how-much-can-i-borrow

**Applied fix:**
```bash
# 1. Renamed folder
mv /public/calculators/loans/how-much-can-borrow \
   /public/calculators/loans/how-much-can-i-borrow

# 2. Updated navigation.json
{
  "id": "how-much-can-i-borrow",  // Changed from "how-much-can-borrow"
  "name": "How Much Can I Borrow",
  "url": "/loans/how-much-can-i-borrow"  // Will be auto-generated
}

# 3. Regenerated pages
node scripts/generate-mpa-pages.js
```

**Result:**
- ✅ Folder: `/public/calculators/loans/how-much-can-i-borrow/`
- ✅ Calculator ID: `"how-much-can-i-borrow"`
- ✅ navigation.json: `"url": "/loans/how-much-can-i-borrow"`
- ✅ sitemap.xml: `<loc>https://calchowmuch.com/loans/how-much-can-i-borrow/</loc>`

### Prevention & Best Practices

**DO:**
- ✅ Rename the folder to change URLs
- ✅ Update the `id` field in `navigation.json` to match the new folder name
- ✅ Run `generate-mpa-pages.js` to apply changes
- ✅ Remember: **Folder structure = source of truth**

**DON'T:**
- ❌ Manually edit URLs in `navigation.json` (will be overwritten)
- ❌ Manually edit `sitemap.xml` (will be overwritten)
- ❌ Edit `navigation.json` URLs without renaming folders

### Why This System Exists

This auto-generation architecture prevents **URL drift** where:
- Manual JSON edits could create broken links
- Folder structure and URLs could become mismatched
- Sitemap could reference non-existent paths

By making the folder structure the source of truth, the codebase ensures:
- URLs always match actual file locations
- Navigation always points to existing calculators
- Sitemap stays synchronized with real content

### Related Files

- `/scripts/generate-mpa-pages.js` - Main generation script (lines 560-578, 657)
- `/public/config/navigation.json` - Calculator configuration (auto-generated URLs)
- `/public/sitemap.xml` - XML sitemap (auto-generated from navigation.json)
- `/public/calculators/[category]/[calculator-id]/` - Physical folder structure

### Search Keywords

URL change, navigation.json reverts, sitemap.xml overwrites, generate-mpa-pages, folder rename, calculator URL, auto-generation, source of truth

---
