import { describe, expect, it } from 'vitest';
import {
  annualiseExtraPayment,
  grossAtBasis,
  resolveExtraPaymentAmount,
  resolveExtraPayments,
} from '../../../public/calculators/salary-calculators/shared/tax-engine/extra-payments.js';

describe('extra-payments resolver (spec §63-§65)', () => {
  it('overtime, method A (fixed): uses the entered amount', () => {
    expect(resolveExtraPaymentAmount({ type: 'overtime', method: 'fixed', amount: 500 })).toBe(500);
  });

  it('overtime, method B (hourly): rate x hours', () => {
    const amount = resolveExtraPaymentAmount({
      type: 'overtime',
      method: 'hourly',
      hourlyRate: 25,
      hours: 10,
    });
    expect(amount).toBe(250);
  });

  it('overtime, method C (percent of gross): gross at the chosen basis x percent', () => {
    // Monthly gross of 48000/12 = 4000, times 10% = 400.
    const amount = resolveExtraPaymentAmount(
      { type: 'overtime', method: 'percent', percent: 10, percentBasis: 'monthly' },
      { grossAnnual: 48000 }
    );
    expect(amount).toBe(400);
  });

  it('grossAtBasis: annual / periods, 4-weekly is /13', () => {
    expect(grossAtBasis(52000, 'weekly')).toBe(1000);
    expect(grossAtBasis(52000, 'fourWeekly')).toBeCloseTo(4000, 8);
    expect(grossAtBasis(52000, 'annual')).toBe(52000);
  });

  it('annualiseExtraPayment: a per-period amount times its frequency', () => {
    expect(annualiseExtraPayment(400, 'monthly')).toBe(4800);
    expect(annualiseExtraPayment(250, 'weekly')).toBe(13000);
    expect(annualiseExtraPayment(250, 'fourWeekly')).toBe(3250);
    expect(annualiseExtraPayment(1000, 'oneOff')).toBe(1000);
    expect(annualiseExtraPayment(1000, 'annual')).toBe(1000);
  });

  it('bonus / commission / other: a plain amount at its frequency', () => {
    const out = resolveExtraPayments(
      [
        { type: 'bonus', amount: 5000, frequency: 'oneOff' },
        { type: 'commission', amount: 800, frequency: 'monthly' },
        { type: 'other', amount: 100, frequency: 'weekly' },
      ],
      { grossAnnual: 60000 }
    );
    expect(out.items.map((i) => i.annualAmount)).toEqual([5000, 9600, 5200]);
    expect(out.totalAnnual).toBe(5000 + 9600 + 5200);
  });

  it('combines every method into one annual total', () => {
    const out = resolveExtraPayments(
      [
        { type: 'overtime', method: 'hourly', hourlyRate: 30, hours: 8, frequency: 'weekly' }, // 240 * 52
        { type: 'bonus', amount: 3000, frequency: 'oneOff' },
      ],
      { grossAnnual: 60000 }
    );
    expect(out.totalAnnual).toBe(240 * 52 + 3000);
  });

  it('negative / non-numeric inputs are floored to zero', () => {
    expect(resolveExtraPaymentAmount({ type: 'overtime', method: 'fixed', amount: -10 })).toBe(0);
    expect(resolveExtraPaymentAmount({ type: 'bonus', amount: 'abc' })).toBe(0);
    expect(resolveExtraPayments(null, {}).totalAnnual).toBe(0);
  });
});
