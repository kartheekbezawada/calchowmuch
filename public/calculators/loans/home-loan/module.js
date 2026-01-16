import { formatCurrency, formatNumber, formatPercent } from "/assets/js/core/format.js";
import { setupButtonGroup } from "/assets/js/core/ui.js";

const priceInput = document.querySelector("#mtg-price");
const downAmountInput = document.querySelector("#mtg-down-amount");
const downPercentInput = document.querySelector("#mtg-down-percent");
const downAmountRow = document.querySelector("#mtg-down-amount-row");
const downPercentRow = document.querySelector("#mtg-down-percent-row");
const termInput = document.querySelector("#mtg-term");
const rateInput = document.querySelector("#mtg-rate");
const taxInput = document.querySelector("#mtg-tax");
const insuranceInput = document.querySelector("#mtg-insurance");
const startInput = document.querySelector("#mtg-start");
const extraInput = document.querySelector("#mtg-extra");
const lumpInput = document.querySelector("#mtg-lump");
const lumpMonthInput = document.querySelector("#mtg-lump-month");
const calculateButton = document.querySelector("#mtg-calculate");
const resultDiv = document.querySelector("#mtg-result");
const summaryDiv = document.querySelector("#mtg-summary");

const downTypeGroup = document.querySelector('[data-button-group="mtg-down-type"]');
const viewGroup = document.querySelector('[data-button-group="mtg-view"]');

const explanationRoot = document.querySelector("#loan-mtg-explanation");
const priceValue = explanationRoot?.querySelector('[data-mtg="price"]');
const downPaymentValue = explanationRoot?.querySelector('[data-mtg="down-payment"]');
const downPercentValue = explanationRoot?.querySelector('[data-mtg="down-percent"]');
const loanAmountValue = explanationRoot?.querySelector('[data-mtg="loan-amount"]');
const rateValue = explanationRoot?.querySelector('[data-mtg="rate"]');
const termValue = explanationRoot?.querySelector('[data-mtg="term"]');
const extraMonthlyValue = explanationRoot?.querySelector('[data-mtg="extra-monthly"]');
const lumpSumValue = explanationRoot?.querySelector('[data-mtg="lump-sum"]');
const escrowValue = explanationRoot?.querySelector('[data-mtg="escrow"]');
const monthlySummary = explanationRoot?.querySelector('[data-mtg="monthly-summary"]');
const monthlyBreakdown = explanationRoot?.querySelector('[data-mtg="monthly-breakdown"]');
const yearlySummary = explanationRoot?.querySelector('[data-mtg="yearly-summary"]');
const lifetimeSummary = explanationRoot?.querySelector('[data-mtg="lifetime-summary"]');
const monthlySummaryBlock = explanationRoot?.querySelector('[data-mtg-view="monthly"]');
const yearlySummaryBlock = explanationRoot?.querySelector('[data-mtg-view="yearly"]');

const lineBaseline = explanationRoot?.querySelector("#mtg-line-base");
const lineOver = explanationRoot?.querySelector("#mtg-line-over");
const graphTitle = explanationRoot?.querySelector("#mtg-graph-title");
const graphNote = explanationRoot?.querySelector("#mtg-graph-note");
const graphYMax = explanationRoot?.querySelector("#mtg-y-max");
const graphYMid = explanationRoot?.querySelector("#mtg-y-mid");
const graphXStart = explanationRoot?.querySelector("#mtg-x-start");
const graphXEnd = explanationRoot?.querySelector("#mtg-x-end");
const graphXLabel = explanationRoot?.querySelector("#mtg-x-label");

const tableTitle = explanationRoot?.querySelector("#mtg-table-title");
const monthlyTableBody = explanationRoot?.querySelector("#mtg-table-monthly-body");
const yearlyTableBody = explanationRoot?.querySelector("#mtg-table-yearly-body");
const monthlyTableWrap = explanationRoot?.querySelector("#mtg-table-monthly-wrap");
const yearlyTableWrap = explanationRoot?.querySelector("#mtg-table-yearly-wrap");

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const downTypeButtons = setupButtonGroup(downTypeGroup, {
  defaultValue: "amount",
  onChange: value => {
    setDownPaymentVisibility(value);
    calculate();
  },
});

