import { setupButtonGroup, setPageMetadata } from "/assets/js/core/ui.js";
import { formatNumber, formatPercent } from "/assets/js/core/format.js";
import { calculateCompoundInterest } from "/assets/js/core/time-value-utils.js";

/* ── DOM refs: calculator inputs ── */
const principalInput = document.querySelector("#ci-principal");
const rateInput = document.querySelector("#ci-rate");
const timeInput = document.querySelector("#ci-time");
const contributionInput = document.querySelector("#ci-contribution");
const calculateButton = document.querySelector("#ci-calc");
const resultDiv = document.querySelector("#ci-result");
const summaryDiv = document.querySelector("#ci-result-detail");

/* ── DOM refs: slider value displays ── */
const principalDisplay = document.querySelector("#ci-principal-display");
const rateDisplay = document.querySelector("#ci-rate-display");
const timeDisplay = document.querySelector("#ci-time-display");
const contribDisplay = document.querySelector("#ci-contrib-display");

/* ── DOM refs: snapshot rows ── */
const snapPrincipal = document.querySelector('[data-ci="snap-principal"]');
const snapRate = document.querySelector('[data-ci="snap-rate"]');
const snapTime = document.querySelector('[data-ci="snap-time"]');
const snapCompounding = document.querySelector('[data-ci="snap-compounding"]');
const snapContribution = document.querySelector(
  '[data-ci="snap-contribution"]',
);
const snapPeriodicRate = document.querySelector(
  '[data-ci="snap-periodic-rate"]',
);
const snapTotalPeriods = document.querySelector(
  '[data-ci="snap-total-periods"]',
);
const projectionTableBody = document.querySelector("#ci-projection-body");

/* ── DOM refs: chart section ── */
const growthChartSection = document.querySelector("#ci-growth-chart-section");
const growthChartCanvas = document.querySelector("#ci-growth-canvas");
const growthChartTooltip = document.querySelector("#ci-growth-tooltip");
const growthChartStatus = document.querySelector("#ci-growth-status");
const growthChartEndingBalance = document.querySelector(
  '[data-ci="chart-ending-balance"]',
);
const growthChartPrincipalBase = document.querySelector(
  '[data-ci="chart-principal-base"]',
);
const growthChartInterestTotal = document.querySelector(
  '[data-ci="chart-interest-total"]',
);

/* ── DOM refs: explanation targets ── */
const explanationRoot = document.querySelector("#ci-explanation");
const valueTargets = explanationRoot
  ? {
      principal: explanationRoot.querySelectorAll('[data-ci="principal"]'),
      rate: explanationRoot.querySelectorAll('[data-ci="rate"]'),
      frequency: explanationRoot.querySelectorAll('[data-ci="frequency"]'),
      time: explanationRoot.querySelectorAll('[data-ci="time"]'),
      endingBalance: explanationRoot.querySelectorAll(
        '[data-ci="ending-balance"]',
      ),
      totalInterest: explanationRoot.querySelectorAll(
        '[data-ci="total-interest"]',
      ),
      totalContributions: explanationRoot.querySelectorAll(
        '[data-ci="total-contributions"]',
      ),
      contributionPerPeriod: explanationRoot.querySelectorAll(
        '[data-ci="contribution-per-period"]',
      ),
      periodicRate: explanationRoot.querySelectorAll(
        '[data-ci="periodic-rate"]',
      ),
      periodicRateDecimal: explanationRoot.querySelectorAll(
        '[data-ci="periodic-rate-decimal"]',
      ),
      totalPeriods: explanationRoot.querySelectorAll(
        '[data-ci="total-periods"]',
      ),
      periodsPerYear: explanationRoot.querySelectorAll(
        '[data-ci="periods-per-year"]',
      ),
      yearsValue: explanationRoot.querySelectorAll('[data-ci="years-value"]'),
      growthFactor: explanationRoot.querySelectorAll(
        '[data-ci="growth-factor"]',
      ),
      principalGrowth: explanationRoot.querySelectorAll(
        '[data-ci="principal-growth"]',
      ),
    }
  : null;

