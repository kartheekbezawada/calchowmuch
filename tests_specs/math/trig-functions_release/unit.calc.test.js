import { describe, expect, it } from 'vitest';
import { computeTrigValues, degToRad, getSpecialAngleInfo } from '../../../public/assets/js/core/trigonometry.js';

describe('math/trig-functions unit', () => {
  it('computes 30 degree trig values', () => {
    const values = computeTrigValues(degToRad(30));
    expect(values.sin).toBeCloseTo(0.5, 8);
    expect(values.cos).toBeCloseTo(0.8660254038, 8);
    expect(values.tan).toBeCloseTo(0.5773502691, 8);
  });

  it('returns special-angle metadata for 45 degrees', () => {
    const special = getSpecialAngleInfo(45);
    expect(special?.sin).toBe('sqrt(2)/2');
    expect(special?.cos).toBe('sqrt(2)/2');
    expect(special?.radLabel).toBe('pi/4');
  });
});
