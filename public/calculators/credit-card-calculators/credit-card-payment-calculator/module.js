import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateCreditCardPayoff } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-payoff-balance');
const aprInput = document.querySelector('#cc-payoff-apr');
const paymentInput = document.querySelector('#cc-payoff-payment');
const extraInput = document.querySelector('#cc-payoff-extra');
const calculateButton = document.querySelector('#cc-payoff-calc');

const placeholder = document.querySelector('#cc-payoff-placeholder');
const errorMessage = document.querySelector('#cc-payoff-error');
const resultsList = document.querySelector('#cc-payoff-results-list');
const tableBody = document.querySelector('#cc-payoff-table-body');

const explanationSpans = Array.from(document.querySelectorAll('[data-cc-payoff]')).reduce(
  (acc, el) => {
    const key = el.dataset.ccPayoff;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(el);
    return acc;
  },
  {}
);

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a credit card payoff calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A credit card payoff calculator estimates how long it will take to pay off a credit card balance with a fixed monthly payment. It shows total interest paid, total amount paid, and a year-by-year breakdown of your payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is credit card interest calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Credit card interest is typically calculated monthly. Your APR is divided by 12 to get the monthly rate. Each month, interest is charged on the remaining balance, so paying more reduces the balance faster and saves on interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long will it take to pay off my credit card?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The payoff time depends on your balance, APR, and monthly payment amount. This calculator computes the exact number of months by simulating each monthly payment and interest charge until the balance reaches zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I only make the minimum payment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Making only the minimum payment significantly extends your payoff time and increases total interest paid. Minimum payments typically start as a small percentage of your balance and decrease as the balance drops, which can result in decades of payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does an extra payment reduce my payoff time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Extra payments go directly toward reducing your principal balance. Even a small extra amount each month reduces the balance faster, which means less interest accrues in subsequent months, creating a compounding savings effect.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is APR and how does it affect my balance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'APR (Annual Percentage Rate) is the yearly interest rate charged on your outstanding balance. A higher APR means more interest each month, which slows down payoff and increases total cost. Even a small APR difference can add up to hundreds of dollars over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I pay off my credit card faster with biweekly payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This calculator uses monthly payments. Biweekly payments effectively add one extra monthly payment per year, which can shorten payoff time. To estimate biweekly savings, divide your monthly payment by two and multiply by 26, then divide by 12 to get the equivalent monthly amount.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my APR changes during repayment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This calculator assumes a fixed APR for the entire repayment period. If your APR changes due to a variable rate or promotional period ending, you can recalculate with the new rate to see the updated payoff timeline.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator account for new purchases?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This calculator assumes no new purchases are added to the balance during repayment. Adding new charges increases your balance and extends the payoff time beyond what is shown here.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is this credit card payoff estimate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This estimate is accurate for fixed payments on a static balance with a constant APR. Real-world results may vary if your APR changes, you make additional purchases, or you miss payments. Use it as a planning tool to understand the impact of your payment amount.',
      },
    },
  ],
};

const metadata = {
  title: 'Credit Card Payment Calculator | Payoff & Interest',
  description:
    'Estimate credit card payoff time, monthly payment impact, total interest, and total repaid from your balance, APR, and payment plan.',
  canonical: 'https://calchowmuch.com/credit-card-calculators/credit-card-payment-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Credit Card Payment Calculator | Payoff & Interest',
        url: 'https://calchowmuch.com/credit-card-calculators/credit-card-payment-calculator/',
        description:
          'Estimate credit card payoff time, monthly payment impact, total interest, and total repaid from your balance, APR, and payment plan.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Credit Card Payment Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        url: 'https://calchowmuch.com/credit-card-calculators/credit-card-payment-calculator/',
        description:
          'Estimate payoff time, total interest, and total repaid from your credit card balance, APR, and payment plan.',
        browserRequirements: 'Requires JavaScript enabled',
        softwareVersion: '1.0',
        creator: {
          '@type': 'Organization',
          name: 'CalcHowMuch',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://calchowmuch.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Credit Card Calculators',
            item: 'https://calchowmuch.com/credit-card-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Credit Card Payment Calculator',
            item: 'https://calchowmuch.com/credit-card-calculators/credit-card-payment-calculator/',
          },
        ],
      },
    ],
  },
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
};

setPageMetadata(metadata);

let hasCalculated = false;

function setSpan(key, value) {
  const nodes = explanationSpans[key] || [];
  nodes.forEach((node) => {
    node.textContent = value;
  });
}

function resetIfCalculated() {
  if (hasCalculated) {
    showProjectionResults();
  }
}

function showProjectionResults() {
  clearError();
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.remove('is-hidden');
}

