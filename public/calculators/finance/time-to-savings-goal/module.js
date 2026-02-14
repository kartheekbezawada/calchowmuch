import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateSavingsGoal } from '/assets/js/core/time-value-utils.js';

/* ── DOM refs: calculator inputs ── */
const goalInput = document.querySelector('#tsg-goal');
const currentInput = document.querySelector('#tsg-current');
const contributionInput = document.querySelector('#tsg-contribution');
const rateInput = document.querySelector('#tsg-rate');
const calculateButton = document.querySelector('#tsg-calc');
const resultDiv = document.querySelector('#tsg-result');
const summaryDiv = document.querySelector('#tsg-result-detail');

/* ── DOM refs: slider value displays ── */
const goalDisplay = document.querySelector('#tsg-goal-display');
const currentDisplay = document.querySelector('#tsg-current-display');
const contribDisplay = document.querySelector('#tsg-contribution-display');
const rateDisplay = document.querySelector('#tsg-rate-display');

/* ── DOM refs: snapshot rows ── */
const snapGoal = document.querySelector('[data-tsg="snap-goal"]');
const snapCurrent = document.querySelector('[data-tsg="snap-current"]');
const snapContribution = document.querySelector('[data-tsg="snap-contribution"]');
const snapRate = document.querySelector('[data-tsg="snap-rate"]');
const snapCompounding = document.querySelector('[data-tsg="snap-compounding"]');
const snapTiming = document.querySelector('[data-tsg="snap-timing"]');
const snapContributions = document.querySelector('[data-tsg="snap-contributions"]');
const snapInterest = document.querySelector('[data-tsg="snap-interest"]');

/* ── DOM refs: explanation targets ── */
const explanationRoot = document.querySelector('#tsg-explanation');
const valueTargets = explanationRoot
    ? {
        goal: explanationRoot.querySelectorAll('[data-tsg="goal"]'),
        current: explanationRoot.querySelectorAll('[data-tsg="current"]'),
        contribution: explanationRoot.querySelectorAll('[data-tsg="contribution"]'),
        rate: explanationRoot.querySelectorAll('[data-tsg="rate"]'),
        compounding: explanationRoot.querySelectorAll('[data-tsg="compounding"]'),
        timing: explanationRoot.querySelectorAll('[data-tsg="timing"]'),
        monthsRequired: explanationRoot.querySelectorAll('[data-tsg="months-required"]'),
        yearsDecimal: explanationRoot.querySelectorAll('[data-tsg="years-decimal"]'),
        totalContributions: explanationRoot.querySelectorAll('[data-tsg="total-contributions"]'),
        totalInterest: explanationRoot.querySelectorAll('[data-tsg="total-interest"]'),
        finalBalance: explanationRoot.querySelectorAll('[data-tsg="final-balance"]'),
        periodsPerYear: explanationRoot.querySelectorAll('[data-tsg="periods-per-year"]'),
        gap: explanationRoot.querySelectorAll('[data-tsg="gap"]'),
        timeResult: explanationRoot.querySelectorAll('[data-tsg="time-result"]'),
    }
    : null;

/* ── Button groups ── */
const compoundingGroup = document.querySelector('[data-button-group="tsg-compounding"]');
const timingGroup = document.querySelector('[data-button-group="tsg-timing"]');

