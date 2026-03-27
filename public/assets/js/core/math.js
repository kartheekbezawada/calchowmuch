export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    return null;
  }
  return a / b;
}

export function percentageChange(fromValue, toValue) {
  if (fromValue === 0) {
    return null;
  }

  return ((toValue - fromValue) / fromValue) * 100;
}

export function percentOf(percent, value) {
  return (percent / 100) * value;
}

export function calculatePercentageOfNumber(percentValue, baseValue) {
  const x = Number(percentValue);
  const y = Number(baseValue);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }
  const result = (x / 100) * y;
  return {
    percent: x,
    number: y,
    result,
    formula: '(X ÷ 100) × Y',
  };
}

export function calculatePercentageDifference(valueA, valueB) {
  const a = Number(valueA);
  const b = Number(valueB);

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return null;
  }

  const absoluteDifference = Math.abs(a - b);
  const averageBaseline = (Math.abs(a) + Math.abs(b)) / 2;
  if (averageBaseline === 0) {
    return null;
  }

  const percentDifference = (absoluteDifference / averageBaseline) * 100;
  if (!Number.isFinite(percentDifference)) {
    return null;
  }

  return {
    valueA: a,
    valueB: b,
    absoluteDifference,
    averageBaseline,
    percentDifference,
    formula: 'Percent Difference = (|A - B| / ((|A| + |B|) / 2)) x 100',
  };
}

export function calculateMargin({ mode = 'cost-price', cost, price, marginPercent } = {}) {
  const c = Number(cost);
  if (!Number.isFinite(c) || c < 0) {
    return null;
  }

  if (mode === 'cost-price') {
    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) {
      return null;
    }
    const profit = p - c;
    const g = (profit / p) * 100;
    return {
      mode,
      cost: c,
      price: p,
      profit,
      marginPercent: g,
      formula: 'Gross Margin % = ((P - C) / P) x 100',
    };
  }

  if (mode === 'cost-margin') {
    const g = Number(marginPercent);
    if (!Number.isFinite(g) || g < 0 || g >= 99.99) {
      return null;
    }
    const denominator = 1 - g / 100;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      return null;
    }
    const p = c / denominator;
    if (!Number.isFinite(p)) {
      return null;
    }
    return {
      mode,
      cost: c,
      price: p,
      profit: p - c,
      marginPercent: g,
      formula: 'Selling Price (P) = C / (1 - G/100)',
    };
  }

  return null;
}

export function calculateCommission({ sales, mode = 'flat', rate = 0, tiers = [] }) {
  const salesValue = Number(sales);
  if (!Number.isFinite(salesValue) || salesValue < 0) {
    return null;
  }

  if (mode === 'flat') {
    const rateValue = Number(rate);
    if (!Number.isFinite(rateValue) || rateValue < 0) {
      return null;
    }
    const totalCommission = (salesValue * rateValue) / 100;
    const effectiveRate = salesValue === 0 ? 0 : (totalCommission / salesValue) * 100;
    return {
      mode: 'flat',
      sales: salesValue,
      totalCommission,
      effectiveRate,
      formula: 'Commission = Sales × (Rate / 100)',
      breakdown: [],
    };
  }

  if (mode !== 'tiered' || !Array.isArray(tiers) || tiers.length === 0) {
    return null;
  }

  const normalized = [];
  let previousUpper = 0;

  for (let i = 0; i < tiers.length; i += 1) {
    const tier = tiers[i] ?? {};
    const rateValue = Number(tier.rate);
    const hasUpper = tier.upTo !== null && tier.upTo !== undefined && String(tier.upTo) !== '';
    const upperValue = hasUpper ? Number(tier.upTo) : null;

    if (!Number.isFinite(rateValue) || rateValue < 0) {
      return null;
    }

    if (hasUpper) {
      if (!Number.isFinite(upperValue) || upperValue <= previousUpper) {
        return null;
      }
      previousUpper = upperValue;
    }

    normalized.push({
      upTo: hasUpper ? upperValue : null,
      rate: rateValue,
    });
  }

  const breakdown = [];
  let totalCommission = 0;
  let lowerBound = 0;

  for (let i = 0; i < normalized.length; i += 1) {
    const tier = normalized[i];
    const upperBound = tier.upTo === null ? Infinity : tier.upTo;
    const tierCapacity = upperBound - lowerBound;
    const tierSales = Math.max(0, Math.min(salesValue - lowerBound, tierCapacity));
    const tierCommission = (tierSales * tier.rate) / 100;

    breakdown.push({
      index: i + 1,
      from: lowerBound,
      to: Number.isFinite(upperBound) ? upperBound : null,
      sales: tierSales,
      rate: tier.rate,
      commission: tierCommission,
    });

    totalCommission += tierCommission;

    if (!Number.isFinite(upperBound) || salesValue <= upperBound) {
      lowerBound = upperBound;
      break;
    }

    lowerBound = upperBound;
  }

  if (salesValue > lowerBound && Number.isFinite(lowerBound)) {
    const fallbackRate = normalized[normalized.length - 1].rate;
    const remainingSales = salesValue - lowerBound;
    const extraCommission = (remainingSales * fallbackRate) / 100;
    breakdown.push({
      index: breakdown.length + 1,
      from: lowerBound,
      to: null,
      sales: remainingSales,
      rate: fallbackRate,
      commission: extraCommission,
    });
    totalCommission += extraCommission;
  }

  const effectiveRate = salesValue === 0 ? 0 : (totalCommission / salesValue) * 100;

  return {
    mode: 'tiered',
    sales: salesValue,
    totalCommission,
    effectiveRate,
    formula: 'Total Commission = Sum(Tier Sales × Tier Rate / 100)',
    breakdown,
  };
}

