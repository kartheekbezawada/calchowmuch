import { describe, it, expect } from 'vitest';
import { factorial, permutation, combination } from '../../public/assets/js/core/stats.js';

/**
 * PERM-TEST-U-1 - Permutation and combination calculations
 */
describe('Permutation/Combination - PERM-TEST-U-1: Core calculations', () => {
  it('calculates permutation nPr', () => {
    expect(permutation(10, 3)).toBe(BigInt(720));
  });

  it('calculates combination nCr', () => {
    expect(combination(10, 3)).toBe(BigInt(120));
  });
});

/**
 * PERM-TEST-U-2 - Factorial and edge cases
 */
describe('Permutation/Combination - PERM-TEST-U-2: Factorial', () => {
  it('calculates factorial correctly', () => {
    expect(factorial(5)).toBe(BigInt(120));
    expect(factorial(0)).toBe(BigInt(1));
  });

  it('rejects invalid factorial inputs', () => {
    expect(factorial(-1)).toBe(null);
  });
});