const viewButtons = setupButtonGroup(viewGroup, {
  defaultValue: "monthly",
  onChange: () => updateView(),
});

let currentData = null;

function setDownPaymentVisibility(type) {
  if (downAmountRow) {
    downAmountRow.classList.toggle("is-hidden", type !== "amount");
  }
  if (downPercentRow) {
    downPercentRow.classList.toggle("is-hidden", type !== "percent");
  }
}

function parseStartDate(value) {
  if (!value) {
    return null;
  }
  const [yearPart, monthPart] = value.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null;
  }
  const date = new Date(year, month - 1, 1);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function formatMonthYear(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTerm(months) {
  const wholeMonths = Math.max(0, Math.round(months));
  const years = Math.floor(wholeMonths / 12);
  const remainingMonths = wholeMonths % 12;

  if (years === 0) {
    return `${remainingMonths} months`;
  }
  if (remainingMonths === 0) {
    return `${years} years`;
  }
  return `${years} years ${remainingMonths} months`;
}

function computeMonthlyPayment(principal, monthlyRate, months) {
  if (monthlyRate === 0) {
    return principal / months;
  }
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function buildSchedule({
  principal,
  monthlyRate,
  months,
  payment,
  extraMonthly,
  lumpSum,
  lumpSumMonth,
}) {
  const schedule = [];
  let balance = principal;
  let totalPayment = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalExtra = 0;
  let month = 0;
  const maxMonths = months + 1200;

  while (balance > 0 && month < maxMonths) {
    month += 1;
    const interest = balance * monthlyRate;
    let principalPayment = payment - interest;
    if (principalPayment < 0) {
      principalPayment = 0;
    }

    let extraPayment = extraMonthly > 0 ? extraMonthly : 0;
    if (lumpSum > 0 && lumpSumMonth && month === lumpSumMonth) {
      extraPayment += lumpSum;
    }

    let totalPrincipalPayment = principalPayment + extraPayment;
    if (totalPrincipalPayment > balance) {
      totalPrincipalPayment = balance;
      extraPayment = Math.max(0, totalPrincipalPayment - principalPayment);
    }

    const paymentTotal = interest + totalPrincipalPayment;
    balance -= totalPrincipalPayment;

    totalPayment += paymentTotal;
    totalInterest += interest;
    totalPrincipal += totalPrincipalPayment;
    totalExtra += extraPayment;

    schedule.push({
      month,
      payment: paymentTotal,
      principal: totalPrincipalPayment,
      interest,
      extra: extraPayment,
      balance: Math.max(0, balance),
    });
  }

  return {
    schedule,
    totalPayment,
    totalInterest,
    totalPrincipal,
    totalExtra,
    months: schedule.length,
  };
}

function aggregateYearly(schedule, startDate) {
  const yearlyMap = new Map();
  const order = [];

  schedule.forEach(entry => {
    const yearKey = startDate
      ? addMonths(startDate, entry.month - 1).getFullYear()
      : Math.ceil(entry.month / 12);
    if (!yearlyMap.has(yearKey)) {
      yearlyMap.set(yearKey, {
        year: yearKey,
        label: String(yearKey),
        payment: 0,
        principal: 0,
        interest: 0,
        extra: 0,
        balance: entry.balance,
      });
      order.push(yearKey);
    }
    const record = yearlyMap.get(yearKey);
    record.payment += entry.payment;
    record.principal += entry.principal;
    record.interest += entry.interest;
    record.extra += entry.extra;
    record.balance = entry.balance;
  });

  return order.map((yearKey, index) => {
    const record = yearlyMap.get(yearKey);
    const label = startDate ? String(yearKey) : String(index + 1);
    return { ...record, label, year: index + 1 };
  });
}

function sampleValues(values, maxPoints) {
  if (values.length <= maxPoints) {
    return values;
  }
  const step = Math.ceil(values.length / maxPoints);
  const sampled = [];
  for (let i = 0; i < values.length; i += step) {
    sampled.push(values[i]);
  }
  if (sampled[sampled.length - 1] !== values[values.length - 1]) {
    sampled.push(values[values.length - 1]);
  }
  return sampled;
}

function formatTableNumber(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAxisValue(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return formatNumber(value, { maximumFractionDigits: 0 });
}

function buildMonthlySeries(schedule, principal, totalMonths) {
  const series = new Array(totalMonths + 1).fill(0);
  series[0] = principal;
  schedule.forEach(entry => {
    if (entry.month <= totalMonths) {
      series[entry.month] = entry.balance;
    }
  });
  return series;
}

function buildYearlySeries(yearly, principal, totalYears) {
  const series = new Array(totalYears + 1).fill(0);
  series[0] = principal;
  yearly.forEach(entry => {
    if (entry.year <= totalYears) {
      series[entry.year] = entry.balance;
    }
  });
  return series;
}

function buildPolyline(values, maxBalance) {
  if (!values.length || maxBalance <= 0) {
    return "";
  }
  if (values.length === 1) {
    return `0,${100 - (values[0] / maxBalance) * 100}`;
  }
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - (value / maxBalance) * 100;
      const clampedY = Math.min(100, Math.max(0, y));
      return `${x.toFixed(2)},${clampedY.toFixed(2)}`;
    })
    .join(" ");
}

function getMonthLabel(month, startDate) {
  if (!startDate) {
    return String(month);
  }
  const date = addMonths(startDate, month - 1);
  return formatMonthYear(date);
}

function renderMonthlyTable(schedule, startDate) {
  if (!monthlyTableBody) {
    return;
  }
  monthlyTableBody.innerHTML = schedule
    .map(
      entry =>
        `<tr>
          <td>${getMonthLabel(entry.month, startDate)}</td>
          <td>${formatTableNumber(entry.payment)}</td>
          <td>${formatTableNumber(entry.principal)}</td>
          <td>${formatTableNumber(entry.interest)}</td>
          <td>${formatTableNumber(entry.extra)}</td>
          <td>${formatTableNumber(entry.balance)}</td>
        </tr>`,
    )
    .join("");
}

function renderYearlyTable(yearly) {
  if (!yearlyTableBody) {
    return;
  }
  yearlyTableBody.innerHTML = yearly
    .map(
      entry =>
        `<tr>
          <td>${entry.label}</td>
          <td>${formatTableNumber(entry.payment)}</td>
          <td>${formatTableNumber(entry.principal)}</td>
          <td>${formatTableNumber(entry.interest)}</td>
          <td>${formatTableNumber(entry.extra)}</td>
          <td>${formatTableNumber(entry.balance)}</td>
        </tr>`,
    )
    .join("");
}

function updateExplanation(data) {
  if (!explanationRoot || !data) {
    return;
  }

  if (priceValue) {
    priceValue.textContent = formatCurrency(data.price);
  }
  if (downPaymentValue) {
    downPaymentValue.textContent = formatCurrency(data.downAmount);
  }
  if (downPercentValue) {
    downPercentValue.textContent = formatPercent(data.downPercent);
  }
  if (loanAmountValue) {
    loanAmountValue.textContent = formatCurrency(data.principal);
  }
  if (rateValue) {
    rateValue.textContent = formatPercent(data.annualRate);
  }
  if (termValue) {
    termValue.textContent = `${formatNumber(data.years, {
      maximumFractionDigits: 2,
    })} years`;
  }
  if (extraMonthlyValue) {
    extraMonthlyValue.textContent =
      data.extraMonthly > 0 ? `${formatCurrency(data.extraMonthly)} per month` : "None";
  }
  if (lumpSumValue) {
    if (data.lumpSum > 0 && data.lumpSumMonth) {
      lumpSumValue.textContent = `${formatCurrency(data.lumpSum)} in month ${data.lumpSumMonth}`;
    } else if (data.lumpSum > 0) {
      lumpSumValue.textContent = formatCurrency(data.lumpSum);
    } else {
      lumpSumValue.textContent = "None";
    }
  }
  if (escrowValue) {
    escrowValue.textContent =
      data.escrowMonthly > 0
        ? `${formatCurrency(data.escrowMonthly)} per month`
        : "None";
  }

  const interestSaved = Math.max(0, data.baseline.totalInterest - data.overpayment.totalInterest);
  const payoffText = formatTerm(data.overpayment.months);
  const payoffDate = data.startDate
    ? formatMonthYear(addMonths(data.startDate, data.overpayment.months - 1))
    : null;

  if (monthlySummary) {
    let text =
      `Monthly payment (principal + interest) is ${formatCurrency(data.payment)}.`;
    if (data.escrowMonthly > 0) {
      text += ` Total monthly payment with taxes and insurance is ${formatCurrency(
        data.payment + data.escrowMonthly,
      )}.`;
    }
    text += ` Payoff takes ${payoffText}`;
    if (payoffDate) {
      text += ` (ending ${payoffDate})`;
    }
    text += ` and saves ${formatCurrency(interestSaved)} in interest.`;
    monthlySummary.textContent = text;
  }

  if (monthlyBreakdown) {
    const first = data.overpayment.schedule[0];
    if (first) {
      monthlyBreakdown.textContent =
        `First payment: ${formatCurrency(first.principal)} principal + ` +
        `${formatCurrency(first.interest)} interest.`;
    } else {
      monthlyBreakdown.textContent = "";
    }
  }

  if (yearlySummary) {
    const years = Math.max(1, data.yearlyOver.length);
    yearlySummary.textContent =
      `Grouped by year, the loan clears in ${years} years. ` +
      `Total paid is ${formatCurrency(data.overpayment.totalPayment)} ` +
      `with total interest of ${formatCurrency(data.overpayment.totalInterest)}.`;
  }

  if (lifetimeSummary) {
    lifetimeSummary.textContent =
      `Total paid is ${formatCurrency(data.overpayment.totalPayment)}. ` +
      `Total principal is ${formatCurrency(data.overpayment.totalPrincipal)} ` +
      `and total interest is ${formatCurrency(data.overpayment.totalInterest)}.`;
  }
}

function updateGraph(data, view) {
  if (!lineBaseline || !lineOver) {
    return;
  }

  const isMonthly = view === "monthly";
  const timeline = isMonthly
    ? Math.max(data.baseline.months, data.overpayment.months)
    : Math.max(data.yearlyBase.length, data.yearlyOver.length);
  const baseSeries = isMonthly
    ? buildMonthlySeries(data.baseline.schedule, data.principal, timeline)
    : buildYearlySeries(data.yearlyBase, data.principal, timeline);
  const overSeries = isMonthly
    ? buildMonthlySeries(data.overpayment.schedule, data.principal, timeline)
    : buildYearlySeries(data.yearlyOver, data.principal, timeline);

  const sampledBase = sampleValues(baseSeries, 60);
  const sampledOver = sampleValues(overSeries, 60);

  lineBaseline.setAttribute("points", buildPolyline(sampledBase, data.principal));
  lineOver.setAttribute("points", buildPolyline(sampledOver, data.principal));

  if (graphTitle) {
    graphTitle.textContent = isMonthly
      ? "Remaining Balance (Monthly)"
      : "Remaining Balance (Yearly)";
  }
  if (graphNote) {
    graphNote.textContent = isMonthly ? `${timeline} months` : `${timeline} years`;
  }
  if (graphYMax) {
    graphYMax.textContent = formatAxisValue(data.principal);
  }
  if (graphYMid) {
    graphYMid.textContent = formatAxisValue(data.principal / 2);
  }
  if (graphXStart) {
    graphXStart.textContent = "1";
  }
  if (graphXEnd) {
    graphXEnd.textContent = String(timeline);
  }
  if (graphXLabel) {
    graphXLabel.textContent = isMonthly ? "Month" : "Year";
  }
}

function applyView(view) {
  if (!currentData) {
    return;
  }
  const isMonthly = view === "monthly";
  if (monthlySummaryBlock) {
    monthlySummaryBlock.hidden = !isMonthly;
  }
  if (yearlySummaryBlock) {
    yearlySummaryBlock.hidden = isMonthly;
  }
  if (monthlyTableWrap) {
    monthlyTableWrap.hidden = !isMonthly;
  }
  if (yearlyTableWrap) {
    yearlyTableWrap.hidden = isMonthly;
  }
  if (tableTitle) {
    tableTitle.textContent = isMonthly
      ? "Amortization Table (Monthly)"
      : "Amortization Table (Yearly)";
  }

  updateExplanation(currentData);
  updateGraph(currentData, view);
}

function updateView() {
  const view = viewButtons?.getValue() ?? "monthly";
  if (!currentData) {
    calculate();
    return;
  }
  applyView(view);
}

function clearOutputs() {
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = "";
  }
  if (yearlyTableBody) {
    yearlyTableBody.innerHTML = "";
  }
  if (lineBaseline) {
    lineBaseline.setAttribute("points", "");
  }
  if (lineOver) {
    lineOver.setAttribute("points", "");
  }
}

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  if (summaryDiv) {
    summaryDiv.textContent = "";
  }
  clearOutputs();
  currentData = null;
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = "";
  summaryDiv.textContent = "";
  clearOutputs();

  const price = Number(priceInput?.value);
  if (!Number.isFinite(price) || price <= 0) {
    setError("Please enter a valid home price greater than 0.");
    return;
  }

  const downType = downTypeButtons?.getValue() ?? "amount";
  const downAmountRaw = Number(downAmountInput?.value);
  const downPercentRaw = Number(downPercentInput?.value);

  let downAmount = downAmountRaw;
  let downPercent = downPercentRaw;

  if (downType === "percent") {
    if (!Number.isFinite(downPercent) || downPercent < 0 || downPercent >= 100) {
      setError("Down payment percent must be between 0 and 100.");
      return;
    }
    downAmount = (price * downPercent) / 100;
  } else {
    if (!Number.isFinite(downAmount) || downAmount < 0) {
      setError("Down payment amount must be 0 or more.");
      return;
    }
    downPercent = price > 0 ? (downAmount / price) * 100 : 0;
    if (downPercent >= 100) {
      setError("Down payment must be less than the home price.");
      return;
    }
  }

  if (downAmount >= price) {
    setError("Down payment must be less than the home price.");
    return;
  }

  if (downType === "percent" && downAmountInput) {
    downAmountInput.value = downAmount.toFixed(2);
  }
  if (downType === "amount" && downPercentInput) {
    downPercentInput.value = downPercent.toFixed(2);
  }

  const principal = price - downAmount;
  if (principal <= 0) {
    setError("Loan amount must be greater than 0.");
    return;
  }

  const years = Number(termInput?.value);
  if (!Number.isFinite(years) || years < 1) {
    setError("Loan term must be at least 1 year.");
    return;
  }

  const annualRate = Number(rateInput?.value);
  if (!Number.isFinite(annualRate) || annualRate < 0) {
    setError("Interest rate must be 0 or more.");
    return;
  }

  const taxAnnual = Number(taxInput?.value);
  if (!Number.isFinite(taxAnnual) || taxAnnual < 0) {
    setError("Property tax must be 0 or more.");
    return;
  }

  const insuranceAnnual = Number(insuranceInput?.value);
  if (!Number.isFinite(insuranceAnnual) || insuranceAnnual < 0) {
    setError("Home insurance must be 0 or more.");
    return;
  }

  const extraMonthly = Number(extraInput?.value);
  if (!Number.isFinite(extraMonthly) || extraMonthly < 0) {
    setError("Extra monthly payment must be 0 or more.");
    return;
  }

  const lumpSum = Number(lumpInput?.value);
  if (!Number.isFinite(lumpSum) || lumpSum < 0) {
    setError("Lump sum payment must be 0 or more.");
    return;
  }

  const months = Math.round(years * 12);
  if (!Number.isFinite(months) || months < 1) {
    setError("Loan term must be at least 1 year.");
    return;
  }

  let lumpSumMonth = null;
  if (lumpSum > 0) {
    const lumpMonthValue = Number(lumpMonthInput?.value);
    if (!Number.isFinite(lumpMonthValue) || lumpMonthValue < 1) {
      setError("Lump sum month must be at least 1.");
      return;
    }
    if (lumpMonthValue > months) {
      setError("Lump sum month must be within the loan term.");
      return;
    }
    lumpSumMonth = Math.round(lumpMonthValue);
  }

  const monthlyRate = annualRate / 100 / 12;
  const payment = computeMonthlyPayment(principal, monthlyRate, months);
  if (!Number.isFinite(payment) || payment <= 0) {
    setError("Unable to compute payment with the current inputs.");
    return;
  }

  const baseline = buildSchedule({
    principal,
    monthlyRate,
    months,
    payment,
    extraMonthly: 0,
    lumpSum: 0,
    lumpSumMonth: null,
  });
  const overpayment = buildSchedule({
    principal,
    monthlyRate,
    months,
    payment,
    extraMonthly,
    lumpSum,
    lumpSumMonth,
  });

  const startDate = parseStartDate(startInput?.value);
  const yearlyBase = aggregateYearly(baseline.schedule, startDate);
  const yearlyOver = aggregateYearly(overpayment.schedule, startDate);
  const escrowMonthly = (taxAnnual + insuranceAnnual) / 12;

  currentData = {
    price,
    downAmount,
    downPercent,
    principal,
    annualRate,
    years,
    months,
    monthlyRate,
    payment,
    escrowMonthly,
    extraMonthly,
    lumpSum,
    lumpSumMonth,
    startDate,
    baseline,
    overpayment,
    yearlyBase,
    yearlyOver,
  };

  resultDiv.innerHTML =
    `<strong>Monthly Payment (Principal + Interest):</strong> ${formatCurrency(payment)}`;

  const interestSaved = Math.max(0, baseline.totalInterest - overpayment.totalInterest);
  const timeSaved = Math.max(0, baseline.months - overpayment.months);
  const payoffText = formatTerm(overpayment.months);
  const payoffDate = startDate
    ? formatMonthYear(addMonths(startDate, overpayment.months - 1))
    : null;
  const escrowLine =
    escrowMonthly > 0
      ? `Total monthly payment (PITI): ${formatCurrency(payment + escrowMonthly)} ` +
        `(taxes + insurance ${formatCurrency(escrowMonthly)}/mo).`
      : "";
  const extraLine =
    extraMonthly > 0 || lumpSum > 0
      ? `Extra payments save ${formatCurrency(interestSaved)} ` +
        `and ${formatTerm(timeSaved)}.`
      : "No extra payment applied.";
  const payoffLine = payoffDate ? `${payoffText} (ending ${payoffDate})` : payoffText;

  summaryDiv.innerHTML =
    `<p><strong>Payoff with extras:</strong> ${payoffLine}.</p>` +
    (escrowLine ? `<p>${escrowLine}</p>` : "") +
    `<p>${extraLine}</p>`;

  renderMonthlyTable(overpayment.schedule, startDate);
  renderYearlyTable(yearlyOver);

  const view = viewButtons?.getValue() ?? "monthly";
  applyView(view);
}

setDownPaymentVisibility(downTypeButtons?.getValue() ?? "amount");

calculateButton?.addEventListener("click", calculate);

calculate();