/* ── Button groups ── */
const compoundingGroup = document.querySelector(
  '[data-button-group="ci-compounding"]',
);
const tableFrequencyGroup = document.querySelector(
  '[data-button-group="ci-table-frequency"]',
);
const chartScaleGroup = document.querySelector(
  '[data-button-group="ci-chart-scale"]',
);

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: "annual",
  onChange() {
    calculate();
  },
});

const tableFrequencyButtons = setupButtonGroup(tableFrequencyGroup, {
  defaultValue: "annual",
  onChange() {
    renderProjectionVisuals(lastProjectionInput);
  },
});

const chartScaleButtons = setupButtonGroup(chartScaleGroup, {
  defaultValue: "linear",
  onChange() {
    renderGrowthChart(lastProjectionInput);
  },
});

const PROJECTION_FREQUENCY = {
  annual: { periodsPerYear: 1, label: "Year" },
  semiannual: { periodsPerYear: 2, label: "Half-Year" },
  quarterly: { periodsPerYear: 4, label: "Quarter" },
};

let lastProjectionInput = null;
let lastGrowthSeries = null;
let growthChartModulePromise = null;
let growthChartRenderer = null;
let growthChartHydrated = false;
let growthChartHydrationRequested = false;
let growthChartObserver = null;
let growthChartIdleHandle = null;
let firstPaintCompleted = false;
let deferredGrowthHydration = false;

/* ── SEO / Schema ── */
export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is compound interest?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Compound interest is interest calculated on both the initial principal and the accumulated interest from prior periods, creating exponential growth.",
      },
    },
    {
      "@type": "Question",
      name: "What is the compound interest formula?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A = P × (1 + r/n)^(n×t), where P is principal, r is annual rate, n is compounding periods per year, and t is time in years.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between simple and compound interest?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simple interest grows linearly on principal only. Compound interest grows exponentially because it earns interest on both principal and accumulated interest.",
      },
    },
    {
      "@type": "Question",
      name: "Does compounding frequency matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. More frequent compounding produces a slightly higher ending balance at the same nominal rate because interest is reinvested sooner.",
      },
    },
    {
      "@type": "Question",
      name: "How do contributions affect the result?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Regular contributions increase the base that earns interest. Each contribution compounds for the remaining term, significantly boosting the final balance.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this for savings planning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Enter your initial deposit, expected rate, time horizon, and regular savings amount to estimate your future balance.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if the rate is 0%?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The ending balance equals the principal plus total contributions — no interest is earned.",
      },
    },
    {
      "@type": "Question",
      name: "Why is compound interest called the eighth wonder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because small amounts grow into large sums over long periods. The exponential nature means your money accelerates its growth the longer it compounds.",
      },
    },
    {
      "@type": "Question",
      name: "Is this useful for loan calculations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It shows how debt grows under compounding. For loans, the ending balance represents the total amount owed if no payments are made.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Rule of 72?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Divide 72 by the annual interest rate to estimate how many years it takes for your money to double with compound interest.",
      },
    },
  ],
};

const metadata = {
  title: "Compound Interest Calculator | Ending Balance & Growth",
  description:
    "Estimate ending balance, total contributions, and compound growth using starting amount, rate, time, and compounding.",
  canonical:
    "https://calchowmuch.com/finance-calculators/compound-interest-calculator/",
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Compound Interest Calculator | Ending Balance & Growth",
        url: "https://calchowmuch.com/finance-calculators/compound-interest-calculator/",
        description:
          "Estimate ending balance, total contributions, and compound growth using starting amount, rate, time, and compounding.",
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        name: "Compound Interest Calculator",
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "Interest & Growth Calculator",
        operatingSystem: "Web",
        url: "https://calchowmuch.com/finance-calculators/compound-interest-calculator/",
        description:
          "Free compound interest calculator with contributions. Estimate ending balance, interest earned, and growth.",
        browserRequirements: "Requires JavaScript enabled",
        softwareVersion: "1.0",
        creator: { "@type": "Organization", name: "CalcHowMuch" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://calchowmuch.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Finance",
            item: "https://calchowmuch.com/finance-calculators/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Compound Interest",
            item: "https://calchowmuch.com/finance-calculators/compound-interest-calculator/",
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

/* ── Helpers ── */

function fmt(value, opts = {}) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...opts,
  });
}

