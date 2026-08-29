import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

import {
  calculateCaBonusImpact,
  calculateCaTakeHome,
} from '../../../public/calculators/salary-calculators/shared/tax-engine/ca-engine.js';

const ROOT = path.resolve(process.cwd(), 'public/calculators/salary-calculators/shared/tax-data');
const ca = JSON.parse(fs.readFileSync(path.join(ROOT, 'ca.json'), 'utf8'));

const { federal, cpp, ei, provinces } = ca;

const money = (n) => Math.round(n * 100) / 100;
const run = (input, provinceCode = 'AB') =>
  calculateCaTakeHome(input, { federal, cpp, ei, province: provinces[provinceCode] });

describe('federal income tax (BPA as a non-refundable credit, not a deduction)', () => {
  it('taxes the full bracket amount, then credits back BPA at the lowest band rate', () => {
    const r = run({ grossAnnual: 60000 }, 'AB');
    // Bracket tax on the full 60,000 (NOT 60,000 - 16,452): 58,523@14% + 1,477@20.5%
    expect(money(r.federalTax.grossTax)).toBeCloseTo(8496.01, 2);
    // BPA credit = 16,452 * 14% (the lowest band's rate) - not subtracted from taxable income
    expect(money(r.federalTax.bpa.credit)).toBeCloseTo(2303.28, 2);
    expect(money(r.federalTax.total)).toBeCloseTo(6192.73, 2);
    expect(r.federalTax.marginalRate).toBe(0.205);
  });

  it('is not tapered below the 181,440 threshold', () => {
    const r = run({ grossAnnual: 100000 }, 'AB');
    expect(r.federalTax.bpa.isTapered).toBe(false);
    expect(r.federalTax.bpa.taperedAmount).toBe(16452);
    expect(r.isInBpaTaper).toBe(false);
  });

  it('tapers the BPA above 181,440, losing about 2.1 cents per dollar of income', () => {
    const r = run({ grossAnnual: 200000 }, 'AB');
    expect(r.federalTax.bpa.isTapered).toBe(true);
    expect(r.isInBpaTaper).toBe(true);
    expect(money(r.federalTax.bpa.taperedAmount)).toBeCloseTo(16061.01, 2);
  });

  it('floors the taper at 14,829 rather than shrinking to zero like the UK Personal Allowance', () => {
    const r = run({ grossAnnual: 300000 }, 'AB');
    expect(money(r.federalTax.bpa.taperedAmount)).toBeCloseTo(14829, 2);
    // Even at a much higher income, the floor holds instead of continuing to shrink.
    const rHigh = run({ grossAnnual: 1000000 }, 'AB');
    expect(money(rHigh.federalTax.bpa.taperedAmount)).toBeCloseTo(14829, 2);
  });

  it('throws if no province/territory is supplied, rather than silently defaulting', () => {
    expect(() => calculateCaTakeHome({ grossAnnual: 60000 }, { federal, cpp, ei, province: undefined }))
      .toThrow(RangeError);
  });
});

describe('CPP (Canada Pension Plan)', () => {
  it('charges nothing below the 3,500 basic exemption', () => {
    expect(run({ grossAnnual: 3000 }, 'AB').cpp.total).toBe(0);
  });

  it('charges 5.95% of earnings between the exemption and the YMPE (74,600)', () => {
    const r = run({ grossAnnual: 60000 }, 'AB');
    expect(money(r.cpp.base)).toBeCloseTo(3361.75, 2);
    expect(r.cpp.secondTier).toBe(0);
    expect(money(r.cpp.total)).toBeCloseTo(3361.75, 2);
  });

  it('adds CPP2 at 4% between the YMPE and the YAMPE (85,000) as a genuinely separate tier', () => {
    const r = run({ grossAnnual: 80000 }, 'AB');
    expect(money(r.cpp.base)).toBeCloseTo(4230.45, 2); // capped at the YMPE ceiling
    expect(money(r.cpp.secondTier)).toBeCloseTo(216, 2); // (80,000 - 74,600) * 4%
  });

  it('stops accruing entirely above the YAMPE', () => {
    const at85k = run({ grossAnnual: 85000 }, 'AB').cpp.total;
    const at200k = run({ grossAnnual: 200000 }, 'AB').cpp.total;
    expect(money(at85k)).toBe(money(at200k));
  });

  it('is not charged for Quebec residents — qpp replaces it entirely', () => {
    const r = run({ grossAnnual: 60000 }, 'QC');
    expect(r.cpp).toBeNull();
    expect(r.qpp).not.toBeNull();
  });
});