function clearError() {
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.classList.add('is-hidden');
  }
}

function showError(message) {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = message;
  errorMessage.classList.remove('is-hidden');
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
  if (tableBody) {
    tableBody.innerHTML = '';
  }
}

function addResultLine(text) {
  if (!resultsList) {
    return;
  }
  const line = document.createElement('div');
  line.className = 'result-line';
  line.textContent = text;
  resultsList.appendChild(line);
}

function updateTable(yearly) {
  if (!tableBody) {
    return;
  }
  tableBody.innerHTML = yearly
    .map(
      (row) => `
        <tr>
          <td>${row.year}</td>
          <td>${formatNumber(row.payment)}</td>
          <td>${formatNumber(row.interest)}</td>
          <td>${formatNumber(row.balance)}</td>
        </tr>
      `
    )
    .join('');
}

function updateExplanation(data) {
  setSpan('balance', formatNumber(data.balance));
  setSpan('apr', formatPercent(data.apr));
  setSpan('payment', formatNumber(data.monthlyPayment));
  setSpan('extra', formatNumber(data.extraPayment));
  setSpan('months', formatNumber(data.months, { maximumFractionDigits: 0 }));
  setSpan('interest', formatNumber(data.totalInterest));
  setSpan('total', formatNumber(data.totalPayment));
}

function calculate() {
  const balance = Number(balanceInput?.value);
  const apr = Number(aprInput?.value);
  const monthlyPayment = Number(paymentInput?.value);
  const extraPayment = Number(extraInput?.value);

  const data = calculateCreditCardPayoff({
    balance,
    apr,
    monthlyPayment,
    extraPayment,
  });

  if (data.error) {
    showError(data.error);
    return;
  }

  if (resultsList) {
    resultsList.innerHTML = '';
  }

  addResultLine(`Current Balance: ${formatNumber(balance)}`);
  addResultLine(`APR: ${formatPercent(apr)}`);
  addResultLine(`Monthly Payment: ${formatNumber(monthlyPayment)}`);
  addResultLine(`Extra Monthly: ${formatNumber(extraPayment)}`);
  addResultLine(
    `Estimated Payoff Time: ${formatNumber(data.months, { maximumFractionDigits: 0 })} months`
  );
  addResultLine(`Total Interest: ${formatNumber(data.totalInterest)}`);
  addResultLine(`Total Paid: ${formatNumber(data.totalPayment)}`);

  showProjectionResults();

  updateTable(data.yearly);
  updateExplanation({ ...data, balance, apr, extraPayment });
  renderPayoffChart(data.yearly);
}

// ─── Payoff Progress Chart ────────────────────────────────────────────────────

const chartSection  = document.querySelector('#cc-payoff-chart-section');
const chartCanvas   = document.querySelector('#cc-payoff-chart');
const chartTooltip  = document.querySelector('#cc-payoff-chart-tooltip');
const chartWrap     = document.querySelector('#cc-payoff-chart-wrap');

