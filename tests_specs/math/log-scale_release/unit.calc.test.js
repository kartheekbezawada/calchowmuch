import { describe, expect, it } from 'vitest';
import { convertLogScaleValue } from '../../../public/assets/js/core/logarithm.js';

describe('math/log-scale unit', () => {
  it('returns 20 dB for a 10:1 amplitude ratio', () => {
    expect(convertLogScaleValue({ type: 'decibel', amplitude: 10, reference: 1 })).toBeCloseTo(
      20,
      10
    );
  });

  it('returns pH 7 for a hydrogen ion concentration of 1e-7', () => {
    expect(convertLogScaleValue({ type: 'ph', concentration: 1e-7 })).toBeCloseTo(7, 10);
  });

  it('returns Richter magnitude 2 for a 100:1 motion ratio', () => {
    expect(convertLogScaleValue({ type: 'richter', magnitude: 100, reference: 1 })).toBeCloseTo(
      2,
      10
    );
  });
});