const compoundingButtons = setupButtonGroup(compoundingGroup, {
    defaultValue: 'annual',
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
            name: 'How long will it take me to save 25,000?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'It depends on your current savings, monthly contributions, and interest rate. Enter your values to get a personalized timeline estimate.',
            },
        },
        {
            '@type': 'Question',
            name: 'How does interest reduce the time needed to reach my savings goal?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Interest compounds on your balance, meaning your money earns money. Even a modest rate can shave months or years off your timeline.',
            },
        },
        {
            '@type': 'Question',
            name: 'Does starting with existing savings shorten the timeline?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. The more you already have, the less you need to save. Plus, a larger starting balance earns more interest from day one.',
            },
        },
        {
            '@type': 'Question',
            name: 'What difference does compounding frequency make?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'More frequent compounding means interest is reinvested sooner, slightly accelerating your path to the goal.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is contributing at the beginning of the month better?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Beginning-of-month contributions start earning interest immediately for that period, giving you a slight advantage.',
            },
        },
        {
            '@type': 'Question',
            name: 'What happens if I increase my monthly savings slightly?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Even small increases can dramatically shorten your savings timeline, especially at higher interest rates.',
            },
        },
        {
            '@type': 'Question',
            name: 'How much faster does 5% growth reach my goal compared to 0%?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Significantly faster. For a 25,000 goal with 500/month contributions, 5% interest can cut the timeline by several months.',
            },
        },
        {
            '@type': 'Question',
            name: 'Why does the timeline shrink significantly at higher interest rates?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Compounding is exponential — higher rates amplify growth more the longer you save.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can this calculator be used for house deposit planning?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely. Set your goal to the deposit amount, enter your current savings and monthly contributions, and see how long until you can buy.',
            },
        },
        {
            '@type': 'Question',
            name: 'Should I focus more on increasing contributions or increasing return?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'For shorter timelines, increasing contributions has more impact. For longer timelines, a higher return rate benefits from compounding effects.',
            },
        },
    ],
};

