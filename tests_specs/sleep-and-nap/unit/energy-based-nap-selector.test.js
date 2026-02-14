import { describe, it, expect } from 'vitest';
import {
  getTimeBucket,
  getEnergyNapRecommendation,
  ENERGY_NAP_GOALS,
} from '../../public/assets/js/core/nap-utils.js';

describe('Energy-Based Nap Selector - ENAP-TEST-U-1: deterministic mappings', () => {
  it('maps Quick to 15 minutes', () => {
    const rec = getEnergyNapRecommendation('quick', { hours: 10, minutes: 0 }, true);
    expect(rec.recommendedMinutes).toBe(ENERGY_NAP_GOALS.quick.minutes);
    expect(rec.effectiveGoal).toBe('quick');
  });

  it('maps Strong to 25 minutes', () => {
    const rec = getEnergyNapRecommendation('strong', { hours: 10, minutes: 0 }, true);
    expect(rec.recommendedMinutes).toBe(ENERGY_NAP_GOALS.strong.minutes);
    expect(rec.effectiveGoal).toBe('strong');
  });

  it('maps Full to 90 minutes when explicitly selected', () => {
    const rec = getEnergyNapRecommendation('full', { hours: 10, minutes: 0 }, true);
    expect(rec.recommendedMinutes).toBe(ENERGY_NAP_GOALS.full.minutes);
    expect(rec.effectiveGoal).toBe('full');
  });
});

describe('Energy-Based Nap Selector - ENAP-TEST-U-2: bucket and override behavior', () => {
  it('classifies night bucket correctly', () => {
    expect(getTimeBucket({ hours: 23, minutes: 30 })).toBe('Night');
    expect(getTimeBucket({ hours: 2, minutes: 15 })).toBe('Night');
  });

  it('downgrades inferred Full to Strong at night', () => {
    const rec = getEnergyNapRecommendation('full', { hours: 23, minutes: 30 }, false);
    expect(rec.effectiveGoal).toBe('strong');
    expect(rec.recommendedMinutes).toBe(25);
    expect(rec.overridden).toBe(true);
    expect(rec.warning).toContain('downgraded');
  });

  it('keeps explicit Full at night and warns', () => {
    const rec = getEnergyNapRecommendation('full', { hours: 23, minutes: 30 }, true);
    expect(rec.effectiveGoal).toBe('full');
    expect(rec.recommendedMinutes).toBe(90);
    expect(rec.overridden).toBe(false);
    expect(rec.warning).toContain('90-minute');
  });
});