function setSliderFill(input) {
  if (!input) {return;}
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty("--fill", `${pct}%`);
}

function updateSliderDisplays() {
  if (principalInput && principalDisplay) {
    setSliderFill(principalInput);
    principalDisplay.textContent = fmt(Number(principalInput.value), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  if (rateInput && rateDisplay) {
    setSliderFill(rateInput);
    rateDisplay.textContent = `${Number(rateInput.value)}%`;
  }
  if (timeInput && timeDisplay) {
    setSliderFill(timeInput);
    timeDisplay.textContent = `${Number(timeInput.value)} yrs`;
  }
  if (contributionInput && contribDisplay) {
    setSliderFill(contributionInput);
    contribDisplay.textContent = fmt(Number(contributionInput.value), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}

function updateTargets(targets, value) {
  if (!targets) {return;}
  targets.forEach((node) => {
    node.textContent = value;
  });
}

function getProjectionFrequencyInfo() {
  const tableFrequency = tableFrequencyButtons?.getValue() ?? "annual";
  return PROJECTION_FREQUENCY[tableFrequency] ?? PROJECTION_FREQUENCY.annual;
}

function getChartScale() {
  return chartScaleButtons?.getValue() === "log" ? "log" : "linear";
}

function setGrowthStatus(message) {
  if (!growthChartStatus) {return;}
  if (!message) {
    growthChartStatus.hidden = true;
    return;
  }
  growthChartStatus.textContent = message;
  growthChartStatus.hidden = false;
}

function setGrowthKpis({ endingBalance, principalBase, interestTotal } = {}) {
  if (growthChartEndingBalance) {
    growthChartEndingBalance.textContent = Number.isFinite(endingBalance)
      ? fmt(endingBalance)
      : "—";
  }
  if (growthChartPrincipalBase) {
    growthChartPrincipalBase.textContent = Number.isFinite(principalBase)
      ? fmt(principalBase)
      : "—";
  }
  if (growthChartInterestTotal) {
    growthChartInterestTotal.textContent = Number.isFinite(interestTotal)
      ? fmt(interestTotal)
      : "—";
  }
}

function clearGrowthTooltip() {
  if (growthChartTooltip) {
    growthChartTooltip.hidden = true;
    growthChartTooltip.innerHTML = "";
  }
}

function clearGrowthChartState(message) {
  lastGrowthSeries = null;
  setGrowthKpis();
  setGrowthStatus(message);
  clearGrowthTooltip();
  if (growthChartRenderer?.update) {
    growthChartRenderer.update(null, { scale: getChartScale() });
  }
}

function buildProjectionSeries(data) {
  if (!data) {return null;}

  const { principal, annualRate, years, contributionPerPeriod } = data;
  const frequencyInfo = getProjectionFrequencyInfo();
  const periodsPerYear = frequencyInfo.periodsPerYear;
  const periodicRate = annualRate / 100 / periodsPerYear;
  const totalPeriods = Math.max(0, Math.round(years * periodsPerYear));

  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualRate) ||
    !Number.isFinite(years) ||
    !Number.isFinite(contributionPerPeriod) ||
    !Number.isFinite(periodicRate) ||
    !Number.isFinite(totalPeriods)
  ) {
    return null;
  }

  const points = [];
  let runningBalance = principal;

  points.push({
    periodIndex: 0,
    periodLabel: `${frequencyInfo.label} 0`,
    openingBalance: principal,
    contribution: 0,
    interestEarned: 0,
    endingBalance: principal,
    principalBase: principal,
    interestTotal: 0,
  });

  for (let periodIndex = 1; periodIndex <= totalPeriods; periodIndex += 1) {
    const openingBalance = runningBalance;
    const interestEarned = openingBalance * periodicRate;
    const endingBalance =
      openingBalance + interestEarned + contributionPerPeriod;
    const principalBase = principal + contributionPerPeriod * periodIndex;
    const interestTotal = Math.max(endingBalance - principalBase, 0);

    points.push({
      periodIndex,
      periodLabel: `${frequencyInfo.label} ${periodIndex}`,
      openingBalance,
      contribution: contributionPerPeriod,
      interestEarned,
      endingBalance,
      principalBase,
      interestTotal,
    });

    runningBalance = endingBalance;
  }

  return {
    points,
    frequencyLabel: frequencyInfo.label,
    periodsPerYear,
    totalPeriods,
    xAxisLabel: `Time (${frequencyInfo.label} periods)`,
    yAxisLabel: "Balance (USD)",
  };
}

function renderProjectionPlaceholder(message) {
  if (!projectionTableBody) {return;}
  projectionTableBody.innerHTML = `<tr class="ci-projection-placeholder-row"><td colspan="5">${message}</td></tr>`;
}

function renderProjectionTable(data) {
  if (!projectionTableBody) {return;}

  const series = buildProjectionSeries(data);
  if (!series) {
    renderProjectionPlaceholder(
      "Run a valid calculation to view projection rows.",
    );
    return;
  }

  const rows = series.points.slice(1).map(
    (point) => `<tr>
        <td>${point.periodLabel}</td>
        <td>${fmt(point.openingBalance)}</td>
        <td>${fmt(point.contribution)}</td>
        <td>${fmt(point.interestEarned)}</td>
        <td>${fmt(point.endingBalance)}</td>
      </tr>`,
  );

  if (rows.length === 0) {
    const first = series.points[0];
    projectionTableBody.innerHTML = `
      <tr>
        <td>${first.periodLabel}</td>
        <td>${fmt(first.openingBalance)}</td>
        <td>${fmt(first.contribution)}</td>
        <td>${fmt(first.interestEarned)}</td>
        <td>${fmt(first.endingBalance)}</td>
      </tr>`;
    return;
  }

  projectionTableBody.innerHTML = rows.join("");
}

function loadGrowthChartModule() {
  if (!growthChartModulePromise) {
    growthChartModulePromise =
      import("/assets/js/calculators/finance-calculators/compound-interest-calculator/ci-growth-chart.js");
  }
  return growthChartModulePromise;
}

function teardownGrowthChartTriggers() {
  if (growthChartObserver) {
    growthChartObserver.disconnect();
    growthChartObserver = null;
  }

  if (growthChartIdleHandle !== null) {
    if (
      typeof window !== "undefined" &&
      typeof window.cancelIdleCallback === "function"
    ) {
      window.cancelIdleCallback(growthChartIdleHandle);
    } else {
      clearTimeout(growthChartIdleHandle);
    }
    growthChartIdleHandle = null;
  }
}

function ensureGrowthChartHydration() {
  if (growthChartHydrated || !growthChartSection || !growthChartCanvas) {return;}

  if (!firstPaintCompleted) {
    deferredGrowthHydration = true;
    return;
  }

  growthChartHydrated = true;
  teardownGrowthChartTriggers();
  setGrowthStatus("Rendering chart...");

  loadGrowthChartModule()
    .then((module) => {
      growthChartRenderer = module.createCompoundInterestGrowthChart({
        canvas: growthChartCanvas,
        tooltip: growthChartTooltip,
      });

      if (lastGrowthSeries && growthChartRenderer?.update) {
        growthChartRenderer.update(lastGrowthSeries, {
          scale: getChartScale(),
        });
        setGrowthStatus("");
      } else {
        setGrowthStatus("Run a valid calculation to render chart data.");
      }
    })
    .catch((error) => {
      console.error("[CI Calculator] growth chart load failed:", error);
      setGrowthStatus(
        "Unable to load chart. You can still use the projection table above.",
      );
    });
}

function scheduleGrowthChartHydration() {
  if (
    !growthChartSection ||
    !growthChartCanvas ||
    growthChartHydrated ||
    growthChartHydrationRequested
  ) {
    return;
  }

  growthChartHydrationRequested = true;

  const requestHydration = () => {
    ensureGrowthChartHydration();
  };

  if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    growthChartObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (!visible) {return;}
        requestHydration();
      },
      { rootMargin: "340px 0px" },
    );
    growthChartObserver.observe(growthChartSection);
  }

  if (
    typeof window !== "undefined" &&
    typeof window.requestIdleCallback === "function"
  ) {
    growthChartIdleHandle = window.requestIdleCallback(requestHydration, {
      timeout: 5000,
    });
    return;
  }

  if (typeof window !== "undefined") {
    growthChartIdleHandle = window.setTimeout(requestHydration, 4200);
  }
}

