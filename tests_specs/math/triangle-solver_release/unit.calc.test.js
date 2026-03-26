import { describe, expect, it } from 'vitest';
import { solveTriangle } from '../../../public/assets/js/core/trigonometry.js';

describe('math/triangle-solver unit', () => {
  it('solves a stable SSS triangle', () => {
    const result = solveTriangle('SSS', { a: 7, b: 9, c: 12 });
    expect(result.error).toBeUndefined();
    expect(result.solutions).toHaveLength(1);
    expect(result.solutions[0].A).toBeCloseTo(35.4309446873, 6);
    expect(result.solutions[0].B).toBeCloseTo(48.1896851042, 6);
    expect(result.solutions[0].C).toBeCloseTo(96.3793702084, 6);
    expect(result.solutions[0].area).toBeCloseTo(31.304951685, 6);
  });

  it('returns both SSA ambiguous-case solutions', () => {
    const result = solveTriangle('SSA', { a: 7, b: 9, A: 35 });
    expect(result.error).toBeUndefined();
    expect(result.solutions).toHaveLength(2);
    expect(result.notes).toBe('Ambiguous case produced two solutions.');
    expect(result.solutions[0].B).toBeCloseTo(47.5151049823, 6);
    expect(result.solutions[1].B).toBeCloseTo(132.4848950176, 6);
  });
});
