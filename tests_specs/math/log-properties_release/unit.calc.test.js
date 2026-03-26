import { describe, expect, it } from 'vitest';
import { logPowerRule, logProductRule, logQuotientRule } from '../../../public/assets/js/core/logarithm.js';

describe('math/log-properties unit', () => {
  it('verifies the product and quotient rules at base 10', () => {
    expect(logProductRule(10, 2, 5)).toBeCloseTo(1, 10);
    expect(logQuotientRule(10, 20, 4)).toBeCloseTo(Math.log10(5), 10);
  });

  it('verifies the power rule numerically', () => {
    expect(logPowerRule(10, 3, 2)).toBeCloseTo(Math.log10(9), 10);
  });
});
