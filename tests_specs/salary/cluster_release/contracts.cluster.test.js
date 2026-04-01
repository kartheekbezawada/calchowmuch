import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SCOPE_MAP_PATH = path.resolve(process.cwd(), 'config/testing/test-scope-map.json');

describe('salary cluster contracts', () => {
  it('scope map contains cluster and calculator route contracts', () => {
    const map = JSON.parse(fs.readFileSync(SCOPE_MAP_PATH, 'utf8'));
    const cluster = map.clusters.salary;

    expect(cluster).toBeTruthy();
    expect(Array.isArray(cluster.routes)).toBeTruthy();
    expect(cluster.routes).toContain('/salary-calculators/');
    expect(cluster.routes).toContain('/salary-calculators/commission-calculator/');
    expect(cluster.routes).toContain('/salary-calculators/inflation-adjusted-salary-calculator/');
    expect(cluster.calculators && typeof cluster.calculators).toBe('object');
    expect(Object.keys(cluster.calculators)).toHaveLength(11);

    for (const [calcId, calc] of Object.entries(cluster.calculators)) {
      expect(calcId).toBeTruthy();
      expect(typeof calc.route).toBe('string');
      expect(calc.route.startsWith('/salary-calculators/')).toBeTruthy();
      expect(typeof calc.releaseDir).toBe('string');
    }
  });
});
