# Loan EMI Calculator — Test Scenarios

---

## TEST-EMI-1 — EMI Accuracy

**Input**
- Loan: 100,000
- Rate: 10%
- Tenure: 10 years

**Expected**
- EMI matches standard EMI formula

**Rules**
- EMI-OUT-1

---

## TEST-EMI-2 — Overpayment Effect

**Action**
- Enable extra monthly payment

**Expected**
- Loan duration reduces
- Interest saved displayed

**Rules**
- EMI-OP-1
- EMI-OUT-4

---

## TEST-EMI-3 — Toggle Behavior

**Action**
- Switch monthly ↔ yearly toggle

**Expected**
- Table updates
- Graph updates
- Explanation updates

**Rules**
- EMI-GRAPH-2
- EMI-EXP-2

---

## TEST-EMI-4 — Layout Stability

**Action**
- Scroll explanation pane

**Expected**
- Page height unchanged
- Internal scroll only

**Rules**
- EMI-UI-1

---

## Failure Reporting

Violation:
- Rule ID:
- Severity:
- Description:
- Screenshot / DOM selector