describe('EI (Employment Insurance)', () => {
  it('charges 1.66% up to the Maximum Insurable Earnings', () => {
    expect(money(run({ grossAnnual: 50000 }, 'AB').ei.amount)).toBeCloseTo(830, 2);
  });

  it('caps at the MIE ceiling, charging no marginal EI above it', () => {
    const atCap = run({ grossAnnual: 68900 }, 'AB').ei.amount;
    const wellAbove = run({ grossAnnual: 300000 }, 'AB').ei.amount;
    expect(money(atCap)).toBe(money(wellAbove));
    expect(money(atCap)).toBeCloseTo(1143.74, 2);
  });

  it('uses a reduced 1.30% rate for Quebec, on the SAME national MIE ceiling — not a lower one', () => {
    const ab = run({ grossAnnual: 100000 }, 'AB').ei.amount;
    const qc = run({ grossAnnual: 100000 }, 'QC').ei.amount;
    expect(money(qc)).toBeLessThan(money(ab));
    expect(money(qc)).toBeCloseTo(895.7, 2); // 68,900 * 1.30%
    expect(run({ grossAnnual: 68900 }, 'QC').ei.amount)
      .toBe(run({ grossAnnual: 200000 }, 'QC').ei.amount);
  });
});

describe('provincial/territorial income tax', () => {
  it('applies a flat-rate BPA credit provincially too (no taper modelled at this layer)', () => {
    const r = run({ grossAnnual: 60000 }, 'AB');
    expect(money(r.provincialTax.bpa.credit)).toBeCloseTo(1821.52, 2); // 22,769 * 8%
    expect(money(r.provincialTax.total)).toBeCloseTo(2978.48, 2);
  });

  it('produces materially different provincial tax across provinces at the same income', () => {
    const ab = run({ grossAnnual: 80000 }, 'AB').provincialTax.total;
    const bc = run({ grossAnnual: 80000 }, 'BC').provincialTax.total;
    expect(money(ab)).not.toBe(money(bc));
  });

  describe('Ontario surtax + health premium', () => {
    it('charges neither wrinkle at a modest income', () => {
      const r = run({ grossAnnual: 30000 }, 'ON');
      expect(r.provincialTax.surtax.total).toBe(0);
      expect(money(r.provincialTax.healthPremium.total)).toBeLessThan(900);
    });

    it('layers both surtax tiers additively once provincial tax owing clears both thresholds', () => {
      const r = run({ grossAnnual: 100000 }, 'ON');
      expect(r.provincialTax.surtax.total).toBeGreaterThan(0);
      expect(money(r.provincialTax.total)).toBeCloseTo(7127.83, 2);
    });

    it('caps the health premium at 900/year no matter how high income climbs', () => {
      expect(money(run({ grossAnnual: 5000000 }, 'ON').provincialTax.healthPremium.total)).toBe(900);
    });

    it('leaves every other province with a null surtax and health premium — Ontario-only wrinkles', () => {
      const r = run({ grossAnnual: 100000 }, 'AB');
      expect(r.provincialTax.surtax.total).toBe(0);
      expect(r.provincialTax.healthPremium.total).toBe(0);
    });
  });
});

