// Compact inline-SVG payoff curve. Deliberately not the canvas chart used by the loan cluster:
// an SVG with a fixed viewBox has no layout shift, needs no resize observer or teardown, and
// renders in the static HTML so the shape of the minimum-payment trap is visible without JS.

const VIEW_W = 640;
const VIEW_H = 260;
const PAD_L = 58;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 34;

const PLOT_W = VIEW_W - PAD_L - PAD_R;
const PLOT_H = VIEW_H - PAD_T - PAD_B;

function balanceSeries(schedule, startBalance) {
  return [startBalance, ...schedule.map((row) => row.balance)];
}

function toPoints(series, maxMonths, maxBalance) {
  if (!series.length || maxMonths <= 0 || maxBalance <= 0) {
    return '';
  }
  return series
    .map((balance, month) => {
      const x = PAD_L + (month / maxMonths) * PLOT_W;
      const y = PAD_T + PLOT_H - (balance / maxBalance) * PLOT_H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function niceCeiling(value) {
  if (value <= 0) {
    return 1;
  }
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function money(value) {
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`;
  }
  return `$${Math.round(value)}`;
}

function monthLabel(month) {
  const years = month / 12;
  return years >= 1 ? `${Math.round(years)}y` : `${month}m`;
}

/**
 * Renders both payoff curves into the chart's SVG. Returns false when there is nothing to draw.
 */
export function renderPayoffChart(root, { minimum, fixed, startBalance }) {
  if (!root) {
    return false;
  }

  const minSeries = balanceSeries(minimum?.schedule || [], startBalance);
  const fixedSeries = fixed && !fixed.error ? balanceSeries(fixed.schedule, startBalance) : [];

  const maxMonths = Math.max(minSeries.length - 1, fixedSeries.length - 1, 1);
  const maxBalance = niceCeiling(startBalance);

  const minPath = root.querySelector('[data-chart-series="minimum"]');
  const fixedPath = root.querySelector('[data-chart-series="fixed"]');
  if (minPath) {
    minPath.setAttribute('points', toPoints(minSeries, maxMonths, maxBalance));
  }
  if (fixedPath) {
    fixedPath.setAttribute('points', toPoints(fixedSeries, maxMonths, maxBalance));
  }

  const yTop = root.querySelector('[data-chart-label="y-top"]');
  const yMid = root.querySelector('[data-chart-label="y-mid"]');
  const xEnd = root.querySelector('[data-chart-label="x-end"]');
  const xMid = root.querySelector('[data-chart-label="x-mid"]');
  if (yTop) {
    yTop.textContent = money(maxBalance);
  }
  if (yMid) {
    yMid.textContent = money(maxBalance / 2);
  }
  if (xEnd) {
    xEnd.textContent = monthLabel(maxMonths);
  }
  if (xMid) {
    xMid.textContent = monthLabel(Math.round(maxMonths / 2));
  }

  const caption = root.querySelector('[data-chart-caption]');
  if (caption) {
    caption.textContent = fixedSeries.length
      ? `Minimum-only clears the balance in ${minSeries.length - 1} months. Doubling the payment clears it in ${fixedSeries.length - 1}.`
      : `Minimum-only clears the balance in ${minSeries.length - 1} months.`;
  }

  return true;
}

export const CHART_GEOMETRY = { VIEW_W, VIEW_H, PAD_L, PAD_R, PAD_T, PAD_B, PLOT_W, PLOT_H };
