import { formatCurrency, formatNumber, formatPercent } from "/assets/js/core/format.js";
import { setupButtonGroup } from "/assets/js/core/ui.js";

const amountInput = document.querySelector("#emi-amount");
const rateInput = document.querySelector("#emi-rate");
const yearsInput = document.querySelector("#emi-years");
const extraInput = document.querySelector("#emi-extra");
const extraGroup = document.querySelector('[data-button-group="emi-extra-type"]');
const viewGroup = document.querySelector('[data-button-group="emi-view"]');
const calculateButton = document.querySelector("#emi-calculate");
const resultDiv = document.querySelector("#emi-result");
const summaryDiv = document.querySelector("#emi-summary");
const detailDiv = document.querySelector("#emi-detail");
const comparisonBody = document.querySelector("#emi-comparison-body");
const monthlyTableBody = document.querySelector("#emi-table-monthly-body");
const yearlyTableBody = document.querySelector("#emi-table-yearly-body");
const monthlyTable = document.querySelector("#emi-table-monthly");
const yearlyTable = document.querySelector("#emi-table-yearly");
const monthlyTableWrap = document.querySelector("#emi-table-monthly-wrap");
const yearlyTableWrap = document.querySelector("#emi-table-yearly-wrap");
const tableTitle = document.querySelector("#emi-table-title");

const explanationRoot = document.querySelector("#loan-emi-explanation");
const amountValue = explanationRoot?.querySelector('[data-emi="amount"]');
const rateValue = explanationRoot?.querySelector('[data-emi="rate"]');
const yearsValue = explanationRoot?.querySelector('[data-emi="years"]');
const extraValue = explanationRoot?.querySelector('[data-emi="extra"]');
const monthlySummary = explanationRoot?.querySelector('[data-emi="monthly-summary"]');
const yearlySummary = explanationRoot?.querySelector('[data-emi="yearly-summary"]');
const monthlySummaryBlock = explanationRoot?.querySelector('[data-emi-view="monthly"]');
const yearlySummaryBlock = explanationRoot?.querySelector('[data-emi-view="yearly"]');
const graphTitle = explanationRoot?.querySelector("#emi-graph-title");
const graphNote = explanationRoot?.querySelector("#emi-graph-note");
const graphBars = explanationRoot?.querySelector("#emi-graph-bars");
const graphYMax = explanationRoot?.querySelector("#emi-y-max");
const graphYMid = explanationRoot?.querySelector("#emi-y-mid");
const graphXStart = explanationRoot?.querySelector("#emi-x-start");
const graphXEnd = explanationRoot?.querySelector("#emi-x-end");
const graphXLabel = explanationRoot?.querySelector("#emi-x-label");

const extraButtons = setupButtonGroup(extraGroup, {
  defaultValue: "monthly",
  onChange: () => calculate(),
});

const viewButtons = setupButtonGroup(viewGroup, {
  defaultValue: "monthly",
  onChange: () => updateView(),
});

let currentData = null;

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