export function calculateMarkupFromCost(cost, markupPercent) {
  const c = Number(cost);
  const m = Number(markupPercent);
  if (!Number.isFinite(c) || !Number.isFinite(m)) {
    return null;
  }
  const markupAmount = c * (m / 100);
  const price = c + markupAmount;
  return { cost: c, markupAmount, price, markupPercent: m };
}

export function calculateMarkupFromPrice(cost, price) {
  const c = Number(cost);
  const p = Number(price);
  if (!Number.isFinite(c) || !Number.isFinite(p)) {
    return null;
  }
  const markupAmount = p - c;
  const markupPercent = c === 0 ? null : (markupAmount / c) * 100;
  return { cost: c, markupAmount, price: p, markupPercent };
}

export function calculatePercentageDecrease(originalValue, newValue) {
  const x = Number(originalValue);
  const y = Number(newValue);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }
  if (x === 0) {
    return null;
  }
  const decreaseAmount = x - y;
  const percentDecrease = (decreaseAmount / x) * 100;
  return { originalValue: x, newValue: y, decreaseAmount, percentDecrease };
}

export function calculateReversePercentage(percentage, finalValue) {
  const x = Number(percentage);
  const y = Number(finalValue);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }
  if (x === 0) {
    return null;
  }
  const original = (y * 100) / x;
  return { percentage: x, finalValue: y, original };
}

export function calculateWhatPercentIsXOfY(part, whole) {
  const x = Number(part);
  const y = Number(whole);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }
  if (y === 0) {
    return null;
  }
  const percent = (x / y) * 100;
  return { part: x, whole: y, percent };
}

function gcdInt(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const r = x % y;
    x = y;
    y = r;
  }
  return x || 1;
}

