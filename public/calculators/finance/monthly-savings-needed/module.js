import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateSavingsGoal } from '/assets/js/core/time-value-utils.js';

/* ── DOM refs: calculator inputs ── */
const goalInput = document.querySelector('#msn-goal');
const currentInput = document.querySelector('#msn-current');
const yearsInput = document.querySelector('#msn-years');
const monthsInput = document.querySelector('#msn-months');
const rateInput = document.querySelector('#msn-rate');
const calculateButton = document.querySelector('#msn-calc');
const resultDiv = document.querySelector('#msn-result');
const summaryDiv = document.querySelector('#msn-result-detail');

/* ── DOM refs: slider value displays ── */
const goalDisplay = document.querySelector('#msn-goal-display');
const currentDisplay = document.querySelector('#msn-current-display');
const yearsDisplay = document.querySelector('#msn-years-display');
const monthsDisplay = document.querySelector('#msn-months-display');
const rateDisplay = document.querySelector('#msn-rate-display');

/* ── DOM refs: snapshot rows ── */
const snapGoal = document.querySelector('[data-msn="snap-goal"]');
const snapCurrent = document.querySelector('[data-msn="snap-current"]');
const snapTime = document.querySelector('[data-msn="snap-time"]');
const snapRate = document.querySelector('[data-msn="snap-rate"]');
const snapCompounding = document.querySelector('[data-msn="snap-compounding"]');
const snapTiming = document.querySelector('[data-msn="snap-timing"]');
const snapMonthly = document.querySelector('[data-msn="snap-monthly"]');
const snapContributions = document.querySelector('[data-msn="snap-contributions"]');
const snapInterest = document.querySelector('[data-msn="snap-interest"]');
const snapBalance = document.querySelector('[data-msn="snap-balance"]');

/* ── DOM refs: explanation targets ── */
const explanationRoot = document.querySelector('#msn-explanation');
const valueTargets = explanationRoot
    ? {
        goal: explanationRoot.querySelectorAll('[data-msn="goal"]'),
        current: explanationRoot.querySelectorAll('[data-msn="current"]'),
        rate: explanationRoot.querySelectorAll('[data-msn="rate"]'),
        compounding: explanationRoot.querySelectorAll('[data-msn="compounding"]'),
        timing: explanationRoot.querySelectorAll('[data-msn="timing"]'),
        monthlySavings: explanationRoot.querySelectorAll('[data-msn="monthly-savings"]'),
        totalContributions: explanationRoot.querySelectorAll('[data-msn="total-contributions"]'),
        totalInterest: explanationRoot.querySelectorAll('[data-msn="total-interest"]'),
        finalBalance: explanationRoot.querySelectorAll('[data-msn="final-balance"]'),
        periodsPerYear: explanationRoot.querySelectorAll('[data-msn="periods-per-year"]'),
        gap: explanationRoot.querySelectorAll('[data-msn="gap"]'),
        timePeriod: explanationRoot.querySelectorAll('[data-msn="time-period"]'),
        totalMonths: explanationRoot.querySelectorAll('[data-msn="total-months"]'),
    }
    : null;

/* ── Button groups ── */
const compoundingGroup = document.querySelector('[data-button-group="msn-compounding"]');
const timingGroup = document.querySelector('[data-button-group="msn-timing"]');

const compoundingButtons = setupButtonGroup(compoundingGroup, {
    defaultValue: 'monthly',
    onChange() { calculate(); },
});

const timingButtons = setupButtonGroup(timingGroup, {
    defaultValue: 'end',
    onChange() { calculate(); },
});

/* ── SEO / Schema ── */
export const pageSchema = {
    calculatorFAQ: true,
    globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How much do I need to save each month to reach 25,000 in 3 years?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'It depends on your current savings, interest rate, and compounding settings. Enter your values to get a personalized monthly savings figure.',
            },
        },
        {
            '@type': 'Question',
            name: 'Does interest reduce the required monthly savings amount?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Interest compounds on your balance, meaning your money earns money. Even a modest rate can noticeably reduce how much you need to save each month.',
            },
        },
        {
            '@type': 'Question',
            name: 'What if I already have some savings?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Existing savings reduce the gap to your goal. The more you start with, the less you need to save monthly.',
            },
        },
        {
            '@type': 'Question',
            name: 'How does compounding frequency affect required savings?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'More frequent compounding means interest is reinvested sooner, slightly reducing the monthly savings required to reach the same goal.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is saving at the beginning of the month better?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Beginning-of-month contributions start earning interest immediately for that period, requiring marginally less monthly savings.',
            },
        },
        {
            '@type': 'Question',
            name: 'What happens if I shorten my time frame?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'A shorter time frame means less time for compounding, so the required monthly savings increases.',
            },
        },
        {
            '@type': 'Question',
            name: 'How much difference does 5 percent growth make?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'At 5% annual growth, your savings benefit from meaningful compound interest. For longer time horizons, this can reduce your required monthly savings substantially.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can this calculator help plan a house deposit?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely. Set your goal to the deposit amount, enter your current savings and time frame, and see exactly how much per month you need to save.',
            },
        },
        {
            '@type': 'Question',
            name: 'What if my investment returns vary each year?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'This calculator uses a fixed annual rate for simplicity. In practice, variable returns may change outcomes — use a conservative estimate.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is it better to increase time or increase monthly savings?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Both work, but increasing time benefits from compounding effects. Starting earlier is more powerful than increasing your monthly contribution.',
            },
        },
    ],
};

