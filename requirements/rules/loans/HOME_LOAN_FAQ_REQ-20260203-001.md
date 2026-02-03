# Home Loan Calculator FAQ Section Requirements

**REQ ID:** REQ-20260203-001  
**Status:** NEW  
**Priority:** HIGH  
**Type:** Content + UI/Flow  
**SEO Impact:** YES  
**Date Created:** 2026-02-03  

---

## Overview

Add a Frequently Asked Questions (FAQ) section to the Home Loan Calculator explanation pane. The FAQ section must appear below the amortization table and follow the same styling pattern as the Buy-to-Let calculator FAQ section.

---

## Acceptance Criteria

### AC-1: Placement
- FAQ section must be placed at the bottom of the explanation pane
- Must appear after the amortization table (both monthly and yearly views)
- Must be contained within the explanation pane's scrollable area

### AC-2: Structure
- FAQ section must use `<h3>Frequently Asked Questions</h3>` heading
- Must be wrapped in `<div class="result-section">` container
- Each FAQ must be within a `<div class="faq-item">` element
- Each FAQ item must contain:
  - `<h4>` for the question
  - `<p>` for the answer (can be multiple paragraphs if needed)

### AC-3: Styling (Calculator-Specific CSS)
Create or update `/public/calculators/loans/home-loan/calculator.css` to include:

```css
#loan-mtg-explanation .faq-item {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--panel-bg);
}

#loan-mtg-explanation .faq-item h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

#loan-mtg-explanation .faq-item p {
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
}
```

### AC-4: Content Requirements
Must include exactly 10 FAQs with the following content:

#### FAQ 1: What is a home loan?
**Question:** What is a home loan?  
**Answer:** A home loan (also called a mortgage) is a secured loan from a bank or lender used to buy, build, or refinance a property. The property serves as collateral until the loan is fully repaid.

#### FAQ 2: How much can I borrow for a home loan?
**Question:** How much can I borrow for a home loan?  
**Answer:** Most lenders typically allow borrowing between 4x to 5.5x of your annual income. The exact amount depends on your income, credit profile, monthly expenses, existing debts, and job stability.

#### FAQ 3: What is Loan-to-Value (LTV)?
**Question:** What is Loan-to-Value (LTV)?  
**Answer:** LTV is the percentage of the property price financed by a loan. For example, if a property is worth £250,000 and the loan is £200,000, the LTV is 80%. Lower LTV usually helps you qualify for better interest rates.

#### FAQ 4: How do interest rates affect my monthly payment?
**Question:** How do interest rates affect my monthly payment?  
**Answer:** Higher interest rates increase both your monthly payment and total interest paid over time. Even a small rate change (e.g., 0.5%) can significantly impact total repayment.

#### FAQ 5: What is a typical home loan term?
**Question:** What is a typical home loan term?  
**Answer:** Most home loans run for 20 to 35 years, with 25 years being the most common choice, depending on affordability and borrower preference.

#### FAQ 6: What is the difference between fixed and variable rates?
**Question:** What is the difference between fixed and variable rates?  
**Answer:** Fixed-rate loan: Your interest rate remains the same for a set period. Variable-rate loan: Your rate can change based on market conditions or lender policy.

#### FAQ 7: How much deposit do I need to buy a house?
**Question:** How much deposit do I need to buy a house?  
**Answer:** Most buyers need a deposit between 5% and 20% of the property value. A higher deposit generally helps secure lower interest rates.

#### FAQ 8: What additional costs come with a home loan?
**Question:** What additional costs come with a home loan?  
**Answer:** Common extra costs include property valuation fees, legal/conveyancing fees, loan processing fees, property taxes, and home insurance.

#### FAQ 9: Can I repay my home loan early?
**Question:** Can I repay my home loan early?  
**Answer:** Yes, but some lenders charge an early repayment fee, especially during fixed-rate periods. Always check your loan terms before making extra payments.

#### FAQ 10: What happens if I miss payments?
**Question:** What happens if I miss payments?  
**Answer:** Missing payments can harm your credit score, lead to penalties, and in severe cases may result in repossession of the property.

---

## Implementation Reference

### Buy-to-Let Pattern
See `/public/calculators/loans/buy-to-let/explanation.html` lines 139-302 for reference implementation.

### Time & Date Pattern
See `/public/calculators/time-and-date/sleep-time-calculator/calculator.css` lines 62-69 for CSS reference.

---

## Files to Modify

1. `/public/calculators/loans/home-loan/explanation.html` - Add FAQ section
2. `/public/calculators/loans/home-loan/calculator.css` - Add FAQ item styles (if not already present)

---

## Compliance References

- **explanation_pane_standard.md** - Explanation pane structure and formatting rules (`requirements/universal-rules/explanation_pane_standard.md`)
- **UNIVERSAL_REQUIREMENTS.md** - UI-2.* (Typography), UI-3.* (Layout), UI-4.* (Accessibility)
- **HOME_LOAN.MD** - MTG-FAQ-1 through MTG-FAQ-7

---

## Testing Requirements

### Manual Testing
- ✓ FAQ section appears below amortization table
- ✓ FAQ items have correct border, padding, and spacing
- ✓ Text is readable and properly formatted
- ✓ Section scrolls within explanation pane without causing page growth
- ✓ All 10 FAQs are present with correct content

### E2E Test Coverage
Create test in `tests/e2e/calculators/home-loan.spec.js`:
- Verify FAQ section exists
- Count FAQ items (should be 10)
- Check FAQ item styling (border, padding, background)
- Verify no horizontal scroll or layout shift

---

## SEO Impact

- Adds structured FAQ content for rich snippets
- Targets long-tail keyword queries
- Improves dwell time and reduces bounce rate
- Supports voice search optimization
- See `/requirements/seo/REQ-20260203-001.md` for full SEO specification

---

## Definition of Done

- [ ] FAQ section added to explanation.html
- [ ] CSS styles added to calculator.css
- [ ] All 10 FAQs present with exact content
- [ ] Visual review confirms match with Buy-to-Let pattern
- [ ] E2E test passes
- [ ] No layout regressions (page does not grow vertically)
- [ ] SEO schema markup ready for future implementation
- [ ] Compliance report updated

---

**Notes:**
- This requirement is part of the ongoing content enhancement for the Home Loan calculator
- FAQ content is SEO-optimized and user-focused
- Implementation must follow existing patterns (Buy-to-Let, Time & Date calculators)