export function calculatePercentToFractionDecimal(rawPercent) {
  const raw = String(rawPercent ?? '').trim();
  if (!raw) {
    return null;
  }

  const sanitized = raw.replace(/,/g, '').replace(/%$/, '').trim();
  if (!/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(sanitized)) {
    return null;
  }

  const numericPercent = Number(sanitized);
  if (!Number.isFinite(numericPercent)) {
    return null;
  }

  const sign = sanitized.startsWith('-') ? -1 : 1;
  const unsigned = sanitized.replace(/^[-+]/, '');
  const [wholePart, fractionalPartRaw = ''] = unsigned.split('.');
  const fractionalPart = fractionalPartRaw.replace(/0+$/, '');
  const decimals = fractionalPart.length;

  const wholeDigits = wholePart === '' ? '0' : wholePart;
  const combinedDigits = `${wholeDigits}${fractionalPart}`.replace(/^0+(?=\d)/, '') || '0';
  let numeratorOverOne = sign * Number.parseInt(combinedDigits, 10);
  let denominatorOverOne = decimals > 0 ? 10 ** decimals : 1;

  const reducedRaw = gcdInt(numeratorOverOne, denominatorOverOne);
  numeratorOverOne /= reducedRaw;
  denominatorOverOne /= reducedRaw;

  let numerator = numeratorOverOne;
  let denominator = denominatorOverOne * 100;
  const reducedFinal = gcdInt(numerator, denominator);
  numerator /= reducedFinal;
  denominator /= reducedFinal;

  const absNumerator = Math.abs(numerator);
  const whole = Math.trunc(absNumerator / denominator);
  const remainder = absNumerator % denominator;

  let mixedNumber = null;
  if (whole > 0 && remainder > 0) {
    const signedWhole = numerator < 0 ? -whole : whole;
    mixedNumber = `${signedWhole} ${remainder}/${denominator}`;
  }

  return {
    percent: numericPercent,
    decimal: numericPercent / 100,
    fraction: `${numerator}/${denominator}`,
    mixedNumber,
    steps: [
      `Write percent over 100: ${numericPercent}% = ${numericPercent}/100`,
      `Convert percent to decimal: ${numericPercent} / 100 = ${numericPercent / 100}`,
      `Simplify ${numerator}/${denominator} using GCD.`,
    ],
  };
}

export function calculatePercentageComposition(items, knownTotal = null) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const parsed = [];
  let sumItems = 0;

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i] ?? {};
    const value = Number(item.value);
    if (!Number.isFinite(value)) {
      return null;
    }
    parsed.push({ name: item.name || `Item ${i + 1}`, value });
    sumItems += value;
  }

  const useKnownTotal = knownTotal !== null && knownTotal !== undefined;
  const total = useKnownTotal ? Number(knownTotal) : sumItems;

  if (!Number.isFinite(total) || total === 0) {
    return null;
  }

  const computed = parsed.map((item, i) => ({
    index: i + 1,
    name: item.name,
    value: item.value,
    percent: (item.value / total) * 100,
  }));

  const remainingValue = useKnownTotal ? total - sumItems : 0;
  const remainderPercent = useKnownTotal ? (remainingValue / total) * 100 : 0;
  const totalPercent = computed.reduce((acc, r) => acc + r.percent, 0) + remainderPercent;

  return {
    items: computed,
    sumItems,
    total,
    useKnownTotal,
    remainingValue,
    remainderPercent,
    totalPercent,
  };
}

export function calculateBasketMarkup(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  const computed = [];
  let totalCost = 0;
  let totalPrice = 0;
  let totalQuantity = 0;

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] ?? {};
    const c = Number(row.cost);
    const q = Number(row.quantity ?? 1);
    if (!Number.isFinite(c) || !Number.isFinite(q) || q <= 0) {
      return null;
    }

    let p;
    let markupPercent;

    if (row.mode === 'cost-to-price') {
      const m = Number(row.markupPercent);
      if (!Number.isFinite(m)) {
        return null;
      }
      p = c * (1 + m / 100);
      markupPercent = m;
    } else {
      p = Number(row.price);
      if (!Number.isFinite(p)) {
        return null;
      }
      markupPercent = c === 0 ? null : ((p - c) / c) * 100;
    }

    const markupAmount = p - c;
    const rowTotalCost = c * q;
    const rowTotalPrice = p * q;

    computed.push({
      index: i + 1,
      name: row.name || `Product ${i + 1}`,
      cost: c,
      price: p,
      quantity: q,
      markupAmount,
      markupPercent,
      rowTotalCost,
      rowTotalPrice,
      rowTotalMarkup: rowTotalPrice - rowTotalCost,
    });

    totalCost += rowTotalCost;
    totalPrice += rowTotalPrice;
    totalQuantity += q;
  }

  const totalMarkup = totalPrice - totalCost;
  const basketMarkupPercent = totalCost === 0 ? null : (totalMarkup / totalCost) * 100;

  return {
    rows: computed,
    totalQuantity,
    totalCost,
    totalPrice,
    totalMarkup,
    basketMarkupPercent,
  };
}