const metadata = {
    title: 'Monthly Savings Needed Calculator – CalcHowMuch',
    description:
        'Calculate how much you need to save each month to reach a savings goal within a chosen time period, with optional interest and compounding.',
    canonical: 'https://calchowmuch.com/finance/monthly-savings-needed/',
    pageSchema,
    calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
    structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                name: 'Monthly Savings Needed Calculator',
                url: 'https://calchowmuch.com/finance/monthly-savings-needed/',
                description:
                    'Calculate required monthly savings to reach a financial goal with compound interest.',
                inLanguage: 'en',
            },
            {
                '@type': 'SoftwareApplication',
                name: 'Monthly Savings Needed Calculator',
                applicationCategory: 'FinanceApplication',
                applicationSubCategory: 'Savings & Wealth Calculator',
                operatingSystem: 'Web',
                url: 'https://calchowmuch.com/finance/monthly-savings-needed/',
                description:
                    'Free monthly savings calculator. Determine the exact monthly savings needed to reach your financial goal on time.',
                browserRequirements: 'Requires JavaScript enabled',
                softwareVersion: '1.0',
                creator: { '@type': 'Organization', name: 'CalcHowMuch' },
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://calchowmuch.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://calchowmuch.com/finance/' },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: 'Monthly Savings Needed',
                        item: 'https://calchowmuch.com/finance/monthly-savings-needed/',
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
    if (!input) return;
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value);
    const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
    input.style.setProperty('--fill', `${Math.min(100, Math.max(0, pct))}%`);
}

function updateSliderDisplays() {
    if (goalInput && goalDisplay) {
        setSliderFill(goalInput);
        goalDisplay.textContent = fmt(Number(goalInput.value), { maximumFractionDigits: 0 });
    }
    if (currentInput && currentDisplay) {
        setSliderFill(currentInput);
        currentDisplay.textContent = fmt(Number(currentInput.value), { maximumFractionDigits: 0 });
    }
    if (yearsInput && yearsDisplay) {
        setSliderFill(yearsInput);
        yearsDisplay.textContent = String(Number(yearsInput.value));
    }
    if (monthsInput && monthsDisplay) {
        setSliderFill(monthsInput);
        monthsDisplay.textContent = String(Number(monthsInput.value));
    }
    if (rateInput && rateDisplay) {
        setSliderFill(rateInput);
        rateDisplay.textContent = `${Number(rateInput.value)}%`;
    }
}

function updateTargets(targets, value) {
    if (!targets) return;
    targets.forEach((node) => {
        node.textContent = value;
    });
}

function setError(message) {
    if (resultDiv) resultDiv.textContent = message;
    if (summaryDiv) summaryDiv.textContent = '';
}

function timingLabel(value) {
    return value === 'beginning' ? 'Beginning of Month' : 'End of Month';
}

