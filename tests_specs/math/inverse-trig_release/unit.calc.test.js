import { describe, expect, it } from 'vitest';
import { getInverseTrigSolutions } from '../../../public/assets/js/core/trigonometry.js';

describe('math/inverse-trig unit', () => {
  it('returns expected arcsin solutions across a full-turn interval', () => {
    const result = getInverseTrigSolutions('arcsin', 0.5, -2 * Math.PI, 2 * Math.PI);
    expect(result.error).toBeUndefined();
    expect(result.solutions).toHaveLength(4);
    expect(result.principal).toBeCloseTo(Math.PI / 6, 8);
  });

  it('returns expected arctan principal value and interval solutions', () => {
    const result = getInverseTrigSolutions('arctan', 1, -2 * Math.PI, 2 * Math.PI);
    expect(result.error).toBeUndefined();
    expect(result.solutions).toHaveLength(4);
    expect(result.principal).toBeCloseTo(Math.PI / 4, 8);
  });
});
