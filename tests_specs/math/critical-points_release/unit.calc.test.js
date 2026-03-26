import { describe, expect, it } from 'vitest';
import { CriticalPointsFinder } from '../../../public/calculators/math/calculus/critical-points/module.js';

describe('math/critical-points unit', () => {
  it('finds and classifies the turning points of the default cubic', () => {
    const finder = new CriticalPointsFinder('x^3 - 3*x^2 + 2', 'x');
    const result = finder.analyze(-3, 5);

    expect(result.criticalPoints).toHaveLength(2);

    const maximum = result.criticalPoints.find((point) =>
      point.classification.includes('Maximum')
    );
    const minimum = result.criticalPoints.find((point) =>
      point.classification.includes('Minimum')
    );

    expect(maximum).toBeTruthy();
    expect(minimum).toBeTruthy();
    expect(maximum.x).toBeCloseTo(0, 1);
    expect(minimum.x).toBeCloseTo(2, 1);
  });

  it('uses the selected variable when evaluating the expression', () => {
    const finder = new CriticalPointsFinder('t^2 - 4*t + 3', 't');
    const value = finder.evaluateFunction('t^2 - 4*t + 3', 2);

    expect(value).toBeCloseTo(-1);
  });
});