/** Abbreviate dollar values for Y-axis labels */
function fmtAxis(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(v >= 10_000 ? 0 : 1)}k`;
  return `$${Math.round(v)}`;
}

/** Full dollar amount for tooltip */
function fmtFull(v) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(v);
}

/** Store last data for redraws on resize */
let _lastYearly = null;

function renderPayoffChart(yearly) {
  if (!chartCanvas || !yearly || yearly.length === 0) return;
  _lastYearly = yearly;

  // Show the section
  if (chartSection) chartSection.classList.remove('is-hidden');

  _drawPayoffChart(yearly);

  // Hover events
  chartCanvas.onmousemove = (e) => _onChartHover(e, yearly);
  chartCanvas.onmouseleave = _hideTooltip;
  chartCanvas.ontouchend = _hideTooltip;
}

function _drawPayoffChart(yearly) {
  const canvas = chartCanvas;
  if (!canvas) return;

  const dpr  = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const W    = Math.max(rect.width,  1);
  const H    = Math.max(rect.height, 1);

  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // ── Layout margins ──────────────────────────────────────────────────────────
  const pad = { top: 22, right: 22, bottom: 58, left: 68 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  // ── Colour tokens (matching the dark premium theme) ──────────────────────────
  const CLR = {
    grid:          'rgba(148, 163, 184, 0.13)',
    axis:          'rgba(148, 163, 184, 0.44)',
    label:         'rgba(148, 163, 184, 0.82)',
    axisTitle:     'rgba(148, 163, 184, 0.68)',
    payments:      ['rgba(59,130,246,0.95)',  'rgba(37,99,235,0.72)'],
    interest:      ['rgba(249,115,22,0.95)',  'rgba(234,88,12,0.72)'],
    balanceLine:   '#22d3ee',
    balanceFill:   'rgba(34,211,238,0.10)',
    balanceDotOut: '#22d3ee',
    balanceDotIn:  '#081425',
    activeColBg:   'rgba(255,255,255,0.04)',
  };

  // ── Y-axis range ─────────────────────────────────────────────────────────────
  const allVals = yearly.flatMap((r) => [r.payment, r.interest, r.balance]);
  const rawMax  = Math.max(...allVals);
  const yMax    = rawMax * 1.14;               // 14 % head-room

  // ── Coordinate helpers ───────────────────────────────────────────────────────
  const n        = yearly.length;
  const groupW   = plotW / n;
  const barW     = Math.min(groupW * 0.30, 26);
  const barGap   = Math.min(groupW * 0.05,  4);

  const toY      = (v) => pad.top + plotH - (v / yMax) * plotH;
  const xCenter  = (i) => pad.left + (i + 0.5) * groupW;
  const baseY    = pad.top + plotH;             // bottom of plot area

  // ── Clear ──────────────────────────────────────────────────────────────────
  ctx.clearRect(0, 0, W, H);

  // ── Grid lines & Y-axis ticks ──────────────────────────────────────────────
  const GRID_N = 5;
  const baseFontSize = W > 460 ? 11 : 10;
  ctx.font          = `${baseFontSize}px system-ui,sans-serif`;
  ctx.textBaseline  = 'middle';
  ctx.textAlign     = 'right';

  for (let g = 0; g <= GRID_N; g++) {
    const val = (yMax / GRID_N) * (GRID_N - g);
    const y   = pad.top + (plotH / GRID_N) * g;

    // dashed grid line
    ctx.beginPath();
    ctx.strokeStyle = CLR.grid;
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 5]);
    ctx.moveTo(pad.left,       y);
    ctx.lineTo(W - pad.right,  y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Y tick label
    ctx.fillStyle = CLR.label;
    ctx.fillText(fmtAxis(val), pad.left - 7, y);
  }

  // ── Axes ──────────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.strokeStyle = CLR.axis;
  ctx.lineWidth   = 1.2;
  ctx.moveTo(pad.left,       pad.top);
  ctx.lineTo(pad.left,       baseY);
  ctx.lineTo(W - pad.right,  baseY);
  ctx.stroke();

  // ── Balance area fill ─────────────────────────────────────────────────────
  const balGrad = ctx.createLinearGradient(0, pad.top, 0, baseY);
  balGrad.addColorStop(0,   CLR.balanceFill);
  balGrad.addColorStop(1,   'rgba(34,211,238,0.01)');

  ctx.beginPath();
  ctx.moveTo(xCenter(0), toY(yearly[0].balance));
  for (let i = 1; i < n; i++) ctx.lineTo(xCenter(i), toY(yearly[i].balance));
  ctx.lineTo(xCenter(n - 1), baseY);
  ctx.lineTo(xCenter(0),     baseY);
  ctx.closePath();
  ctx.fillStyle = balGrad;
  ctx.fill();

  // ── Balance line ──────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.strokeStyle = CLR.balanceLine;
  ctx.lineWidth   = 2.5;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  for (let i = 0; i < n; i++) {
    const x = xCenter(i);
    const y = toY(yearly[i].balance);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // ── Balance dots ─────────────────────────────────────────────────────────
  for (let i = 0; i < n; i++) {
    const x = xCenter(i);
    const y = toY(yearly[i].balance);
    // outer glow ring
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(34,211,238,0.22)';
    ctx.fill();
    // filled dot
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = CLR.balanceDotOut;
    ctx.fill();
    // inner dark core
    ctx.beginPath();
    ctx.arc(x, y, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = CLR.balanceDotIn;
    ctx.fill();
  }

  // ── Grouped bars ─────────────────────────────────────────────────────────
  for (let i = 0; i < n; i++) {
    const cx      = xCenter(i);
    const leftBar = cx - barGap / 2 - barW;  // Payments bar left edge
    const rightBar = cx + barGap / 2;         // Interest bar left edge

    // Payments
    const pyTop = toY(yearly[i].payment);
    const pyH   = baseY - pyTop;
    if (pyH > 0.5) {
      const g = ctx.createLinearGradient(0, pyTop, 0, baseY);
      g.addColorStop(0, CLR.payments[0]);
      g.addColorStop(1, CLR.payments[1]);
      ctx.fillStyle = g;
      ctx.beginPath();
      const rp = Math.min(4, pyH / 2, barW / 2);
      ctx.roundRect(leftBar, pyTop, barW, pyH, [rp, rp, 0, 0]);
      ctx.fill();
    }

    // Interest
    const iyTop = toY(yearly[i].interest);
    const iyH   = baseY - iyTop;
    if (iyH > 0.5) {
      const g = ctx.createLinearGradient(0, iyTop, 0, baseY);
      g.addColorStop(0, CLR.interest[0]);
      g.addColorStop(1, CLR.interest[1]);
      ctx.fillStyle = g;
      ctx.beginPath();
      const ri = Math.min(4, iyH / 2, barW / 2);
      ctx.roundRect(rightBar, iyTop, barW, iyH, [ri, ri, 0, 0]);
      ctx.fill();
    }
  }

  // ── X-axis labels ─────────────────────────────────────────────────────────
  ctx.fillStyle    = CLR.label;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';
  ctx.font         = `${baseFontSize}px system-ui,sans-serif`;

  // Skip labels if too crowded (show every Nth)
  const skipEvery = n > 20 ? 3 : n > 12 ? 2 : 1;
  for (let i = 0; i < n; i++) {
    if (i % skipEvery !== 0 && i !== n - 1) continue;
    const label = `Yr ${yearly[i].year}`;
    ctx.fillText(label, xCenter(i), baseY + 9);
  }

  // ── Axis titles ───────────────────────────────────────────────────────────
  ctx.fillStyle    = CLR.axisTitle;
  ctx.font         = `${baseFontSize}px system-ui,sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Year', pad.left + plotW / 2, H - 7);

  ctx.save();
  ctx.translate(13, pad.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Amount ($)', 0, 0);
  ctx.restore();

  // ── Store hit-test metadata ───────────────────────────────────────────────
  canvas._chartMeta = { xCenter, groupW, n, pad, plotW };
}

