# Math Simple Calculators — Requirements with Rule IDs

Calculator Category: MATH-SIMPLE  
Purpose: Basic mathematical calculation tools including percentage operations and fraction arithmetic.

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-20260119-002 | Percentage Calculator | • PERC-UI-1<br>• PERC-UI-2<br>• PERC-UI-3<br>• PERC-UI-4<br>• PERC-UI-5<br>• PERC-CALC-1<br>• PERC-CALC-2<br>• PERC-CALC-3<br>• PERC-CALC-4<br>• PERC-CALC-5<br>• PERC-VAL-1<br>• PERC-VAL-2<br>• PERC-VAL-3<br>• PERC-OUT-1<br>• PERC-OUT-2<br>• PERC-OUT-3 | • PERC-TEST-E2E-LOAD<br>• PERC-TEST-E2E-NAV<br>• PERC-TEST-E2E-WORKFLOW<br>• PERC-TEST-E2E-MOBILE<br>• PERC-TEST-E2E-A11Y<br>• PERC-TEST-U-1<br>• PERC-TEST-U-2 | 2026-01-19 |
| REQ-20260119-003 | Fraction Calculator | • FRAC-UI-1<br>• FRAC-UI-2<br>• FRAC-UI-3<br>• FRAC-UI-4<br>• FRAC-UI-5<br>• FRAC-UI-6<br>• FRAC-CALC-1<br>• FRAC-CALC-2<br>• FRAC-CALC-3<br>• FRAC-CALC-4<br>• FRAC-CALC-5<br>• FRAC-CALC-6<br>• FRAC-VAL-1<br>• FRAC-VAL-2<br>• FRAC-VAL-3<br>• FRAC-VAL-4<br>• FRAC-OUT-1<br>• FRAC-OUT-2<br>• FRAC-OUT-3<br>• FRAC-OUT-4 | • FRAC-TEST-E2E-LOAD<br>• FRAC-TEST-E2E-NAV<br>• FRAC-TEST-E2E-WORKFLOW<br>• FRAC-TEST-E2E-MOBILE<br>• FRAC-TEST-E2E-A11Y<br>• FRAC-TEST-U-1<br>• FRAC-TEST-U-2<br>• FRAC-TEST-U-3 | 2026-01-19 |

---

## PERCENTAGE CALCULATOR RULES (REQ-20260119-002)

### PERC-UI — User Interface Rules

**PERC-UI-1**  
Must provide 5 calculation mode buttons in horizontal button group:
- "Percent Change" (default active)
- "Percent Of"
- "Increase By" 
- "Decrease By"
- "What Percent"

**PERC-UI-2**  
Each mode must show appropriate input fields with clear labels:
- Percent Change: "Start Value" and "End Value"
- Percent Of: "Percentage" and "Of Value"
- Increase By: "Original Value" and "Increase %"
- Decrease By: "Original Value" and "Decrease %"
- What Percent: "Part Value" and "Total Value"

**PERC-UI-3**  
All input fields must have:
- `maxlength="15"` attribute for reasonable input limits
- Proper accessibility labels
- Number validation (allow decimal points)

**PERC-UI-4**  
Must have prominent "Calculate" button that triggers calculation.

**PERC-UI-5**  
Results must display in clearly formatted result area with appropriate currency/percentage formatting.

### PERC-CALC — Calculation Logic Rules

**PERC-CALC-1**  
Percent Change calculation must be accurate:
- Formula: ((End Value - Start Value) / Start Value) × 100
- Handle negative changes correctly
- Prevent division by zero (Start Value = 0)

**PERC-CALC-2**  
Percent Of calculation must be accurate:
- Formula: (Percentage / 100) × Of Value
- Handle percentage values correctly (e.g., 25% = 25, not 0.25)

**PERC-CALC-3**  
Increase By calculation must be accurate:
- Formula: Original Value × (1 + Increase% / 100)
- Show both the increase amount and new total

**PERC-CALC-4**  
Decrease By calculation must be accurate:
- Formula: Original Value × (1 - Decrease% / 100)
- Show both the decrease amount and new total

**PERC-CALC-5**  
What Percent calculation must be accurate:
- Formula: (Part Value / Total Value) × 100
- Prevent division by zero (Total Value = 0)

