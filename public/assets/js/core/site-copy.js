/**
 * SITE_COPY — calchowmuch.com
 * Source of truth: requirements/universal/SITE_COPY.md
 *
 * Authority: This module exposes all user-facing global copy.
 * Rule: Use verbatim. No rewording. No punctuation changes.
 * Last Updated: 2026-01-23
 */

export const SITE_COPY = {
  /**
   * Primary site title appearing in header navigation
   * Must not include domain name
   */
  SITE_TITLE: "Calculate How Much",

  /**
   * Global tagline (DESIGN-001)
   * Must appear directly below the site title within the shared header shell on every page
   */
  SITE_TAGLINE: "Clear answers, without the guesswork",

  /**
   * Category taglines (DESIGN-HEADER-001)
   * Use verbatim when rendering category-specific taglines in the global header
   * Category tagline must only appear when the corresponding category context is active
   * No rotation, personalization, or A/B testing is permitted
   */
  CATEGORY_TAGLINES: {
    "Math": "Clear answers, without the guesswork",
    "Home Loans": "Money, made clear",
    "Credit Cards": "Understand the cost before you swipe",
    "Auto Loans": "Know what you'll really pay",
    "CFA / Advanced Finance": "Clarity for serious financial decisions"
  }
};

/**
 * Get the tagline for a specific category
 * @param {string} categoryName - The name of the category
 * @returns {string|null} The tagline for the category, or null if not found
 */
export function getCategoryTagline(categoryName) {
  return SITE_COPY.CATEGORY_TAGLINES[categoryName] || null;
}

/**
 * Get all available category names
 * @returns {string[]} Array of category names
 */
export function getCategoryNames() {
  return Object.keys(SITE_COPY.CATEGORY_TAGLINES);
}