function renderGrowthChart(data) {
  if (!growthChartSection || !growthChartCanvas) {return;}

  if (!data) {
    clearGrowthChartState("Run a valid calculation to render chart data.");
    return;
  }

  const series = buildProjectionSeries(data);
  if (!series) {
    clearGrowthChartState("Run a valid calculation to render chart data.");
    return;
  }

  lastGrowthSeries = series;
  const lastPoint = series.points[series.points.length - 1];
  setGrowthKpis({
    endingBalance: lastPoint?.endingBalance,
    principalBase: lastPoint?.principalBase,
    interestTotal: lastPoint?.interestTotal,
  });

  scheduleGrowthChartHydration();

  if (!growthChartHydrated || !growthChartRenderer?.update) {
    setGrowthStatus(
      "Chart initializes after first paint and when this section is near view.",
    );
    return;
  }

  growthChartRenderer.update(series, { scale: getChartScale() });
  setGrowthStatus("");
}

function renderProjectionVisuals(data) {
  renderProjectionTable(data);
  renderGrowthChart(data);
}

function setError(message) {
  if (resultDiv) {resultDiv.textContent = message;}
  if (summaryDiv) {summaryDiv.textContent = "";}
  renderProjectionPlaceholder(
    "Run a valid calculation to view projection rows.",
  );
  clearGrowthChartState("Run a valid calculation to render chart data.");
}

