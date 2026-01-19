import { describe, it, expect } from 'vitest';
import {
  computeMonthlyPayment,
  computePrincipalFromPayment,
  buildAmortizationSchedule,
  calculateBuyToLet,
  calculateInterestRateChange,
  calculateLtv,
  calculateRemortgage,
  calculateOffset,
  calculateBorrow,
} from '../../public/assets/js/core/loan-utils.js';

describe('loan utility calculations', () => {
  it('computes monthly payment for zero interest', () => {
    const payment = computeMonthlyPayment(1200, 0, 12);
    expect(payment).toBeCloseTo(100, 6);
  });

  it('computes monthly payment for standard interest', () => {
    const payment = computeMonthlyPayment(100000, 6, 360);
    expect(payment).toBeCloseTo(599.55, 2);
  });

  it('computes principal from payment for zero interest', () => {
    const principal = computePrincipalFromPayment(100, 0, 12);
    expect(principal).toBeCloseTo(1200, 6);
  });

  it('computes principal from payment for standard interest', () => {
    const payment = computeMonthlyPayment(100000, 6, 360);
    const principal = computePrincipalFromPayment(payment, 6, 360);
    expect(principal).toBeCloseTo(100000, 0);
  });

  it('builds amortization schedule with zero interest', () => {
    const schedule = buildAmortizationSchedule({ principal: 1200, annualRate: 0, months: 12 });
    expect(schedule.months).toBe(12);
    expect(schedule.totalInterest).toBeCloseTo(0, 6);
    expect(schedule.totalPrincipal).toBeCloseTo(1200, 6);
    expect(schedule.schedule.at(-1)?.balance ?? 1).toBeCloseTo(0, 6);
  });

  it('calculates buy-to-let outputs for interest-only loan', () => {
    const result = calculateBuyToLet({
      propertyPrice: 200000,
      depositType: 'percent',
      depositAmount: 0,
      depositPercent: 25,
      annualRate: 5,
      termYears: 25,
      mortgageType: 'interest-only',
      monthlyRent: 1200,
      vacancyType: 'percent',
      vacancyPercent: 5,
      vacancyMonths: 0,
      agentFeePercent: 10,
      maintenanceMonthly: 100,
      otherCostsMonthly: 50,
    });

    expect(result.loanAmount).toBeCloseTo(150000, 2);
    expect(result.grossYield).toBeCloseTo(7.2, 2);
    expect(result.netMonthlyCashflow).toBeLessThan(result.effectiveRent);
    expect(result.projection.length).toBe(25);
  });

  it('calculates buy-to-let outputs for repayment loan with vacancy months', () => {
    const result = calculateBuyToLet({
      propertyPrice: 180000,
      depositType: 'amount',
      depositAmount: 30000,
      depositPercent: 0,
      annualRate: 4.5,
      termYears: 20,
      mortgageType: 'repayment',
      monthlyRent: 1100,
      vacancyType: 'months',
      vacancyPercent: 0,
      vacancyMonths: 1,
      agentFeePercent: 8,
      maintenanceMonthly: 90,
      otherCostsMonthly: 40,
    });

    expect(result.vacancyPercent).toBeCloseTo(8.33, 2);
    expect(result.monthlyMortgage).toBeGreaterThan(0);
  });

  it('calculates interest rate change with delayed adjustment', () => {
    const result = calculateInterestRateChange({
      balance: 200000,
      currentRate: 4,
      newRate: 6,
      termYears: 30,
      changeTiming: 'after',
      changeAfterMonths: 12,
    });

    expect(result.changeMonths).toBe(12);
    expect(result.paymentTimelineNew[0]).toBeCloseTo(result.baselinePayment, 6);
    expect(result.paymentTimelineNew[13]).toBeCloseTo(result.newPayment, 6);
    expect(result.totalInterestNew).toBeGreaterThan(0);
  });

  it('calculates interest rate change with immediate adjustment', () => {
    const result = calculateInterestRateChange({
      balance: 150000,
      currentRate: 5,
      newRate: 4,
      termYears: 20,
      changeTiming: 'immediate',
      changeAfterMonths: 0,
    });

    expect(result.changeMonths).toBe(0);
    expect(result.paymentTimelineNew[0]).toBeCloseTo(result.newPayment, 6);
    expect(result.totalInterestNew).toBeLessThan(result.totalInterestBaseline);
  });

  it('calculates LTV and bucket', () => {
    const result = calculateLtv({
      propertyValue: 200000,
      mode: 'loan',
      loanAmount: 150000,
      depositType: 'amount',
      depositAmount: 0,
      depositPercent: 0,
    });

    expect(result.ltv).toBeCloseTo(75, 2);
    expect(result.bucket).toBe('Up to 75%');
    expect(result.highRisk).toBe(false);
  });

  it('calculates LTV from deposit percent', () => {
    const result = calculateLtv({
      propertyValue: 250000,
      mode: 'deposit',
      loanAmount: 0,
      depositType: 'percent',
      depositAmount: 0,
      depositPercent: 10,
    });

    expect(result.loanAmount).toBeCloseTo(225000, 2);
    expect(result.ltv).toBeCloseTo(90, 2);
  });

  it('calculates remortgage savings and break-even', () => {
    const result = calculateRemortgage({
      balance: 180000,
      currentRate: 6,
      remainingYears: 20,
      currentPayment: 0,
      newRate: 5,
      newTermYears: 20,
      newFees: 0,
      exitFees: 0,
      legalFees: 0,
      horizonYears: 2,
    });

    expect(result.monthlyDifference).toBeGreaterThan(0);
    expect(result.totalSavings).toBeGreaterThan(0);
    expect(result.breakEvenMonth).toBe(1);
  });

  it('handles remortgage with no break-even within horizon', () => {
    const result = calculateRemortgage({
      balance: 180000,
      currentRate: 5,
      remainingYears: 20,
      currentPayment: 0,
      newRate: 4.8,
      newTermYears: 20,
      newFees: 5000,
      exitFees: 3000,
      legalFees: 1500,
      horizonYears: 2,
    });

    expect(result.breakEvenMonth).toBeNull();
    expect(result.totalSavings).toBeLessThan(0);
  });

  it('calculates offset savings impact', () => {
    const result = calculateOffset({
      balance: 250000,
      annualRate: 5,
      termYears: 25,
      offsetBalance: 20000,
      offsetContribution: 200,
      offsetMode: 'full',
    });

    expect(result.payment).toBeGreaterThan(0);
    expect(result.interestSaved).toBeGreaterThan(0);
    expect(result.yearlyRows.length).toBeGreaterThan(0);
  });

  it('calculates offset with partial mode', () => {
    const result = calculateOffset({
      balance: 200000,
      annualRate: 4.2,
      termYears: 20,
      offsetBalance: 10000,
      offsetContribution: 0,
      offsetMode: 'partial',
    });

    expect(result.effectiveBalance).toBeCloseTo(195000, 2);
  });

  it('calculates borrow amount for payment-based method', () => {
    const result = calculateBorrow({
      grossIncomeAnnual: 90000,
      netIncomeMonthly: 5000,
      incomeBasis: 'net',
      expensesMonthly: 1200,
      debtMonthly: 300,
      interestRate: 5,
      termYears: 25,
      method: 'payment',
      incomeMultiple: 4.5,
      paymentCapPercent: 35,
      deposit: 20000,
    });

    expect(result.hasAffordabilityGap).toBe(false);
    expect(result.maxBorrow).toBeGreaterThan(0);
    expect(result.maxPropertyPrice).toBeGreaterThan(result.maxBorrow);
  });

  it('calculates borrow amount for income multiple with net basis', () => {
    const result = calculateBorrow({
      grossIncomeAnnual: 80000,
      netIncomeMonthly: 4000,
      incomeBasis: 'net',
      expensesMonthly: 900,
      debtMonthly: 200,
      interestRate: 4.5,
      termYears: 30,
      method: 'income',
      incomeMultiple: 4,
      paymentCapPercent: 35,
      deposit: 0,
    });

    expect(result.maxBorrow).toBeCloseTo(192000, 0);
  });

  it('flags affordability gaps when outgoings exceed income', () => {
    const result = calculateBorrow({
      grossIncomeAnnual: 50000,
      netIncomeMonthly: 2000,
      incomeBasis: 'net',
      expensesMonthly: 1800,
      debtMonthly: 400,
      interestRate: 5,
      termYears: 25,
      method: 'income',
      incomeMultiple: 4,
      paymentCapPercent: 35,
      deposit: 0,
    });

    expect(result.hasAffordabilityGap).toBe(true);
  });
});
