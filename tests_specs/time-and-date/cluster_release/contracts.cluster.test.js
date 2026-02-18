import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SCOPE_MAP_PATH = path.resolve(process.cwd(), 'config/testing/test-scope-map.json');

describe('time-and-date cluster contracts', () => {
  it('scope map contains cluster and calculator route contracts', () => {
    const map = JSON.parse(fs.readFileSync(SCOPE_MAP_PATH, 'utf8'));
    const cluster = map.clusters['time-and-date'];

    expect(cluster).toBeTruthy();
    expect(Array.isArray(cluster.routes)).toBeTruthy();
    expect(cluster.routes.length).toBeGreaterThan(0);
    expect(cluster.calculators && typeof cluster.calculators).toBe('object');

    for (const [calcId, calc] of Object.entries(cluster.calculators)) {
      expect(calcId).toBeTruthy();
      expect(typeof calc.route).toBe('string');
      expect(calc.route.startsWith('/')).toBeTruthy();
      expect(typeof calc.releaseDir).toBe('string');
    }
  });
});
