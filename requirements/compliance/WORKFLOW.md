# Compliance Workflow Master Document

## Overview

This document defines the end-to-end traceability workflow from requirements to production compliance.

## Workflow Chain

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  REQUIREMENTS       │────▶│  BUILD              │────▶│  TESTING            │
│  TRACKER            │     │  TRACKER            │     │  TRACKER            │
│  (REQ-XXX)          │     │  (BUILD-XXX)        │     │  (TEST-XXX)         │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                                                  │
                                                                  ▼
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  COMPLIANCE         │◀────│  UNIVERSAL REQ      │◀────│  SEO TESTS          │
│  REPORT             │     │  VALIDATION         │     │  TRACKER            │
│  (Final Matrix)     │     │  (Rule IDs)         │     │  (SEO-XXX)          │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

## Workflow Steps

### Step 1: Requirements Tracker (Copilot Creates)
- **Document**: [requirements-tracker.md](requirements-tracker.md)
- **ID Format**: `REQ-XXX`
- **Owner**: Copilot
- **Action**: Define requirements with associated Rule IDs from calculator MD files

### Step 2: Build Tracker (Codex Implements)
- **Document**: [build-tracker.md](build-tracker.md)
- **ID Format**: `BUILD-XXX`
- **Owner**: Codex
- **Action**: Implement requirements, update build status

### Step 3: Testing Tracker (Codex Executes)
- **Document**: [testing-tracker.md](testing-tracker.md)
- **ID Format**: `TEST-XXX`
- **Owner**: Codex
- **Action**: Execute tests, record results

### Step 4: SEO Tests Tracker (Codex Validates)
- **Document**: [seo-tracker.md](seo-tracker.md)
- **ID Format**: `SEO-XXX`
- **Owner**: Codex
- **Action**: Validate SEO compliance for each build

### Step 5: Universal Requirements Validation
- **Document**: [../universal/UNIVERSAL_REQUIREMENTS.md](../universal/UNIVERSAL_REQUIREMENTS.md)
- **Owner**: Codex + Copilot Review
- **Action**: Verify all Rule IDs (UI-x.x, FS-x.x, etc.) are followed

### Step 6: Final Compliance Report
- **Document**: [compliance-report.md](compliance-report.md)
- **Owner**: System (Auto-generated from all trackers)
- **Action**: Generate final compliance matrix

---

## ID Naming Conventions

| Tracker | Prefix | Format | Example |
|---------|--------|--------|---------|
| Requirements | REQ | REQ-CATEGORY-NNN | REQ-LOAN-001, REQ-MATH-001 |
| Build | BUILD | BUILD-NNN | BUILD-001 |
| Testing | TEST | TEST-CATEGORY-NNN | TEST-LOAN-001 |
| SEO | SEO | SEO-NNN | SEO-001 |
| Issues | ISS | ISS-NNN | ISS-001 |
| Rule IDs | Various | PREFIX-SECTION-N | AUTO-CAR-1, BTL-IN-1 |

## Category Codes

| Category | Code | Calculator Rule File |
|----------|------|---------------------|
| Auto Loans | AUTO | AUTO_LOAN_RULES.md |
| Buy-to-Let | BTL | BUY_TO_LET_RULES.md |
| Credit Cards | CC | CREDIT_CARD_RULES.md |
| Mortgage | MTG | HOME_LOAN.MD |
| Borrow Calculator | BOR | HOW_MUCH_CAN_I_BORROW_RULES.md |
| Loan EMI | EMI | LOAN_EMI.md |
| Interest Rate | IR | INTEREST_RATE_CHANGE_RULES.md |
| LTV Calculator | LTV | LTV_CALCULATOR_RULES.md |
| Offset Mortgage | OFFSET | OFFSET_MORTGAGE_RULES.md |
| Overpayment | OVERPAY | OVERPAYMENT_ADDITIONAL_PAYMENT_RULES.md |
| Remortgage | REMTG | REMORTGAGE_SWITCHING_RULES.md |
| Statistics | STAT | Statistics.md |
| Universal | UI/FS/CS/TS/SEO | UNIVERSAL_REQUIREMENTS.md |

---

## Document Cross-Reference Matrix

| Document | Contains | Links To |
|----------|----------|----------|
| Calculator MD Files | Rule IDs, Requirement IDs | Requirements Tracker |
| Requirements Tracker | REQ-XXX entries | Build Tracker, Rule IDs |
| Build Tracker | BUILD-XXX entries | Testing Tracker, REQ-XXX |
| Testing Tracker | TEST-XXX entries | SEO Tracker, BUILD-XXX |
| SEO Tracker | SEO-XXX entries | Compliance Report |
| Issue Tracker | ISS-XXX entries | All Trackers |
| Compliance Report | Final Matrix | All Trackers |

---

## Roles and Responsibilities

| Role | Creates | Updates | Reviews |
|------|---------|---------|---------|
| Copilot | Requirements, Rule IDs | Requirements Tracker | Compliance Report |
| Codex | Implementation | Build/Testing/SEO Trackers | - |
| System | Compliance Report | Auto-updates | - |
| Human | - | Issue Tracker | All Documents |

---

## Compliance Gates

| Gate | Requirements | Builds | Tests | SEO | Universal |
|------|-------------|--------|-------|-----|-----------|
| Alpha | 50% Complete | 50% Complete | 50% Pass | N/A | 100% |
| Beta | 80% Complete | 80% Complete | 80% Pass | 80% | 100% |
| Production | 100% Complete | 100% Complete | 100% Pass | 100% | 100% |