### PERC-VAL — Input Validation Rules

**PERC-VAL-1**  
Must validate all numeric inputs:
- Reject non-numeric entries (except decimal points)
- Handle negative numbers appropriately
- Show clear error messages for invalid inputs

**PERC-VAL-2**  
Must prevent division by zero scenarios:
- Start Value = 0 in Percent Change mode
- Total Value = 0 in What Percent mode
- Show user-friendly error messages

**PERC-VAL-3**  
Must handle edge cases:
- Very large numbers (up to 15 digits)
- Very small decimal numbers
- Negative percentages

### PERC-OUT — Output Display Rules

**PERC-OUT-1**  
Results must display with appropriate formatting:
- Percentage results: show % symbol, 2 decimal places
- Currency results: show appropriate currency formatting
- Large numbers: use comma separators

**PERC-OUT-2**  
Must show calculation details/explanation:
- Display the actual formula used
- Show step-by-step breakdown when helpful
- Provide context for the result

**PERC-OUT-3**  
Must handle result display for all modes correctly:
- Show both percentage and absolute values where applicable
- Indicate positive/negative changes clearly
- Format very large or very small results appropriately

---

## FRACTION CALCULATOR RULES (REQ-20260119-003)

### FRAC-UI — User Interface Rules

**FRAC-UI-1**  
Must provide 5 calculation mode buttons in horizontal button group:
- "Add" (default active)
- "Subtract"
- "Multiply"
- "Divide"
- "Simplify"

**FRAC-UI-2**  
For Add/Subtract/Multiply/Divide modes, must show two fraction input sections:
- First fraction: Numerator and Denominator inputs
- Second fraction: Numerator and Denominator inputs
- Proper visual fraction bar representation

**FRAC-UI-3**  
For Simplify mode, must show single fraction input:
- Single numerator and denominator inputs
- Clear "Simplify" action button

**FRAC-UI-4**  
All input fields must have:
- `maxlength="10"` attribute
- Integer-only validation
- Clear labels ("Numerator", "Denominator")

**FRAC-UI-5**  
Must include mixed number conversion toggle:
- Option to show results as mixed numbers (e.g., 1 2/3)
- Option to show results as improper fractions (e.g., 5/3)

**FRAC-UI-6**  
Results must display in proper fraction format with visual fraction bars.

### FRAC-CALC — Calculation Logic Rules

**FRAC-CALC-1**  
Addition must be accurate:
- Formula: (a/b) + (c/d) = (ad + bc)/(bd)
- Must simplify result to lowest terms
- Handle mixed number conversions

**FRAC-CALC-2**  
Subtraction must be accurate:
- Formula: (a/b) - (c/d) = (ad - bc)/(bd)
- Must simplify result to lowest terms
- Handle negative results correctly

**FRAC-CALC-3**  
Multiplication must be accurate:
- Formula: (a/b) × (c/d) = (ac)/(bd)
- Must simplify result to lowest terms
- Handle whole number results (denominator = 1)

**FRAC-CALC-4**  
Division must be accurate:
- Formula: (a/b) ÷ (c/d) = (a/b) × (d/c) = (ad)/(bc)
- Must prevent division by zero (c = 0)
- Must simplify result to lowest terms

**FRAC-CALC-5**  
Simplification must use correct GCD algorithm:
- Find greatest common divisor of numerator and denominator
- Divide both by GCD to get simplified fraction
- Handle sign preservation correctly

**FRAC-CALC-6**  
Mixed number conversion must be accurate:
- Improper to mixed: whole = numerator ÷ denominator, remainder = numerator % denominator
- Mixed to improper: numerator = (whole × denominator) + remainder

### FRAC-VAL — Input Validation Rules

**FRAC-VAL-1**  
Must validate all numerator and denominator inputs:
- Accept only integers (positive and negative)
- Reject decimal numbers, letters, special characters
- Show clear error messages

**FRAC-VAL-2**  
Must prevent zero denominators:
- Show error if user enters 0 as denominator
- Prevent calculation attempts with invalid fractions

**FRAC-VAL-3**  
Must handle negative fractions correctly:
- Allow negative numerators
- Standardize sign placement (negative in numerator)

