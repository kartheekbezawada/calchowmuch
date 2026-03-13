import { describe, expect, it } from 'vitest';
import { buildPlannerData, validateRouteScope } from '../../../scripts/validate-route-scope.mjs';

describe('route-scope planner generation', () => {
  const planner = buildPlannerData();

  it('builds deterministic baseline counts', () => {
    expect(planner.rows).toHaveLength(90);

    const counts = Object.fromEntries(
      planner.prefixSummary.map((row) => [row.routePrefix, row.calculatorCount])
    );

    expect(counts['/math/']).toBe(36);
    expect(counts['/loan-calculators/']).toBe(8);
    expect(counts['/credit-card-calculators/']).toBe(4);
    expect(counts['/car-loan-calculators/']).toBe(5);
    expect(counts['/finance-calculators/']).toBe(11);
    expect(counts['/time-and-date/']).toBe(12);
    expect(counts['/percentage-calculators/']).toBe(14);
  });

  it('maps legacy route ownership and source files', () => {
    const row = planner.rows.find(
      (item) => item.route === '/loan-calculators/offset-mortgage-calculator/'
    );
    expect(row).toBeTruthy();
    expect(row.ownerState).toBe('legacy-shared');
    expect(row.sourceFiles).toContain(
      'public/calculators/loan-calculators/offset-mortgage-calculator/module.js'
    );
    expect(row.testScope.join(' ')).toContain('tests_specs/loans/offset-calculator_release/**');
  });

  it('maps cluster route ownership and contract files', () => {
    const row = planner.rows.find((item) => item.route === '/time-and-date/age-calculator/');
    expect(row).toBeTruthy();
    expect(row.ownerState).toBe('cluster-owned:time-and-date');
    expect(row.contractFiles).toContain('config/clusters/route-ownership.json');
    expect(row.contractFiles).toContain('clusters/time-and-date/config/asset-manifest.json');
  });

  it('maps mixed prefix cluster route (reverse percentage)', () => {
    const row = planner.rows.find(
      (item) => item.route === '/percentage-calculators/reverse-percentage-calculator/'
    );
    expect(row).toBeTruthy();
    expect(row.ownerState).toBe('cluster-owned:percentage');
    expect(row.contractFiles).toContain('clusters/percentage/config/navigation.json');
  });

  it('maps finance exception source files from content + assets', () => {
    const row = planner.rows.find(
      (item) => item.route === '/finance-calculators/present-value-calculator/'
    );
    expect(row).toBeTruthy();
    expect(row.sourceFiles).toContain(
      'content/calculators/finance-calculators/present-value-calculator/index.html'
    );
    expect(row.sourceFiles).toContain(
      'public/assets/js/calculators/finance-calculators/present-value-calculator/module.js'
    );
    expect(row.sourceFiles).toContain(
      'public/assets/css/calculators/finance-calculators/present-value-calculator/calculator.css'
    );
  });
});

describe('route-scope validator behavior', () => {
  const planner = buildPlannerData();

  it('passes when all files are within selected route scope', () => {
    const result = validateRouteScope({
      route: '/loan-calculators/offset-mortgage-calculator/',
      changedFiles: [
        'public/calculators/loan-calculators/offset-mortgage-calculator/module.js',
        'tests_specs/loans/offset-calculator_release/unit.calc.test.js',
        'public/loan-calculators/offset-mortgage-calculator/index.html',
      ],
      planner,
    });

    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('fails when changed files include another calculator path', () => {
    const result = validateRouteScope({
      route: '/loan-calculators/offset-mortgage-calculator/',
      changedFiles: [
        'public/calculators/loan-calculators/offset-mortgage-calculator/module.js',
        'public/calculators/loan-calculators/mortgage-calculator/module.js',
      ],
      planner,
    });

    expect(result.ok).toBe(false);
    expect(result.violations).toContain(
      'public/calculators/loan-calculators/mortgage-calculator/module.js'
    );
  });

  it('fails fast for unknown route', () => {
    expect(() =>
      validateRouteScope({
        route: '/unknown/not-a-real-route/',
        changedFiles: ['public/unknown/not-a-real-route/index.html'],
        planner,
      })
    ).toThrow(/Unknown route/);
  });

  it('keeps percent-change aligned on the canonical calculator route', () => {
    const percentChangeWarnings = planner.warnings.filter((item) =>
      item.includes('calculatorId=percent-change')
    );

    expect(percentChangeWarnings).toHaveLength(0);

    const row = planner.rows.find(
      (item) => item.route === '/percentage-calculators/percent-change-calculator/'
    );
    expect(row).toBeTruthy();
    expect(row?.ownerState).toBe('cluster-owned:percentage');
  });
});
