# Loan EMI Calculator — Rulebook

Calculator ID: LOAN-EMI

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-EMI-001 | Loan EMI Calculator | • EMI-IN-1<br>• EMI-IN-2<br>• EMI-IN-3<br>• EMI-OP-1<br>• EMI-OP-2<br>• EMI-OP-3<br>• EMI-OUT-1<br>• EMI-OUT-2<br>• EMI-OUT-3<br>• EMI-OUT-4<br>• EMI-TBL-M-1<br>• EMI-TBL-Y-1<br>• EMI-GRAPH-1<br>• EMI-GRAPH-2<br>• EMI-GRAPH-3<br>• EMI-EXP-1<br>• EMI-EXP-2 | • EMI-TEST-U-1<br>• EMI-TEST-U-2<br>• EMI-TEST-E2E-1 | 2026-01-19 |

---

## EMI-IN — Inputs

**EMI-IN-1**  
Loan amount must be numeric and > 0.

**EMI-IN-2**  
Interest rate must be ≥ 0.

**EMI-IN-3**  
Loan tenure must be ≥ 1 year.

---

## EMI-OP — Overpayment

**EMI-OP-1**  
Extra monthly or yearly overpayment must be supported.

**EMI-OP-2**  
Overpayment must not create negative balance.

**EMI-OP-3**  
Early payoff must auto-adjust final payment.

---

## EMI-OUT — Outputs

**EMI-OUT-1**  
Display monthly EMI.

**EMI-OUT-2**  
Display yearly payment summary.

**EMI-OUT-3**  
Display total payment and interest.

**EMI-OUT-4**  
Show baseline vs overpayment comparison.

---

## EMI-TBL — Tables

**EMI-TBL-M-1**  
Monthly amortization table required.

**EMI-TBL-Y-1**  
Yearly amortization table required.

---

## EMI-GRAPH — Graphs

**EMI-GRAPH-1**  
Graph must exist in explanation pane.

**EMI-GRAPH-2**  
Graph must switch between monthly/yearly views.

**EMI-GRAPH-3**  
Graph must not increase page height.

---

## EMI-EXP — Explanation

**EMI-EXP-1**  
Explanation must use real computed values.

**EMI-EXP-2**  
Monthly and yearly summaries must match active toggle.

---

## EMI-UI — Layout Compliance

**EMI-UI-1**  
Explanation pane must scroll internally.

**EMI-UI-2**  
Universal UI tokens must be used.

---

Completion requires all EMI-* rules to pass.