**FRAC-VAL-4**  
Must validate for division by zero in division mode:
- Check if second fraction's numerator is 0
- Show appropriate error message

### FRAC-OUT — Output Display Rules

**FRAC-OUT-1**  
Results must display with proper fraction formatting:
- Visual fraction bars (horizontal lines)
- Clear numerator/denominator alignment
- Appropriate font sizing

**FRAC-OUT-2**  
Must show both simplified and unsimplified results when relevant:
- Original calculation result
- Simplified result (if different)
- Clear indication which is which

**FRAC-OUT-3**  
Must handle mixed number display:
- Show whole number separately from fraction part
- Use proper spacing and formatting (e.g., "2 1/4")
- Allow toggling between mixed and improper formats

**FRAC-OUT-4**  
Must handle special result cases:
- Whole numbers (show as "X/1" or just "X" based on mode)
- Zero results (show as "0/1" or "0")
- Negative results with clear sign placement

---

## Testing Requirements

### PERC-TEST — Percentage Calculator Tests

**PERC-TEST-U-1**  
Unit test all calculation modes with known values:
- Percent Change: 100 to 150 = 50% increase
- Percent Of: 25% of 200 = 50
- Increase By: 100 increased by 20% = 120
- Decrease By: 100 decreased by 20% = 80
- What Percent: 25 of 100 = 25%

**PERC-TEST-U-2**  
Unit test edge cases:
- Division by zero scenarios (Start Value = 0, Total Value = 0)
- Negative percentages and values
- Very large numbers (up to 15 digits)
- Very small decimal numbers
- Boundary conditions (0%, 100%, -100%)

**PERC-TEST-E2E-1**  
E2E test complete user workflows:
- Select each mode and verify correct input fields appear/disappear
- Enter values in each mode and verify calculations display correctly
- Test input validation and verify appropriate error messages
- Test accessibility features (keyboard navigation, screen readers)
- Verify mobile responsiveness

### FRAC-TEST — Fraction Calculator Tests

**FRAC-TEST-U-1**  
Unit test all fraction operations with known values:
- Addition: 1/2 + 1/3 = 5/6
- Subtraction: 3/4 - 1/2 = 1/4  
- Multiplication: 2/3 × 3/4 = 1/2
- Division: 1/2 ÷ 1/4 = 2/1 (or 2)
- Simplify: 6/9 = 2/3, 15/25 = 3/5

**FRAC-TEST-U-2**  
Unit test mixed number conversions:
- Improper to mixed: 7/3 = 2 1/3, 11/4 = 2 3/4
- Mixed to improper: 2 1/4 = 9/4, 1 2/3 = 5/3
- GCD algorithm accuracy for various number pairs

**FRAC-TEST-U-3**  
Unit test edge cases and error handling:
- Zero denominators (must show error)
- Division by zero fractions (0/x ÷ y/z scenarios)
- Negative fractions (-1/2, 1/-2 standardization)
- Whole number results (6/3 = 2/1)
- Large numerators/denominators (within 10-digit limit)

---

## Mandatory Default Playwright E2E Tests

### PERC-TEST-E2E — Percentage Calculator Playwright Tests

**PERC-TEST-E2E-LOAD**  
Playwright test - Calculator page loads correctly:
- Navigate to `/calculators/math/percentage-increase`
- Verify page loads without console errors
- Verify all UI elements render (button group, inputs, result area)
- Verify no JavaScript exceptions thrown

**PERC-TEST-E2E-NAV**  
Playwright test - Navigation and deep-linking:
- Verify Math -> Simple -> Percentage Calculator navigation path works
- Verify direct URL `/calculators/math/percentage-increase` loads correctly
- Verify calculator is highlighted in navigation when active
- Verify browser back/forward navigation works

**PERC-TEST-E2E-WORKFLOW**  
Playwright test - Complete user workflow end-to-end:
- Select each of 5 calculation modes
- Enter valid inputs for each mode
- Click Calculate and verify results display
- Verify results are formatted correctly with % symbols
- Test clearing and re-calculating

**PERC-TEST-E2E-MOBILE**  
Playwright test - Mobile responsiveness:
- Test at viewport 375x667 (iPhone SE)
- Test at viewport 768x1024 (iPad)
- Verify button group wraps or stacks appropriately
- Verify inputs are usable on touch devices
- Verify no horizontal scroll appears

