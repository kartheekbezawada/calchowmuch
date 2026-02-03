# Remortgage / Switching Calculator FAQ Section Requirements

**REQ ID:** REQ-20260203-002  
**Status:** NEW  
**Priority:** HIGH  
**Type:** Content + UI/Flow  
**SEO Impact:** YES  
**Date Created:** 2026-02-03  

---

## Overview

Add a Frequently Asked Questions (FAQ) section to the Remortgage / Switching Calculator explanation pane. The FAQ section must appear at the bottom of the explanation pane and follow the same styling pattern as the Home Loan calculator FAQ section, with each FAQ in a boxed container with proper indentation.

---

## Acceptance Criteria

### AC-1: Placement
- FAQ section must be placed at the bottom of the explanation pane
- Must appear after all other content (comparison tables, savings summary, etc.)
- Must be contained within the explanation pane's scrollable area

### AC-2: Structure
- FAQ section must use `<h3>Frequently Asked Questions</h3>` heading
- Must be wrapped in `<div class="result-section">` container
- Each FAQ must be within a `<div class="faq-item">` element
- Each FAQ item must contain:
  - `<h4>` for the question
  - `<p>` for the answer (can be multiple paragraphs if needed)
  - For nested lists, use proper indentation

### AC-3: Styling (Calculator-Specific CSS)
Create or update `/public/calculators/loans/remortgage-switching/calculator.css` to include:

```css
#remortgage-explanation .faq-item {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--panel-bg);
}

#remortgage-explanation .faq-item h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

#remortgage-explanation .faq-item p {
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
}

#remortgage-explanation .faq-item ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
  line-height: 1.5;
  font-size: 14px;
}

#remortgage-explanation .faq-item li {
  margin-bottom: 4px;
}
```

### AC-4: Content Requirements
Must include exactly 10 FAQs with the following content:

#### FAQ 1: What does remortgaging (switching) mean?
**Question:** What does remortgaging (switching) mean?  
**Answer:** Remortgaging means replacing your existing home loan with a new deal—either with your current lender or a different one—to reduce interest, lower payments, change your term, or release equity.

#### FAQ 2: How does my Current Balance affect switching benefits?
**Question:** How does my Current Balance affect switching benefits?  
**Answer:** Your Current Balance determines how much you need to refinance. Lower balances usually make switching cheaper, while higher balances increase potential interest savings from a better rate.

#### FAQ 3: Why is Current Rate (APR) important in remortgaging?
**Question:** Why is Current Rate (APR) important in remortgaging?  
**Answer:** Your Current Rate (APR) is the baseline for comparison. The larger the gap between your current rate and the New Rate (APR), the more likely switching will save you money.

#### FAQ 4: How does Remaining Term influence my savings?
**Question:** How does Remaining Term influence my savings?  
**Answer:** A longer Remaining Term means more future interest is still unpaid, which generally increases the financial benefit of switching to a lower rate.

#### FAQ 5: Why is my Current Monthly Payment needed?
**Question:** Why is my Current Monthly Payment needed?  
**Answer:** Your Current Monthly Payment helps quantify real savings by comparing what you pay now versus your projected payment after switching.

#### FAQ 6: How does choosing a New Rate (APR) impact affordability?
**Question:** How does choosing a New Rate (APR) impact affordability?  
**Answer:** A lower New Rate (APR) reduces monthly payments and total interest over time. Even small rate reductions can produce meaningful savings.

#### FAQ 7: Should I keep my term or choose a New Term?
**Question:** Should I keep my term or choose a New Term?  
**Answer:** Your choice depends on your priorities:

- **Keeping the same term:** maximizes interest savings.
- **Extending the term:** lowers monthly payments but increases total interest paid.
- **Shortening the term:** raises payments but reduces lifetime interest.

#### FAQ 8: Why do Additional Fees matter in the comparison?
**Question:** Why do Additional Fees matter in the comparison?  
**Answer:** Switching is only worthwhile if long-term savings outweigh New Deal Fees, Exit Fees/ERC, and Legal/Valuation costs. Your calculator accounts for this when fees are set to Include.

#### FAQ 9: What is the Comparison Horizon and why does it matter?
**Question:** What is the Comparison Horizon and why does it matter?  
**Answer:** The Comparison Horizon defines how long you evaluate savings (e.g., 2, 5, or 10 years). Short horizons may not justify switching if upfront fees are high.

#### FAQ 10: When does remortgaging typically make sense?
**Question:** When does remortgaging typically make sense?  
**Answer:** Switching usually makes sense when:

- Your New Rate is meaningfully lower than your current rate,
- Your Remaining Term is still long, and
- Your savings over the Comparison Horizon exceed total switching costs.

---

## Implementation Reference

### Home Loan Pattern
See `/public/calculators/loans/home-loan/explanation.html` lines 90-200 for reference implementation.

### Buy-to-Let Pattern
See `/public/calculators/loans/buy-to-let/explanation.html` lines 139-302 for reference implementation.

---

## Files to Modify

1. `/public/calculators/loans/remortgage-switching/explanation.html` - Add FAQ section
2. `/public/calculators/loans/remortgage-switching/calculator.css` - Add FAQ item styles (if not already present)

---

## Compliance References

- **explanation_pane_standard.md** - Explanation pane structure and formatting rules (`requirements/universal-rules/explanation_pane_standard.md`)
- **UNIVERSAL_REQUIREMENTS.md** - UI-2.* (Typography), UI-3.* (Layout), UI-4.* (Accessibility)
- **REMORTAGAGE_SWITCHING_RULES_V2.MD** - Remortgage calculator data contract and output rules

---

## Testing Requirements

### Manual Testing
- ✓ FAQ section appears at the bottom of explanation pane
- ✓ FAQ items have correct border, padding, and spacing
- ✓ Text is readable and properly formatted
- ✓ Lists are properly indented within FAQ items
- ✓ Section scrolls within explanation pane without causing page growth
- ✓ All 10 FAQs are present with correct content

### E2E Test Coverage
Create test in `tests/e2e/calculators/remortgage-switching.spec.js`:
- Verify FAQ section exists
- Count FAQ items (should be 10)
- Check FAQ item styling (border, padding, background)
- Verify no horizontal scroll or layout shift
- Verify list items are properly indented (FAQ 7 and FAQ 10)

---

## SEO Impact

- Adds structured FAQ content for rich snippets
- Targets long-tail keyword queries related to remortgaging and switching
- Improves content depth for remortgage-related searches
- Potential FAQPage schema markup opportunity

---

## Notes

- List indentation (FAQ 7 and FAQ 10) must use proper `<ul>` and `<li>` tags
- Maintain consistency with Home Loan FAQ styling
- Ensure FAQ items are visually distinct with borders and background
- Each FAQ must be self-contained within its box
