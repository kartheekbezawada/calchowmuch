import { describe, expect, it } from 'vitest';
import {
  computeTrigValues,
  degToRad,
  getQuadrantFromDegrees,
  getReferenceAngleDegrees,
  normalizeDegrees,
} from '../../../public/assets/js/core/trigonometry.js';

describe('math/unit-circle unit', () => {
  it('normalizes degrees into the standard 0-360 range', () => {
    expect(normalizeDegrees(405)).toBe(45);
    expect(normalizeDegrees(-90)).toBe(270);
  });

  it('returns correct quadrant and reference angle for 135 degrees', () => {
    expect(getQuadrantFromDegrees(135)).toBe('II');
    expect(getReferenceAngleDegrees(135)).toBe(45);
  });

  it('computes standard-angle trig values for 45 degrees', () => {
    const values = computeTrigValues(degToRad(45));
    expect(values.sin).toBeCloseTo(Math.SQRT1_2, 6);
    expect(values.cos).toBeCloseTo(Math.SQRT1_2, 6);
    expect(values.tan).toBeCloseTo(1, 6);
  });

  it('returns undefined tangent when cosine is zero', () => {
    const values = computeTrigValues(degToRad(90));
    expect(values.cos).toBeCloseTo(0, 6);
    expect(values.tan).toBeNull();
  });
});