function buildSchedule(principal, monthlyRate, months, emi, extra, extraFrequency) {
  const schedule = [];
  let balance = principal;
  let totalPayment = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalExtra = 0;
  let month = 0;
  const maxMonths = months + 1200;
  const isMonthlyExtra = extraFrequency === "monthly";
  const isYearlyExtra = extraFrequency === "yearly";

  while (balance > 0 && month < maxMonths) {
    month += 1;
    const interest = balance * monthlyRate;
    let principalPayment = emi - interest;
    if (principalPayment < 0) {
      principalPayment = 0;
    }

    let extraPayment = 0;
    if (extra > 0 && (isMonthlyExtra || (isYearlyExtra && month % 12 === 0))) {
      extraPayment = extra;
    }

    let totalPrincipalPayment = principalPayment + extraPayment;
    if (totalPrincipalPayment > balance) {
      totalPrincipalPayment = balance;
      extraPayment = Math.max(0, totalPrincipalPayment - principalPayment);
    }

    const payment = interest + totalPrincipalPayment;
    balance -= totalPrincipalPayment;

    totalPayment += payment;
    totalInterest += interest;
    totalPrincipal += totalPrincipalPayment;
    totalExtra += extraPayment;

    schedule.push({
      month,
      payment,
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

function aggregateYearly(schedule) {
  const yearly = [];
  schedule.forEach(entry => {
    const yearIndex = Math.ceil(entry.month / 12) - 1;
    if (!yearly[yearIndex]) {
      yearly[yearIndex] = {
        year: yearIndex + 1,
        payment: 0,
        principal: 0,
        interest: 0,
        extra: 0,
        balance: entry.balance,
      };
    }
    const record = yearly[yearIndex];
    record.payment += entry.payment;
    record.principal += entry.principal;
    record.interest += entry.interest;
    record.extra += entry.extra;
    record.balance = entry.balance;
  });
  return yearly.filter(Boolean);
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

function renderComparison(base, over) {
  if (!comparisonBody) {
    return;
  }

  const interestSaved = Math.max(0, base.totalInterest - over.totalInterest);
  const monthsSaved = Math.max(0, base.months - over.months);

  const rows = [
    {
      label: "Total payment",
      base: formatTableNumber(base.totalPayment),
      over: formatTableNumber(over.totalPayment),
    },
    {
      label: "Total interest",
      base: formatTableNumber(base.totalInterest),
      over: formatTableNumber(over.totalInterest),
    },
    {
      label: "Payoff time",
      base: formatTerm(base.months),
      over: formatTerm(over.months),
    },
    {
      label: "Interest saved",
      base: "-",
      over: formatTableNumber(interestSaved),
    },
    {
      label: "Time saved",
      base: "-",
      over: formatTerm(monthsSaved),
    },
  ];

  comparisonBody.innerHTML = rows
    .map(
      row =>
        `<tr><td>${row.label}</td><td>${row.base}</td><td>${row.over}</td></tr>`,
    )
    .join("");
}

function renderMonthlyTable(schedule) {
  if (!monthlyTableBody) {
    return;
  }
  monthlyTableBody.innerHTML = schedule
    .map(
      entry =>
        `<tr>
          <td>${entry.month}</td>
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
          <td>${entry.year}</td>
          <td>${formatTableNumber(entry.payment)}</td>
          <td>${formatTableNumber(entry.principal)}</td>
          <td>${formatTableNumber(entry.interest)}</td>
          <td>${formatTableNumber(entry.extra)}</td>
          <td>${formatTableNumber(entry.balance)}</td>
        </tr>`,
    )
    .join("");
}

function updateExplanation(data, view) {
  if (!explanationRoot) {
    return;
  }

  if (amountValue) {
    amountValue.textContent = formatCurrency(data.principal);
  }
  if (rateValue) {
    rateValue.textContent = formatPercent(data.annualRate);
  }
  if (yearsValue) {
    yearsValue.textContent = `${formatNumber(data.years, { maximumFractionDigits: 2 })} years`;
  }
  if (extraValue) {
    if (data.extra > 0) {
      const cadence = data.extraFrequency === "monthly" ? "per month" : "per year";
      extraValue.textContent = `${formatCurrency(data.extra)} ${cadence}`;
    } else {
      extraValue.textContent = "None";
    }
  }

  const interestSaved = Math.max(0, data.baseline.totalInterest - data.overpayment.totalInterest);
  const payoffText = formatTerm(data.overpayment.months);

  if (monthlySummary) {
    monthlySummary.textContent =
      `Monthly EMI is ${formatCurrency(data.emi)}. ` +
      `With the current overpayment, payoff takes ${payoffText} ` +
      `and saves ${formatCurrency(interestSaved)} in interest.`;
  }

  if (yearlySummary) {
    const years = Math.max(1, Math.ceil(data.overpayment.months / 12));
    yearlySummary.textContent =
      `Grouped by year, the loan clears in ${years} years. ` +
      `Total paid is ${formatCurrency(data.overpayment.totalPayment)} ` +
      `with total interest of ${formatCurrency(data.overpayment.totalInterest)}.`;
  }

  if (monthlySummaryBlock) {
    monthlySummaryBlock.hidden = view !== "monthly";
  }
  if (yearlySummaryBlock) {
    yearlySummaryBlock.hidden = view !== "yearly";
  }
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

function updateGraph(data, view) {
  if (!graphBars || !graphTitle) {
    return;
  }

  const maxBalance = data.principal;
  const isMonthly = view === "monthly";
  const sourceData = isMonthly ? data.overpayment.schedule : data.yearlyOver;
  const balances = sourceData.map(entry => entry.balance);

  if (balances[0] !== maxBalance) {
    balances.unshift(maxBalance);
  }

  const sampled = sampleValues(balances, 60);
  graphBars.innerHTML = "";

  sampled.forEach((balance, index) => {
    const bar = document.createElement("div");
    bar.className = "graph-bar balance";
    const height = maxBalance > 0 ? (balance / maxBalance) * 100 : 0;
    bar.style.height = `${Math.max(2, Math.min(100, height))}%`;
    bar.title = `${isMonthly ? "Month" : "Year"} ${index + 1}: ${formatTableNumber(balance)}`;
    graphBars.appendChild(bar);
  });

  graphTitle.textContent =
    isMonthly ? "Remaining Balance (Monthly)" : "Remaining Balance (Yearly)";

  if (graphNote) {
    graphNote.textContent = isMonthly
      ? `${sampled.length} points`
      : `${sampled.length} years`;
  }

  if (graphYMax) {
    graphYMax.textContent = formatAxisValue(maxBalance);
  }
  if (graphYMid) {
    graphYMid.textContent = formatAxisValue(maxBalance / 2);
  }

  if (graphXStart) {
    graphXStart.textContent = "1";
  }
  if (graphXEnd) {
    const totalPeriods = isMonthly ? data.overpayment.months : data.yearlyOver.length;
    graphXEnd.textContent = String(totalPeriods);
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
  if (monthlyTableWrap) {
    monthlyTableWrap.hidden = !isMonthly;
  } else if (monthlyTable) {
    monthlyTable.hidden = !isMonthly;
  }
  if (yearlyTableWrap) {
    yearlyTableWrap.hidden = isMonthly;
  } else if (yearlyTable) {
    yearlyTable.hidden = isMonthly;
  }
  if (tableTitle) {
    tableTitle.textContent = isMonthly
      ? "Amortization Table (Monthly)"
      : "Amortization Table (Yearly)";
  }

  updateExplanation(currentData, view);
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
  if (comparisonBody) {
    comparisonBody.innerHTML = "";
  }
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = "";
  }
  if (yearlyTableBody) {
    yearlyTableBody.innerHTML = "";
  }
  if (graphBars) {
    graphBars.innerHTML = "";
  }
}

function calculate() {
  if (!resultDiv || !summaryDiv || !detailDiv) {
    return;
  }

  resultDiv.textContent = "";
  summaryDiv.textContent = "";
  clearOutputs();

  const principal = Number(amountInput?.value);
  const annualRate = Number(rateInput?.value);
  const years = Number(yearsInput?.value);
  const extra = Number(extraInput?.value);

  if (!Number.isFinite(principal) || principal <= 0) {
    resultDiv.textContent = "Please enter a valid loan amount greater than 0.";
    currentData = null;
    return;
  }

  if (!Number.isFinite(annualRate) || annualRate < 0) {
    resultDiv.textContent = "Please enter a valid interest rate of 0 or more.";
    currentData = null;
    return;
  }

  if (!Number.isFinite(years) || years < 1) {
    resultDiv.textContent = "Please enter a loan tenure of at least 1 year.";
    currentData = null;
    return;
  }

  if (!Number.isFinite(extra) || extra < 0) {
    resultDiv.textContent = "Extra payment must be 0 or more.";
    currentData = null;
    return;
  }

  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;
  const emi = computeMonthlyPayment(principal, monthlyRate, months);

  if (!Number.isFinite(emi) || emi <= 0) {
    resultDiv.textContent = "Unable to compute EMI with the current inputs.";
    currentData = null;
    return;
  }

  const extraFrequency = extraButtons?.getValue() ?? "monthly";
  const baseline = buildSchedule(principal, monthlyRate, months, emi, 0, "monthly");
  const overpayment = buildSchedule(principal, monthlyRate, months, emi, extra, extraFrequency);
  const yearlyOver = aggregateYearly(overpayment.schedule);

  currentData = {
    principal,
    annualRate,
    years,
    months,
    extra,
    extraFrequency,
    emi,
    baseline,
    overpayment,
    yearlyOver,
  };

  resultDiv.innerHTML = `<strong>Monthly EMI:</strong> ${formatCurrency(emi)}`;

  const interestSaved = Math.max(0, baseline.totalInterest - overpayment.totalInterest);
  const extraLabel =
    extra > 0
      ? extraFrequency === "monthly"
        ? `Extra monthly payment: ${formatCurrency(extra)}`
        : `Extra yearly payment: ${formatCurrency(extra)}`
      : "No extra payment applied.";

  summaryDiv.innerHTML =
    `<p><strong>${extraLabel}</strong></p>` +
    `<p><strong>Payoff with overpayment:</strong> ${formatTerm(overpayment.months)} ` +
    `- interest saved ${formatCurrency(interestSaved)}.</p>`;

  renderComparison(baseline, overpayment);
  renderMonthlyTable(overpayment.schedule);
  renderYearlyTable(yearlyOver);

  const view = viewButtons?.getValue() ?? "monthly";
  applyView(view);
}

calculateButton?.addEventListener("click", calculate);

calculate();
