import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculateCreditCardPayoff,
  calculateMinimumPayment,
} from '../../../public/assets/js/core/credit-card-utils.js';

const SRC_DIR = path.join(
  process.cwd(),
  'public',
  'calculators',
  'credit-card-calculators',
  'credit-card-minimum-payment-calculator'
);

// Slider defaults declared in index.html. Kept here so a change to either side fails loudly.
const DEFAULTS = { balance: 3200, apr: 21.9, minRate: 2.5, minPayment: 25 };

const amount = (v) =>
  Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percent = (v, d = 2) =>
  `${Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })}%`;
const count = (v) => Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 });

describe('credit-cards/credit-card-minimum-payment static pre-render', () => {
  const minimum = calculateMinimumPayment(DEFAULTS);
  const doubled = calculateCreditCardPayoff({
    balance: DEFAULTS.balance,
    apr: DEFAULTS.apr,
    monthlyPayment: minimum.firstPayment * 2,
  });

  // The page ships the default scenario already rendered into the [data-cc-min] spans so the raw
  // HTML carries real numbers for crawlers instead of em-dash placeholders (see fix-4). Those
  // values are static, so this asserts they still match what the engine actually produces.
  const expected = {
    balance: amount(DEFAULTS.balance),
    apr: percent(DEFAULTS.apr),
    rate: percent(DEFAULTS.minRate, 1),
    floor: amount(DEFAULTS.minPayment),
    'first-rate-payment': amount((DEFAULTS.balance * DEFAULTS.minRate) / 100),
    'monthly-apr': percent(DEFAULTS.apr / 12, 2),
    'first-payment': amount(minimum.firstPayment),
    months: `${count(minimum.months)} months`,
    interest: amount(minimum.totalInterest),
    total: amount(minimum.totalPayment),
    'comparison-saved': amount(minimum.totalInterest - doubled.totalInterest),
    'comparison-sooner': `${count(minimum.months - doubled.months)} months`,
  };

  for (const file of ['index.html', 'explanation.html']) {
    const html = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');

    it(`${file} has no em-dash placeholders left in data spans`, () => {
      expect(html).not.toMatch(/<span data-cc-min="[a-z-]+">—<\/span>/);
    });

    it(`${file} pre-renders values matching the engine`, () => {
      for (const [key, value] of Object.entries(expected)) {
        const matches = [
          ...html.matchAll(new RegExp(`<span data-cc-min="${key}">([^<]*)</span>`, 'g')),
        ].map((m) => m[1]);
        for (const rendered of matches) {
          expect(rendered, `${file} span[data-cc-min="${key}"]`).toBe(value);
        }
      }
    });
  }

  it('reference table rows match the engine at 21.9% APR', () => {
    const html = fs.readFileSync(path.join(SRC_DIR, 'explanation.html'), 'utf8');
    const balances = [1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000];

    for (const balance of balances) {
      const row = calculateMinimumPayment({ ...DEFAULTS, balance });
      const money = (v) => `$${Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
      expect(html, `balance ${balance}`).toContain(
        `<td>${money(balance)}</td><td>${money(row.firstPayment)}</td><td>${row.months} months (${(
          row.months / 12
        ).toFixed(1)} yrs)</td><td>${money(row.totalInterest)}</td><td>${money(
          row.totalPayment
        )}</td>`
      );
    }
  });
});
