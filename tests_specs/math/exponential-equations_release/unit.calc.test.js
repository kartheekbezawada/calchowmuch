import { describe, expect, it } from 'vitest';
import { solveSimpleExponential } from '../../../public/assets/js/core/logarithm.js';

describe('math/exponential-equations unit', () => {
  it('solves a simple power equation', () => {
    expect(solveSimpleExponential({ base: 2, target: 16, multiplier: 1, shift: 0 })).toBeCloseTo(4, 10);
  });

  it('solves a shifted and scaled exponent equation', () => {
    expect(solveSimpleExponential({ base: 2, target: 32, multiplier: 2, shift: 1 })).toBeCloseTo(2, 10);
  });
});
