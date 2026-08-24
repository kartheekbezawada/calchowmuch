/**
 * Generic progressive-tax algorithm.
 *
 * One implementation, reused by UK Income Tax, UK National Insurance, US federal income tax and
 * every US state (tax-engine spec §11.3). Nothing in here knows which country it is serving.
 *
 * Bands are ABSOLUTE boundaries on whatever income measure the caller passes in — not offsets.
 * That is what lets the same function serve two different conventions:
 *
 *   Income Tax: pass income after the personal allowance, bands starting at 0
 *   National Insurance: pass gross earnings, bands starting at the primary threshold (12,570)
 *
 * Trying to express NI as "offsets from a threshold" is where hand-rolled implementations go
 * wrong, because NI's thresholds are unrelated to the Income Tax allowance.
 */

/**
 * @typedef {object} TaxBand
 * @property {string} [id]
 * @property {string} [name]
 * @property {number} rate   Fraction, so 20% is 0.2
 * @property {number} from   Absolute lower bound, inclusive
 * @property {number|null} to Absolute upper bound, exclusive; null means unbounded
 */

/**
 * @typedef {object} BandBreakdown
 * @property {string} id
 * @property {string} name
 * @property {number} rate
 * @property {number} from
 * @property {number|null} to
 * @property {number} amountInBand  How much income landed in this band
 * @property {number} tax           amountInBand * rate
 */

/**
 * @param {number} income Income measured on the same scale as the band boundaries.
 * @param {TaxBand[]} bands Contiguous, ascending. Validated by scripts/validate-tax-data.mjs.
 * @returns {{ total: number, breakdown: BandBreakdown[], marginalRate: number }}
 */
export function calculateProgressiveTax(income, bands) {
  if (!Array.isArray(bands) || bands.length === 0) {
    throw new TypeError('calculateProgressiveTax: `bands` must be a non-empty array');
  }

  const safeIncome = Number.isFinite(income) && income > 0 ? income : 0;
  const breakdown = [];
  let total = 0;
  let marginalRate = 0;

  for (const band of bands) {
    const upper = band.to === null || band.to === undefined ? Infinity : band.to;
    // Full precision throughout — rounding happens at the presentation layer only (spec §10).
    const amountInBand = Math.max(0, Math.min(safeIncome, upper) - band.from);
    const tax = amountInBand * band.rate;

    if (amountInBand > 0) {
      total += tax;
      // The last band that actually received income sets the marginal rate. This is the rate on
      // the next pound earned, and it is NOT the effective rate — conflating them is the single
      // most common misunderstanding this calculator has to avoid (spec §12).
      marginalRate = band.rate;
    }

    breakdown.push({
      id: band.id ?? '',
      name: band.name ?? '',
      rate: band.rate,
      from: band.from,
      to: band.to ?? null,
      amountInBand,
      tax,
    });
  }

  return { total, breakdown, marginalRate };
}

/**
 * Flat-rate tax on income above a threshold — UK student loans, and several US states.
 * Expressed separately because it is not a band schedule and pretending otherwise obscures it.
 *
 * @returns {{ total: number, applicableIncome: number }}
 */
export function calculateThresholdTax(income, threshold, rate) {
  const applicableIncome = Math.max(0, (Number.isFinite(income) ? income : 0) - threshold);
  return { total: applicableIncome * rate, applicableIncome };
}

/**
 * Allowance that tapers away above an income threshold — the UK Personal Allowance, and the
 * same shape as several US state exemption phase-outs.
 *
 * The UK case: 1 lost for every 2 above 100,000, so the 12,570 allowance is gone by 125,140.
 * That creates a ~60% effective marginal band which users notice and ask about, so the taper
 * has to be modelled rather than approximated.
 */
export function calculateTaperedAllowance(income, { amount, taper }) {
  if (!taper || income <= taper.thresholdIncome) {
    return { allowance: amount, reducedBy: 0, isTapered: false };
  }

  const excess = income - taper.thresholdIncome;
  const reduction = Math.min(amount, excess * taper.reducedByPerPoundOver);

  return {
    allowance: Math.max(0, amount - reduction),
    reducedBy: reduction,
    isTapered: true,
  };
}