/* ── Core calculate ── */

function calculate() {
  if (!resultDiv || !summaryDiv) {return;}
  try {
    const principal = Number(principalInput?.value);
    const annualRate = Number(rateInput?.value);
    const timePeriod = Number(timeInput?.value);
    const contribution = Number(contributionInput?.value ?? 0);
    const compounding = compoundingButtons?.getValue() ?? "annual";

    if (!Number.isFinite(principal) || principal < 0) {
      setError("Principal must be 0 or more.");
      lastProjectionInput = null;
      return;
    }
    if (!Number.isFinite(annualRate) || annualRate < 0) {
      setError("Rate must be 0 or more.");
      lastProjectionInput = null;
      return;
    }
    if (!Number.isFinite(timePeriod) || timePeriod < 0) {
      setError("Time must be 0 or more.");
      lastProjectionInput = null;
      return;
    }
    if (!Number.isFinite(contribution) || contribution < 0) {
      setError("Contribution must be 0 or more.");
      lastProjectionInput = null;
      return;
    }

    const result = calculateCompoundInterest({
      principal,
      annualRate,
      timePeriod,
      periodType: "years",
      compounding,
      contribution,
    });

    if (!result) {
      setError("Check your inputs.");
      lastProjectionInput = null;
      return;
    }

    const periodicRatePct = result.periodicRate * 100;
    const principalStr = fmt(principal);
    const rateStr = formatPercent(annualRate);
    const timeStr = `${fmt(timePeriod, { maximumFractionDigits: 0 })} years`;
    const compoundingStr = result.compoundingLabel;
    const contribStr = fmt(contribution);
    const periodicRateStr = fmt(periodicRatePct, { maximumFractionDigits: 4 });
    const periodicRateDecimalStr = fmt(result.periodicRate, {
      maximumFractionDigits: 6,
    });
    const totalPeriodsStr = fmt(result.totalPeriods, {
      maximumFractionDigits: 0,
    });
    const totalContribStr = fmt(result.totalContributions);
    const totalInterestStr = fmt(result.totalInterestEarned);
    const endingBalanceStr = fmt(result.endingBalance);
    const periodsPerYearStr = String(result.periodsPerYear);
    const yearsValueStr = fmt(result.years, { maximumFractionDigits: 2 });

    /* Growth factor & principal growth for formula walkthrough */
    const growthFactor = Math.pow(1 + result.periodicRate, result.totalPeriods);
    const principalGrowth = principal * growthFactor;
    const growthFactorStr = fmt(growthFactor, { maximumFractionDigits: 6 });
    const principalGrowthStr = fmt(principalGrowth);

    /* Preview panel */
    resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${endingBalanceStr}</span>`;
    const valueEl = resultDiv.querySelector(".mtg-result-value");
    if (valueEl) {setTimeout(() => valueEl.classList.remove("is-updated"), 420);}

    summaryDiv.innerHTML =
      `<p><strong>Total interest:</strong> ${totalInterestStr}</p>` +
      `<p><strong>Total contributions:</strong> ${totalContribStr}</p>` +
      `<p><strong>Compounding:</strong> ${compoundingStr}</p>`;

    /* Snapshot rows */
    if (snapPrincipal) {snapPrincipal.textContent = principalStr;}
    if (snapRate) {snapRate.textContent = rateStr;}
    if (snapTime) {snapTime.textContent = timeStr;}
    if (snapCompounding) {snapCompounding.textContent = compoundingStr;}
    if (snapContribution) {snapContribution.textContent = contribStr;}
    if (snapPeriodicRate) {snapPeriodicRate.textContent = `${periodicRateStr}%`;}
    if (snapTotalPeriods) {snapTotalPeriods.textContent = totalPeriodsStr;}

    /* Explanation targets */
    if (valueTargets) {
      updateTargets(valueTargets.principal, principalStr);
      updateTargets(valueTargets.rate, rateStr);
      updateTargets(valueTargets.frequency, compoundingStr);
      updateTargets(valueTargets.time, timeStr);
      updateTargets(valueTargets.endingBalance, endingBalanceStr);
      updateTargets(valueTargets.totalInterest, totalInterestStr);
      updateTargets(valueTargets.totalContributions, totalContribStr);
      updateTargets(valueTargets.contributionPerPeriod, contribStr);
      updateTargets(valueTargets.periodicRate, periodicRateStr);
      updateTargets(valueTargets.periodicRateDecimal, periodicRateDecimalStr);
      updateTargets(valueTargets.totalPeriods, totalPeriodsStr);
      updateTargets(valueTargets.periodsPerYear, periodsPerYearStr);
      updateTargets(valueTargets.yearsValue, yearsValueStr);
      updateTargets(valueTargets.growthFactor, growthFactorStr);
      updateTargets(valueTargets.principalGrowth, principalGrowthStr);
    }

    lastProjectionInput = {
      principal,
      annualRate,
      years: result.years,
      contributionPerPeriod: contribution,
    };

    renderProjectionVisuals(lastProjectionInput);
  } catch (err) {
    console.error("[CI Calculator] calculate():", err);
    lastProjectionInput = null;
    renderProjectionPlaceholder(
      "Run a valid calculation to view projection rows.",
    );
    clearGrowthChartState("Run a valid calculation to render chart data.");
  }
}

/* ── Event wiring ── */

[principalInput, rateInput, timeInput, contributionInput].forEach((input) => {
  input?.addEventListener("input", () => {
    updateSliderDisplays();
    calculate();
  });
});

calculateButton?.addEventListener("click", calculate);

/* ── Init ── */
updateSliderDisplays();
calculate();

if (
  typeof window !== "undefined" &&
  typeof window.requestAnimationFrame === "function"
) {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      firstPaintCompleted = true;
      if (deferredGrowthHydration) {
        deferredGrowthHydration = false;
        ensureGrowthChartHydration();
      } else {
        scheduleGrowthChartHydration();
      }
    });
  });
} else {
  firstPaintCompleted = true;
  scheduleGrowthChartHydration();
}
