import { describe, expect, it } from 'vitest';
import { detectTriangleType, solveTriangle } from '../../../public/assets/js/core/trigonometry.js';

describe('math/law-of-sines-cosines unit', () => {
  it('detects SSS input and solves it with one valid triangle', () => {
    const type = detectTriangleType({ a: 7, b: 9, c: 12, A: Number.NaN, B: Number.NaN, C: Number.NaN });
    expect(type).toBe('SSS');

    const result = solveTriangle(type, { a: 7, b: 9, c: 12, A: Number.NaN, B: Number.NaN, C: Number.NaN });
    expect(result.error).toBeUndefined();
    expect(result.solutions).toHaveLength(1);
    expect(result.solutions[0].A).toBeCloseTo(35.4309445, 6);
  });

  it('returns two solutions for an ambiguous SSA case', () => {
    const type = detectTriangleType({ a: 7, b: 9, c: Number.NaN, A: 35, B: Number.NaN, C: Number.NaN });
    expect(type).toBe('SSA');

    const result = solveTriangle(type, { a: 7, b: 9, c: Number.NaN, A: 35, B: Number.NaN, C: Number.NaN });
    expect(result.error).toBeUndefined();
    expect(result.solutions).toHaveLength(2);
    expect(result.notes).toBe('Ambiguous case produced two solutions.');
  });
});