describe('Quebec (a structurally separate stack, not a bracket-table swap)', () => {
  it('replaces CPP with QPP at a higher combined base rate (6.3% vs 5.95%)', () => {
    const r = run({ grossAnnual: 60000 }, 'QC');
    expect(r.cpp).toBeNull();
    expect(money(r.qpp.base)).toBeCloseTo(3559.5, 2); // (60,000 - 3,500) * 6.3%
  });

  it('adds a separate QPIP premium with no non-Quebec equivalent', () => {
    const ab = run({ grossAnnual: 60000 }, 'AB');
    const qc = run({ grossAnnual: 60000 }, 'QC');
    expect(ab.qpip).toBeNull();
    expect(money(qc.qpip.amount)).toBeCloseTo(258, 2); // 60,000 * 0.43%
  });

  it('applies a 16.5% federal abatement that reduces federal tax owing, not provincial', () => {
    const ab = run({ grossAnnual: 60000 }, 'AB');
    const qc = run({ grossAnnual: 60000 }, 'QC');
    // Federal bracket tax and BPA credit are identical - the federal BPA is not province-specific.
    expect(money(qc.federalTax.total)).toBeCloseTo(money(ab.federalTax.total), 2);
    expect(qc.federalTax.abatement).toBeGreaterThan(0);
    expect(money(qc.federalTax.payable)).toBeCloseTo(money(qc.federalTax.total * (1 - 0.165)), 2);
    expect(ab.federalTax.abatement).toBe(0);
  });

  it('matches the hand-verified Alberta-vs-Quebec comparison at 60,000/year used in the UI E2E tests', () => {
    const ab = run({ grossAnnual: 60000 }, 'AB');
    const qc = run({ grossAnnual: 60000 }, 'QC');
    expect(money(ab.netAnnual)).toBeCloseTo(46471.05, 2);
    expect(money(qc.netAnnual)).toBeCloseTo(44202.1, 2);
    expect(qc.netAnnual).toBeLessThan(ab.netAnnual);
  });
});

describe('result integrity', () => {
  it('reconciles gross minus every deduction line to net (non-Quebec: federal + CPP + EI + provincial)', () => {
    const r = run({ grossAnnual: 90000 }, 'ON');
    const sum = r.federalTax.payable + r.cpp.total + r.ei.amount + r.provincialTax.total;
    expect(money(sum)).toBeCloseTo(money(r.totalDeductions), 2);
    expect(money(r.gross - sum)).toBeCloseTo(money(r.netAnnual), 2);
  });

  it('reconciles Quebec, which swaps CPP for QPP and adds a QPIP line', () => {
    const r = run({ grossAnnual: 90000 }, 'QC');
    const sum = r.federalTax.payable + r.qpp.total + r.ei.amount + r.qpip.amount + r.provincialTax.total;
    expect(money(sum)).toBeCloseTo(money(r.totalDeductions), 2);
    expect(money(r.gross - sum)).toBeCloseTo(money(r.netAnnual), 2);
  });

  it('reports federal and provincial marginal rates separately, never merged silently', () => {
    const r = run({ grossAnnual: 100000 }, 'ON');
    expect(r.marginalRate).toBe(r.federalTax.marginalRate);
    expect(r.provincialMarginalRate).toBe(r.provincialTax.marginalRate);
    expect(money(r.combinedMarginalRate)).toBeCloseTo(money(r.marginalRate + r.provincialMarginalRate), 2);
    expect(r.effectiveRate).toBeLessThan(r.combinedMarginalRate);
  });

  it('surfaces the selected province as both a code and a name', () => {
    expect(run({ grossAnnual: 60000 }, 'QC').province).toEqual({ code: 'QC', name: 'Quebec' });
  });
});