function _onChartHover(event, yearly) {
  const canvas = chartCanvas;
  if (!canvas || !canvas._chartMeta) return;

  const rect  = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;

  const { xCenter, groupW, n, pad } = canvas._chartMeta;

  // Find the closest year column
  let best = -1, bestDist = Infinity;
  for (let i = 0; i < n; i++) {
    const cx   = xCenter(i);
    const dist = Math.abs(mouseX - cx);
    if (dist < groupW / 2 && dist < bestDist) {
      best = i;
      bestDist = dist;
    }
  }

  if (best === -1) { _hideTooltip(); return; }

  const row = yearly[best];

  // Build tooltip
  if (!chartTooltip) return;
  chartTooltip.innerHTML = `
    <div class="chart-tooltip-title">Year ${row.year}</div>
    <div class="chart-tooltip-row">
      <span class="ct-dot ct-dot-payments"></span>
      <span class="ct-label">Payments</span>
      <span class="ct-value">${fmtFull(row.payment)}</span>
    </div>
    <div class="chart-tooltip-row">
      <span class="ct-dot ct-dot-interest"></span>
      <span class="ct-label">Interest</span>
      <span class="ct-value">${fmtFull(row.interest)}</span>
    </div>
    <div class="chart-tooltip-row">
      <span class="ct-dot ct-dot-balance"></span>
      <span class="ct-label">Balance</span>
      <span class="ct-value">${fmtFull(row.balance)}</span>
    </div>
  `;

  // Position relative to the chart wrapper
  const wrapRect    = chartWrap ? chartWrap.getBoundingClientRect() : rect;
  const tipX        = event.clientX - wrapRect.left;
  const tipY        = event.clientY - wrapRect.top;
  const tipW        = chartTooltip.offsetWidth  || 200;
  const tipH        = chartTooltip.offsetHeight || 120;
  const maxLeft     = wrapRect.width  - tipW - 8;
  const maxTop      = wrapRect.height - tipH - 8;

  chartTooltip.style.left = `${Math.max(8, Math.min(tipX + 14, maxLeft))}px`;
  chartTooltip.style.top  = `${Math.max(8, Math.min(tipY - tipH / 2, maxTop))}px`;
  chartTooltip.classList.remove('is-hidden');
}

function _hideTooltip() {
  if (chartTooltip) chartTooltip.classList.add('is-hidden');
}

// Re-draw chart on window resize to keep it sharp and responsive
let _resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    if (_lastYearly) _drawPayoffChart(_lastYearly);
  }, 120);
});

// ─── Event listeners ─────────────────────────────────────────────────────────

calculateButton?.addEventListener('click', () => {
  hasCalculated = true;
  calculate();
});

const inputs = document.querySelectorAll('#calc-cc-payoff input');
inputs.forEach((input) => {
  input.addEventListener('input', () => resetIfCalculated());
});

// Pre-fill explanation and projection values on page load
(function prefillExplanation() {
  calculate();
})();