function timePeriodLabel(years, months) {
    const parts = [];
    if (years > 0) parts.push(`${years} Year${years !== 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} Month${months !== 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(' ') : '0 Months';
}

/* ── Core calculate ── */

function calculate() {
    if (!resultDiv || !summaryDiv) return;
    try {

        const goalAmount = Number(goalInput?.value);
        const currentSavings = Number(currentInput?.value);
        const years = Number(yearsInput?.value);
        const months = Number(monthsInput?.value);
        const annualRate = Number(rateInput?.value);
        const compounding = compoundingButtons?.getValue() ?? 'monthly';
        const contributionTiming = timingButtons?.getValue() ?? 'end';

        const totalMonths = years * 12 + months;

        if (!Number.isFinite(goalAmount) || goalAmount <= 0) { setError('Goal must be greater than 0.'); return; }
        if (!Number.isFinite(currentSavings) || currentSavings < 0) { setError('Current savings cannot be negative.'); return; }
        if (!Number.isFinite(annualRate) || annualRate < 0) { setError('Rate must be 0 or more.'); return; }
        if (totalMonths <= 0) { setError('Time period must be at least 1 month.'); return; }

        if (currentSavings >= goalAmount) {
            resultDiv.innerHTML = '<span class="mtg-result-value is-updated">Already reached!</span>';
            const el = resultDiv.querySelector('.mtg-result-value');
            if (el) setTimeout(() => el.classList.remove('is-updated'), 420);
            summaryDiv.innerHTML = '<p>Your current savings already meet or exceed the goal.</p>';
            return;
        }

        const result = calculateSavingsGoal({
            mode: 'monthly-needed',
            goalAmount,
            currentSavings,
            targetTime: totalMonths,
            targetTimeUnit: 'months',
            annualRate,
            compounding,
            contributionTiming,
        });

        if (!result) { setError('Unable to calculate. Try adjusting your inputs.'); return; }

        /* Derived values */
        const gap = goalAmount - currentSavings;
        const timePeriodStr = timePeriodLabel(years, months);
        const timingStr = timingLabel(contributionTiming);

        /* Formatted strings */
        const goalStr = fmt(goalAmount, { maximumFractionDigits: 0 });
        const currentStr = fmt(currentSavings, { maximumFractionDigits: 0 });
        const rateStr = formatPercent(annualRate);
        const compoundingStr = result.compoundingLabel;
        const monthlyStr = fmt(result.requiredMonthlySavings);
        const totalContribStr = fmt(result.totalContributions);
        const totalInterestStr = fmt(result.totalInterestEarned);
        const finalBalanceStr = fmt(result.finalBalance);
        const gapStr = fmt(gap, { maximumFractionDigits: 0 });
        const periodsPerYearStr = String(result.periodsPerYear);
        const totalMonthsStr = String(totalMonths);

        /* Preview panel */
        resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${monthlyStr} per month</span>`;
        const valueEl = resultDiv.querySelector('.mtg-result-value');
        if (valueEl) setTimeout(() => valueEl.classList.remove('is-updated'), 420);

        summaryDiv.innerHTML =
            `<p><strong>Total contributions:</strong> ${totalContribStr}</p>` +
            `<p><strong>Interest earned:</strong> ${totalInterestStr}</p>` +
            `<p><strong>Final balance:</strong> ${finalBalanceStr}</p>`;

        /* Snapshot rows */
        if (snapGoal) snapGoal.textContent = goalStr;
        if (snapCurrent) snapCurrent.textContent = currentStr;
        if (snapTime) snapTime.textContent = timePeriodStr;
        if (snapRate) snapRate.textContent = rateStr;
        if (snapCompounding) snapCompounding.textContent = compoundingStr;
        if (snapTiming) snapTiming.textContent = timingStr;
        if (snapMonthly) snapMonthly.textContent = monthlyStr;
        if (snapContributions) snapContributions.textContent = totalContribStr;
        if (snapInterest) snapInterest.textContent = totalInterestStr;
        if (snapBalance) snapBalance.textContent = finalBalanceStr;

        /* Explanation targets */
        if (valueTargets) {
            updateTargets(valueTargets.goal, goalStr);
            updateTargets(valueTargets.current, currentStr);
            updateTargets(valueTargets.rate, rateStr);
            updateTargets(valueTargets.compounding, compoundingStr);
            updateTargets(valueTargets.timing, timingStr);
            updateTargets(valueTargets.monthlySavings, monthlyStr);
            updateTargets(valueTargets.totalContributions, totalContribStr);
            updateTargets(valueTargets.totalInterest, totalInterestStr);
            updateTargets(valueTargets.finalBalance, finalBalanceStr);
            updateTargets(valueTargets.periodsPerYear, periodsPerYearStr);
            updateTargets(valueTargets.gap, gapStr);
            updateTargets(valueTargets.timePeriod, timePeriodStr);
            updateTargets(valueTargets.totalMonths, totalMonthsStr);
        }

    } catch (err) {
        console.error('[MSN Calculator] calculate():', err);
    }
}

/* ── Event wiring ── */

[goalInput, currentInput, yearsInput, monthsInput, rateInput].forEach((input) => {
    input?.addEventListener('input', () => {
        updateSliderDisplays();
        calculate();
    });
});

calculateButton?.addEventListener('click', calculate);

/* ── Init ── */
updateSliderDisplays();
calculate();