describe('bonus impact', () => {
  it('is the difference between two full results, not bonus times marginal rate', () => {
    const impact = calculateCaBonusImpact(
      { grossAnnual: 60000, bonus: 5000 },
      { federal, cpp, ei, province: provinces.AB }
    );
    expect(money(impact.netBonus))
      .toBeCloseTo(money(impact.withBonus.netAnnual - impact.withoutBonus.netAnnual), 2);
    expect(impact.grossBonus).toBe(5000);
  });

  it('captures CPP dropping out once earnings clear the YAMPE', () => {
    // At a 90,000 base, the whole 10,000 bonus sits above the 85,000 YAMPE, so CPP is flat.
    const impact = calculateCaBonusImpact(
      { grossAnnual: 90000, bonus: 10000 },
      { federal, cpp, ei, province: provinces.AB }
    );
    expect(impact.withBonus.cpp.total).toBe(impact.withoutBonus.cpp.total);
  });
});

describe('tax-data integrity', () => {
  it('has all 13 provinces/territories, keyed by their code, with no extras', () => {
    const codes = Object.keys(provinces).sort();
    expect(codes).toEqual(
      ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].sort()
    );
  });

  it('gives every province a `province` field matching its object key — what ca-engine.js branches on for Quebec', () => {
    for (const [code, data] of Object.entries(provinces)) {
      expect(data.province, `${code} missing/mismatched province field`).toBe(code);
    }
  });

  it('gives federal and every province contiguous bands with an unbounded top band', () => {
    const checkBands = (bands, label) => {
      bands.forEach((band, i) => {
        if (i < bands.length - 1) expect(band.to, `${label} band ${i}`).toBe(bands[i + 1].from);
        else expect(band.to, `${label} top band`).toBeNull();
      });
    };
    checkBands(federal.bands, 'federal');
    for (const [code, data] of Object.entries(provinces)) checkBands(data.bands, code);
  });

  it('only Ontario carries a surtax or health premium', () => {
    for (const [code, data] of Object.entries(provinces)) {
      if (code === 'ON') {
        expect(data.surtax).not.toBeNull();
        expect(data.healthPremium).not.toBeNull();
      } else {
        expect(data.surtax, `${code} surtax`).toBeNull();
        expect(data.healthPremium, `${code} health premium`).toBeNull();
      }
    }
  });

  it('only Quebec carries qpp/eiReduced/qpip/quebecAbatementRate', () => {
    for (const [code, data] of Object.entries(provinces)) {
      if (code === 'QC') {
        expect(data.qpp).toBeTruthy();
        expect(data.eiReduced).toBeTruthy();
        expect(data.qpip).toBeTruthy();
        expect(data.quebecAbatementRate).toBeGreaterThan(0);
      } else {
        expect(data.qpp, `${code} qpp`).toBeUndefined();
        expect(data.eiReduced, `${code} eiReduced`).toBeUndefined();
        expect(data.qpip, `${code} qpip`).toBeUndefined();
      }
    }
  });

  it('gives CPP2/QPP2 the same YMPE/YAMPE tier boundaries as base CPP/QPP', () => {
    expect(cpp.secondTier.floor).toBe(cpp.base.ceiling);
    expect(provinces.QC.qpp.secondTier.floor).toBe(provinces.QC.qpp.base.ceiling);
    expect(cpp.base.ceiling).toBe(provinces.QC.qpp.base.ceiling);
    expect(cpp.secondTier.ceiling).toBe(provinces.QC.qpp.secondTier.ceiling);
  });

  it('gives Quebec eiReduced the SAME national MIE as general EI — only the rate differs', () => {
    expect(provinces.QC.eiReduced.maxInsurableEarnings).toBe(ei.maxInsurableEarnings);
    expect(provinces.QC.eiReduced.rate).toBeLessThan(ei.rate);
  });

  it('carries the required top-level metadata and an honest verification status', () => {
    for (const key of ['country', 'dataset', 'taxYear', 'effectiveFrom', 'effectiveTo', 'source']) {
      expect(ca[key], `ca.json missing ${key}`).toBeTruthy();
    }
    expect(ca.verification.status).toMatch(/^(verified|aggregated-source)$/);
  });
});
