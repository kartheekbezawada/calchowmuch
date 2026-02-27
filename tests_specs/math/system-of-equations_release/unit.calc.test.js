import { describe, expect, it } from 'vitest';
import { solveSystem2x2, solveSystem3x3 } from '../../../public/assets/js/core/algebra.js';

describe('math/system-of-equations unit', () => {
  it('solves 2x2 system with unique solution', () => {
    const result = solveSystem2x2(1, 2, 5, 3, 4, 11);
    expect(result.type).toBe('unique');
    expect(result.solution.x).toBeCloseTo(1, 8);
    expect(result.solution.y).toBeCloseTo(2, 8);
  });

  it('detects 2x2 no-solution case', () => {
    const result = solveSystem2x2(1, 1, 2, 2, 2, 5);
    expect(result.type).toBe('none');
  });

  it('solves 3x3 system with unique solution', () => {
    const result = solveSystem3x3(1, 1, 1, 6, 2, -1, 1, 3, 1, 2, -1, 3);
    expect(result.type).toBe('unique');
    expect(result.solution.x).toBeCloseTo(1.2857142857, 6);
    expect(result.solution.y).toBeCloseTo(2.1428571428, 6);
    expect(result.solution.z).toBeCloseTo(2.5714285714, 6);
  });
});