**PERC-TEST-E2E-A11Y**  
Playwright test - Accessibility compliance:
- Verify all inputs have associated labels
- Verify keyboard navigation works (Tab through all elements)
- Verify focus indicators are visible
- Verify ARIA live regions announce results
- Run axe-core accessibility scan

### FRAC-TEST-E2E — Fraction Calculator Playwright Tests

**FRAC-TEST-E2E-LOAD**  
Playwright test - Calculator page loads correctly:
- Navigate to `/calculators/math/fraction-calculator`
- Verify page loads without console errors
- Verify all UI elements render (button group, fraction inputs, result area)
- Verify no JavaScript exceptions thrown

**FRAC-TEST-E2E-NAV**  
Playwright test - Navigation and deep-linking:
- Verify Math -> Simple -> Fraction Calculator navigation path works
- Verify direct URL `/calculators/math/fraction-calculator` loads correctly
- Verify calculator is highlighted in navigation when active
- Verify browser back/forward navigation works

**FRAC-TEST-E2E-WORKFLOW**  
Playwright test - Complete user workflow end-to-end:
- Select each of 5 operation modes (Add, Subtract, Multiply, Divide, Simplify)
- Enter valid fraction inputs for each mode
- Click Calculate and verify results display
- Verify results show simplified fractions
- Test mixed number toggle functionality

**FRAC-TEST-E2E-MOBILE**  
Playwright test - Mobile responsiveness:
- Test at viewport 375x667 (iPhone SE)
- Test at viewport 768x1024 (iPad)
- Verify fraction inputs are usable on touch devices
- Verify button group wraps or stacks appropriately
- Verify no horizontal scroll appears

**FRAC-TEST-E2E-A11Y**  
Playwright test - Accessibility compliance:
- Verify all inputs have associated labels
- Verify keyboard navigation works (Tab through all elements)
- Verify focus indicators are visible
- Verify ARIA live regions announce results
- Run axe-core accessibility scan

---

## Integration Testing Requirements

**INT-TEST-1**  
Verify both calculators load correctly from Math -> Simple navigation.

**INT-TEST-2**  
Verify calculator switching preserves no state between percentage and fraction calculators.

**INT-TEST-3**  
Test calculator deep-linking URLs work correctly:
- `/calculators/math/percentage-increase`
- `/calculators/math/fraction-calculator`

---

## Completion Criteria

### Percentage Calculator (REQ-20260119-002)
- [ ] All 5 calculation modes functional and accurate
- [ ] Input validation prevents invalid entries and shows clear errors
- [ ] Results display with proper formatting and explanations
- [ ] All PERC-TEST requirements pass
- [ ] Accessibility compliance verified
- [ ] Mobile responsiveness confirmed

### Fraction Calculator (REQ-20260119-003)
- [ ] All 5 operation modes functional and accurate
- [ ] Fraction simplification works correctly using GCD algorithm
- [ ] Mixed number conversion toggle works in both directions
- [ ] All FRAC-TEST requirements pass
- [ ] Error handling prevents division by zero and invalid inputs
- [ ] Visual fraction display formatting correct
- [ ] Accessibility compliance verified
- [ ] Mobile responsiveness confirmed

### Universal Compliance
- [ ] Both calculators comply with UNIVERSAL_REQUIREMENTS.md
- [ ] Navigation integration complete
- [ ] Deep linking functional
- [ ] SEO requirements satisfied

All PERC-* and FRAC-* rules must pass + Universal compliance.

### Implementation Checklist:
- [ ] Percentage Calculator: All 5 modes functional with correct calculations
- [ ] Percentage Calculator: Input validation and error handling working
- [ ] Percentage Calculator: Results display with proper formatting
- [ ] Fraction Calculator: All 5 modes functional with correct calculations  
- [ ] Fraction Calculator: Fraction simplification working correctly
- [ ] Fraction Calculator: Mixed number conversions working
- [ ] Both calculators: Proper input validation (maxlength, numeric only)
- [ ] Both calculators: Accessibility compliance (labels, ARIA attributes)
- [ ] Both calculators: Responsive design working on mobile devices
- [ ] Unit tests passing for all calculation modes
- [ ] E2E tests passing for user workflows