const metadata = {
    title: 'Time to Savings Goal Calculator – CalcHowMuch',
    description:
        'Estimate how long it will take to reach your savings target with regular contributions, interest, and compounding. Plan your path to financial goals.',
    canonical: 'https://calchowmuch.com/finance/time-to-savings-goal/',
    pageSchema,
    calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
    structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                name: 'Time to Savings Goal Calculator',
                url: 'https://calchowmuch.com/finance/time-to-savings-goal/',
                description:
                    'Estimate how long it will take to reach a savings target with regular contributions and compound interest.',
                inLanguage: 'en',
            },
            {
                '@type': 'SoftwareApplication',
                name: 'Time to Savings Goal Calculator',
                applicationCategory: 'FinanceApplication',
                applicationSubCategory: 'Savings & Wealth Calculator',
                operatingSystem: 'Web',
                url: 'https://calchowmuch.com/finance/time-to-savings-goal/',
                description:
                    'Free savings timeline calculator. See when you will reach your financial goal with compound interest.',
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
                        name: 'Time to Savings Goal',
                        item: 'https://calchowmuch.com/finance/time-to-savings-goal/',
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
    if (contributionInput && contribDisplay) {
        setSliderFill(contributionInput);
        contribDisplay.textContent = fmt(Number(contributionInput.value), { maximumFractionDigits: 0 });
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

/* ── Core calculate ── */

function calculate() {
    if (!resultDiv || !summaryDiv) return;
    try {

        const goalAmount = Number(goalInput?.value);
        const currentSavings = Number(currentInput?.value);
        const monthlyContribution = Number(contributionInput?.value);
        const annualRate = Number(rateInput?.value);
        const compounding = compoundingButtons?.getValue() ?? 'annual';
        const contributionTiming = timingButtons?.getValue() ?? 'end';

        if (!Number.isFinite(goalAmount) || goalAmount <= 0) { setError('Goal must be greater than 0.'); return; }
        if (!Number.isFinite(currentSavings) || currentSavings < 0) { setError('Current savings cannot be negative.'); return; }
        if (!Number.isFinite(monthlyContribution) || monthlyContribution < 0) { setError('Contribution must be 0 or more.'); return; }
        if (!Number.isFinite(annualRate) || annualRate < 0) { setError('Rate must be 0 or more.'); return; }

        if (currentSavings >= goalAmount) {
            resultDiv.innerHTML = '<span class="mtg-result-value is-updated">Already reached!</span>';
            const el = resultDiv.querySelector('.mtg-result-value');
            if (el) setTimeout(() => el.classList.remove('is-updated'), 420);
            summaryDiv.innerHTML = '<p>Your current savings already meet or exceed the goal.</p>';
            return;
        }

        const result = calculateSavingsGoal({
            mode: 'time-to-goal',
            goalAmount,
            currentSavings,
            monthlyContribution,
            annualRate,
            compounding,
            contributionTiming,
        });

        if (!result) { setError('Cannot reach this goal with these inputs. Try increasing contributions or interest rate.'); return; }

        /* Derived values */
        const gap = goalAmount - currentSavings;
        const yearsDecimal = (result.monthsToGoal / 12).toFixed(1);
        const timeStr = result.yearsPart > 0
            ? `${result.yearsPart} Year${result.yearsPart !== 1 ? 's' : ''} and ${result.remainingMonthsPart} Month${result.remainingMonthsPart !== 1 ? 's' : ''}`
            : `${result.remainingMonthsPart} Month${result.remainingMonthsPart !== 1 ? 's' : ''}`;
        const timingStr = timingLabel(contributionTiming);

        /* Formatted strings */
        const goalStr = fmt(goalAmount, { maximumFractionDigits: 0 });
        const currentStr = fmt(currentSavings, { maximumFractionDigits: 0 });
        const contribStr = fmt(monthlyContribution, { maximumFractionDigits: 0 });
        const rateStr = formatPercent(annualRate);
        const compoundingStr = result.compoundingLabel;
        const monthsStr = String(result.monthsToGoal);
        const totalContribStr = fmt(result.totalContributions);
        const totalInterestStr = fmt(result.totalInterestEarned);
        const finalBalanceStr = fmt(result.finalBalance);
        const gapStr = fmt(gap, { maximumFractionDigits: 0 });
        const periodsPerYearStr = String(result.periodsPerYear);

        /* Preview panel */
        resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${timeStr}</span>`;
        const valueEl = resultDiv.querySelector('.mtg-result-value');
        if (valueEl) setTimeout(() => valueEl.classList.remove('is-updated'), 420);

        summaryDiv.innerHTML =
            `<p><strong>Total contributions:</strong> ${totalContribStr}</p>` +
            `<p><strong>Interest earned:</strong> ${totalInterestStr}</p>` +
            `<p><strong>Final balance:</strong> ${finalBalanceStr}</p>`;

        /* Snapshot rows */
        if (snapGoal) snapGoal.textContent = goalStr;
        if (snapCurrent) snapCurrent.textContent = currentStr;
        if (snapContribution) snapContribution.textContent = contribStr;
        if (snapRate) snapRate.textContent = rateStr;
        if (snapCompounding) snapCompounding.textContent = compoundingStr;
        if (snapTiming) snapTiming.textContent = timingStr;
        if (snapContributions) snapContributions.textContent = totalContribStr;
        if (snapInterest) snapInterest.textContent = totalInterestStr;

        /* Explanation targets */
        if (valueTargets) {
            updateTargets(valueTargets.goal, goalStr);
            updateTargets(valueTargets.current, currentStr);
            updateTargets(valueTargets.contribution, contribStr);
            updateTargets(valueTargets.rate, rateStr);
            updateTargets(valueTargets.compounding, compoundingStr);
            updateTargets(valueTargets.timing, timingStr);
            updateTargets(valueTargets.monthsRequired, monthsStr);
            updateTargets(valueTargets.yearsDecimal, yearsDecimal);
            updateTargets(valueTargets.totalContributions, totalContribStr);
            updateTargets(valueTargets.totalInterest, totalInterestStr);
            updateTargets(valueTargets.finalBalance, finalBalanceStr);
            updateTargets(valueTargets.periodsPerYear, periodsPerYearStr);
            updateTargets(valueTargets.gap, gapStr);
            updateTargets(valueTargets.timeResult, timeStr);
        }

    } catch (err) {
        console.error('[TSG Calculator] calculate():', err);
    }
}

/* ── Event wiring ── */

[goalInput, currentInput, contributionInput, rateInput].forEach((input) => {
    input?.addEventListener('input', () => {
        updateSliderDisplays();
        calculate();
    });
});

calculateButton?.addEventListener('click', calculate);

/* ── Init ── */
updateSliderDisplays();
calculate();
