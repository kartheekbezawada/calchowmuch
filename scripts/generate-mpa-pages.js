import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CALC_DIR = path.join(PUBLIC_DIR, 'calculators');
const CONTENT_CALC_DIR = path.join(ROOT, 'content', 'calculators');
const NAV_PATH = path.join(PUBLIC_DIR, 'config', 'navigation.json');
const ASSET_MANIFEST_PATH = path.join(PUBLIC_DIR, 'config', 'asset-manifest.json');
const SOURCE_CLUSTER_REGISTRY_PATH = path.join(
  ROOT,
  'config',
  'clusters',
  'cluster-registry.json'
);
const PUBLIC_CLUSTER_REGISTRY_PATH = path.join(
  PUBLIC_DIR,
  'config',
  'clusters',
  'cluster-registry.json'
);
const HEADER_PATH = path.join(PUBLIC_DIR, 'layout', 'header.html');
const FOOTER_PATH = path.join(PUBLIC_DIR, 'layout', 'footer.html');
const ROUTE_BUNDLE_MANIFEST_PATH = path.join(
  PUBLIC_DIR,
  'assets',
  'css',
  'route-bundles',
  'manifest.json'
);

const CSS_VERSION = '20260127';
const GTEP_CSS_VERSION = '20260127';
const ROUTE_ASSET_VERSION = process.env.ROUTE_ASSET_VERSION || '20260224';
const SITE_URL = 'https://calchowmuch.com';
const OG_IMAGE = `${SITE_URL}/assets/images/og-default.png`;
// CHM_ENABLE_ADSENSE is deprecated — AdSense code is always injected.
// Ads only render on approved production domains via Google AdSense domain verification.
const ROUTE_ARCHETYPES = new Set(['calc_exp', 'calc_only', 'exp_only', 'content_shell']);
const DESIGN_FAMILIES = new Set(['home-loan', 'auto-loans', 'credit-cards', 'neutral']);
const PANE_LAYOUTS = new Set(['single', 'split']);
const FORCED_SINGLE_PANE_CALCULATOR_IDS = new Set(['what-percent-is-x-of-y']);
const ROUTE_BUNDLE_PILOT_IDS = new Set([
  'birthday-day-of-week',
  'countdown-timer-generator',
  'fraction-calculator',
  'quadratic-equation',
  'slope-distance',
  'factoring',
  'polynomial-operations',
  'system-of-equations',
  'monthly-savings-needed',
  'time-to-savings-goal',
  'investment-growth',
  'investment-return',
  'effective-annual-rate',
  'inflation',
  'compound-interest',
  'simple-interest',
  'present-value',
  'future-value',
  'future-value-of-annuity',
  'present-value-of-annuity',
]);
const MATH_CLUSTER_REDESIGN_IDS = new Set([
  'basic',
  'fraction-calculator',
  'sample-size',
  'quadratic-equation',
  'slope-distance',
  'factoring',
  'polynomial-operations',
  'system-of-equations',
  'unit-circle',
  'triangle-solver',
  'trig-functions',
  'inverse-trig',
  'law-of-sines-cosines',
  'natural-log',
  'common-log',
  'log-properties',
  'exponential-equations',
  'log-scale',
  'derivative',
  'integral',
  'limit',
  'series-convergence',
  'critical-points',
  'mean-median-mode-range',
  'standard-deviation',
  'confidence-interval',
  'z-score',
  'number-sequence',
  'permutation-combination',
  'probability',
  'statistics',
  'correlation',
  'regression-analysis',
  'distribution',
  'anova',
  'hypothesis-testing',
]);
const FINANCE_CALCULATOR_IDS = new Set([
  'present-value',
  'future-value',
  'present-value-of-annuity',
  'future-value-of-annuity',
  'simple-interest',
  'compound-interest',
  'effective-annual-rate',
  'inflation',
  'investment',
  'investment-growth',
  'investment-return',
  'time-to-savings-goal',
  'monthly-savings-needed',
]);
const CALCULATOR_OVERRIDES = {
  basic: {
    title: 'Basic Calculator | Add, Subtract, Multiply, Divide',
    description:
      'Add, subtract, multiply, or divide everyday numbers in one clean answer-first basic calculator with support for extra inputs and memory tools.',
    h1: 'Basic Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'series-convergence': {
    title: 'Series Convergence Calculator – Tests & Analysis',
    description:
      'Check whether an infinite series converges with ratio, root, and comparison tests in a light answer-first calculus layout that keeps the verdict and reasoning together.',
    h1: 'Series Convergence Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'critical-points': {
    title: 'Critical Points Finder – Maxima, Minima & Inflection',
    description:
      'Find critical points, classify local maxima and minima, and surface inflection candidates in a light answer-first calculus layout built for quick curve analysis.',
    h1: 'Critical Points Finder',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'mean-median-mode-range': {
    title: 'Mean Median Mode Range Calculator | Data Summary',
    description:
      'Turn one dataset into mean, median, mode, minimum, maximum, and range in a light answer-first statistics layout built for quick descriptive checks.',
    h1: 'Mean Median Mode Range Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'standard-deviation': {
    title: 'Standard Deviation Calculator | Sample & Population',
    description:
      'Measure sample or population spread with standard deviation, variance, and mean outputs in a light answer-first statistics layout.',
    h1: 'Standard Deviation Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'confidence-interval': {
    title: 'Confidence Interval Calculator | Mean & Proportion',
    description:
      'Estimate confidence intervals for sample proportions or known-sigma means in a light answer-first statistics layout with bounds and margin of error together.',
    h1: 'Confidence Interval Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'z-score': {
    title: 'Z-Score Calculator | Standard Score Interpretation',
    description:
      'Convert a raw value into a z-score and plain-language interpretation in a light answer-first statistics layout built for quick standard-score checks.',
    h1: 'Z-Score Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'number-sequence': {
    title: 'Number Sequence Calculator | Arithmetic & Geometric',
    description:
      'Identify arithmetic or geometric patterns, calculate the nth term, and preview future values in a light answer-first sequence calculator.',
    h1: 'Number Sequence Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'permutation-combination': {
    title: 'Permutation & Combination Calculator | nPr, nCr',
    description:
      'Calculate permutations, combinations, and factorial values in a light answer-first counting calculator built for quick exact-integer results.',
    h1: 'Permutation & Combination Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  probability: {
    title: 'Probability Calculator | Odds, Bayes & Binomial',
    description:
      'Calculate single-event, combined-event, conditional, Bayes, and binomial probabilities in a light answer-first probability calculator.',
    h1: 'Probability Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  statistics: {
    title: 'Statistics Calculator | Descriptive Stats Summary',
    description:
      'Calculate a full descriptive statistics summary with centre, spread, variance, and standard deviation in a light answer-first layout.',
    h1: 'Statistics Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  investment: {
    title: 'Investment Calculator | Growth, Inflation & Contributions',
    description:
      'Project ending value, total contributions, compound growth, and inflation-adjusted purchasing power for a broad investment plan.',
    h1: 'Investment Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  correlation: {
    title: 'Correlation Calculator – Pearson, Spearman & Kendall',
    description:
      'Measure Pearson, Spearman, and Kendall correlation with significance checks in a light answer-first statistics layout.',
    h1: 'Correlation Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'regression-analysis': {
    title: 'Regression Analysis | Linear & Polynomial Models',
    description:
      'Fit linear, polynomial, exponential, and logarithmic models with goodness-of-fit metrics in a light answer-first statistics layout.',
    h1: 'Regression Analysis',
    explanationHeading: '',
    paneLayout: 'single',
  },
  distribution: {
    title: 'Distribution Calculator | Normal, t, Chi-Square',
    description:
      'Calculate CDF, PDF, and quantile values for normal, Student\'s t, chi-square, and F distributions in a light answer-first statistics layout.',
    h1: 'Distribution Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  anova: {
    title: 'ANOVA Calculator | One-Way F-Test & Effect Size',
    description:
      'Compare multiple group means with one-way ANOVA, F-statistic, p-value, and effect sizes in a light answer-first statistics layout.',
    h1: 'ANOVA Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'hypothesis-testing': {
    title: 'Hypothesis Testing | t-Tests, Chi-Square & p-Value',
    description:
      'Run one-sample, two-sample, paired, and chi-square hypothesis tests with p-values, intervals, and effect sizes in a light answer-first statistics layout.',
    h1: 'Hypothesis Testing',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'home-loan': {
    title: 'Home Loan Calculator | Mortgage Payment, Interest & Amortization',
    description:
      'Estimate monthly mortgage payment, total interest, amortization, and payoff impact from deposit, rate, term, taxes, and extra payments.',
    h1: 'Home Loan Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'how-much-can-i-borrow': {
    title: 'How Much Can I Borrow Calculator | Mortgage Affordability',
    description:
      'Estimate mortgage affordability from income, debts, deposit, rate, and term, then compare borrowing power with likely monthly payments.',
    h1: 'How Much Can I Borrow Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'remortgage-switching': {
    title: 'Remortgage Calculator | Break-Even, Payment & Savings',
    description:
      'Compare your current mortgage with a new rate or term to estimate payment change, break-even timing, and total savings.',
    h1: 'Remortgage Calculator (Switching)',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'buy-to-let': {
    title: 'Buy-to-Let Mortgage Calculator | Yield, Cash Flow & Cover',
    description:
      'Estimate buy-to-let yield, monthly cash flow, stress coverage, and financing impact from rent, deposit, rate, and costs.',
    h1: 'Buy-to-Let Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'car-loan': {
    title: 'Car Loan Calculator | Payment, APR & Total Cost',
    description:
      'Estimate car loan monthly payment, amount financed, total interest, and total cost using price, deposit, trade-in, fees, tax, APR, and term.',
    h1: 'Car Loan Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'hire-purchase': {
    title: 'Hire Purchase Calculator | Payment, Balloon & Total Cost',
    description:
      'Estimate hire purchase monthly payment, optional balloon amount, total interest, and total payable from vehicle price, deposit, APR, and term.',
    h1: 'Hire Purchase Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'pcp-calculator': {
    title: 'PCP Calculator | Payment, GFV & Total Cost',
    description:
      'Estimate PCP monthly payment, GFV, option fee, total interest, and total payable using vehicle price, deposit, APR, and term.',
    h1: 'PCP Car Finance Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'leasing-calculator': {
    title: 'Car Lease Calculator | Payment, Residual & Lease Cost',
    description:
      'Estimate car lease monthly payment, residual value, finance charge, and total lease cost from price, money factor, upfront payment, and term.',
    h1: 'Car Lease Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'multiple-car-loan': {
    title: 'Auto Loan Comparison Calculator | APR, Payment & Cost',
    description:
      'Compare two auto loans by monthly payment, total interest, total cost, and payoff timing to see which offer is cheaper.',
    h1: 'Auto Loan Comparison Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'offset-calculator': {
    title: 'Offset Mortgage Calculator | Interest Savings & Payoff',
    description:
      'See how an offset savings balance and monthly deposits could reduce mortgage interest, shorten payoff, and change total cost.',
    h1: 'Offset Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'loan-to-value': {
    title: 'LTV Calculator | Loan-to-Value Ratio & Deposit Bands',
    description:
      'Calculate loan-to-value from property value and loan amount or deposit, then compare mortgage risk bands and target deposit levels.',
    h1: 'Loan-to-Value (LTV) Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'personal-loan': {
    title: 'Personal Loan Calculator | Monthly Payment, Interest & Payoff',
    description:
      'Estimate personal loan monthly payment, total interest, total cost, and extra-payment savings from amount, APR, fees, and term.',
    h1: 'Personal Loan Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'interest-rate-change-calculator': {
    title: 'Interest Rate Change Calculator | Mortgage Payment Impact',
    description:
      'Estimate how a mortgage rate increase or decrease changes monthly payment, total interest, and budget pressure over the remaining term.',
    h1: 'Interest Rate Change Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'salary-calculators-hub': {
    title: 'Salary Calculators | Pay Conversion, Overtime, Raises & Commission',
    description:
      'Browse salary calculators to convert pay, compare overtime, plan raises, estimate bonuses, and model commission-based earnings with gross-pay assumptions.',
    h1: 'Salary Calculators',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'salary-calculator': {
    title: 'Salary Calculator – Convert Pay Across Time Periods',
    description:
      'Convert a salary or pay rate across hourly, daily, weekly, biweekly, monthly, and annual amounts using your work schedule assumptions.',
    h1: 'Salary Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'hourly-to-salary-calculator': {
    title: 'Hourly to Salary Calculator – Annual Pay Converter',
    description:
      'Convert an hourly wage into annual salary, monthly pay, biweekly pay, and weekly pay using your hours worked and weeks per year.',
    h1: 'Hourly to Salary Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'salary-to-hourly-calculator': {
    title: 'Salary to Hourly Calculator – Annual to Hourly Pay',
    description:
      'Convert annual salary into hourly pay, weekly pay, biweekly pay, and monthly pay using your hours worked and weeks per year.',
    h1: 'Salary to Hourly Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'annual-to-monthly-salary-calculator': {
    title: 'Annual to Monthly Salary Calculator – Pay Converter',
    description:
      'Convert annual salary into monthly pay, with optional biweekly and weekly estimates based on your yearly income.',
    h1: 'Annual to Monthly Salary Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'monthly-to-annual-salary-calculator': {
    title: 'Monthly to Annual Salary Calculator – Pay Converter',
    description:
      'Convert monthly salary into annual pay, with optional biweekly and weekly estimates based on your monthly income.',
    h1: 'Monthly to Annual Salary Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'weekly-pay-calculator': {
    title: 'Weekly Pay Calculator – Estimate Earnings from Hours',
    description:
      'Estimate weekly pay from your hourly rate and hours worked, with optional support for regular and overtime hour splits.',
    h1: 'Weekly Pay Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'overtime-pay-calculator': {
    title: 'Overtime Pay Calculator – Estimate Extra Earnings',
    description:
      'Estimate overtime pay from your hourly rate, overtime hours, and overtime multiplier, with optional total-pay output.',
    h1: 'Overtime Pay Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'raise-calculator': {
    title: 'Raise Calculator | Calculate New Salary After a Pay Raise',
    description:
      'Calculate a new salary after a raise using either a percentage increase or a flat raise amount.',
    h1: 'Raise Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'bonus-calculator': {
    title: 'Bonus Calculator – Salary Bonus Amount or Percent',
    description:
      'Calculate a bonus as a percentage of salary or as a flat amount, and estimate total compensation.',
    h1: 'Bonus Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'commission-calculator': {
    title: 'Commission Calculator – Calculate Sales Earnings',
    description:
      'Calculate commission earnings from sales and commission rate, with optional total earnings when base pay is included.',
    h1: 'Commission Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'inflation-adjusted-salary-calculator': {
    title: 'Inflation Adjusted Salary Calculator | Real Raise vs Inflation',
    description:
      'Compare current salary, new salary, inflation rate, and years between pay points to see whether a raise keeps up with inflation.',
    h1: 'Inflation Adjusted Salary Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'fraction-calculator': {
    title: 'Fraction Calculator | Math Operations & Simplify',
    description:
      'Use this free fraction calculator to add, subtract, multiply, divide, simplify, and convert fractions with clear worked steps for students.',
    h1: 'Fraction Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'sample-size': {
    title: 'Sample Size Calculator – Mean & Proportion Planner',
    description:
      'Plan your study sample size for proportions or means with confidence intervals, finite-population correction, worked examples, formulas, and research-ready guidance.',
    h1: 'Sample Size Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'triangle-solver': {
    title: 'Triangle Solver | SSS, SAS, ASA, AAS and SSA | CalcHowMuch',
    description:
      'Solve SSS, SAS, ASA, AAS, and SSA triangles with a clear answer-first layout, worked examples, formula notes, and an instant triangle diagram.',
    h1: 'Triangle Solver',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'trig-functions': {
    title: 'Trigonometric Functions Calculator | sin, cos, tan',
    description:
      'Check sin, cos, tan, sec, csc, and cot at one angle with special-angle labels, graph controls, worked examples, and a light answer-first trig layout.',
    h1: 'Trigonometric Functions Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'inverse-trig': {
    title: 'Inverse Trig Functions Calculator | arcsin to arctan',
    description:
      'Find arcsin, arccos, and arctan principal values plus every matching solution in a custom degree or radian interval with a light answer-first trig layout.',
    h1: 'Inverse Trig Functions Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'law-of-sines-cosines': {
    title: 'Sine & Cosine Law Calculator – Triangle Solver',
    description:
      'Solve missing triangle sides, angles, and area with an answer-first Law of Sines and Cosines calculator that recommends the correct trig law and shows a live diagram.',
    h1: 'Law of Sines and Cosines Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'natural-log': {
    title: 'Natural Log Calculator | ln(x) and e^y = x | CalcHowMuch',
    description:
      'Compute ln(x), confirm the matching e^y = x statement, and read the natural log curve in a light answer-first calculator layout.',
    h1: 'Natural Log Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'common-log': {
    title: 'Common Log Calculator | Base 10, 2 & Custom Logs',
    description:
      'Compute base-10, base-2, base-e, or custom logarithms with an answer-first layout that compares change-of-base results and shows the selected log curve.',
    h1: 'Common Log Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'log-properties': {
    title: 'Logarithm Properties Calculator | Log Rules Tool',
    description:
      'Check the product, quotient, and power log rules in an answer-first layout that pairs each numeric result with the matching symbolic rewrite.',
    h1: 'Logarithm Properties Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'exponential-equations': {
    title: 'Exponential Equation Solver | Solve Using Logs',
    description:
      'Solve exponential equations in an answer-first layout that shows the logarithmic rearrangement, solved x value, and a graph checkpoint on the curve.',
    h1: 'Exponential Equation Solver',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'log-scale': {
    title: 'Log Scale Converter | Decibel, pH and Richter',
    description:
      'Convert decibel, pH, and Richter-scale inputs in an answer-first layout that keeps the result, formula, and plain-language interpretation together.',
    h1: 'Log Scale Converter',
    explanationHeading: '',
    paneLayout: 'single',
  },
  derivative: {
    title: 'Derivative Calculator | Symbolic & Point Values',
    description:
      'Find a symbolic derivative, repeat the derivative order, and evaluate the result at one point in a light answer-first calculus layout.',
    h1: 'Derivative Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  integral: {
    title: 'Integral Calculator | Definite and Indefinite',
    description:
      'Find an antiderivative or a definite integral value in a light answer-first calculus layout built for quick power-rule checks.',
    h1: 'Integral Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  limit: {
    title: 'Limit Calculator | One-Sided, Direct & Infinity',
    description:
      'Check direct, one-sided, and infinity limits in a light answer-first calculus layout built for quick continuity and approach-value checks.',
    h1: 'Limit Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'credit-card-minimum-payment': {
    title: 'Credit Card Minimum Payment Calculator | Payoff Time & Interest',
    description:
      'See how long minimum-only credit card payments could take, your first minimum payment, and total interest paid over the payoff period.',
    h1: 'Credit Card Minimum Payment Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'balance-transfer-installment-plan': {
    title: 'Balance Transfer Calculator | Promo APR, Fee & Savings',
    description:
      'Compare transfer fees, promo APR, revert APR, payoff timing, and total cost to see whether a balance transfer saves money.',
    h1: 'Balance Transfer Credit Card Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'credit-card-repayment-payoff': {
    title: 'Credit Card Payoff Calculator | Payment Plan & Interest',
    description:
      'Estimate how long credit card repayment could take, total interest, and total paid from your balance, APR, monthly payment, and extra amount.',
    h1: 'Credit Card Payment Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'credit-card-consolidation': {
    title: 'Credit Card Consolidation Calculator | Loan vs Card Payoff',
    description:
      'Compare keeping card debt versus using a consolidation loan by monthly payment, payoff time, fees, interest, and total repaid.',
    h1: 'Credit Card Consolidation Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'quadratic-equation': {
    title: 'Quadratic Equation Solver Calculator | CalcHowMuch',
    description:
      'Solve quadratic equations of the form ax² + bx + c = 0 with real or complex roots, discriminant details, and step-by-step output.',
    h1: 'Quadratic Equation Solver',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'slope-distance': {
    title: 'Slope and Distance Calculator | CalcHowMuch',
    description:
      'Calculate slope, midpoint, distance, and line equations from two points with clear outputs for vertical, horizontal, and diagonal lines.',
    h1: 'Slope and Distance Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  factoring: {
    title: 'Factoring Calculator | Polynomial Factoring Tool',
    description:
      'Factor algebraic expressions using GCF, quadratic factoring, difference of squares, cubes, and grouping with readable result steps.',
    h1: 'Factoring Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'polynomial-operations': {
    title: 'Polynomial Operations Calculator | Algebra Tool',
    description:
      'Perform polynomial addition, subtraction, multiplication, and division with quotient and remainder outputs and clear operation summaries.',
    h1: 'Polynomial Operations Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'system-of-equations': {
    title: 'System of Equations Solver | 2x2 and 3x3 | CalcHowMuch',
    description:
      'Solve 2x2 and 3x3 linear systems using elimination, substitution, and matrix methods with unique/no-solution diagnostics.',
    h1: 'System of Equations Solver',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'unit-circle': {
    title: 'Unit Circle Calculator | Angles & Trig Values',
    description:
      'Explore unit circle angles in degrees or radians with quadrant, reference angle, and exact sine, cosine, and tangent values.',
    h1: 'Unit Circle Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'overtime-hours-calculator': {
    title: 'Overtime Hours Calculator | Daily, Weekly & Night Overtime',
    description:
      'Calculate regular and overtime hours with daily or weekly thresholds, split shifts, rounding rules, and night-hour tracking for scheduling and payroll checks.',
    h1: 'Overtime Hours Calculator',
  },
  'work-hours-calculator': {
    title: 'Work Hours Calculator | Shift, Break & Weekly Hour Totals',
    description:
      'Calculate shift hours, split shifts, unpaid breaks, and weekly totals in HH:MM and decimal hours for timesheets, rotas, and payroll checks.',
    h1: 'Work Hours Calculator',
  },
  'time-between-two-dates-calculator': {
    title: 'Time Between Two Dates Calculator | Days, Weeks, Months & Hours',
    description:
      'Find the exact time between two dates in days, weeks, months, business days, and hours with date-only or date-time mode, inclusive counting, and copy-ready summaries.',
    h1: 'Time Between Two Dates Calculator',
  },
  'sleep-time-calculator': {
    title: 'Sleep Time Calculator | Best Bedtime & Wake-Up Times',
    description:
      'Find the best bedtime or wake-up time using 90-minute sleep cycles, a fall-asleep buffer, and 4, 5, or 6 cycle options for workdays, travel, or shift schedules.',
    h1: 'Sleep Time Calculator',
  },
  'wake-up-time-calculator': {
    title: 'Wake-Up Time Calculator | Best Alarm Times by Sleep Cycle',
    description:
      'Calculate the best wake-up times from a target bedtime using 90-minute sleep cycles, then compare 4, 5, or 6 cycle options before you set an alarm.',
    h1: 'Wake-Up Time Calculator',
  },
  'nap-time-calculator': {
    title: 'Nap Time Calculator | Best Nap Wake-Up Time',
    description:
      'Choose a quick, power, or longer nap and get the best wake-up time from your start time, nap length, and optional wake buffer.',
    h1: 'Nap Time Calculator',
  },
  'power-nap-calculator': {
    title: 'Power Nap Calculator | Compare 10, 20, 30, 60 & 90 Minutes',
    description:
      'Compare 10, 20, 30, 60, and 90-minute power nap options and see the best wake-up time for each nap length before you set an alarm.',
    h1: 'Power Nap Calculator',
  },
  'energy-based-nap-selector': {
    title: 'Energy-Based Nap Selector | Best Nap Length for Energy Goals',
    description:
      'Choose Quick, Strong, or Full energy goals to get the best nap length, wake-up time, and practical alternatives for daytime or late-night naps.',
    h1: 'Energy-Based Nap Selector',
  },
  'birthday-day-of-week': {
    title: 'Birthday Day-of-Week Calculator | Find the Day You Were Born',
    description:
      'Find the weekday you were born on, preview future birthday weekdays, and spot upcoming Friday, Saturday, or Sunday birthdays for planning.',
    h1: 'Birthday Day-of-Week Calculator',
  },
  'countdown-timer-generator': {
    title: 'Countdown Timer | Live Countdown to Any Date or Event',
    description:
      'Create a live countdown timer for birthdays, launches, holidays, trips, and deadlines, then track time left and export the event to your calendar.',
    h1: 'Countdown Timer',
  },
  'days-until-a-date-calculator': {
    title: 'Days Until a Date Calculator | Countdown, Days Since & Weekdays',
    description:
      'Count days until a future date, days since a past date, or weekdays between two dates with countdown, range, and inclusive-count options.',
    h1: 'Days Until a Date Calculator',
  },
  'age-calculator': {
    title: 'Age Calculator | Exact Age in Years, Months, Days & Next Birthday',
    description:
      'Calculate exact age in years, months, and days from a date of birth or any as-of date, then see total days, total weeks, and your next birthday countdown.',
    h1: 'Age Calculator',
  },
  'discount-calculator': {
    title: 'Discount Calculator | Sale Price and Savings',
    description:
      'Calculate the sale price after a percentage discount and see exactly how much you save.',
    h1: 'Discount Calculator',
  },
  'markup-calculator': {
    title: 'Markup Calculator | Selling Price From Cost & Markup %',
    description:
      'Calculate selling price from cost and markup percentage, or work backward from cost and selling price to find markup %.',
    h1: 'Markup Calculator',
  },
  'what-percent-is-x-of-y': {
    title: 'What Percent Is X of Y Calculator | Find the Share of a Total',
    description:
      'Find what percent one number is of another using X divided by Y times 100, then use the result for scores, budgets, ratios, or completion rates.',
    h1: 'What Percent Is X of Y',
  },
  'percentage-of-a-number-calculator': {
    title: 'Percentage of a Number Calculator | Calculate X% of Y',
    description:
      'Calculate what X% of Y equals with the standard percent-to-decimal formula for discounts, tax, tips, commission, and quick percentage checks.',
    h1: 'Find Percentage of a Number Calculator',
  },
  'reverse-percentage': {
    title: 'Reverse Percentage Calculator | Find the Original Value',
    description:
      'Find the original value before a percentage was applied when you know the final value and the percentage rate.',
    h1: 'Reverse Percentage',
  },
  'present-value': {
    title: 'Present Value Calculator | Future Cash Flow Discounting',
    description:
      'Discount future cash flow into today\'s value using rate, time period, and compounding to compare offers, projects, or investments.',
    h1: 'Present Value Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'future-value': {
    title: 'Future Value Calculator | Savings & Investment Projection',
    description:
      'Project how a lump sum or recurring deposits could grow using return rate, time period, and compounding assumptions.',
    h1: 'Future Value Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'present-value-of-annuity': {
    title: 'Present Value of Annuity Calculator | Payment Stream Value',
    description:
      'Find the present value of recurring payments using discount rate, number of periods, and ordinary or due annuity timing.',
    h1: 'Present Value of Annuity Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'future-value-of-annuity': {
    title: 'Future Value of Annuity Calculator | Savings Plan Growth',
    description:
      'Project how recurring payments could grow using return rate, payment periods, and ordinary or due annuity timing.',
    h1: 'Future Value of Annuity Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'simple-interest': {
    title: 'Simple Interest Calculator | Interest Earned & Final Balance',
    description:
      'Calculate simple interest, total interest earned, and ending balance from principal, rate, and time for loans or savings.',
    h1: 'Simple Interest Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'effective-annual-rate': {
    title: 'Effective Annual Rate Calculator | APR to EAR',
    description:
      'Convert a nominal rate or APR into effective annual rate so you can compare the true yearly borrowing cost or return.',
    h1: 'Effective Annual Rate Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  inflation: {
    title: 'Inflation Calculator | CPI Purchasing Power',
    description:
      'Compare what money from one U.S. CPI month is worth in another and see equivalent value, cumulative inflation, and annualized inflation.',
    h1: 'Inflation Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'time-to-savings-goal': {
    title: 'Time to Savings Goal Calculator | Months to Reach Target',
    description:
      'Estimate how many months it could take to reach a savings goal using current balance, recurring deposits, interest rate, and compounding.',
    h1: 'Time to Savings Goal Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'monthly-savings-needed': {
    title: 'Monthly Savings Needed Calculator | Savings Goal Planner',
    description:
      'Calculate the monthly savings needed to reach a target balance using current savings, time horizon, rate, compounding, and deposit timing.',
    h1: 'Monthly Savings Needed Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'compound-interest': {
    title: 'Compound Interest Calculator | Savings Growth & Ending Balance',
    description:
      'Project ending balance, interest earned, and contribution impact from principal, return rate, time, and compounding frequency.',
    h1: 'Compound Interest Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'simple-interest': {
    title: 'Simple Interest Calculator | Interest Earned & Final Balance',
    description:
      'Calculate simple interest, total interest earned, and ending balance from principal, rate, and time for loans or savings.',
    h1: 'Simple Interest Calculator',
  },
  'investment-growth': {
    title: 'Investment Growth Calculator | Future Value & Real Return',
    description:
      'Project future value, total contributions, total gains, and inflation-adjusted balance from expected return and time horizon.',
    h1: 'Investment Growth Calculator',
  },
  'investment-return': {
    title: 'Investment Return Calculator | CAGR, Profit & Real Return',
    description:
      'Estimate ending value, profit, CAGR, and real return with recurring deposits, tax assumptions, inflation, and scenario testing.',
    h1: 'Investment Return Calculator',
    paneLayout: 'single',
    explanationHeading: '',
  },
  'commission-calculator': {
    title: 'Sales Commission Calculator | Flat & Tiered Commission on Sales',
    description:
      'Calculate commission on sales using flat or tiered rates, compare the effective commission %, and model payout scenarios for pricing or sales plans.',
    h1: 'Sales Commission Calculator',
    paneLayout: 'single',
    suppressAdsColumn: true,
    calculatorPanelClass: 'panel--shellless',
    layoutMainClass: 'layout-main--no-ads',
  },
  'margin-calculator': {
    title: 'Margin Calculator | Gross Margin %, Profit & Selling Price',
    description:
      'Calculate gross margin percentage, profit, or target selling price from cost so you can price products and protect profitability.',
    h1: 'Margin Calculator',
  },
  'percent-change': {
    title: 'Percent Change Calculator | Percentage Increase or Decrease',
    description:
      'Calculate percent change between an original and new value, show increase or decrease, and see the signed result, raw change, and formula in one step.',
    h1: 'Percent Change Calculator',
    explanationHeading: '',
  },
  'percentage-difference': {
    title: 'Percentage Difference Calculator | Compare Two Values Fairly',
    description:
      'Compare two values with the symmetric percentage difference formula that uses their average as the baseline when neither number is the original.',
    h1: 'Percentage Difference Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'percentage-increase': {
    title: 'Percentage Increase Calculator | Growth from Original Value',
    description:
      'Calculate percentage increase from an original value to a new value and see the growth amount, direction, and formula in one step.',
    h1: 'Percentage Increase Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'percentage-decrease': {
    title: 'Percentage Decrease Calculator | Percentage Drop from Original',
    description:
      'Calculate percentage decrease from an original value to a lower value and see the drop amount, direction, and formula in one step.',
    h1: 'Percentage Decrease Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'percentage-composition': {
    title: 'Percentage Composition Calculator | Percent Share of a Total',
    description:
      "Calculate each item's percentage share of a total, compare components, and see any remainder percentage from a known or calculated total.",
    h1: 'Percentage Composition Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'percent-to-fraction-decimal': {
    title: 'Percent to Fraction & Decimal Calculator | Convert a Percentage',
    description:
      'Convert a percentage into a decimal and simplified fraction, then check the divide-by-100 steps and final forms side by side.',
    h1: 'Percent to Fraction & Decimal Converter',
  },
  'percentage-of-a-number': {
    title: 'Percentage of a Number Calculator | Calculate X% of Y',
    description:
      'Calculate what X% of Y equals with the standard percent-to-decimal formula for discounts, tax, tips, commission, and quick percentage checks.',
    h1: 'Find Percentage of a Number Calculator',
  },
};

const ROUTE_SPECIFIC_OVERRIDES = {
  '/salary-calculators/commission-calculator/': {
    title: 'Commission Earnings Calculator | Sales Commission Pay & Base Pay',
    description:
      'Calculate commission earnings from sales, rate, or a known payout amount, then add base pay to estimate gross total earnings.',
    h1: 'Commission Earnings Calculator',
    paneLayout: 'single',
  },
};

const HOME_LOAN_SCHEMA_CONFIG = {
  'home-loan': {
    breadcrumbLabel: 'Home Loan',
    softwareName: 'Home Loan Calculator',
    softwareDescription:
      'Estimate monthly mortgage payment, total interest, amortization schedule, and payoff impact from deposit, rate, term, taxes, and extra payments.',
    featureList: [
      'Monthly mortgage payment estimate',
      'Amortization schedule (monthly and yearly)',
      'Principal versus interest split',
      'Extra payment and lump-sum payoff impact',
    ],
    keywords: [
      'home loan calculator',
      'mortgage calculator',
      'amortization schedule',
      'monthly mortgage payment',
      'extra payment mortgage',
    ],
  },
  'how-much-can-i-borrow': {
    breadcrumbLabel: 'How Much Can I Borrow',
    softwareName: 'How Much Can I Borrow Calculator',
    softwareDescription:
      'Estimate mortgage affordability from income, debts, deposit, rate, and term using income multiple and payment-to-income checks.',
    featureList: [
      'Income multiple borrowing estimate',
      'Payment-to-income affordability mode',
      'Maximum borrow and property budget',
      'Rate and term scenario comparison',
    ],
    keywords: [
      'how much can i borrow calculator',
      'mortgage affordability calculator',
      'income multiple mortgage',
      'payment to income calculator',
      'borrowing power calculator',
    ],
  },
  'remortgage-switching': {
    breadcrumbLabel: 'Remortgage / Switching',
    softwareName: 'Remortgage Calculator (Switching)',
    softwareDescription:
      'Compare your current mortgage against a new rate or term to estimate payment change, break-even timing, and total savings.',
    featureList: [
      'Monthly and annual savings',
      'Break-even month tracking',
      '2 to 10 year horizon comparison',
      'Monthly and yearly cost tables',
    ],
    keywords: [
      'remortgage calculator',
      'mortgage switching calculator',
      'remortgage savings',
      'mortgage break-even calculator',
      'compare mortgage rates',
    ],
  },
  'buy-to-let': {
    breadcrumbLabel: 'Buy-to-Let Calculator',
    softwareName: 'Buy-to-Let Calculator',
    softwareDescription:
      'Estimate buy-to-let yield, monthly cash flow, and lender stress coverage for rental property financing scenarios.',
    featureList: [
      'Gross and net rental yield',
      'Monthly and annual cashflow',
      'Stress coverage ratio',
      'Interest-only versus repayment comparison',
    ],
    keywords: [
      'buy-to-let calculator',
      'rental yield calculator',
      'buy-to-let cashflow calculator',
      'stress coverage ratio',
      'interest only mortgage calculator',
    ],
  },
  'offset-calculator': {
    breadcrumbLabel: 'Offset Calculator',
    softwareName: 'Offset Calculator',
    softwareDescription:
      'Model how offset savings and monthly deposits reduce mortgage interest, shorten payoff, and change total cost.',
    featureList: [
      'Offset interest savings estimate',
      'Effective mortgage balance tracking',
      'Payoff timeline reduction',
      'Monthly and yearly comparison tables',
    ],
    keywords: [
      'offset calculator',
      'offset mortgage calculator',
      'offset savings interest',
      'mortgage payoff calculator',
      'effective balance calculator',
    ],
  },
  'interest-rate-change-calculator': {
    breadcrumbLabel: 'Interest Rate Change Calculator',
    softwareName: 'Interest Rate Change Calculator',
    softwareDescription:
      'Estimate monthly payment and total interest impact when a mortgage rate changes now or after a selected period.',
    featureList: [
      'Current versus new rate comparison',
      'Immediate or delayed rate-change timing',
      'Monthly payment impact estimate',
      'Total interest and cost difference',
    ],
    keywords: [
      'interest rate change calculator',
      'mortgage payment change',
      'rate rise impact calculator',
      'mortgage interest comparison',
      'refinance impact calculator',
    ],
  },
  'loan-to-value': {
    breadcrumbLabel: 'Loan-to-Value (LTV) Calculator',
    softwareName: 'Loan-to-Value (LTV) Calculator',
    softwareDescription:
      'Calculate mortgage loan-to-value and review deposit bands using property value with loan or deposit inputs.',
    featureList: [
      'Loan-to-value percentage calculator',
      'Loan or deposit input modes',
      'Risk band classification',
      'Target LTV planning table',
    ],
    keywords: [
      'loan to value calculator',
      'ltv calculator',
      'mortgage ltv bands',
      'deposit percentage calculator',
      'remortgage ltv',
    ],
  },
  'personal-loan': {
    breadcrumbLabel: 'Personal Loan Calculator',
    softwareName: 'Personal Loan Calculator',
    softwareDescription:
      'Estimate personal loan monthly payment, total interest, total cost, and the payoff impact of extra monthly payments across a fixed-rate term.',
    featureList: [
      'Fixed-rate monthly payment estimate',
      'Total repayment and interest breakdown',
      'Early payoff projection with extra payments',
      '12-month amortization preview and balance chart',
    ],
    keywords: [
      'personal loan calculator',
      'loan emi calculator',
      'monthly payment calculator',
      'loan interest calculator',
      'early payoff calculator',
    ],
  },
};

const FINANCE_SCHEMA_CONFIG = {
  'monthly-savings-needed': {
    breadcrumbLabel: 'Monthly Savings Needed',
    softwareName: 'Monthly Savings Needed Calculator',
    softwareDescription:
      'Calculate the monthly savings needed to reach a target balance using current savings, time horizon, interest rate, and compounding.',
    featureList: [
      'Required monthly savings calculation',
      'Total contributions breakdown',
      'Total interest earned',
      'Compounding frequency options',
    ],
    keywords: [
      'monthly savings calculator',
      'savings goal calculator',
      'how much to save',
      'investment calculator',
    ],
  },
  'compound-interest': {
    breadcrumbLabel: 'Compound Interest',
    softwareName: 'Compound Interest Calculator',
    softwareDescription:
      'Project ending balance, interest earned, and contribution impact from principal, return rate, time, and compounding frequency.',
    featureList: [
      'Ending balance estimate',
      'Total interest earned',
      'Compounding frequency toggle',
      'Yearly contribution slider',
    ],
    keywords: [
      'compound interest calculator',
      'interest calculator',
      'investment growth',
      'savings calculator',
    ],
  },
  'time-to-savings-goal': {
    breadcrumbLabel: 'Time to Savings Goal',
    softwareName: 'Time to Savings Goal Calculator',
    softwareDescription:
      'Estimate how many months it could take to reach your savings target with regular contributions, interest, and compounding.',
    featureList: [
      'Time to goal estimate',
      'Total interest earned',
      'Total accumulated balance',
      'Compounding frequency options',
    ],
    keywords: ['time to savings goal', 'savings calculator', 'goal calculator', 'how long to save'],
  },
  'effective-annual-rate': {
    breadcrumbLabel: 'Effective Annual Rate',
    softwareName: 'Effective Annual Rate Calculator',
    softwareDescription:
      'Convert a nominal rate or APR into effective annual rate using compounding frequency.',
    featureList: [
      'Nominal to EAR conversion',
      'Compounding frequency options',
      'Difference highlight',
    ],
    keywords: [
      'effective annual rate calculator',
      'ear calculator',
      'nominal vs effective',
      'interest rate converter',
    ],
  },
  inflation: {
    breadcrumbLabel: 'Inflation Calculator',
    breadcrumbSectionLabel: 'Finance Calculators',
    softwareName: 'Inflation Calculator',
    webPageName: 'Inflation Calculator',
    webPageDescription:
      'Compare what money from one U.S. CPI month is worth in another and see equivalent value, cumulative inflation, and annualized inflation.',
    linkWebPageToSoftwareApplication: true,
    softwareDescription:
      'Calculate inflation-adjusted value using U.S. CPI data to compare purchasing power across months and years.',
    featureList: [
      'Inflation-adjusted value comparison',
      'Equivalent value in target month',
      'Cumulative inflation rate',
      'Annualized inflation rate',
      'Purchasing power comparison',
    ],
    keywords: [
      'inflation calculator',
      'CPI calculator',
      'purchasing power calculator',
      'inflation-adjusted value',
      'value of money over time',
    ],
  },
  'future-value': {
    breadcrumbLabel: 'Future Value (FV)',
    softwareName: 'Future Value (FV) Calculator',
    softwareDescription:
      'Project how a lump sum or recurring deposits could grow over time using return rate and compounding.',
    featureList: [
      'Future value estimate',
      'Total growth breakdown',
      'Regular contributions',
      'Compounding frequency options',
    ],
    keywords: [
      'future value calculator',
      'fv calculator',
      'time value of money',
      'investment growth',
    ],
  },
  'future-value-of-annuity': {
    breadcrumbLabel: 'Future Value of Annuity',
    softwareName: 'Future Value of Annuity Calculator',
    softwareDescription:
      'Project how recurring payments could grow and compare ordinary annuity versus annuity due.',
    featureList: [
      'Ordinary vs Annuity Due',
      'Future value estimate',
      'Total interest earned',
      'Payment frequency calculation',
    ],
    keywords: [
      'future value of annuity calculator',
      'fva calculator',
      'annuity calculator',
      'time value of money',
    ],
  },
  investment: {
    breadcrumbLabel: 'Investment Calculator',
    softwareName: 'Investment Calculator',
    softwareDescription:
      'Project ending value, total contributions, compound growth, and inflation-adjusted purchasing power for a broad investment plan.',
    featureList: [
      'Ending value projection',
      'Contribution breakdown',
      'Inflation-adjusted purchasing power',
      'Compound growth comparison',
    ],
    keywords: [
      'investment calculator',
      'investment growth calculator',
      'compound growth calculator',
      'inflation adjusted investment calculator',
    ],
  },
  'investment-growth': {
    breadcrumbLabel: 'Investment Growth',
    softwareName: 'Investment Growth Calculator',
    softwareDescription:
      'Project future value, total contributions, total gains, and inflation-adjusted balance from expected return and time horizon.',
    featureList: [
      'Investment growth projection',
      'Inflation adjustment',
      'Monthly contribution',
      'Total gains breakdown',
    ],
    keywords: [
      'investment calculator',
      'growth calculator',
      'compound interest',
      'inflation adjusted return',
    ],
  },
  'investment-return': {
    breadcrumbLabel: 'Investment Return',
    softwareName: 'Investment Return Calculator',
    softwareDescription:
      'Estimate ending value, profit, CAGR, and real return with recurring deposits, tax assumptions, and inflation adjustments.',
    featureList: [
      'Future value from lump sum and recurring contributions',
      'Annual and monthly breakdowns',
      'Tax on gains with loss carryforward modeling',
      'Inflation-adjusted return metrics',
    ],
    keywords: [
      'investment return calculator',
      'portfolio growth calculator',
      'cagr calculator',
      'inflation adjusted investment return',
    ],
  },
  'present-value': {
    breadcrumbLabel: 'Present Value (PV)',
    softwareName: 'Present Value (PV) Calculator',
    softwareDescription:
      'Discount future cash flow into today\'s value using rate, time period, and compounding.',
    featureList: ['Present value estimate', 'Discount lost breakdown', 'Compounding options'],
    keywords: [
      'present value calculator',
      'pv calculator',
      'discount rate calculator',
      'time value of money',
    ],
  },
  'present-value-of-annuity': {
    breadcrumbLabel: 'Present Value of Annuity',
    softwareName: 'Present Value of Annuity Calculator',
    softwareDescription:
      'Find the present value of recurring payments and compare ordinary annuity versus annuity due.',
    featureList: ['Ordinary vs Annuity Due', 'Present value estimate', 'Discount saved breakdown'],
    keywords: [
      'present value of annuity calculator',
      'pva calculator',
      'annuity value',
      'time value of money',
    ],
  },
  'simple-interest': {
    breadcrumbLabel: 'Simple Interest',
    softwareName: 'Simple Interest Calculator',
    softwareDescription:
      'Calculate simple interest to find total interest earned and ending balance using principal, rate, and time.',
    featureList: [
      'Total interest calculation',
      'Ending amount estimate',
      'Time unit toggle',
      'Interest basis toggle',
    ],
    keywords: [
      'simple interest calculator',
      'interest calculator',
      'loan interest',
      'ending balance',
    ],
  },
};

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return process.argv[index + 1] || null;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function normalizeRoute(rawRoute) {
  if (!rawRoute || typeof rawRoute !== 'string') {
    return null;
  }
  let route = rawRoute.trim();
  if (!route) {
    return null;
  }
  if (!route.startsWith('/')) {
    route = `/${route}`;
  }
  route = route.replace(/\/+/g, '/');
  if (route !== '/' && !route.endsWith('/')) {
    route = `${route}/`;
  }
  return route;
}

function parseGenerationScope() {
  const targetRoute = normalizeRoute(process.env.TARGET_ROUTE || getArgValue('--route'));
  const targetCalcId = (process.env.TARGET_CALC_ID || getArgValue('--calc-id') || '').trim() || null;
  const fullSite = process.env.GENERATE_ALL_ROUTES === '1' || hasFlag('--all');

  if (fullSite && (targetRoute || targetCalcId)) {
    throw new Error(
      'Invalid scope: use either full-site mode (--all / GENERATE_ALL_ROUTES=1) or a scoped target (--route / TARGET_ROUTE or --calc-id / TARGET_CALC_ID), not both.'
    );
  }

  if (!fullSite && !targetRoute && !targetCalcId) {
    throw new Error(
      'Safe mode: this generator requires explicit scope. Use TARGET_ROUTE=/path/ (or --route /path/), TARGET_CALC_ID=<id> (or --calc-id <id>), or opt into full-site regeneration with --all (or GENERATE_ALL_ROUTES=1).'
    );
  }

  return { targetRoute, targetCalcId, fullSite };
}

function parseBooleanFlag(value) {
  if (typeof value !== 'string') {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true';
}

function indentBlock(block, indent) {
  return block
    .split('\n')
    .map((line) => (line ? `${indent}${line}` : line))
    .join('\n');
}

function inferDesignFamily(categoryId, subcategoryId) {
  if (categoryId === 'loans' && DESIGN_FAMILIES.has(subcategoryId)) {
    return subcategoryId;
  }
  return 'neutral';
}

function resolveCalculatorGovernance({ category, subcategory, calculator, override }) {
  const routeArchetype = calculator.routeArchetype ?? 'calc_exp';
  const inferredDesignFamily = inferDesignFamily(category.id, subcategory.id);
  const designFamily = calculator.designFamily ?? inferredDesignFamily;
  const forcedPaneLayout = FORCED_SINGLE_PANE_CALCULATOR_IDS.has(calculator.id) ? 'single' : null;
  const overridePaneLayout = override?.paneLayout;

  if (
    !forcedPaneLayout &&
    calculator.paneLayout &&
    overridePaneLayout &&
    calculator.paneLayout !== overridePaneLayout
  ) {
    throw new Error(
      `Conflicting paneLayout for ${calculator.id}: navigation=${calculator.paneLayout} override=${overridePaneLayout}`
    );
  }

  let paneLayout = forcedPaneLayout ?? calculator.paneLayout ?? overridePaneLayout ?? 'split';

  if (!ROUTE_ARCHETYPES.has(routeArchetype)) {
    throw new Error(
      `Unsupported routeArchetype "${routeArchetype}" for ${calculator.id}. Allowed: ${Array.from(
        ROUTE_ARCHETYPES
      ).join(', ')}`
    );
  }

  if (!DESIGN_FAMILIES.has(designFamily)) {
    throw new Error(
      `Unsupported designFamily "${designFamily}" for ${calculator.id}. Allowed: ${Array.from(
        DESIGN_FAMILIES
      ).join(', ')}`
    );
  }

  if (!PANE_LAYOUTS.has(paneLayout)) {
    throw new Error(
      `Unsupported paneLayout "${paneLayout}" for ${calculator.id}. Allowed: ${Array.from(
        PANE_LAYOUTS
      ).join(', ')}`
    );
  }

  if (routeArchetype !== 'calc_exp') {
    paneLayout = 'single';
  }

  calculator.routeArchetype = routeArchetype;
  calculator.designFamily = designFamily;
  calculator.paneLayout = paneLayout;

  return { routeArchetype, designFamily, paneLayout };
}

function appendVersionParam(href, version = ROUTE_ASSET_VERSION) {
  if (typeof href !== 'string' || !href.trim() || !version) {
    return href;
  }
  const [pathAndQuery, hash = ''] = href.split('#');
  if (/[?&]v=/.test(pathAndQuery)) {
    return href;
  }
  const separator = pathAndQuery.includes('?') ? '&' : '?';
  const withVersion = `${pathAndQuery}${separator}v=${encodeURIComponent(version)}`;
  return hash ? `${withVersion}#${hash}` : withVersion;
}

function versionCalculatorSourceHref(href) {
  if (typeof href !== 'string') {
    return href;
  }
  return href.startsWith('/calculators/') ? appendVersionParam(href) : href;
}

function applyCalculatorFragmentVersioning(html) {
  if (typeof html !== 'string' || !html) {
    return html;
  }
  return html.replace(
    /\/calculators\/[^"')\s]+?\.(?:js|css)(?:\?[^"')\s]*)?/g,
    (match) => versionCalculatorSourceHref(match)
  );
}

function normalizeSeoText(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/â€“/g, '–')
    .replace(/\u2026|\.{3,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildTitle(name) {
  const normalizedName = normalizeSeoText(name);
  return `${normalizedName} | Calculate How Much Online Calculator`;
}

function buildDescription(name) {
  const normalizedName = normalizeSeoText(name);
  return `${normalizedName} calculator with fast inputs and clear results. Calculate How Much provides explanations, examples, and assumptions to help you plan confidently.`;
}

function buildCanonical(pathname) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`;
  return `${SITE_URL}${withSlash}`;
}

function resolveCalculatorOverride(calculator) {
  const routeKey = normalizeRoutePath(calculator?.url || '');
  if (routeKey && ROUTE_SPECIFIC_OVERRIDES[routeKey]) {
    return ROUTE_SPECIFIC_OVERRIDES[routeKey];
  }
  return CALCULATOR_OVERRIDES[calculator?.id];
}

function isCalculatorPath(pathname) {
  const normalizedPath = typeof pathname === 'string' ? pathname : '';
  return normalizedPath.includes('-calculators/') || normalizedPath.endsWith('-calculator/');
}

function isCalculatorPathFromCanonical(canonicalUrl) {
  try {
    const parsed = new URL(canonicalUrl, SITE_URL);
    return isCalculatorPath(parsed.pathname);
  } catch {
    return false;
  }
}

function toTitleCaseLabel(value) {
  return String(value)
    .split('-')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
}

function buildCalculatorFallbackStructuredData({ canonical, title, description, h1 }) {
  let pathname = '/';
  try {
    pathname = new URL(canonical, SITE_URL).pathname || '/';
  } catch {
    pathname = '/';
  }

  const segments = pathname.split('/').filter(Boolean);
  const clusterSegment = segments[0] || '';
  const softwareName =
    normalizeSeoText(h1) || normalizeSeoText(title).split('|')[0].trim() || 'Calculator';
  const breadcrumbLabel = toTitleCaseLabel(clusterSegment);
  const clusterItem = clusterSegment ? `${SITE_URL}/${clusterSegment}/` : '';

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
  ];

  if (breadcrumbLabel && clusterItem && clusterItem !== canonical) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: breadcrumbLabel,
      item: clusterItem,
    });
  }

  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: softwareName,
    item: canonical,
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#softwareapplication`,
        name: softwareName,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: canonical,
        description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: breadcrumbItems,
      },
    ],
  };
}

function buildCollectionPageStructuredData({
  canonical,
  title,
  description,
  collectionName,
  breadcrumbName,
}) {
  const name = normalizeSeoText(collectionName) || normalizeSeoText(title) || 'Calculators';
  const breadcrumbLabel = normalizeSeoText(breadcrumbName) || name;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'CalcHowMuch',
        inLanguage: 'en',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'CalcHowMuch',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
      },
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#webpage`,
        name: title,
        url: canonical,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#softwareapplication`,
        name,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: canonical,
        description,
        inLanguage: 'en',
        provider: { '@id': `${SITE_URL}/#organization` },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: breadcrumbLabel,
            item: canonical,
          },
        ],
      },
    ],
  };
}

function generateHeadMeta({
  canonicalUrl,
  seoTitle,
  seoDescription,
  ogImageUrl,
  h1,
  isCalculatorPage,
}) {
  const fallbackTitle = normalizeSeoText(h1) || 'CalcHowMuch';
  const title = normalizeSeoText(seoTitle) || fallbackTitle;
  let description = normalizeSeoText(seoDescription);
  if (!description || description.toLowerCase() === title.toLowerCase()) {
    description = `${fallbackTitle} with clear inputs, practical assumptions, and transparent results on CalcHowMuch.`;
  }

  const canonical = normalizeSeoText(canonicalUrl) || `${SITE_URL}/`;
  const ogImage = normalizeSeoText(ogImageUrl) || OG_IMAGE;
  const calculatorFallbackJsonLd = isCalculatorPage
    ? `\n    <script type="application/ld+json" data-static-ld="true" data-calculator-ld="true">${stringifyStructuredData(
        buildCalculatorFallbackStructuredData({
          canonical,
          title,
          description,
          h1: fallbackTitle,
        })
      )}</script>`
    : '';

  // Keep argument explicit in the shared contract even though current tags are identical.
  const ogType = isCalculatorPage ? 'website' : 'website';

  return `    <meta charset="utf-8" />
    <title>${escapeHtmlAttr(title)}</title>
    <meta name="description" content="${escapeHtmlAttr(description)}" />
    <link rel="canonical" href="${escapeHtmlAttr(canonical)}" />
    <meta property="og:title" content="${escapeHtmlAttr(title)}" />
    <meta property="og:description" content="${escapeHtmlAttr(description)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${escapeHtmlAttr(canonical)}" />
    <meta property="og:image" content="${escapeHtmlAttr(ogImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtmlAttr(title)}" />
    <meta name="twitter:description" content="${escapeHtmlAttr(description)}" />
    <meta name="twitter:image" content="${escapeHtmlAttr(ogImage)}" />
    <meta name="robots" content="index,follow" />${calculatorFallbackJsonLd}`;
}

function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizeHtmlText(value) {
  return decodeHtmlEntities(String(value).replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTagText(html, tagName) {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = html.match(re);
  return match ? normalizeHtmlText(match[1]) : '';
}

function extractCalculatorFaqEntries(explanationHtml, calculatorId) {
  const salaryFaqGridMatch = explanationHtml.match(
    /<div[^>]*class="[^"]*\bsal-faq-grid\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );
  if (salaryFaqGridMatch) {
    const entries = [];
    const cardRegex = /<article[^>]*class="[^"]*\bsal-related-card\b[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;

    for (const [, cardHtml] of salaryFaqGridMatch[1].matchAll(cardRegex)) {
      const question = extractTagText(cardHtml, 'h3');
      const answer = extractTagText(cardHtml, 'p');
      if (!question || !answer) {
        continue;
      }
      entries.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      });
    }

    if (entries.length >= 4) {
      return entries;
    }
  }

  const faqSectionMatch = explanationHtml.match(
    /<section[^>]*id="[^"]*faq[^"]*"[^>]*>([\s\S]*?)<\/section>/i
  );
  const faqHtml = faqSectionMatch ? faqSectionMatch[1] : explanationHtml;
  const cardRegex = /<(div|article)[^>]*class="[^"]*\bfaq-card\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi;
  const entries = [];

  for (const [, , cardHtml] of faqHtml.matchAll(cardRegex)) {
    const question = extractTagText(cardHtml, 'h4');
    const answer = extractTagText(cardHtml, 'p');
    if (!question || !answer) {
      continue;
    }
    entries.push({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    });
  }

  if (entries.length < 4) {
    throw new Error(
      `Expected at least 4 FAQ entries for ${calculatorId}, extracted ${entries.length} from explanation.html`
    );
  }

  if (calculatorId === 'home-loan' && entries.length !== 10) {
    throw new Error(
      `Expected 10 FAQ entries for ${calculatorId}, extracted ${entries.length} from explanation.html`
    );
  }

  return entries;
}

function buildHomeLoanStructuredData({
  calculatorId,
  title,
  description,
  canonical,
  faqEntries,
  breadcrumbLabel,
  softwareName,
  softwareDescription,
  featureList = [],
  keywords = [],
}) {
  const isHomeLoanRoot = calculatorId === 'home-loan';
  const breadcrumbList = isHomeLoanRoot
    ? [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Home Loan',
          item: `${SITE_URL}/loan-calculators/mortgage-calculator/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: breadcrumbLabel,
          item: canonical,
        },
      ]
    : [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Home Loan',
          item: `${SITE_URL}/loan-calculators/mortgage-calculator/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: breadcrumbLabel,
          item: canonical,
        },
      ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'CalcHowMuch',
        inLanguage: 'en',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'CalcHowMuch',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        name: title,
        url: canonical,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#softwareapplication`,
        name: softwareName,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: canonical,
        description: softwareDescription || description,
        inLanguage: 'en',
        provider: { '@id': `${SITE_URL}/#organization` },
        ...(featureList.length ? { featureList } : {}),
        ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqEntries,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: breadcrumbList,
      },
    ],
  };
}

function buildFinanceStructuredData({
  title,
  description,
  canonical,
  faqEntries,
  breadcrumbLabel,
  breadcrumbSectionLabel = 'Finance',
  softwareName,
  webPageName,
  webPageDescription,
  linkWebPageToSoftwareApplication = false,
  softwareDescription,
  featureList = [],
  keywords = [],
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'CalcHowMuch',
        inLanguage: 'en',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'CalcHowMuch',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        name: webPageName || title,
        url: canonical,
        description: webPageDescription || description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
        ...(linkWebPageToSoftwareApplication
          ? {
              about: { '@id': `${canonical}#softwareapplication` },
              mainEntity: { '@id': `${canonical}#softwareapplication` },
              breadcrumb: { '@id': `${canonical}#breadcrumbs` },
            }
          : {}),
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#softwareapplication`,
        name: softwareName,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: canonical,
        description: softwareDescription || description,
        inLanguage: 'en',
        provider: { '@id': `${SITE_URL}/#organization` },
        ...(featureList.length ? { featureList } : {}),
        ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqEntries,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: breadcrumbSectionLabel,
            item: `${SITE_URL}/finance-calculators/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: breadcrumbLabel,
            item: canonical,
          },
        ],
      },
    ],
  };
}

function buildSalaryStructuredData({
  title,
  description,
  canonical,
  faqEntries,
  softwareName,
  softwareDescription,
  featureList = [],
  keywords = [],
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'CalcHowMuch',
        inLanguage: 'en',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'CalcHowMuch',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        name: title,
        url: canonical,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
        about: { '@id': `${canonical}#softwareapplication` },
        mainEntity: { '@id': `${canonical}#softwareapplication` },
        breadcrumb: { '@id': `${canonical}#breadcrumbs` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#softwareapplication`,
        name: softwareName,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: canonical,
        description: softwareDescription || description,
        inLanguage: 'en',
        provider: { '@id': `${SITE_URL}/#organization` },
        ...(featureList.length ? { featureList } : {}),
        ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqEntries,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Salary Calculators',
            item: `${SITE_URL}/salary-calculators/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: softwareName,
            item: canonical,
          },
        ],
      },
    ],
  };
}

function buildMathStructuredData({
  title,
  description,
  canonical,
  faqEntries,
  breadcrumbLabel,
  softwareName,
  softwareDescription,
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'CalcHowMuch',
        inLanguage: 'en',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'CalcHowMuch',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        name: title,
        url: canonical,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
        about: { '@id': `${canonical}#softwareapplication` },
        mainEntity: { '@id': `${canonical}#softwareapplication` },
        breadcrumb: { '@id': `${canonical}#breadcrumbs` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#softwareapplication`,
        name: softwareName,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: canonical,
        description: softwareDescription || description,
        inLanguage: 'en',
        provider: { '@id': `${SITE_URL}/#organization` },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqEntries,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Math',
            item: `${SITE_URL}/math/basic/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: breadcrumbLabel,
            item: canonical,
          },
        ],
      },
    ],
  };
}

function buildHomepageStructuredData({ title, description, canonical }) {
  const faqEntries = [
    {
      '@type': 'Question',
      name: 'What calculators are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CalcHowMuch covers mortgage, loan, credit card, finance, pricing, salary, time, percentage, and math calculators.',
      },
    },
    {
      '@type': 'Question',
      name: 'How should I choose the right calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with the closest calculator cluster, then choose the route that matches your exact question such as margin, markup, overtime, age, or mortgage payment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the results accurate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Calculations use standard formulas and are designed for planning, comparison, and educational use.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the calculators free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All calculators on CalcHowMuch are free to use.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to sign up to use the calculators?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The calculators are available instantly in your browser without registration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store my inputs or calculation results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Calculator inputs and results stay in your browser and are not stored as personal calculation records.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use these calculator results for financial, legal, or tax decisions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Calculator results are for informational and planning purposes only and should not replace professional advice.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do results sometimes differ from banks, lenders, or other websites?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Results can differ because other tools may use different assumptions, rounding methods, timing rules, fees, or tax treatments.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do the calculators work on mobile devices?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. CalcHowMuch calculators are designed to work on mobile, tablet, and desktop devices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do your calculators include fees, taxes, or penalties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on the route. Some calculators include optional fee or tax inputs, while others focus on the core formula only.',
      },
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Calculate How Much',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Calculate How Much',
        inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/calculators/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        name: title,
        url: canonical,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqEntries,
      },
    ],
  };
}

function stringifyStructuredData(structuredData) {
  return JSON.stringify(structuredData).replace(/<\/script/gi, '<\\/script');
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function normalizeRoutePath(routePath) {
  if (!routePath || typeof routePath !== 'string') {
    return null;
  }
  let normalized = routePath.trim();
  if (!normalized) {
    return null;
  }
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  normalized = normalized.replace(/\/+/g, '/');
  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

function readRouteBundleManifest() {
  if (!fs.existsSync(ROUTE_BUNDLE_MANIFEST_PATH)) {
    throw new Error(`Missing route CSS bundle manifest: ${ROUTE_BUNDLE_MANIFEST_PATH}`);
  }
  const manifest = JSON.parse(readFile(ROUTE_BUNDLE_MANIFEST_PATH));
  if (!manifest || typeof manifest !== 'object' || !manifest.routes) {
    throw new Error(`Invalid route CSS bundle manifest: ${ROUTE_BUNDLE_MANIFEST_PATH}`);
  }
  return manifest;
}

function resolveRouteBundleEntry(manifest, routePath) {
  const normalizedRoute = normalizeRoutePath(routePath);
  if (!normalizedRoute) {
    return null;
  }
  const entry = manifest.routes[normalizedRoute];
  if (!entry || typeof entry !== 'object') {
    return null;
  }
  return entry;
}

function readAssetManifest() {
  if (!fs.existsSync(ASSET_MANIFEST_PATH)) {
    return { routes: {} };
  }
  const manifest = JSON.parse(readFile(ASSET_MANIFEST_PATH));
  if (!manifest || typeof manifest !== 'object' || !manifest.routes) {
    throw new Error(`Invalid asset manifest: ${ASSET_MANIFEST_PATH}`);
  }
  return manifest;
}

function syncClusterRegistryToPublic() {
  if (!fs.existsSync(SOURCE_CLUSTER_REGISTRY_PATH)) {
    throw new Error(`Missing cluster registry: ${SOURCE_CLUSTER_REGISTRY_PATH}`);
  }
  const registry = JSON.parse(readFile(SOURCE_CLUSTER_REGISTRY_PATH));
  writeFile(PUBLIC_CLUSTER_REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`);
}

function resolveAssetConfig(assetManifest, routePath) {
  const normalizedRoute = normalizeRoutePath(routePath);
  if (!normalizedRoute) {
    return null;
  }
  const entry = assetManifest.routes[normalizedRoute];
  if (!entry || typeof entry !== 'object') {
    return null;
  }
  return entry;
}

function renderManagedHeadAdsenseBlock() {
  return '';
}

function renderManagedAdPanel(indent = '          ') {
  return `${indent}<div class="ad-panel"></div>`;
}

function readRequiredFragment(filePath, fragmentName, calculatorId, routeArchetype) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Missing required ${fragmentName} fragment for ${calculatorId} (${routeArchetype}): ${filePath}`
    );
  }
  return readFile(filePath);
}

function loadRouteFragments(fragmentDir, calculatorId, routeArchetype) {
  const calculatorPath = path.join(fragmentDir, 'index.html');
  const explanationPath = path.join(fragmentDir, 'explanation.html');
  const contentPath = path.join(fragmentDir, 'content.html');

  switch (routeArchetype) {
    case 'calc_exp':
      return {
        calculatorHtml: readRequiredFragment(
          calculatorPath,
          'index.html',
          calculatorId,
          routeArchetype
        ),
        explanationHtml: readRequiredFragment(
          explanationPath,
          'explanation.html',
          calculatorId,
          routeArchetype
        ),
        contentHtml: '',
      };
    case 'calc_only':
      return {
        calculatorHtml: readRequiredFragment(
          calculatorPath,
          'index.html',
          calculatorId,
          routeArchetype
        ),
        explanationHtml: '',
        contentHtml: '',
      };
    case 'exp_only':
      return {
        calculatorHtml: '',
        explanationHtml: readRequiredFragment(
          explanationPath,
          'explanation.html',
          calculatorId,
          routeArchetype
        ),
        contentHtml: '',
      };
    case 'content_shell':
      return {
        calculatorHtml: '',
        explanationHtml: '',
        contentHtml: readRequiredFragment(
          contentPath,
          'content.html',
          calculatorId,
          routeArchetype
        ),
      };
    default:
      throw new Error(`Unsupported routeArchetype "${routeArchetype}" for ${calculatorId}`);
  }
}

function findCalculatorDirs(rootDir) {
  const map = new Map();
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    let hasIndex = false;
    let hasModule = false;
    let hasExplanation = false;
    let hasContent = false;
    for (const entry of entries) {
      if (entry.isFile()) {
        if (entry.name === 'index.html') hasIndex = true;
        if (entry.name === 'module.js') hasModule = true;
        if (entry.name === 'explanation.html') hasExplanation = true;
        if (entry.name === 'content.html') hasContent = true;
      }
    }
    if ((hasIndex || hasExplanation || hasContent) && (hasModule || hasContent)) {
      const id = path.basename(current);
      const relPath = path.relative(rootDir, current).replace(/\\/g, '/');
      if (!map.has(id)) {
        map.set(id, relPath);
      }
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        stack.push(path.join(current, entry.name));
      }
    }
  }
  return map;
}

function isFinanceCalculatorRelPath(relPath) {
  return typeof relPath === 'string' && relPath.startsWith('finance-calculators/');
}

function pathExistsAsDirectory(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
}

function resolveCalculatorFragmentDir(relPath) {
  if (!isFinanceCalculatorRelPath(relPath)) {
    return path.join(CALC_DIR, relPath);
  }
  const clusterDir = path.join(CALC_DIR, relPath);
  if (pathExistsAsDirectory(clusterDir)) {
    return clusterDir;
  }
  const contentDir = path.join(CONTENT_CALC_DIR, relPath);
  if (pathExistsAsDirectory(contentDir)) {
    return contentDir;
  }
  throw new Error(`Missing finance fragment directory: ${contentDir}`);
}

function resolveCalculatorModuleScriptHref(calculatorRelPath) {
  if (!calculatorRelPath) {
    return null;
  }
  if (isFinanceCalculatorRelPath(calculatorRelPath)) {
    const clusterModuleAbsPath = path.join(CALC_DIR, calculatorRelPath, 'module.js');
    if (fs.existsSync(clusterModuleAbsPath)) {
      return appendVersionParam(`/calculators/${calculatorRelPath}/module.js`);
    }
    const financeAssetRelPath = path
      .join('assets', 'js', 'calculators', calculatorRelPath, 'module.js')
      .replace(/\\/g, '/');
    const financeAssetAbsPath = path.join(PUBLIC_DIR, financeAssetRelPath);
    if (!fs.existsSync(financeAssetAbsPath)) {
      throw new Error(`Missing finance module asset: ${financeAssetAbsPath}`);
    }
    return appendVersionParam(`/${financeAssetRelPath}`);
  }
  return appendVersionParam(`/calculators/${calculatorRelPath}/module.js`);
}

function resolveCalculatorCssHref(calculatorRelPath) {
  if (!calculatorRelPath) {
    return null;
  }
  return appendVersionParam(`/calculators/${calculatorRelPath}/calculator.css`);
}

const HOME_LOAN_CLUSTER_REDESIGN_ORDER = [
  'how-much-can-i-borrow',
  'home-loan',
  'remortgage-switching',
  'offset-calculator',
  'interest-rate-change-calculator',
  'loan-to-value',
  'buy-to-let',
  'personal-loan',
];

// Opt-in list so the rollout can complete one calculator at a time without flipping unfinished routes.
const HOME_LOAN_CLUSTER_REDESIGN_IDS = new Set([
  'how-much-can-i-borrow',
  'home-loan',
  'remortgage-switching',
  'offset-calculator',
  'interest-rate-change-calculator',
  'loan-to-value',
  'buy-to-let',
  'personal-loan',
]);

HOME_LOAN_CLUSTER_REDESIGN_IDS.forEach((calculatorId) => {
  if (!HOME_LOAN_CLUSTER_REDESIGN_ORDER.includes(calculatorId)) {
    throw new Error(`Unknown Home Loan redesign calculator id: ${calculatorId}`);
  }
});

const AUTO_LOAN_CLUSTER_REDESIGN_ORDER = [
  'car-loan',
  'multiple-car-loan',
  'hire-purchase',
  'pcp-calculator',
  'leasing-calculator',
];

const AUTO_LOAN_CLUSTER_REDESIGN_IDS = new Set([
  'car-loan',
  'multiple-car-loan',
  'hire-purchase',
  'pcp-calculator',
  'leasing-calculator',
]);

AUTO_LOAN_CLUSTER_REDESIGN_IDS.forEach((calculatorId) => {
  if (!AUTO_LOAN_CLUSTER_REDESIGN_ORDER.includes(calculatorId)) {
    throw new Error(`Unknown Auto Loan redesign calculator id: ${calculatorId}`);
  }
});

const FINANCE_CLUSTER_REDESIGN_ORDER = [
  'present-value',
  'future-value',
  'present-value-of-annuity',
  'future-value-of-annuity',
  'effective-annual-rate',
  'inflation',
  'investment',
  'simple-interest',
  'compound-interest',
  'investment-growth',
  'time-to-savings-goal',
  'monthly-savings-needed',
  'investment-return',
];

// Opt-in list so finance can migrate one calculator at a time without flipping untouched routes.
const FINANCE_CLUSTER_REDESIGN_IDS = new Set([
  'present-value',
  'future-value',
  'present-value-of-annuity',
  'future-value-of-annuity',
  'effective-annual-rate',
  'inflation',
  'investment',
  'simple-interest',
  'compound-interest',
  'investment-growth',
  'time-to-savings-goal',
  'monthly-savings-needed',
  'investment-return',
]);

FINANCE_CLUSTER_REDESIGN_IDS.forEach((calculatorId) => {
  if (!FINANCE_CLUSTER_REDESIGN_ORDER.includes(calculatorId)) {
    throw new Error(`Unknown Finance redesign calculator id: ${calculatorId}`);
  }
});

const TIME_AND_DATE_CLUSTER_REDESIGN_ORDER = [
  'age-calculator',
  'birthday-day-of-week',
  'days-until-a-date-calculator',
  'time-between-two-dates-calculator',
  'countdown-timer-generator',
  'work-hours-calculator',
  'overtime-hours-calculator',
  'sleep-time-calculator',
  'wake-up-time-calculator',
  'nap-time-calculator',
  'power-nap-calculator',
  'energy-based-nap-selector',
];

// Opt-in list so the cluster can be migrated and released one calculator at a time.
const TIME_AND_DATE_CLUSTER_REDESIGN_IDS = new Set([
  'age-calculator',
  'birthday-day-of-week',
  'days-until-a-date-calculator',
  'time-between-two-dates-calculator',
  'countdown-timer-generator',
  'work-hours-calculator',
  'overtime-hours-calculator',
  'sleep-time-calculator',
  'wake-up-time-calculator',
  'nap-time-calculator',
  'power-nap-calculator',
  'energy-based-nap-selector',
]);

TIME_AND_DATE_CLUSTER_REDESIGN_IDS.forEach((calculatorId) => {
  if (!TIME_AND_DATE_CLUSTER_REDESIGN_ORDER.includes(calculatorId)) {
    throw new Error(`Unknown Time & Date redesign calculator id: ${calculatorId}`);
  }
});

const PERCENTAGE_CLUSTER_REDESIGN_ORDER = [
  'percent-change',
  'percentage-difference',
  'percentage-increase',
  'percentage-decrease',
  'percentage-composition',
  'reverse-percentage',
  'percent-to-fraction-decimal',
  'what-percent-is-x-of-y',
  'percentage-of-a-number',
];

// Opt-in list so the percentage cluster can move fully to the new shell one calculator at a time.
const PERCENTAGE_CLUSTER_REDESIGN_IDS = new Set([
  'percent-change',
  'percentage-difference',
  'percentage-increase',
  'percentage-decrease',
  'percentage-composition',
  'reverse-percentage',
  'percent-to-fraction-decimal',
  'what-percent-is-x-of-y',
  'percentage-of-a-number',
]);

const PRICING_CLUSTER_REDESIGN_ORDER = [
  'commission-calculator',
  'discount-calculator',
  'margin-calculator',
  'markup-calculator',
];

const SALARY_CLUSTER_REDESIGN_ORDER = [
  'salary-calculators-hub',
  'salary-calculator',
  'hourly-to-salary-calculator',
  'salary-to-hourly-calculator',
  'annual-to-monthly-salary-calculator',
  'monthly-to-annual-salary-calculator',
  'weekly-pay-calculator',
  'overtime-pay-calculator',
  'raise-calculator',
  'bonus-calculator',
  'commission-calculator',
  'inflation-adjusted-salary-calculator',
];

PERCENTAGE_CLUSTER_REDESIGN_IDS.forEach((calculatorId) => {
  if (!PERCENTAGE_CLUSTER_REDESIGN_ORDER.includes(calculatorId)) {
    throw new Error(`Unknown Percentage redesign calculator id: ${calculatorId}`);
  }
});

const PRICING_CLUSTER_REDESIGN_IDS = new Set(PRICING_CLUSTER_REDESIGN_ORDER);
const SALARY_CLUSTER_REDESIGN_IDS = new Set(SALARY_CLUSTER_REDESIGN_ORDER);

PRICING_CLUSTER_REDESIGN_IDS.forEach((calculatorId) => {
  if (!PRICING_CLUSTER_REDESIGN_ORDER.includes(calculatorId)) {
    throw new Error(`Unknown Pricing redesign calculator id: ${calculatorId}`);
  }
});

SALARY_CLUSTER_REDESIGN_IDS.forEach((calculatorId) => {
  if (!SALARY_CLUSTER_REDESIGN_ORDER.includes(calculatorId)) {
    throw new Error(`Unknown Salary redesign calculator id: ${calculatorId}`);
  }
});

function buildCreditCardClusterInlineCss(calculatorRelPath) {
  const sources = [
    path.join(PUBLIC_DIR, 'assets', 'css', 'base.css'),
    path.join(PUBLIC_DIR, 'assets', 'css', 'calculator.css'),
    path.join(PUBLIC_DIR, 'calculators', 'credit-card-calculators', 'shared', 'cluster-light.css'),
  ];

  if (calculatorRelPath) {
    sources.push(path.join(PUBLIC_DIR, 'calculators', calculatorRelPath, 'calculator.css'));
  }

  return sources
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      const fileContents = readFile(filePath)
        .trim()
        .replace(
          /\/\*\s*theme-premium-dark\.css[\s\S]*?\*\//gi,
          ''
        )
        .trim();
      return `/* ${relPath} */\n${fileContents}`;
    })
    .join('\n\n');
}

function buildHomeLoanInlineCss(calculatorRelPath) {
  const sources = [
    path.join(PUBLIC_DIR, 'assets', 'css', 'base.css'),
    path.join(PUBLIC_DIR, 'assets', 'css', 'calculator.css'),
    path.join(PUBLIC_DIR, 'calculators', 'loan-calculators', 'shared', 'cluster-light.css'),
  ];

  if (calculatorRelPath) {
    sources.push(path.join(PUBLIC_DIR, 'calculators', calculatorRelPath, 'calculator.css'));
  }

  return sources
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      const fileContents = readFile(filePath)
        .trim()
        .replace(/\/\*\s*theme-premium-dark\.css[\s\S]*?\*\//gi, '')
        .trim();
      return `/* ${relPath} */\n${fileContents}`;
    })
    .join('\n\n');
}

function buildAutoLoanInlineCss(calculatorRelPath) {
  const sources = [
    path.join(PUBLIC_DIR, 'assets', 'css', 'base.css'),
    path.join(PUBLIC_DIR, 'assets', 'css', 'calculator.css'),
    path.join(PUBLIC_DIR, 'calculators', 'car-loan-calculators', 'shared', 'cluster-light.css'),
  ];

  if (calculatorRelPath) {
    sources.push(path.join(PUBLIC_DIR, 'calculators', calculatorRelPath, 'calculator.css'));
  }

  return sources
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      return `/* ${relPath} */\n${readFile(filePath).trim()}`;
    })
    .join('\n\n');
}

function buildFinanceClusterInlineCss(calculatorRelPath) {
  const sources = [
    path.join(PUBLIC_DIR, 'assets', 'css', 'base.css'),
    path.join(PUBLIC_DIR, 'assets', 'css', 'calculator.css'),
    path.join(PUBLIC_DIR, 'calculators', 'finance-calculators', 'shared', 'cluster-light.css'),
  ];

  if (calculatorRelPath) {
    sources.push(path.join(PUBLIC_DIR, 'calculators', calculatorRelPath, 'calculator.css'));
  }

  return sources
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      return `/* ${relPath} */\n${readFile(filePath).trim()}`;
    })
    .join('\n\n');
}

function buildMathClusterInlineCss(calculatorRelPath) {
  const sources = [
    path.join(PUBLIC_DIR, 'assets', 'css', 'base.css'),
    path.join(PUBLIC_DIR, 'assets', 'css', 'calculator.css'),
    path.join(PUBLIC_DIR, 'calculators', 'math', 'shared', 'cluster-light.css'),
  ];

  if (calculatorRelPath) {
    sources.push(path.join(PUBLIC_DIR, 'calculators', calculatorRelPath, 'calculator.css'));
  }

  return sources
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      const fileContents = readFile(filePath)
        .trim()
        .replace(/\/\*\s*theme-premium-dark\.css[\s\S]*?\*\//gi, '')
        .trim();
      return `/* ${relPath} */\n${fileContents}`;
    })
    .join('\n\n');
}

function buildTimeAndDateClusterInlineCss(calculatorRelPath) {
  const sources = [
    path.join(PUBLIC_DIR, 'assets', 'css', 'base.css'),
    path.join(PUBLIC_DIR, 'assets', 'css', 'calculator.css'),
    path.join(PUBLIC_DIR, 'calculators', 'time-and-date', 'shared', 'cluster-light.css'),
  ];

  if (calculatorRelPath) {
    sources.push(path.join(PUBLIC_DIR, 'calculators', calculatorRelPath, 'calculator.css'));
  }

  return sources
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      return `/* ${relPath} */\n${readFile(filePath).trim()}`;
    })
    .join('\n\n');
}

function buildPercentageClusterInlineCss(calculatorRelPath) {
  const sources = [
    path.join(PUBLIC_DIR, 'assets', 'css', 'base.css'),
    path.join(PUBLIC_DIR, 'assets', 'css', 'calculator.css'),
    path.join(PUBLIC_DIR, 'calculators', 'percentage-calculators', 'shared', 'cluster-light.css'),
  ];

  if (calculatorRelPath) {
    sources.push(path.join(PUBLIC_DIR, 'calculators', calculatorRelPath, 'calculator.css'));
  }

  return sources
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      return `/* ${relPath} */\n${readFile(filePath).trim()}`;
    })
    .join('\n\n');
}

function buildPricingClusterInlineCss(calculatorRelPath) {
  const sources = [
    path.join(PUBLIC_DIR, 'assets', 'css', 'base.css'),
    path.join(PUBLIC_DIR, 'assets', 'css', 'calculator.css'),
    path.join(PUBLIC_DIR, 'calculators', 'pricing-calculators', 'shared', 'cluster-light.css'),
  ];

  if (calculatorRelPath) {
    sources.push(path.join(PUBLIC_DIR, 'calculators', calculatorRelPath, 'calculator.css'));
  }

  return sources
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      return `/* ${relPath} */\n${readFile(filePath).trim()}`;
    })
    .join('\n\n');
}

function buildSalaryClusterInlineCss(calculatorRelPath) {
  const sources = [
    path.join(PUBLIC_DIR, 'assets', 'css', 'base.css'),
    path.join(PUBLIC_DIR, 'assets', 'css', 'calculator.css'),
    path.join(PUBLIC_DIR, 'calculators', 'salary-calculators', 'shared', 'cluster-light.css'),
  ];

  if (calculatorRelPath) {
    sources.push(path.join(PUBLIC_DIR, 'calculators', calculatorRelPath, 'calculator.css'));
  }

  return sources
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => {
      const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      return `/* ${relPath} */\n${readFile(filePath).trim()}`;
    })
    .join('\n\n');
}

function buildCreditCardClusterHeaderHtml() {
  return `<header class="cc-cluster-site-header">
  <div class="cc-cluster-wrap cc-cluster-site-header-inner">
    <a class="cc-cluster-brand" href="/" aria-label="CalcHowMuch home">
      <span class="cc-cluster-brand-mark" aria-hidden="true">#</span>
      <span>CalcHowMuch</span>
    </a>
    <nav class="cc-cluster-site-links" aria-label="Site links">
      <a href="/">Home</a>
      <a href="/">All Calculators</a>
      <a href="/faq/">FAQs</a>
    </nav>
  </div>
</header>`;
}

function buildCreditCardClusterFooterHtml() {
  return `<footer class="cc-cluster-site-footer">
  <div class="cc-cluster-wrap cc-cluster-site-footer-inner">
    <nav class="cc-cluster-footer-links" aria-label="Footer links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
      <a href="/contact-us/">Contact</a>
      <a href="/about-us/">About Us</a>
      <a href="/faq/">FAQs</a>
      <a href="/sitemap.xml">Sitemap</a>
    </nav>
    <span class="cc-cluster-footer-copy">&copy; 2026 @CalcHowMuch</span>
  </div>
</footer>`;
}

function buildHomeLoanClusterHeaderHtml() {
  return `<header class="hl-cluster-site-header">
  <div class="hl-cluster-wrap hl-cluster-site-header-inner">
    <a class="hl-cluster-brand" href="/" aria-label="CalcHowMuch home">
      <span class="hl-cluster-brand-mark" aria-hidden="true">CH</span>
      <span>CalcHowMuch</span>
    </a>
    <nav class="hl-cluster-site-links" aria-label="Site links">
      <a href="/">Home</a>
      <a href="/">All Calculators</a>
      <a href="/faq/">FAQs</a>
    </nav>
  </div>
</header>`;
}

function buildHomeLoanClusterFooterHtml() {
  return `<footer class="hl-cluster-site-footer">
  <div class="hl-cluster-wrap hl-cluster-site-footer-inner">
    <nav class="hl-cluster-footer-links" aria-label="Footer links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
      <a href="/contact-us/">Contact</a>
      <a href="/about-us/">About Us</a>
      <a href="/faq/">FAQs</a>
      <a href="/sitemap.xml">Sitemap</a>
    </nav>
    <span class="hl-cluster-footer-copy">&copy; 2026 @CalcHowMuch</span>
  </div>
</footer>`;
}

function buildAutoLoanClusterHeaderHtml() {
  return `<header class="al-cluster-site-header">
  <div class="al-cluster-wrap al-cluster-site-header-inner">
    <a class="al-cluster-brand" href="/" aria-label="CalcHowMuch home">
      <span class="al-cluster-brand-mark" aria-hidden="true">AL</span>
      <span>CalcHowMuch</span>
    </a>
    <nav class="al-cluster-site-links" aria-label="Site links">
      <a href="/">Home</a>
      <a href="/">All Calculators</a>
      <a href="/faq/">FAQs</a>
    </nav>
  </div>
</header>`;
}

function buildAutoLoanClusterFooterHtml() {
  return `<footer class="al-cluster-site-footer">
  <div class="al-cluster-wrap al-cluster-site-footer-inner">
    <nav class="al-cluster-footer-links" aria-label="Footer links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
      <a href="/contact-us/">Contact</a>
      <a href="/about-us/">About Us</a>
      <a href="/faq/">FAQs</a>
      <a href="/sitemap.xml">Sitemap</a>
    </nav>
    <span class="al-cluster-footer-copy">&copy; 2026 @CalcHowMuch</span>
  </div>
</footer>`;
}

function buildFinanceClusterHeaderHtml() {
  return `<header class="fi-cluster-site-header">
  <div class="fi-cluster-wrap fi-cluster-site-header-inner">
    <a class="fi-cluster-brand" href="/" aria-label="CalcHowMuch home">
      <span class="fi-cluster-brand-mark" aria-hidden="true">FI</span>
      <span>CalcHowMuch</span>
    </a>
    <nav class="fi-cluster-site-links" aria-label="Site links">
      <a href="/">Home</a>
      <a href="/">All Calculators</a>
      <a href="/faq/">FAQs</a>
    </nav>
  </div>
</header>`;
}

function buildFinanceClusterFooterHtml() {
  return `<footer class="fi-cluster-site-footer">
  <div class="fi-cluster-wrap fi-cluster-site-footer-inner">
    <nav class="fi-cluster-footer-links" aria-label="Footer links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
      <a href="/contact-us/">Contact</a>
      <a href="/about-us/">About Us</a>
      <a href="/faq/">FAQs</a>
      <a href="/sitemap.xml">Sitemap</a>
    </nav>
    <span class="fi-cluster-footer-copy">&copy; 2026 @CalcHowMuch</span>
  </div>
</footer>`;
}

function buildMathClusterHeaderHtml() {
  return `<header class="math-cluster-site-header">
  <div class="math-cluster-wrap math-cluster-site-header-inner">
    <a class="math-cluster-brand" href="/" aria-label="CalcHowMuch home">
      <span class="math-cluster-brand-mark" aria-hidden="true">MATH</span>
      <span>CalcHowMuch</span>
    </a>
    <div class="math-cluster-site-label" aria-label="Cluster label">Math Calculators</div>
    <nav class="math-cluster-site-links" aria-label="Site links">
      <a href="/">All Calculators</a>
      <a href="/contact-us/">Contact</a>
      <a href="/faq/">FAQs</a>
    </nav>
  </div>
</header>`;
}

function buildMathClusterFooterHtml() {
  return `<footer class="math-cluster-site-footer">
  <div class="math-cluster-wrap math-cluster-site-footer-inner">
    <nav class="math-cluster-footer-links" aria-label="Footer links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
      <a href="/contact-us/">Contact</a>
      <a href="/about-us/">About Us</a>
      <a href="/faq/">FAQs</a>
      <a href="/sitemap.xml">Sitemap</a>
    </nav>
    <span class="math-cluster-footer-copy">&copy; 2026 CalcHowMuch</span>
  </div>
</footer>`;
}

function buildTimeAndDateClusterHeaderHtml() {
  return `<header class="td-cluster-site-header">
  <div class="td-cluster-wrap td-cluster-site-header-inner">
    <a class="td-cluster-brand" href="/" aria-label="CalcHowMuch home">
      <span class="td-cluster-brand-mark" aria-hidden="true">TD</span>
      <span>CalcHowMuch</span>
    </a>
    <div class="td-cluster-site-label" aria-label="Cluster label">Time &amp; Date Calculators</div>
    <nav class="td-cluster-site-links" aria-label="Site links">
      <a href="/">All Calculators</a>
      <a href="/contact-us/">Contact</a>
      <a href="/faqs/">FAQs</a>
    </nav>
  </div>
</header>`;
}

function buildTimeAndDateClusterFooterHtml() {
  return `<footer class="td-cluster-site-footer">
  <div class="td-cluster-wrap td-cluster-site-footer-inner">
    <nav class="td-cluster-footer-links" aria-label="Footer links">
      <a href="/">Home</a>
      <a href="/privacy/">Privacy</a>
      <a href="/terms-and-conditions/">Terms</a>
      <a href="/contact-us/">Contact</a>
      <a href="/about-us/">About Us</a>
    </nav>
    <span class="td-cluster-footer-copy">&copy; 2026 CalcHowMuch</span>
  </div>
</footer>`;
}

function buildPercentageClusterHeaderHtml() {
  return `<header class="pct-cluster-site-header">
  <div class="pct-cluster-wrap pct-cluster-site-header-inner">
    <a class="pct-cluster-brand" href="/" aria-label="CalcHowMuch home">
      <span class="pct-cluster-brand-mark" aria-hidden="true">%</span>
      <span>CalcHowMuch</span>
    </a>
    <div class="pct-cluster-site-label" aria-label="Cluster label">Percentage Calculators</div>
    <nav class="pct-cluster-site-links" aria-label="Site links">
      <a href="/">All Calculators</a>
      <a href="/contact-us/">Contact</a>
      <a href="/faq/">FAQs</a>
    </nav>
  </div>
</header>`;
}

function buildPercentageClusterFooterHtml() {
  return `<footer class="pct-cluster-site-footer">
  <div class="pct-cluster-wrap pct-cluster-site-footer-inner">
    <nav class="pct-cluster-footer-links" aria-label="Footer links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
      <a href="/contact-us/">Contact</a>
      <a href="/about-us/">About Us</a>
      <a href="/faq/">FAQs</a>
      <a href="/sitemap.xml">Sitemap</a>
    </nav>
    <span class="pct-cluster-footer-copy">&copy; 2026 CalcHowMuch</span>
  </div>
</footer>`;
}

function buildPricingClusterHeaderHtml() {
  return `<header class="pct-cluster-site-header">
  <div class="pct-cluster-wrap pct-cluster-site-header-inner">
    <a class="pct-cluster-brand" href="/" aria-label="CalcHowMuch home">
      <span class="pct-cluster-brand-mark" aria-hidden="true">$</span>
      <span>CalcHowMuch</span>
    </a>
    <div class="pct-cluster-site-label" aria-label="Cluster label">Pricing Calculators</div>
    <nav class="pct-cluster-site-links" aria-label="Site links">
      <a href="/">All Calculators</a>
      <a href="/contact-us/">Contact</a>
      <a href="/faq/">FAQs</a>
    </nav>
  </div>
</header>`;
}

function buildPricingClusterFooterHtml() {
  return `<footer class="pct-cluster-site-footer">
  <div class="pct-cluster-wrap pct-cluster-site-footer-inner">
    <nav class="pct-cluster-footer-links" aria-label="Footer links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
      <a href="/contact-us/">Contact</a>
      <a href="/about-us/">About Us</a>
      <a href="/faq/">FAQs</a>
      <a href="/sitemap.xml">Sitemap</a>
    </nav>
    <span class="pct-cluster-footer-copy">&copy; 2026 CalcHowMuch</span>
  </div>
</footer>`;
}

function buildSalaryClusterHeaderHtml() {
  return `<header class="sal-cluster-site-header">
  <div class="sal-cluster-wrap sal-cluster-site-header-inner">
    <a class="sal-cluster-brand" href="/" aria-label="CalcHowMuch home">
      <span class="sal-cluster-brand-mark" aria-hidden="true">$</span>
      <span>CalcHowMuch</span>
    </a>
    <div class="sal-cluster-site-label" aria-label="Cluster label">Salary Calculators</div>
    <nav class="sal-cluster-site-links" aria-label="Site links">
      <a href="/">All Calculators</a>
      <a href="/contact-us/">Contact</a>
      <a href="/faq/">FAQs</a>
    </nav>
  </div>
</header>`;
}

function buildSalaryClusterFooterHtml() {
  return `<footer class="sal-cluster-site-footer">
  <div class="sal-cluster-wrap sal-cluster-site-footer-inner">
    <nav class="sal-cluster-footer-links" aria-label="Footer links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
      <a href="/contact-us/">Contact</a>
      <a href="/about-us/">About Us</a>
      <a href="/faq/">FAQs</a>
      <a href="/sitemap.xml">Sitemap</a>
    </nav>
    <span class="sal-cluster-footer-copy">&copy; 2026 CalcHowMuch</span>
  </div>
</footer>`;
}

const AUTO_LOAN_RELATED_CARD_COPY = {
  'car-loan-calculator': 'See the financed amount, monthly payment, and full borrowing cost.',
  'auto-loan-calculator': 'Compare two offers side by side before you choose the cheaper path.',
  'hire-purchase-calculator': 'Balance monthly affordability against the balloon due later.',
  'pcp-calculator': 'Weigh the lower monthly cost against the final payment obligation.',
  'car-lease-calculator': 'Review due-at-signing, residual value, and full lease spend together.',
};

const FINANCE_RELATED_CARD_COPY = {
  'present-value': "Discount a future amount into today's value before you compare options.",
  'future-value': 'Project how a starting balance compounds with time and recurring additions.',
  'present-value-of-annuity': "Value a stream of future payments in today's terms.",
  'future-value-of-annuity': 'Estimate what recurring contributions could become over time.',
  'effective-annual-rate': 'Translate a nominal rate into the real annual rate after compounding.',
  'simple-interest': 'Check straight-line interest cost without compounding.',
  'compound-interest': 'Model compounding growth with clear interest and balance context.',
  'investment-growth': 'Forecast balances, contributions, and growth across longer horizons.',
  'time-to-savings-goal': 'Estimate how long steady saving may take to reach a target.',
  'monthly-savings-needed': 'Work backward from the goal to the monthly saving requirement.',
  'investment-return': 'Stress test a portfolio path with contributions, events, and downturns.',
  inflation: 'Translate an older dollar amount into later CPI-based purchasing power.',
};

const TIME_AND_DATE_RELATED_CARD_COPY = {
  'sleep-time-calculator': 'Plan better bedtimes or wake-up targets around 90-minute sleep cycles.',
  'wake-up-time-calculator': 'Compare alarm times that line up with 4, 5, or 6 sleep cycles.',
  'nap-time-calculator': 'Turn a nap type and start time into a practical wake-up target.',
  'power-nap-calculator': 'Compare 10 to 90-minute nap options before you set an alarm.',
  'energy-based-nap-selector': 'Match nap length to the kind of energy reset you need right now.',
  'work-hours-calculator': 'Track shift totals, breaks, and weekly hours for timesheets or rotas.',
  'overtime-hours-calculator': 'Separate standard and overtime hours with clearer daily or weekly rules.',
  'time-between-two-dates-calculator': 'Measure exact distance between dates, date-times, or business days.',
  'days-until-a-date-calculator': 'Count down to a deadline, measure days since, or switch to weekdays only.',
  'countdown-timer-generator': 'Create a live countdown for launches, trips, birthdays, or deadline tracking.',
  'age-calculator': 'See exact age, total days, and the next birthday in one planning view.',
  'birthday-day-of-week': 'Find the weekday of birth and compare future birthday patterns quickly.',
};

const PERCENTAGE_RELATED_CARD_COPY = {
  'percent-change': 'Measure signed increase or decrease from an original baseline.',
  'percentage-difference': 'Compare two values fairly when neither one is the official starting point.',
  'percentage-increase': 'Show how much a value grew from its original amount.',
  'percentage-decrease': 'Show how much a value dropped from its original amount.',
  'percentage-composition': 'Break a total into item shares and remaining percentage.',
  'reverse-percentage': 'Work backward from a final value and percentage to the original base.',
  'percent-to-fraction-decimal': 'Convert a percentage into decimal and fraction forms side by side.',
  'what-percent-is-x-of-y': 'Find the share a part represents out of a known whole.',
  'percentage-of-a-number': 'Calculate the amount created when a rate is applied to a base value.',
};

function buildCreditCardRelatedCalculatorsHtml(subcategory, activeCalculatorId) {
  const calculators = Array.isArray(subcategory?.calculators) ? subcategory.calculators : [];

  if (!calculators.length) {
    return '';
  }

  const linksHtml = calculators
    .map((calculator) => {
      const isActive = calculator.id === activeCalculatorId;
      return `<a class="cc-cluster-related-link${isActive ? ' is-active' : ''}" href="${calculator.url}"${
        isActive ? ' aria-current="page"' : ''
      }>${calculator.name}</a>`;
    })
    .join('');

  return `<section class="cc-cluster-related" aria-labelledby="cc-cluster-related-title">
  <h2 id="cc-cluster-related-title">Related Credit Card Calculators</h2>
  <div class="cc-cluster-related-links">
    ${linksHtml}
  </div>
</section>`;
}

function buildAutoLoanRelatedCalculatorsHtml(subcategory, activeCalculatorId) {
  const calculators = Array.isArray(subcategory?.calculators) ? subcategory.calculators : [];

  if (!calculators.length) {
    return '';
  }

  const linksHtml = calculators
    .map((calculator) => {
      const isActive = calculator.id === activeCalculatorId;
      const description =
        AUTO_LOAN_RELATED_CARD_COPY[calculator.id] ||
        'Explore this Auto Loan calculator with the shared redesign system.';

      return `<a class="al-cluster-related-link al-cluster-related-card${
        isActive ? ' is-active' : ''
      }" href="${calculator.url}"${isActive ? ' aria-current="page"' : ''}>
        <span class="al-cluster-related-card-title">${calculator.name}</span>
        <span class="al-cluster-related-card-copy">${description}</span>
      </a>`;
    })
    .join('');

  return `<section class="al-cluster-related" aria-labelledby="al-cluster-related-title">
  <h2 id="al-cluster-related-title">Related Auto Loan Calculators</h2>
  <div class="al-cluster-related-links">
    ${linksHtml}
  </div>
</section>`;
}

function buildFinanceRelatedCalculatorsHtml(category, activeCalculatorId) {
  const subcategories = Array.isArray(category?.subcategories) ? category.subcategories : [];
  const calculators = subcategories.flatMap((subcategory) =>
    Array.isArray(subcategory?.calculators)
      ? subcategory.calculators.map((calculator) => ({
          ...calculator,
          sectionLabel: subcategory.name,
        }))
      : []
  );

  if (!calculators.length) {
    return '';
  }

  const linksHtml = calculators
    .map((calculator) => {
      const isActive = calculator.id === activeCalculatorId;
      const description =
        FINANCE_RELATED_CARD_COPY[calculator.id] ||
        'Explore this Finance calculator in the shared redesign system.';

      return `<a class="fi-cluster-related-link${isActive ? ' is-active' : ''}" href="${calculator.url}"${
        isActive ? ' aria-current="page"' : ''
      }>
        <span class="fi-cluster-related-card-title">${calculator.name}</span>
        <span class="fi-cluster-related-card-copy">${description}</span>
        <span class="fi-cluster-related-card-meta">${calculator.sectionLabel}</span>
      </a>`;
    })
    .join('');

  return `<section class="fi-cluster-related" aria-labelledby="fi-cluster-related-title">
  <h2 id="fi-cluster-related-title">Related Finance Calculators</h2>
  <div class="fi-cluster-related-links">
    ${linksHtml}
  </div>
</section>`;
}

function buildTimeAndDateRelatedCalculatorsHtml(category, subcategory, activeCalculatorId) {
  const subcategories = Array.isArray(category?.subcategories) ? category.subcategories : [];
  const currentGroupCalculators = Array.isArray(subcategory?.calculators) ? subcategory.calculators : [];
  const calculators = subcategories.flatMap((group) =>
    Array.isArray(group?.calculators)
      ? group.calculators.map((calculator) => ({
          ...calculator,
          sectionLabel: group.name,
        }))
      : []
  );

  const switcherHtml = currentGroupCalculators.length
    ? `<section class="td-cluster-route-switch" aria-labelledby="td-cluster-route-switch-title">
  <div class="td-cluster-route-switch-head">
    <div>
      <h2 id="td-cluster-route-switch-title">More ${subcategory.name} tools</h2>
    </div>
  </div>
  <div class="td-cluster-switch-chips" data-td-switch-chips="true">
    ${currentGroupCalculators
      .map((calculator) => {
        const isActive = calculator.id === activeCalculatorId;
        return `<a class="td-cluster-switch-chip${isActive ? ' is-active' : ''}" href="${calculator.url}"${
          isActive ? ' aria-current="page"' : ''
        }>${calculator.name}</a>`;
      })
      .join('')}
  </div>
</section>`
    : '';

  const relatedHtml = calculators.length
    ? `<section class="td-cluster-related" aria-labelledby="td-cluster-related-title">
  <div class="td-cluster-related-head">
    <div>
      <h2 id="td-cluster-related-title">Related Time &amp; Date calculators</h2>
    </div>
  </div>
  <div class="td-cluster-related-links">
    ${calculators
      .map((calculator) => {
        const isActive = calculator.id === activeCalculatorId;
        const description =
          TIME_AND_DATE_RELATED_CARD_COPY[calculator.id] ||
          'Explore this Time & Date calculator in the shared redesign system.';

        return `<a class="td-cluster-related-link${isActive ? ' is-active' : ''}" href="${calculator.url}"${
          isActive ? ' aria-current="page"' : ''
        }>
      <span class="td-cluster-related-card-title">${calculator.name}</span>
      <span class="td-cluster-related-card-copy">${description}</span>
      <span class="td-cluster-related-card-meta">${calculator.sectionLabel}</span>
    </a>`;
      })
      .join('')}
  </div>
</section>`
    : '';

  return {
    switcherHtml,
    relatedHtml,
  };
}

function buildPercentageRelatedCalculatorsHtml(subcategory, activeCalculatorId) {
  const calculators = Array.isArray(subcategory?.calculators) ? subcategory.calculators : [];

  const switcherHtml = calculators.length
    ? `<section class="pct-cluster-route-switch" aria-labelledby="pct-cluster-route-switch-title">
  <div class="pct-cluster-route-switch-head">
    <div>
      <span class="pct-cluster-switch-kicker">Switch scenario</span>
      <h2 id="pct-cluster-route-switch-title">Compare another percentage question</h2>
    </div>
  </div>
  <div class="pct-cluster-switch-chips">
    ${calculators
      .map((calculator) => {
        const isActive = calculator.id === activeCalculatorId;
        return `<a class="pct-cluster-switch-chip nav-item${isActive ? ' is-active' : ''}" href="${calculator.url}"${
          isActive ? ' aria-current="page"' : ''
        }>${calculator.name}</a>`;
      })
      .join('')}
  </div>
</section>`
    : '';

  const relatedHtml = calculators.length
    ? `<section class="pct-cluster-related" aria-labelledby="pct-cluster-related-title">
  <div class="pct-cluster-related-head">
    <div>
      <span class="pct-cluster-switch-kicker">Keep exploring</span>
      <h2 id="pct-cluster-related-title">More percentage calculators in the new design</h2>
    </div>
  </div>
  <div class="pct-cluster-related-links">
    ${calculators
      .map((calculator) => {
        const isActive = calculator.id === activeCalculatorId;
        const description =
          PERCENTAGE_RELATED_CARD_COPY[calculator.id] ||
          'Open the same answer-first shell for this percentage scenario.';
        return `<a class="pct-cluster-related-link${isActive ? ' is-active' : ''}" href="${calculator.url}"${
          isActive ? ' aria-current="page"' : ''
        }>
      <span class="pct-cluster-related-card-title">${calculator.name}</span>
      <span class="pct-cluster-related-card-copy">${description}</span>
      <span class="pct-cluster-related-card-meta">Percentage Core</span>
    </a>`;
      })
      .join('')}
  </div>
</section>`
    : '';

  return {
    switcherHtml,
    relatedHtml,
  };
}

function buildPricingRelatedCalculatorsHtml(subcategory, activeCalculatorId) {
  const calculators = Array.isArray(subcategory?.calculators) ? subcategory.calculators : [];

  const switcherHtml = calculators.length
    ? `<section class="pct-cluster-route-switch" aria-labelledby="pct-cluster-route-switch-title">
  <div class="pct-cluster-route-switch-head">
    <div>
      <span class="pct-cluster-switch-kicker">Switch scenario</span>
      <h2 id="pct-cluster-route-switch-title">Compare another pricing question</h2>
    </div>
  </div>
  <div class="pct-cluster-switch-chips">
    ${calculators
      .map((calculator) => {
        const isActive = calculator.id === activeCalculatorId;
        return `<a class="pct-cluster-switch-chip${isActive ? ' is-active' : ''}" href="${calculator.url}"${
          isActive ? ' aria-current="page"' : ''
        }>${calculator.name}</a>`;
      })
      .join('')}
  </div>
</section>`
    : '';

  const relatedHtml = calculators.length
    ? `<section class="pct-cluster-related" aria-labelledby="pct-cluster-related-title">
  <div class="pct-cluster-related-head">
    <div>
      <span class="pct-cluster-switch-kicker">Keep exploring</span>
      <h2 id="pct-cluster-related-title">More pricing calculators in the new design</h2>
    </div>
  </div>
  <div class="pct-cluster-related-links">
    ${calculators
      .map((calculator) => {
        const isActive = calculator.id === activeCalculatorId;
        return `<a class="pct-cluster-related-link${isActive ? ' is-active' : ''}" href="${calculator.url}"${
          isActive ? ' aria-current="page"' : ''
        }>
      <span class="pct-cluster-related-card-title">${calculator.name}</span>
      <span class="pct-cluster-related-card-copy">Open the shared answer-first shell for this pricing scenario.</span>
      <span class="pct-cluster-related-card-meta">Pricing &amp; Margin</span>
    </a>`;
      })
      .join('')}
  </div>
</section>`
    : '';

  return {
    switcherHtml,
    relatedHtml,
  };
}

function buildPricingClusterLandingPage(category) {
  const calculators = Array.isArray(category?.subcategories)
    ? category.subcategories.flatMap((subcategory) => subcategory.calculators || [])
    : [];
  const title = 'Pricing Calculators | Margin, Markup, Discount & Commission';
  const description =
    'Browse pricing calculators for margin, markup, discount, and sales commission so you can protect profit, set prices, and compare pricing scenarios.';
  const canonical = buildCanonical('/pricing-calculators/');
  const headMetaHtml = generateHeadMeta({
    canonicalUrl: canonical,
    seoTitle: title,
    seoDescription: description,
    ogImageUrl: OG_IMAGE,
    h1: 'Pricing Calculators',
    isCalculatorPage: true,
  });

  const cardsHtml = calculators
    .map(
      (calculator) => `<a class="pct-cluster-related-link" href="${calculator.url}">
      <span class="pct-cluster-related-card-title">${calculator.name}</span>
      <span class="pct-cluster-related-card-copy">Open the focused pricing workflow for ${calculator.name.toLowerCase()}.</span>
      <span class="pct-cluster-related-card-meta">Pricing &amp; Margin</span>
    </a>`
    )
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${headMetaHtml}
    <style data-pricing-cluster="true">
${indentBlock(buildPricingClusterInlineCss(null), '      ')}
    </style>
${renderManagedHeadAdsenseBlock()}    <!-- Cloudflare Web Analytics (manual beacon commented out for duplicate-beacon validation): <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script> -->
  </head>
  <body data-page="pricing-cluster" data-route-archetype="content_shell" data-design-family="neutral">
    <div class="page pct-cluster-page-shell">
      ${buildPricingClusterHeaderHtml()}
      <main class="pct-cluster-layout-main">
        <section class="pct-cluster-center-column">
          <section class="pct-cluster-panel panel-span-all">
            <div class="pct-cluster-page-header">
              <h1>Pricing Calculators</h1>
              <p class="pct-cluster-page-intro">Use this pricing calculator hub when you need to move from cost to price, check profitability, compare discount impact, or estimate sales commission without bouncing between generic percentage tools.</p>
            </div>
            <section class="pct-cluster-related" aria-labelledby="pricing-cluster-list-title">
              <div class="pct-cluster-related-head">
                <div>
                  <span class="pct-cluster-switch-kicker">Choose a tool</span>
                  <h2 id="pricing-cluster-list-title">Pricing and margin calculators</h2>
                </div>
              </div>
              <div class="pct-cluster-related-links">
                ${cardsHtml}
              </div>
            </section>
            <section class="pct-cluster-related" aria-labelledby="pricing-cluster-use-cases-title">
              <div class="pct-cluster-related-head">
                <div>
                  <span class="pct-cluster-switch-kicker">Use cases</span>
                  <h2 id="pricing-cluster-use-cases-title">When to use each pricing calculator</h2>
                </div>
              </div>
              <div class="pct-cluster-related-links">
                <article class="pct-cluster-related-link">
                  <span class="pct-cluster-related-card-title">Margin calculator</span>
                  <span class="pct-cluster-related-card-copy">Use margin when you manage gross profit as a share of selling price and need to protect profitability after discounts or channel changes.</span>
                  <span class="pct-cluster-related-card-meta">Profitability view</span>
                </article>
                <article class="pct-cluster-related-link">
                  <span class="pct-cluster-related-card-title">Markup calculator</span>
                  <span class="pct-cluster-related-card-copy">Use markup when your pricing rule starts from cost and you need to turn cost into a consistent selling price or quote.</span>
                  <span class="pct-cluster-related-card-meta">Cost-based pricing</span>
                </article>
                <article class="pct-cluster-related-link">
                  <span class="pct-cluster-related-card-title">Discount calculator</span>
                  <span class="pct-cluster-related-card-copy">Use discount when you need to see sale price, savings, and the immediate revenue impact of a markdown or promotional offer.</span>
                  <span class="pct-cluster-related-card-meta">Promotion planning</span>
                </article>
                <article class="pct-cluster-related-link">
                  <span class="pct-cluster-related-card-title">Sales commission calculator</span>
                  <span class="pct-cluster-related-card-copy">Use commission when you want to test flat or tiered sales payouts and understand the effective commission rate on a deal or period of sales.</span>
                  <span class="pct-cluster-related-card-meta">Sales payouts</span>
                </article>
              </div>
            </section>
            <section class="pct-cluster-related" aria-labelledby="pricing-cluster-guide-title">
              <div class="pct-cluster-related-head">
                <div>
                  <span class="pct-cluster-switch-kicker">Planning guide</span>
                  <h2 id="pricing-cluster-guide-title">How this pricing cluster helps</h2>
                </div>
              </div>
              <div class="pct-cluster-related-links">
                <article class="pct-cluster-related-link">
                  <span class="pct-cluster-related-card-title">Protect margin before discounting</span>
                  <span class="pct-cluster-related-card-copy">Check how much room you really have before a discount or negotiated price starts to erode gross margin more than expected.</span>
                  <span class="pct-cluster-related-card-meta">Margin control</span>
                </article>
                <article class="pct-cluster-related-link">
                  <span class="pct-cluster-related-card-title">Translate cost into a sellable price</span>
                  <span class="pct-cluster-related-card-copy">Move from a supplier cost or landed cost into a target price with markup rules that are easier to standardize across products.</span>
                  <span class="pct-cluster-related-card-meta">Quote building</span>
                </article>
                <article class="pct-cluster-related-link">
                  <span class="pct-cluster-related-card-title">Compare adjacent pricing questions</span>
                  <span class="pct-cluster-related-card-copy">Jump between markup, margin, discount, and commission routes when one pricing question turns into another during planning.</span>
                  <span class="pct-cluster-related-card-meta">Internal linking</span>
                </article>
              </div>
            </section>
          </section>
        </section>
      </main>
      ${buildPricingClusterFooterHtml()}
    </div>
  </body>
</html>
`;
}

function injectBeforeImportantNotes(explanationHtml, injectedHtml) {
  if (!injectedHtml || typeof explanationHtml !== 'string' || !explanationHtml.trim()) {
    return explanationHtml;
  }

  const importantNotesHeadingRe = /<h3>\s*Important Notes\s*<\/h3>/i;
  const headingMatch = explanationHtml.match(importantNotesHeadingRe);

  if (!headingMatch || typeof headingMatch.index !== 'number') {
    return `${explanationHtml}\n${injectedHtml}`;
  }

  const sectionStart = explanationHtml.lastIndexOf('<section', headingMatch.index);

  if (sectionStart === -1) {
    return `${explanationHtml.slice(0, headingMatch.index)}${injectedHtml}\n${explanationHtml.slice(headingMatch.index)}`;
  }

  return `${explanationHtml.slice(0, sectionStart)}${injectedHtml}\n\n${explanationHtml.slice(sectionStart)}`;
}

function injectBeforeFaq(explanationHtml, injectedHtml) {
  if (!injectedHtml || typeof explanationHtml !== 'string' || !explanationHtml.trim()) {
    return explanationHtml;
  }

  const faqHeadingRe = /<h3>\s*(FAQ|Frequently Asked Questions)\s*<\/h3>/i;
  const headingMatch = explanationHtml.match(faqHeadingRe);

  if (!headingMatch || typeof headingMatch.index !== 'number') {
    return `${injectedHtml}\n${explanationHtml}`;
  }

  const sectionStart = explanationHtml.lastIndexOf('<section', headingMatch.index);

  if (sectionStart === -1) {
    return `${explanationHtml.slice(0, headingMatch.index)}${injectedHtml}\n${explanationHtml.slice(headingMatch.index)}`;
  }

  return `${explanationHtml.slice(0, sectionStart)}${injectedHtml}\n\n${explanationHtml.slice(sectionStart)}`;
}

function injectTimeAndDateSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml) {
  return injectBeforeImportantNotes(
    injectBeforeFaq(explanationHtml, routeSwitchHtml),
    relatedCalculatorsHtml
  );
}

function injectPercentageSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml) {
  return injectBeforeImportantNotes(
    injectBeforeFaq(explanationHtml, routeSwitchHtml),
    relatedCalculatorsHtml
  );
}

function injectPricingSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml) {
  return injectBeforeImportantNotes(
    injectBeforeFaq(explanationHtml, routeSwitchHtml),
    relatedCalculatorsHtml
  );
}

const mathIcons = {
  simple:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="18" x2="12" y2="18.01"/><line x1="8" y1="18" x2="8" y2="18.01"/></svg>',
  algebra:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  trigonometry:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  calculus:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  log: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  statistics:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
  chevronDown:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronRight:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
};

function getFirstCalculatorUrl(category) {
  if (!category || !category.subcategories?.length) {
    return '/';
  }
  const calculator = category.subcategories
    .map((subcategory) => subcategory.calculators[0])
    .find(Boolean);
  return calculator?.url ?? '/';
}

function getTopNavItems(categories) {
  const items = [];
  categories.forEach((category) => {
    if (category.id === 'loans') {
      category.subcategories.forEach((subcategory) => {
        const calculator = subcategory.calculators[0];
        if (!calculator) {
          return;
        }
        items.push({
          id: `${category.id}:${subcategory.id}`,
          label: subcategory.name === 'Home' ? 'Home Loan' : subcategory.name,
          href: calculator.url,
          icon: subcategory.icon || category.icon,
        });
      });
    } else {
      items.push({
        id: category.id,
        label: category.name,
        href: getFirstCalculatorUrl(category),
        icon: category.icon,
      });
    }
  });
  return items;
}

function buildTopNavHtml(categories, activeCategoryId, activeSubcategoryId) {
  const items = getTopNavItems(categories);
  const activeId = activeCategoryId === 'loans' ? `loans:${activeSubcategoryId}` : activeCategoryId;

  return items
    .map((item) => {
      const icon = item.icon ? `<span class="nav-icon" aria-hidden="true">${item.icon}</span>` : '';
      const activeClass = item.id === activeId ? ' is-active' : '';
      return `<a class="top-nav-link${activeClass}" href="${item.href}">${icon}<span class="nav-label">${item.label}</span></a>`;
    })
    .join('');
}

function buildMathNav(category, activeCalculatorId, calcLookup) {
  const activeEntry = calcLookup.get(activeCalculatorId);
  const activeSubcategoryId = activeEntry?.subcategory?.id ?? null;

  const hasAnyExpanded = category.subcategories.some(
    (subcategory) => subcategory.id === activeSubcategoryId
  );

  const categoriesHtml = category.subcategories
    .map((subcategory) => {
      const isActiveSubcategory = subcategory.id === activeSubcategoryId;
      const isCollapsed = hasAnyExpanded ? !isActiveSubcategory : subcategory.id !== 'simple';
      const chevronOpen = mathIcons.chevronDown;
      const chevronClosed = mathIcons.chevronRight;
      const chevron = isCollapsed ? chevronClosed : chevronOpen;

      const itemsHtml = subcategory.calculators
        .map((calculator) => {
          const isActive = calculator.id === activeCalculatorId;
          return `<a class="math-nav-item${isActive ? ' is-active' : ''}" href="${calculator.url}">${calculator.name}</a>`;
        })
        .join('');

      return `
<div class="math-nav-category${isCollapsed ? ' is-collapsed' : ''}" data-id="${subcategory.id}">
  <button type="button" class="math-nav-category-toggle" aria-expanded="${!isCollapsed}">
    <span class="math-nav-category-left">
      <span class="math-nav-category-icon">${mathIcons[subcategory.id] || mathIcons.simple}</span>
      <span class="math-nav-category-name">${subcategory.name.toUpperCase()}</span>
    </span>
    <span class="math-nav-category-chevron" data-chevron-open='${chevronOpen}' data-chevron-closed='${chevronClosed}'>${chevron}</span>
  </button>
  <div class="math-nav-category-items">
    ${itemsHtml}
  </div>
</div>`;
    })
    .join('');

  return `<div class="math-nav-container">${categoriesHtml}</div>`;
}

const FINANCE_SUBCATEGORY_ICONS = {
  'time-value-of-money': '⏳',
  'interest-and-growth': '📈',
  'investments-and-savings': '💰',
};

const FINANCE_CALCULATOR_ICONS = {
  'present-value': '📉',
  'future-value': '📈',
  'present-value-of-annuity': '📊',
  'future-value-of-annuity': '💹',
  'simple-interest': '➕',
  'compound-interest': '♻️',
  'effective-annual-rate': '🔄',
  inflation: '🧾',
  'investment-growth': '📊',
  'investment-return': '📈',
  'time-to-savings-goal': '🎯',
  'monthly-savings-needed': '🏦',
};

const PERCENTAGE_SUBCATEGORY_ICONS = {
  'percentage-core': '%',
  'pricing-and-margin': '💼',
};

const PERCENTAGE_CALCULATOR_ICONS = {
  'percent-change': '↔️',
  'percentage-difference': '⚖️',
  'percentage-increase': '⬆️',
  'percentage-decrease': '⬇️',
  'percentage-composition': '🧩',
  'reverse-percentage': '🔁',
  'percent-to-fraction-decimal': '🔢',
  'what-percent-is-x-of-y': '❓',
  'percentage-of-a-number': '🎯',
  'commission-calculator': '💵',
  'discount-calculator': '🏷️',
  'margin-calculator': '📐',
  'markup-calculator': '➕',
};

const TIME_AND_DATE_SUBCATEGORY_ICONS = {
  'sleep-time': '🌙',
  'work-hours': '⏱️',
  'date-time': '📅',
  'age-calculator': '🎂',
};

const TIME_AND_DATE_CALCULATOR_ICONS = {
  'sleep-time-calculator': '🌙',
  'wake-up-time-calculator': '🌅',
  'nap-time-calculator': '😴',
  'power-nap-calculator': '⚡',
  'energy-based-nap-selector': '🔋',
  'work-hours-calculator': '🕒',
  'overtime-hours-calculator': '⌛',
  'time-between-two-dates-calculator': '🗓️',
  'days-until-a-date-calculator': '📆',
  'countdown-timer-generator': '⏳',
  'age-calculator': '🧬',
  'birthday-day-of-week': '🎉',
};

const FIN_NAV_CHEVRON_SVG =
  '<svg class="fin-nav-chevron-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

function buildFinanceNav(category, activeCalculatorId, calcLookup) {
  const activeEntry = calcLookup.get(activeCalculatorId);
  const activeSubcategoryId = activeEntry?.subcategory?.id ?? null;

  const groupsHtml = category.subcategories
    .map((subcategory) => {
      const isExpanded = subcategory.id === activeSubcategoryId;
      const subcategoryIcon = FINANCE_SUBCATEGORY_ICONS[subcategory.id] || '📁';

      const itemsHtml = subcategory.calculators
        .map((calculator) => {
          const isActive = calculator.id === activeCalculatorId;
          const calcIcon = FINANCE_CALCULATOR_ICONS[calculator.id] || '🔢';
          return `<a class="fin-nav-item${isActive ? ' is-active' : ''}" href="${calculator.url}"><span class="fin-nav-item-icon" aria-hidden="true">${calcIcon}</span>${calculator.name}</a>`;
        })
        .join('');

      return `
<div class="fin-nav-group${isExpanded ? ' is-expanded' : ''}" data-fin-subcategory="${subcategory.id}">
  <button type="button" class="fin-nav-toggle" aria-expanded="${isExpanded}">
    <span class="fin-nav-toggle-icon" aria-hidden="true">${subcategoryIcon}</span>
    <span class="fin-nav-toggle-label">${subcategory.name}</span>
    <span class="fin-nav-chevron">${FIN_NAV_CHEVRON_SVG}</span>
  </button>
  <div class="fin-nav-items">
    ${itemsHtml}
  </div>
</div>`;
    })
    .join('');

  return `<div class="fin-nav-container" data-fin-nav="true">${groupsHtml}</div>`;
}

function buildPercentageNav(category, activeCalculatorId, calcLookup) {
  const activeEntry = calcLookup.get(activeCalculatorId);
  const activeSubcategoryId = activeEntry?.subcategory?.id ?? null;

  const groupsHtml = category.subcategories
    .map((subcategory) => {
      const isExpanded = subcategory.id === activeSubcategoryId;
      const subcategoryIcon = PERCENTAGE_SUBCATEGORY_ICONS[subcategory.id] || '📁';

      const itemsHtml = subcategory.calculators
        .map((calculator) => {
          const isActive = calculator.id === activeCalculatorId;
          const calcIcon = PERCENTAGE_CALCULATOR_ICONS[calculator.id] || '🔢';
          return `<a class="fin-nav-item${isActive ? ' is-active' : ''}" href="${calculator.url}"><span class="fin-nav-item-icon" aria-hidden="true">${calcIcon}</span>${calculator.name}</a>`;
        })
        .join('');

      return `
<div class="fin-nav-group${isExpanded ? ' is-expanded' : ''}" data-fin-subcategory="${subcategory.id}">
  <button type="button" class="fin-nav-toggle" aria-expanded="${isExpanded}">
    <span class="fin-nav-toggle-icon" aria-hidden="true">${subcategoryIcon}</span>
    <span class="fin-nav-toggle-label">${subcategory.name}</span>
    <span class="fin-nav-chevron">${FIN_NAV_CHEVRON_SVG}</span>
  </button>
  <div class="fin-nav-items">
    ${itemsHtml}
  </div>
</div>`;
    })
    .join('');

  return `<div class="fin-nav-container" data-fin-nav="true">${groupsHtml}</div>`;
}

function buildTimeAndDateNav(category, activeCalculatorId, calcLookup) {
  const activeEntry = calcLookup.get(activeCalculatorId);
  const activeSubcategoryId = activeEntry?.subcategory?.id ?? null;

  const groupsHtml = category.subcategories
    .map((subcategory) => {
      const isExpanded = subcategory.id === activeSubcategoryId;
      const subcategoryIcon = TIME_AND_DATE_SUBCATEGORY_ICONS[subcategory.id] || '🕒';

      const itemsHtml = subcategory.calculators
        .map((calculator) => {
          const isActive = calculator.id === activeCalculatorId;
          const calcIcon = TIME_AND_DATE_CALCULATOR_ICONS[calculator.id] || '🕒';
          return `<a class="fin-nav-item${isActive ? ' is-active' : ''}" href="${calculator.url}"><span class="fin-nav-item-icon" aria-hidden="true">${calcIcon}</span>${calculator.name}</a>`;
        })
        .join('');

      return `
<div class="fin-nav-group${isExpanded ? ' is-expanded' : ''}" data-fin-subcategory="${subcategory.id}">
  <button type="button" class="fin-nav-toggle" aria-expanded="${isExpanded}">
    <span class="fin-nav-toggle-icon" aria-hidden="true">${subcategoryIcon}</span>
    <span class="fin-nav-toggle-label">${subcategory.name}</span>
    <span class="fin-nav-chevron">${FIN_NAV_CHEVRON_SVG}</span>
  </button>
  <div class="fin-nav-items">
    ${itemsHtml}
  </div>
</div>`;
    })
    .join('');

  return `<div class="fin-nav-container" data-fin-nav="true" data-fin-nav-cluster="time-and-date">${groupsHtml}</div>`;
}

function buildStandardNav(category, activeCalculatorId, activeSubcategoryId, calcLookup) {
  let subcategoriesToRender = category.subcategories;
  if (activeSubcategoryId) {
    const activeSubcategory = category.subcategories.find((sub) => sub.id === activeSubcategoryId);
    if (activeSubcategory) {
      subcategoriesToRender = [activeSubcategory];
    }
  }

  return subcategoriesToRender
    .map((subcategory) => {
      const isActiveSubcategory = subcategory.id === activeSubcategoryId;
      const isCollapsed = activeSubcategoryId ? !isActiveSubcategory : false;
      const indicator = isCollapsed ? '+' : '-';

      const itemsHtml = subcategory.calculators
        .map((calculator) => {
          const isActive = calculator.id === activeCalculatorId;
          return `<a class="nav-item${isActive ? ' is-active' : ''}" href="${calculator.url}">${calculator.name}</a>`;
        })
        .join('');

      return `
<div class="nav-category${isCollapsed ? ' is-collapsed' : ''}" data-id="${subcategory.id}">
  <button type="button" class="nav-category-toggle" aria-expanded="${!isCollapsed}">
    <span class="nav-category-label">${subcategory.name}</span>
    <span class="nav-category-indicator">${indicator}</span>
  </button>
  <div class="nav-category-items">
    ${itemsHtml}
  </div>
</div>`;
    })
    .join('');
}

function buildLeftNavHtml(
  categories,
  activeCategoryId,
  activeSubcategoryId,
  activeCalculatorId,
  calcLookup,
  mode
) {
  if (!activeCategoryId && mode === 'home') {
    const sections = categories
      .map((category) => {
        const items = category.subcategories
          .map((subcategory) => {
            const calculators = subcategory.calculators
              .map(
                (calculator) =>
                  `<a class="nav-item" href="${calculator.url}">${calculator.name}</a>`
              )
              .join('');
            return `
<div class="nav-category" data-id="${subcategory.id}">
  <button type="button" class="nav-category-toggle" aria-expanded="true">
    <span class="nav-category-label">${subcategory.name}</span>
    <span class="nav-category-indicator">-</span>
  </button>
  <div class="nav-category-items">
    ${calculators}
  </div>
</div>`;
          })
          .join('');
        return `<div class="nav-group" data-id="${category.id}">${items}</div>`;
      })
      .join('');
    return sections;
  }

  const category = categories.find((item) => item.id === activeCategoryId);
  if (!category) {
    return '<p class="placeholder">Choose a category from the top navigation to see calculators.</p>';
  }

  if (category.id === 'math') {
    return buildMathNav(category, activeCalculatorId, calcLookup);
  }

  if (category.id === 'finance') {
    return buildFinanceNav(category, activeCalculatorId, calcLookup);
  }

  if (category.id === 'percentage-calculators') {
    return buildPercentageNav(category, activeCalculatorId, calcLookup);
  }

  if (category.id === 'pricing') {
    return buildPercentageNav(category, activeCalculatorId, calcLookup);
  }

  if (category.id === 'time-and-date') {
    return buildTimeAndDateNav(category, activeCalculatorId, calcLookup);
  }

  return buildStandardNav(category, activeCalculatorId, activeSubcategoryId, calcLookup);
}

function assertPercentageFinNavContract({ leftNavHtml, calculatorId, routePath }) {
  // Hard gate (percentage only): keep legacy deletion deferred until all clusters migrate.
  const requiredTokens = ['class="fin-nav-container"', 'class="fin-nav-group', 'class="fin-nav-item"'];
  const forbiddenTokens = ['class="nav-item', 'class="nav-category'];

  const missingTokens = requiredTokens.filter((token) => !leftNavHtml.includes(token));
  const foundForbidden = forbiddenTokens.filter((token) => leftNavHtml.includes(token));

  if (!missingTokens.length && !foundForbidden.length) {
    return;
  }

  const details = [
    missingTokens.length ? `missing=[${missingTokens.join(', ')}]` : null,
    foundForbidden.length ? `forbidden=[${foundForbidden.join(', ')}]` : null,
  ]
    .filter(Boolean)
    .join(' ');

  throw new Error(
    `Percentage nav contract violation for calc=${calculatorId} route=${routePath}. ${details}`
  );
}

function buildPageHtml({
  title,
  description,
  canonical,
  headerHtml,
  footerHtml,
  topNavHtml,
  leftNavHtml,
  calculatorTitle,
  calculatorHtml,
  explanationHtml,
  contentHtml = '',
  explanationHeading = 'Explanation',
  paneLayout = 'split',
  routeArchetype = 'calc_exp',
  designFamily = 'neutral',
  suppressAdsColumn = false,
  calculatorPanelClass = '',
  layoutMainClass = '',
  includeHomeContent,
  pageType,
  calculatorId = null,
  calculatorRelPath,
  assetConfig = null,
  cssBundleConfig = null,
  topNavStatic = false,
  staticStructuredData = null,
  injectStaticStructuredData = false,
  relatedCalculatorsHtml = '',
  routeSwitchHtml = '',
}) {
  const isCreditCardClusterRoute =
    designFamily === 'credit-cards' && canonical.includes('/credit-card-calculators/');
  const isMigratedPercentageClusterRoute =
    canonical.includes('/percentage-calculators/') && PERCENTAGE_CLUSTER_REDESIGN_IDS.has(calculatorId);
  const isMigratedPricingClusterRoute =
    canonical.includes('/pricing-calculators/') && PRICING_CLUSTER_REDESIGN_IDS.has(calculatorId);
  const isMigratedMathClusterRoute =
    canonical.includes('/math/') && MATH_CLUSTER_REDESIGN_IDS.has(calculatorId);
  const isMigratedSalaryClusterRoute =
    canonical.includes('/salary-calculators/') && SALARY_CLUSTER_REDESIGN_IDS.has(calculatorId);
  const isMigratedFinanceClusterRoute =
    canonical.includes('/finance-calculators/') && FINANCE_CLUSTER_REDESIGN_IDS.has(calculatorId);
  const isMigratedTimeAndDateClusterRoute =
    canonical.includes('/time-and-date/') && TIME_AND_DATE_CLUSTER_REDESIGN_IDS.has(calculatorId);
  const isMigratedAutoLoanClusterRoute =
    designFamily === 'auto-loans' &&
    canonical.includes('/car-loan-calculators/') &&
    AUTO_LOAN_CLUSTER_REDESIGN_IDS.has(calculatorId);
  const isMigratedHomeLoanClusterRoute =
    designFamily === 'home-loan' &&
    canonical.includes('/loan-calculators/') &&
    HOME_LOAN_CLUSTER_REDESIGN_IDS.has(calculatorId);
  const versionedCalculatorHtml = applyCalculatorFragmentVersioning(calculatorHtml);
  const sanitizedCalculatorHtml =
    (assetConfig ||
      isCreditCardClusterRoute ||
      isMigratedMathClusterRoute ||
      isMigratedPercentageClusterRoute ||
      isMigratedSalaryClusterRoute ||
      isMigratedPricingClusterRoute ||
      isMigratedFinanceClusterRoute ||
      isMigratedTimeAndDateClusterRoute ||
      isMigratedAutoLoanClusterRoute ||
      isMigratedHomeLoanClusterRoute) &&
    typeof versionedCalculatorHtml === 'string'
      ? versionedCalculatorHtml.replace(
          /<style>\s*@import\s+url\(['"]\/calculators\/[^'"]+\/calculator\.css(?:\?[^'"]*)?['"]\);\s*<\/style>|<script\s+type=['"]module['"]\s+src=['"]\/calculators\/[^'"]+\/module\.js(?:\?[^'"]*)?['"]><\/script>/gi,
          ''
        )
      : versionedCalculatorHtml;

  const explanationTitleHtml =
    explanationHeading === '' || explanationHeading === null
      ? ''
      : `  <h3>${explanationHeading}</h3>\n`;
  const calculatorPanelClassSuffix =
    typeof calculatorPanelClass === 'string' && calculatorPanelClass.trim()
      ? ` ${calculatorPanelClass.trim()}`
      : '';
  const layoutMainClassSuffix =
    typeof layoutMainClass === 'string' && layoutMainClass.trim() ? ` ${layoutMainClass.trim()}` : '';

  let calcContent = '';

  if (includeHomeContent) {
    calcContent = `<div class="panel panel-scroll">
  <h1 id="home-overview-title">Calculate How Much</h1>
  <p class="placeholder" id="home-overview-intro">
    Explore calculators by category using the top navigation. This page is a guide to
    help you discover the right tool, not a calculator itself.
  </p>
  <div class="home-overview-links">
    <p class="helper">Popular starting points:</p>
    <ul>
      <li><a href="/calculators/">Browse all calculators</a></li>
      <li><a href="/loan-calculators/mortgage-calculator/">Home Loan Calculator</a></li>
      <li><a href="/car-loan-calculators/car-loan-calculator/">Car Loan Calculator</a></li>
      <li><a href="/percentage-calculators/percentage-increase-calculator/">Percentage Calculator</a></li>
      <li><a href="/math/basic">Basic Calculator</a></li>
    </ul>
  </div>
</div>
<div class="panel panel-scroll">
  <h3 id="home-guidance-title">How to choose a calculator</h3>
  <p class="placeholder" id="home-guidance-intro">
    Calculate How Much provides fast, focused tools for common finance and math
    questions. Start with a category in the top navigation, then pick the calculator
    that matches your scenario.
  </p>
  <p class="placeholder" id="home-guidance-trust">
    Results are estimates for planning purposes only. Always verify details with your
    lender, advisor, or official documentation.
  </p>
</div>`;
  } else if (routeArchetype === 'calc_exp') {
    calcContent =
      isCreditCardClusterRoute
        ? `<div class="panel panel-scroll panel-span-all cc-cluster-panel${calculatorPanelClassSuffix}">
  <div class="cc-cluster-page-header">
    <h1 id="calculator-title">${calculatorTitle}</h1>
  </div>
  <div class="calculator-page-single cc-cluster-flow">
    ${sanitizedCalculatorHtml}
    ${explanationHtml}
    ${relatedCalculatorsHtml}
  </div>
        </div>`
        : isMigratedPercentageClusterRoute
        ? `<div class="pct-cluster-panel panel panel-scroll panel-span-all${calculatorPanelClassSuffix}">
  <div class="pct-cluster-page-header">
    <h1 id="calculator-title">${calculatorTitle}</h1>
    <p class="pct-cluster-page-intro">${description}</p>
  </div>
  <div class="calculator-page-single pct-cluster-flow">
    ${sanitizedCalculatorHtml}
    ${injectPercentageSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml)}
  </div>
</div>`
        : isMigratedPricingClusterRoute
        ? `<div class="pct-cluster-panel panel panel-scroll panel-span-all${calculatorPanelClassSuffix}">
  <div class="pct-cluster-page-header">
    <h1 id="calculator-title">${calculatorTitle}</h1>
    <p class="pct-cluster-page-intro">${description}</p>
  </div>
  <nav class="pct-cluster-switch-chips" aria-label="Current pricing route">
    <a class="pct-cluster-switch-chip nav-item is-active" href="${canonical}" aria-current="page">${calculatorTitle}</a>
  </nav>
  <div class="calculator-page-single pct-cluster-flow">
    ${sanitizedCalculatorHtml}
    ${injectPricingSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml)}
  </div>
</div>`
        : isMigratedFinanceClusterRoute
        ? `<div class="fi-cluster-panel panel-span-all${calculatorPanelClassSuffix}">
  <div class="fi-cluster-page-header">
    <span class="fi-cluster-page-kicker">Finance Calculators</span>
    <h1 id="calculator-title">${calculatorTitle}</h1>
    <p class="fi-cluster-page-intro">${description}</p>
  </div>
  <div class="calculator-page-single fi-cluster-flow">
    ${sanitizedCalculatorHtml}
    ${explanationHtml}
    ${relatedCalculatorsHtml}
  </div>
</div>`
        : isMigratedMathClusterRoute
        ? `<div class="math-cluster-panel panel-span-all${calculatorPanelClassSuffix}">
  <div class="math-cluster-page-header">
    <div class="math-cluster-breadcrumbs">
      <a href="/">Home</a>
      <span>/</span>
      <a href="/math/basic/">Math</a>
      <span>/</span>
      <span>${calculatorTitle}</span>
    </div>
    <span class="math-cluster-page-kicker">Math Calculator</span>
    <h1 id="calculator-title">${calculatorTitle}</h1>
    <p class="math-cluster-page-intro">${description}</p>
  </div>
  <div class="calculator-page-single math-cluster-flow">
    ${sanitizedCalculatorHtml}
    ${explanationHtml}
  </div>
</div>`
        : isMigratedTimeAndDateClusterRoute
        ? `<div class="td-cluster-panel panel-span-all${calculatorPanelClassSuffix}">
  <div class="td-cluster-page-header">
    <h1 id="calculator-title">${calculatorTitle}</h1>
    <p class="td-cluster-page-intro">${description}</p>
  </div>
  <div class="calculator-page-single td-cluster-flow">
    ${sanitizedCalculatorHtml}
    ${injectTimeAndDateSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml)}
  </div>
</div>`
        : isMigratedSalaryClusterRoute
        ? `<div class="sal-cluster-panel panel-span-all${calculatorPanelClassSuffix}">
  <div class="sal-cluster-page-header">
    <h1 id="calculator-title">${calculatorTitle}</h1>
    <p class="sal-cluster-page-intro">${description}</p>
  </div>
  <div class="calculator-page-single sal-cluster-flow sal-cluster-calc-flow">
    ${sanitizedCalculatorHtml}
    ${explanationHtml}
    ${relatedCalculatorsHtml}
  </div>
</div>`
        : isMigratedAutoLoanClusterRoute
        ? `<div class="al-cluster-panel${calculatorPanelClassSuffix}">
  <div class="al-cluster-page-header">
    <span class="al-cluster-page-kicker">Auto Loan Calculators</span>
    <h1 id="calculator-title">${calculatorTitle}</h1>
    <p class="al-cluster-page-intro">${description}</p>
  </div>
  <div class="calculator-page-single al-cluster-flow">
    ${sanitizedCalculatorHtml}
    ${explanationHtml}
    ${relatedCalculatorsHtml}
  </div>
</div>`
        : isMigratedHomeLoanClusterRoute
        ? `<div class="hl-cluster-panel${calculatorPanelClassSuffix}">
  <div class="hl-cluster-page-header">
    <span class="hl-cluster-page-kicker">Home Loan Calculators</span>
    <h1 id="calculator-title">${calculatorTitle}</h1>
    <p class="hl-cluster-page-intro">${description}</p>
  </div>
  <div class="calculator-page-single hl-cluster-flow">
    ${sanitizedCalculatorHtml}
    ${explanationHtml}
  </div>
</div>`
        : paneLayout === 'single'
        ? `<div class="panel panel-scroll panel-span-all${calculatorPanelClassSuffix}">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  <div class="calculator-page-single">
    ${sanitizedCalculatorHtml}
${explanationTitleHtml}    ${explanationHtml}
  </div>
</div>`
        : `<div class="panel panel-scroll">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  ${sanitizedCalculatorHtml}
</div>
<div class="panel panel-scroll">
${explanationTitleHtml}  ${explanationHtml}
</div>`;
  } else if (routeArchetype === 'calc_only') {
    calcContent = `<div class="${
      isMigratedPercentageClusterRoute
        ? 'pct-cluster-panel panel-span-all'
        :
      isMigratedFinanceClusterRoute
        ? 'fi-cluster-panel'
        : isMigratedTimeAndDateClusterRoute
        ? 'td-cluster-panel'
        : isMigratedAutoLoanClusterRoute
        ? 'al-cluster-panel'
        : isMigratedHomeLoanClusterRoute
        ? 'hl-cluster-panel'
        : `panel panel-scroll panel-span-all${isCreditCardClusterRoute ? ' cc-cluster-panel' : ''}`
    }">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  <div class="calculator-page-single${
    isMigratedTimeAndDateClusterRoute
      ? ' td-cluster-flow'
      : isMigratedPercentageClusterRoute
      ? ' pct-cluster-flow'
      : isMigratedPricingClusterRoute
      ? ' pct-cluster-flow'
      : ''
  }">
    ${sanitizedCalculatorHtml}
    ${
      isMigratedTimeAndDateClusterRoute
        ? injectTimeAndDateSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml)
        : isMigratedPercentageClusterRoute
        ? injectPercentageSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml)
        : isMigratedPricingClusterRoute
        ? injectPricingSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml)
        : ''
    }
    ${
      isCreditCardClusterRoute ||
      isMigratedFinanceClusterRoute ||
      isMigratedAutoLoanClusterRoute
        ? relatedCalculatorsHtml
        : ''
    }
  </div>
</div>`;
  } else if (routeArchetype === 'exp_only') {
    calcContent = `<div class="${
      isMigratedPercentageClusterRoute
        ? 'pct-cluster-panel panel-span-all'
        :
      isMigratedFinanceClusterRoute
        ? 'fi-cluster-panel'
        : isMigratedTimeAndDateClusterRoute
        ? 'td-cluster-panel'
        : isMigratedAutoLoanClusterRoute
        ? 'al-cluster-panel'
        : isMigratedHomeLoanClusterRoute
        ? 'hl-cluster-panel'
        : `panel panel-scroll panel-span-all${isCreditCardClusterRoute ? ' cc-cluster-panel' : ''}`
    }">
  <h1 id="calculator-title">${calculatorTitle}</h1>
${
  isCreditCardClusterRoute ||
  isMigratedPercentageClusterRoute ||
  isMigratedFinanceClusterRoute ||
  isMigratedTimeAndDateClusterRoute ||
  isMigratedAutoLoanClusterRoute
    ? ''
    : explanationTitleHtml
}  ${
  isMigratedTimeAndDateClusterRoute
    ? injectTimeAndDateSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml)
    : isMigratedPercentageClusterRoute
    ? injectPercentageSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml)
    : isMigratedPricingClusterRoute
    ? injectPricingSupportSections(explanationHtml, routeSwitchHtml, relatedCalculatorsHtml)
    : explanationHtml
}
${isCreditCardClusterRoute || isMigratedFinanceClusterRoute || isMigratedAutoLoanClusterRoute ? `\n  ${relatedCalculatorsHtml}` : ''}
</div>`;
  } else if (routeArchetype === 'content_shell') {
    calcContent = `<div class="${
      isMigratedPercentageClusterRoute
        ? 'pct-cluster-panel panel-span-all'
        :
      isMigratedSalaryClusterRoute
        ? 'sal-cluster-panel panel-span-all'
        :
      isMigratedFinanceClusterRoute
        ? 'fi-cluster-panel'
        : isMigratedTimeAndDateClusterRoute
        ? 'td-cluster-panel'
        : isMigratedAutoLoanClusterRoute
        ? 'al-cluster-panel'
        : isMigratedHomeLoanClusterRoute
        ? 'hl-cluster-panel'
        : `panel panel-scroll panel-span-all${isCreditCardClusterRoute ? ' cc-cluster-panel' : ''}`
    }">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  ${contentHtml}
</div>`;
  } else {
    throw new Error(`Unsupported routeArchetype "${routeArchetype}" while building ${canonical}`);
  }

  const bodyAttribute = pageType ? ` data-page="${pageType}"` : '';
  const routeArchetypeAttribute = routeArchetype ? ` data-route-archetype="${routeArchetype}"` : '';
  const designFamilyAttribute = designFamily ? ` data-design-family="${designFamily}"` : '';
  const topNavStaticAttribute =
    topNavStatic &&
    !isMigratedTimeAndDateClusterRoute &&
    !isMigratedMathClusterRoute &&
    !isMigratedPercentageClusterRoute &&
    !isMigratedSalaryClusterRoute &&
    !isMigratedFinanceClusterRoute &&
    !isMigratedAutoLoanClusterRoute &&
    !isMigratedHomeLoanClusterRoute
      ? ' data-top-nav-static="true"'
      : '';
  const routeModuleScriptHref = resolveCalculatorModuleScriptHref(calculatorRelPath);

  let scriptTagsHtml = '';
  if (
    isCreditCardClusterRoute ||
    isMigratedMathClusterRoute ||
    isMigratedPercentageClusterRoute ||
    isMigratedSalaryClusterRoute ||
    isMigratedPricingClusterRoute ||
    isMigratedFinanceClusterRoute ||
    isMigratedTimeAndDateClusterRoute ||
    isMigratedAutoLoanClusterRoute ||
    isMigratedHomeLoanClusterRoute
  ) {
    const defaultScripts = [];
    if (isMigratedTimeAndDateClusterRoute) {
      defaultScripts.push('/calculators/time-and-date/shared/cluster-ux.js');
    }
    if (routeModuleScriptHref) {
      defaultScripts.push(routeModuleScriptHref);
    }
    scriptTagsHtml = defaultScripts.map((src) => `    <script type="module" src="${src}"></script>`).join('\n');
  } else if (assetConfig) {
    const coreScripts = Array.isArray(assetConfig?.js?.core) ? assetConfig.js.core : [];
    const routeScripts = Array.isArray(assetConfig?.js?.route) ? assetConfig.js.route : [];
    const allScripts = [...coreScripts, ...routeScripts];
    scriptTagsHtml = allScripts
      .filter((src) => typeof src === 'string' && src.trim())
      .map((src) => `    <script type="module" src="${versionCalculatorSourceHref(src)}"></script>`)
      .join('\n');
  } else {
    const defaultScripts = ['/assets/js/core/mpa-nav.js'];
    if (routeModuleScriptHref) {
      defaultScripts.push(routeModuleScriptHref);
    }
    scriptTagsHtml = defaultScripts.map((src) => `    <script type="module" src="${src}"></script>`).join('\n');
  }
  const structuredDataScript =
    injectStaticStructuredData && staticStructuredData
      ? `    <script type="application/ld+json" data-static-ld="true" data-calculator-ld="true">${stringifyStructuredData(
          staticStructuredData
        )}</script>\n`
      : '';
  const isCalculatorPage = isCalculatorPathFromCanonical(canonical);
  const shouldEmitCalculatorHeadJsonLd =
    isCalculatorPage && !(injectStaticStructuredData && staticStructuredData);
  const headMetaHtml = generateHeadMeta({
    canonicalUrl: canonical,
    seoTitle: title,
    seoDescription: description,
    ogImageUrl: OG_IMAGE,
    h1: calculatorTitle,
    isCalculatorPage: shouldEmitCalculatorHeadJsonLd,
  });
  let cssLinksHtml = '';
  if (isCreditCardClusterRoute) {
    cssLinksHtml = `    <style data-route-critical="true">\n${indentBlock(
      buildCreditCardClusterInlineCss(calculatorRelPath),
      '      '
    )}\n    </style>\n`;
  } else if (isMigratedPercentageClusterRoute) {
    cssLinksHtml = `    <style data-percentage-cluster="true">\n${indentBlock(
      buildPercentageClusterInlineCss(calculatorRelPath),
      '      '
    )}\n    </style>\n`;
  } else if (isMigratedSalaryClusterRoute) {
    cssLinksHtml = `    <style data-salary-cluster="true">\n${indentBlock(
      buildSalaryClusterInlineCss(calculatorRelPath),
      '      '
    )}\n    </style>\n`;
  } else if (isMigratedPricingClusterRoute) {
    cssLinksHtml = `    <style data-pricing-cluster="true">\n${indentBlock(
      buildPricingClusterInlineCss(calculatorRelPath),
      '      '
    )}\n    </style>\n`;
  } else if (isMigratedMathClusterRoute) {
    cssLinksHtml = `    <style data-math-cluster="true">\n${indentBlock(
      buildMathClusterInlineCss(calculatorRelPath),
      '      '
    )}\n    </style>\n`;
  } else if (isMigratedTimeAndDateClusterRoute) {
    cssLinksHtml = `    <style data-time-and-date-cluster="true">\n${indentBlock(
      buildTimeAndDateClusterInlineCss(calculatorRelPath),
      '      '
    )}\n    </style>\n`;
  } else if (isMigratedFinanceClusterRoute) {
    cssLinksHtml = `    <style data-finance-cluster="true">\n${indentBlock(
      buildFinanceClusterInlineCss(calculatorRelPath),
      '      '
    )}\n    </style>\n`;
  } else if (isMigratedAutoLoanClusterRoute) {
    cssLinksHtml = `    <style data-auto-loan-cluster="true">\n${indentBlock(
      buildAutoLoanInlineCss(calculatorRelPath),
      '      '
    )}\n    </style>\n`;
  } else if (isMigratedHomeLoanClusterRoute) {
    cssLinksHtml = `    <style data-home-loan-cluster="true">\n${indentBlock(
      buildHomeLoanInlineCss(calculatorRelPath),
      '      '
    )}\n    </style>\n`;
  } else if (assetConfig) {
    const deferCoreCss = assetConfig?.options?.deferCoreCss === true;
    const coreCss = Array.isArray(assetConfig?.css?.core) ? assetConfig.css.core : [];
    const routeCss = Array.isArray(assetConfig?.css?.route) ? assetConfig.css.route : [];
    const criticalHref = assetConfig?.css?.critical;
    const lines = [];
    if (criticalHref && typeof criticalHref === 'string') {
      const criticalPath = path.join(PUBLIC_DIR, criticalHref.replace(/^\//, ''));
      if (!fs.existsSync(criticalPath)) {
        throw new Error(`Missing critical CSS artifact for asset manifest route ${canonical}: ${criticalPath}`);
      }
      lines.push(
        `    <style data-route-critical="true">\n${indentBlock(readFile(criticalPath).trim(), '      ')}\n    </style>`
      );
    }
    if (!deferCoreCss) {
      coreCss
        .filter((href) => typeof href === 'string' && href.trim())
        .forEach((href) => lines.push(`    <link rel="stylesheet" href="${href}" />`));
    }
    routeCss
      .filter((href) => typeof href === 'string' && href.trim())
      .forEach((href) => lines.push(`    <link rel="stylesheet" href="${href}" />`));
    cssLinksHtml = `${lines.join('\n')}\n`;
  } else if (cssBundleConfig) {
    cssLinksHtml = `    <style data-route-critical="true">\n${indentBlock(cssBundleConfig.criticalCss, '      ')}\n    </style>\n    <link rel="stylesheet" href="${cssBundleConfig.deferredHref}" />\n`;
  } else {
    cssLinksHtml = `    <link rel="stylesheet" href="/assets/css/theme-premium-dark.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/layout.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/calculator.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/shared-calculator-ui.css?v=${CSS_VERSION}" />\n`;
  }
  const adsenseHeadScript = renderManagedHeadAdsenseBlock();
  const adPanelHtml = renderManagedAdPanel('          ');
  const adsColumnHtml =
    suppressAdsColumn ||
    isCreditCardClusterRoute ||
    isMigratedMathClusterRoute ||
    isMigratedPercentageClusterRoute ||
    isMigratedSalaryClusterRoute ||
    isMigratedPricingClusterRoute ||
    isMigratedFinanceClusterRoute ||
    isMigratedTimeAndDateClusterRoute ||
    isMigratedAutoLoanClusterRoute ||
    isMigratedHomeLoanClusterRoute
      ? ''
      : `        <section class="ads-column" aria-label="Ad placeholders">
${adPanelHtml}
        </section>
`;

  const pageShellHtml = isCreditCardClusterRoute
    ? `    <div class="page cc-cluster-page-shell">
      ${buildCreditCardClusterHeaderHtml()}
      <main class="layout-main cc-cluster-layout-main${layoutMainClassSuffix}">
        <section class="center-column cc-cluster-center-column">
          ${calcContent}
        </section>
      </main>
      ${buildCreditCardClusterFooterHtml()}
    </div>`
    : isMigratedPercentageClusterRoute
    ? `    <div class="page pct-cluster-page-shell">
      ${buildPercentageClusterHeaderHtml()}
      <main class="pct-cluster-layout-main${layoutMainClassSuffix}">
        <section class="pct-cluster-center-column">
          ${calcContent}
        </section>
      </main>
      ${buildPercentageClusterFooterHtml()}
    </div>`
    : isMigratedSalaryClusterRoute
    ? `    <div class="page sal-cluster-page-shell">
      ${buildSalaryClusterHeaderHtml()}
      <main class="sal-cluster-layout-main${layoutMainClassSuffix}">
        <section class="sal-cluster-center-column">
          ${calcContent}
        </section>
      </main>
      ${buildSalaryClusterFooterHtml()}
    </div>`
    : isMigratedMathClusterRoute
    ? `    <div class="page math-cluster-page-shell">
      ${buildMathClusterHeaderHtml()}
      <main class="math-cluster-layout-main${layoutMainClassSuffix}">
        <section class="math-cluster-center-column">
          ${calcContent}
        </section>
      </main>
      ${buildMathClusterFooterHtml()}
    </div>`
    : isMigratedPricingClusterRoute
    ? `    <div class="page pct-cluster-page-shell">
      ${buildPricingClusterHeaderHtml()}
      <main class="pct-cluster-layout-main${layoutMainClassSuffix}">
        <section class="pct-cluster-center-column">
          ${calcContent}
        </section>
      </main>
      ${buildPricingClusterFooterHtml()}
    </div>`
    : isMigratedFinanceClusterRoute
    ? `    <div class="page fi-cluster-page-shell">
      ${buildFinanceClusterHeaderHtml()}
      <main class="fi-cluster-layout-main${layoutMainClassSuffix}">
        <section class="fi-cluster-center-column">
          ${calcContent}
        </section>
      </main>
      ${buildFinanceClusterFooterHtml()}
    </div>`
    : isMigratedTimeAndDateClusterRoute
    ? `    <div class="page td-cluster-page-shell">
      ${buildTimeAndDateClusterHeaderHtml()}
      <main class="td-cluster-layout-main${layoutMainClassSuffix}">
        <section class="td-cluster-center-column">
          ${calcContent}
        </section>
      </main>
      ${buildTimeAndDateClusterFooterHtml()}
    </div>`
    : isMigratedAutoLoanClusterRoute
    ? `    <div class="page al-cluster-page-shell">
      ${buildAutoLoanClusterHeaderHtml()}
      <main class="al-cluster-layout-main${layoutMainClassSuffix}">
        <section class="al-cluster-center-column">
          ${calcContent}
        </section>
      </main>
      ${buildAutoLoanClusterFooterHtml()}
    </div>`
    : isMigratedHomeLoanClusterRoute
    ? `    <div class="page hl-cluster-page-shell">
      ${buildHomeLoanClusterHeaderHtml()}
      <main class="hl-cluster-layout-main${layoutMainClassSuffix}">
        <section class="hl-cluster-center-column">
          ${calcContent}
        </section>
      </main>
      ${buildHomeLoanClusterFooterHtml()}
    </div>`
    : `    <div class="page">
      ${headerHtml}
      <nav class="top-nav" aria-label="Category navigation">${topNavHtml}</nav>
      <main class="layout-main${layoutMainClassSuffix}">
        <aside class="left-nav" aria-label="Left navigation">
          <div id="left-nav-content">${leftNavHtml}</div>
        </aside>
        <section class="center-column">
          ${calcContent}
        </section>
${adsColumnHtml}      </main>
      ${footerHtml}
    </div>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${headMetaHtml}
${cssLinksHtml} 
${structuredDataScript}${adsenseHeadScript}    <!-- Cloudflare Web Analytics (manual beacon commented out for duplicate-beacon validation): <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script> -->
  </head>
  <body${bodyAttribute}${routeArchetypeAttribute}${designFamilyAttribute}${topNavStaticAttribute}>
${pageShellHtml}
${scriptTagsHtml}
  </body>
</html>
`;
}

function buildCalculatorIndex(categories) {
  const sections = categories
    .map((category) => {
      const subSections = category.subcategories
        .map((subcategory) => {
          const items = subcategory.calculators
            .map((calculator) => `<li><a href="${calculator.url}">${calculator.name}</a></li>`)
            .join('');
          return `
              <h3>${subcategory.name}</h3>
              <ul>
                ${items}
              </ul>`;
        })
        .join('');
      return `
            <section>
              <h2>${category.name}</h2>
              ${subSections}
            </section>`;
    })
    .join('');

  const title = 'All Online Calculators by Category | Finance, Salary, Pricing & Math';
  const description =
    'Browse every CalcHowMuch calculator by category, including finance, loans, credit cards, pricing, salary, time, percentage, and math tools.';
  const canonical = buildCanonical('/calculators/');
  const adsenseHeadScript = renderManagedHeadAdsenseBlock();
  const staticStructuredData = buildCollectionPageStructuredData({
    canonical,
    title,
    description,
    collectionName: 'All Calculators',
    breadcrumbName: 'All Calculators',
  });
  const headMetaHtml = generateHeadMeta({
    canonicalUrl: canonical,
    seoTitle: title,
    seoDescription: description,
    ogImageUrl: OG_IMAGE,
    h1: 'All Calculators',
    isCalculatorPage: isCalculatorPathFromCanonical(canonical),
  });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${headMetaHtml}
    <link rel="stylesheet" href="/assets/css/theme-premium-dark.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/layout.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/calculator.css?v=${CSS_VERSION}" />
    <script type="application/ld+json" data-static-ld="true" data-calculator-ld="true">${stringifyStructuredData(
      staticStructuredData
    )}</script>
${adsenseHeadScript}    <!-- Cloudflare Web Analytics (manual beacon commented out for duplicate-beacon validation): <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script> -->
  </head>
  <body>
    <div class="page">
      ${readFile(HEADER_PATH)}
      <main class="layout-main">
        <section class="center-column">
          <div class="panel panel-scroll">
            <h1>All Calculators</h1>
            <p class="helper">
              Browse every public calculator by category so you can jump straight into the right
              tool for finance, pricing, salary, time, percentage, or math questions.
            </p>
            <p class="helper">
              This master hub is designed for discovery as well as navigation. Use it when you know
              the problem you want to solve, when you want to compare adjacent calculators before
              choosing one, or when you need to find a more specific route than a general-purpose
              percentage or finance tool.
            </p>
            <p class="helper">
              Each route is built to answer one calculation clearly, then support that answer with
              formulas, worked examples, and related calculators. Start with the category that best
              matches your intent, then move deeper into the cluster when you need a more precise
              scenario.
            </p>
            <p id="all-calculators-no-results" class="helper" hidden>
              No calculator matches your search.
            </p>
            ${sections}
          </div>
        </section>
      </main>
    </div>
    <script>
      (() => {
        const searchInput = document.getElementById('global-calculator-search');
        const panel = document.querySelector('.panel.panel-scroll');
        const noResultsNode = document.getElementById('all-calculators-no-results');
        if (!searchInput || !panel) {
          return;
        }

        const normalize = (value) =>
          String(value || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim()
            .replace(/\s+/g, ' ');
        const getTokens = (value) => normalize(value).split(' ').filter(Boolean);
        const matchesQuery = (searchable, rawQuery) => {
          const query = normalize(rawQuery);
          if (!query) {
            return true;
          }

          const normalizedSearchable = normalize(searchable);
          if (normalizedSearchable.includes(query)) {
            return true;
          }

          const queryTokens = getTokens(query);
          return queryTokens.length > 1 && queryTokens.every((token) => normalizedSearchable.includes(token));
        };
        const sections = Array.from(panel.querySelectorAll('section')).map((section) => {
          const groups = Array.from(section.querySelectorAll('h3'))
            .map((heading) => {
              const list = heading.nextElementSibling;
              if (!list || list.tagName !== 'UL') {
                return null;
              }
              return {
                heading,
                list,
                items: Array.from(list.querySelectorAll('li')),
              };
            })
            .filter(Boolean);

          return { section, groups };
        });

        const queryFromUrl = new URLSearchParams(window.location.search).get('q') || '';
        searchInput.value = queryFromUrl;

        function applyFilter(rawQuery) {
          const query = normalize(rawQuery);
          let visibleItemCount = 0;

          sections.forEach(({ section, groups }) => {
            let sectionHasVisibleItems = false;

            groups.forEach(({ heading, list, items }) => {
              let groupVisibleCount = 0;

              items.forEach((item) => {
                const link = item.querySelector('a');
                const searchable =
                  (item.textContent || '') + ' ' + (link ? link.getAttribute('href') || '' : '');
                const isMatch = matchesQuery(searchable, query);
                item.hidden = !isMatch;
                if (isMatch) {
                  groupVisibleCount += 1;
                  visibleItemCount += 1;
                }
              });

              const groupVisible = groupVisibleCount > 0;
              heading.hidden = !groupVisible;
              list.hidden = !groupVisible;
              if (groupVisible) {
                sectionHasVisibleItems = true;
              }
            });

            section.hidden = !sectionHasVisibleItems;
          });

          if (noResultsNode) {
            noResultsNode.hidden = !query || visibleItemCount > 0;
          }
        }

        searchInput.addEventListener('input', () => {
          applyFilter(searchInput.value);
        });

        applyFilter(queryFromUrl);
      })();
    </script>
  </body>
</html>`;
}

function buildStandaloneHomepage({ title, description, canonical, robots }) {
  const adsenseHeadScript = renderManagedHeadAdsenseBlock();
  const homepageStructuredData = buildHomepageStructuredData({ title, description, canonical });
  const headMetaHtml = generateHeadMeta({
    canonicalUrl: canonical,
    seoTitle: title,
    seoDescription: description,
    ogImageUrl: OG_IMAGE,
    h1: 'All Calculators — Finance, Loan, Mortgage & Math Tools',
    isCalculatorPage: isCalculatorPathFromCanonical(canonical),
  });
  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${headMetaHtml}
    <link rel="stylesheet" href="/assets/css/homepage-preview.css" />
    <script type="application/ld+json" data-homepage-ld="true" data-calculator-ld="true">${stringifyStructuredData(
      homepageStructuredData
    )}</script>
${adsenseHeadScript}    <!-- Cloudflare Web Analytics (manual beacon commented out for duplicate-beacon validation): <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script> -->
  </head>
  <body data-page="home" data-route-archetype="content_shell" data-design-family="neutral">
    <header class="header preview-header">
      <div class="wrap header-inner preview-header-inner">
        <a class="brand" href="/" aria-label="CalcHowMuch home">
          <span class="brand-mark" aria-hidden="true">#</span>
          <span>CalcHowMuch</span>
        </a>
        <nav class="header-nav preview-nav" aria-label="Homepage sections">
          <a href="#homepage-popular">Popular</a>
          <a href="#homepage-categories">Clusters</a>
          <a href="#homepage-guides">Categories</a>
          <a href="#homepage-faq">FAQ</a>
        </nav>
      </div>
    </header>

    <main class="wrap preview-main">
      <section class="hero" aria-labelledby="homepage-hero-title">
        <div class="hero-inner">
          <h1 id="homepage-hero-title">All Calculators — Finance, Loan, Mortgage &amp; Math Tools</h1>
          <p>
            Browse calculators for mortgages, loans, credit cards, pricing, salary, percentages,
            time, and math. Use the homepage as a search-first hub to compare routes, jump into a
            specific workflow, and get answer-first tools with supporting explanations.
          </p>
          <div class="search" role="search">
            <div class="search-bar">
              <label class="sr-only" for="homepage-search">Search calculators</label>
              <input
                id="homepage-search"
                type="search"
                value=""
                placeholder="Search calculators…"
                autocomplete="off"
                spellcheck="false"
                aria-autocomplete="list"
                aria-controls="homepage-search-suggestions"
                aria-expanded="false"
              />
              <button type="button">Search</button>
            </div>
            <div
              id="homepage-search-suggestions"
              class="search-suggestions"
              role="listbox"
              hidden
            ></div>
          </div>
        </div>
      </section>

      <section id="homepage-popular" class="section" aria-labelledby="homepage-popular-title">
        <div class="section-head">
          <div>
            <h2 id="homepage-popular-title">Popular Calculators</h2>
          </div>
        </div>
        <div class="chip-row" aria-label="Popular calculators">
          <a class="chip" href="/loan-calculators/mortgage-calculator/">Mortgage Calculator</a>
          <a class="chip" href="/loan-calculators/personal-loan-calculator/">Loan Calculator</a>
          <a class="chip" href="/credit-card-calculators/credit-card-payment-calculator/">Credit Card Calculator</a>
          <a class="chip" href="/finance-calculators/compound-interest-calculator/">Compound Interest Calculator</a>
          <a class="chip" href="/finance-calculators/inflation-calculator/">Inflation Calculator</a>
          <a class="chip" href="/percentage-calculators/percentage-increase-calculator/">Percentage Calculator</a>
          <a class="chip" href="/time-and-date/age-calculator/">Age Calculator</a>
        </div>
      </section>

      <section
        id="homepage-categories"
        class="section categories"
        aria-labelledby="homepage-clusters-title"
        data-loading="true"
        style="--loading-card-count: 7"
      >
        <div class="section-head">
          <div>
            <h2 id="homepage-clusters-title">Browse Calculator Clusters</h2>
            <p>
              Start with the cluster that matches your problem, then narrow into the exact
              calculator you need for budgeting, borrowing, pricing, pay planning, date math, or
              classroom-style calculations.
            </p>
          </div>
        </div>
        <div id="homepage-empty" class="empty-state" hidden>No calculator matches your search.</div>
        <div id="homepage-grid" class="card-grid category-grid" aria-live="polite"></div>
      </section>

      <section id="homepage-guides" class="section" aria-label="Category guides">
        <div class="section-head">
          <div>
            <h2>Category Guides</h2>
          </div>
        </div>
        <div class="seo-grid">
          <section class="seo-block">
            <h3>Borrowing &amp; Mortgage Planning</h3>
            <p>
              Estimate monthly payments, compare borrowing costs, and model affordability with the
              <a href="/loan-calculators/mortgage-calculator/">mortgage calculator</a>,
              <a href="/loan-calculators/personal-loan-calculator/">loan calculator</a>, and
              <a href="/loan-calculators/interest-rate-change-calculator/">interest rate change calculator</a>.
            </p>
          </section>

          <section class="seo-block">
            <h3>Pricing &amp; Profitability</h3>
            <p>
              Compare
              <a href="/pricing-calculators/margin-calculator/">margin</a>,
              <a href="/pricing-calculators/markup-calculator/">markup</a>,
              <a href="/pricing-calculators/discount-calculator/">discount</a>, and
              <a href="/pricing-calculators/commission-calculator/">sales commission</a>
              calculators when you need to protect profit while still pricing competitively.
            </p>
          </section>

          <section class="seo-block">
            <h3>Salary, Earnings &amp; Pay Conversion</h3>
            <p>
              Convert hourly and annual pay, compare overtime, and estimate commission-driven
              earnings with the
              <a href="/salary-calculators/salary-calculator/">salary calculator</a>,
              <a href="/salary-calculators/hourly-to-salary-calculator/">hourly to salary calculator</a>,
              and <a href="/salary-calculators/commission-calculator/">commission earnings calculator</a>.
            </p>
          </section>

          <section class="seo-block">
            <h3>Time, Percentage &amp; Everyday Math</h3>
            <p>
              Solve everyday planning questions with the
              <a href="/time-and-date/age-calculator/">age calculator</a>,
              <a href="/time-and-date/time-between-two-dates-calculator/">time between dates calculator</a>,
              <a href="/percentage-calculators/percent-change-calculator/">percent change calculator</a>,
              and classroom-friendly math routes.
            </p>
          </section>
        </div>
      </section>

      <section class="section">
        <div class="trust" aria-labelledby="homepage-why-title">
          <h2 id="homepage-why-title">Why Use CalcHowMuch</h2>
          <p>
            CalcHowMuch is built as a practical calculator library rather than a thin list of
            widgets. The goal is to give you a direct answer fast, then support that answer with
            formulas, examples, and related tools so you can compare scenarios without restarting
            your search from scratch.
          </p>
        </div>
      </section>

      <section id="homepage-faq" class="section" aria-labelledby="homepage-faq-title">
        <div class="faq">
          <div class="section-head">
            <div>
              <h2 id="homepage-faq-title">Frequently Asked Questions</h2>
            </div>
          </div>
          <div class="faq-list">
            <div class="faq-item">
              <h3>What calculators are available?</h3>
              <p>We cover mortgage, loan, credit card, finance, pricing, salary, time, percentage, and math calculators.</p>
            </div>
            <div class="faq-item">
              <h3>How should I choose the right calculator?</h3>
              <p>Start with the closest cluster, then use the route that matches your exact question such as margin, markup, overtime, age, or mortgage payment.</p>
            </div>
            <div class="faq-item">
              <h3>Are the results accurate?</h3>
              <p>Calculations use standard formulas and are designed for planning, comparison, and educational use.</p>
            </div>
            <div class="faq-item">
              <h3>Are the calculators free to use?</h3>
              <p>Yes. All calculators on CalcHowMuch are free to use.</p>
            </div>
            <div class="faq-item">
              <h3>Do I need to sign up to use the calculators?</h3>
              <p>No. The calculators are available instantly in your browser without registration.</p>
            </div>
            <div class="faq-item">
              <h3>Do you store my inputs or calculation results?</h3>
              <p>No. Calculator inputs and results stay in your browser and are not stored as personal calculation records.</p>
            </div>
            <div class="faq-item">
              <h3>Can I use these calculator results for financial, legal, or tax decisions?</h3>
              <p>No. Calculator results are for informational and planning purposes only and should not replace professional advice.</p>
            </div>
            <div class="faq-item">
              <h3>Why do results sometimes differ from banks, lenders, or other websites?</h3>
              <p>Different tools can use different assumptions, rounding methods, timing rules, fees, or tax treatments.</p>
            </div>
            <div class="faq-item">
              <h3>Do the calculators work on mobile devices?</h3>
              <p>Yes. CalcHowMuch calculators are designed to work on mobile, tablet, and desktop devices.</p>
            </div>
            <div class="faq-item">
              <h3>Do your calculators include fees, taxes, or penalties?</h3>
              <p>It depends on the route. Some calculators include optional fee or tax inputs, while others focus on the core formula only.</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer site-footer wrap">
      <nav class="footer-nav" aria-label="Footer links">
        <a href="/privacy/">Privacy</a>
        <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
        <a href="/contact-us/">Contact</a>
        <a href="/about-us/">About Us</a>
        <a href="/faq/">FAQs</a>
        <a href="/sitemap.xml">Sitemap</a>
      </nav>
      <span class="muted">&copy; 2026 @CalcHowMuch</span>
    </footer>
    <script type="module" src="/assets/js/homepage-preview.js"></script>
  </body>
</html>`;
}

function buildGtepFooter() {
  return `<footer class="gtep-footer">\n  <a href="/privacy/">Privacy</a>\n  <span class="footer-divider">|</span>\n  <a href="/terms-and-conditions/">Terms &amp; Conditions</a>\n  <span class="footer-divider">|</span>\n  <a href="/contact-us/">Contact</a>\n  <span class="footer-divider">|</span>\n  <a href="/about-us/">About Us</a>\n  <span class="footer-divider">|</span>\n  <a href="/faq/">FAQs</a>\n  <span class="footer-divider">|</span>\n  <a href="/sitemap.xml">Sitemap</a>\n  <span class="footer-divider">|</span>\n  <span class="footer-branding">&copy; 2026 @CalcHowMuch</span>\n</footer>`;
}

function buildGtepPage({ title, description, canonical, bodyHtml, structuredData = null, showHomeLink = false }) {
  const adsenseHeadScript = renderManagedHeadAdsenseBlock();
  const headMetaHtml = generateHeadMeta({
    canonicalUrl: canonical,
    seoTitle: title,
    seoDescription: description,
    ogImageUrl: OG_IMAGE,
    h1: title,
    isCalculatorPage: isCalculatorPathFromCanonical(canonical),
  });
  const structuredDataHtml = structuredData
    ? `\n    <script type="application/ld+json">${stringifyStructuredData(structuredData)}</script>`
    : '';
  const homeLinkHtml = showHomeLink
    ? '\n        <a href="/" class="gtep-home-link" aria-label="Go to Home Page">← Home</a>'
    : '';
  return `<!doctype html>\n<html lang="en">\n  <head>\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n${headMetaHtml}${structuredDataHtml}\n    <link rel="stylesheet" href="/assets/css/theme-premium-dark.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/gtep.css?v=${GTEP_CSS_VERSION}" />\n${adsenseHeadScript}    <!-- Cloudflare Web Analytics (manual beacon commented out for duplicate-beacon validation): <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script> -->\n  </head>\n  <body class="gtep-body">\n    <div class="gtep-page">\n      <header class="gtep-header">${homeLinkHtml}\n        <span class="gtep-header-title">Calculate How Much</span>\n      </header>\n      <main class="gtep-main">\n        <div class="gtep-content">\n          ${bodyHtml}\n        </div>\n      </main>\n      ${buildGtepFooter()}\n    </div>\n  </body>\n</html>`;
}

function buildGtepSitemap(categories) {
  const sitePages = `
          <section>
            <h2>Site Pages</h2>
            <ul>
              <li><a href="/about-us/">About Us</a></li>
              <li><a href="/privacy/">Privacy</a></li>
              <li><a href="/terms-and-conditions/">Terms &amp; Conditions</a></li>
              <li><a href="/contact-us/">Contact</a></li>
              <li><a href="/faq/">FAQs</a></li>
            </ul>
          </section>`;
  const sections = categories
    .map((category) => {
      const subSections = category.subcategories
        .map((subcategory) => {
          const items = subcategory.calculators
            .map((calculator) => `<li><a href="${calculator.url}">${calculator.name}</a></li>`)
            .join('');
          return `
            <div>
              <h3>${subcategory.name}</h3>
              <ul>
                ${items}
              </ul>
            </div>`;
        })
        .join('');
      return `
          <section>
            <h2>${category.name}</h2>
            ${subSections}
          </section>`;
    })
    .join('');

  const bodyHtml = `
          <h1>Sitemap</h1>
          <p>
            Browse every calculator available on Calculate How Much. All entries are grouped by
            category and stay in sync with navigation.
          </p>
          <div id="sitemap-content" class="gtep-sitemap-links">
            ${sitePages}
            ${sections}
          </div>`;

  return buildGtepPage({
    title: ensureLength('Sitemap | Calculate How Much', 50, 60),
    description: ensureLength(
      'Browse the full list of calculators on Calculate How Much, organized by category.',
      150,
      160
    ),
    canonical: buildCanonical('/sitemap.xml'),
    bodyHtml,
  });
}

function buildSitemapXml(categories) {
  const lastmod = '2026-03-27';
  const staticUrls = [
    { path: '/pricing-calculators/', changefreq: 'monthly', priority: '0.75', lastmod },
    { path: '/about-us/', changefreq: 'monthly', priority: '0.40', lastmod },
    { path: '/privacy/', changefreq: 'monthly', priority: '0.4', lastmod },
    {
      path: '/terms-and-conditions/',
      lastmod,
      changefreq: 'yearly',
      priority: '0.30',
    },
    {
      path: '/contact-us/',
      lastmod,
      changefreq: 'yearly',
      priority: '0.30',
    },
    { path: '/faq/', lastmod, changefreq: 'monthly', priority: '0.40' },
  ];
  const urls = [];
  const seen = new Set();
  categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.calculators.forEach((calculator) => {
        const normalized = calculator.url.endsWith('/') ? calculator.url : `${calculator.url}/`;
        if (!seen.has(normalized)) {
          seen.add(normalized);
          urls.push(normalized);
        }
      });
    });
  });

  const staticUrlItems = staticUrls
    .map(
      (entry) => `
  <url>
    <loc>https://calchowmuch.com${entry.path}</loc>
${entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>\n` : ''}    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('');

  const urlItems = urls
    .map(
      (url) => `
  <url>
    <loc>https://calchowmuch.com${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://calchowmuch.com/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://calchowmuch.com/calculators/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
${staticUrlItems}
${urlItems}
</urlset>`;
}

function main() {
  const scope = parseGenerationScope();
  const shouldWriteRootHomepage = scope.fullSite || scope.targetRoute === '/';
  const shouldWriteCalculatorIndex = scope.fullSite || scope.targetRoute === '/calculators/';
  const shouldWritePricingClusterLanding =
    scope.fullSite || scope.targetRoute === '/pricing-calculators/';

  if (scope.fullSite || shouldWriteRootHomepage) {
    syncClusterRegistryToPublic();
  }

  const navigation = JSON.parse(readFile(NAV_PATH));
  const calculatorDirs = findCalculatorDirs(CALC_DIR);
  const routeBundleManifest = readRouteBundleManifest();
  const assetManifest = readAssetManifest();

  const calcLookup = new Map();
  const allCalculatorEntries = [];
  navigation.categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.calculators.forEach((calculator) => {
        let relPath = null;
        const declaredUrl =
          typeof calculator.url === 'string' && calculator.url.trim()
            ? normalizeRoutePath(calculator.url)
            : null;
        if (typeof calculator.url === 'string' && calculator.url.trim()) {
          const routeDerived = calculator.url.replace(/^\/+|\/+$/g, '');
          const candidateDir = path.join(CALC_DIR, routeDerived);
          const contentCandidateDir = path.join(CONTENT_CALC_DIR, routeDerived);
          if (routeDerived) {
            if (FINANCE_CALCULATOR_IDS.has(calculator.id)) {
              if (
                pathExistsAsDirectory(candidateDir) ||
                pathExistsAsDirectory(contentCandidateDir)
              ) {
                relPath = routeDerived;
              }
            } else if (pathExistsAsDirectory(candidateDir)) {
              relPath = routeDerived;
            }
          }
        }
        if (!relPath) {
          relPath = calculatorDirs.get(calculator.id) ?? null;
        }
        if (!relPath) {
          throw new Error(`Unable to locate calculator folder for ${calculator.id}`);
        }
        const override = resolveCalculatorOverride(calculator);
        const governance = resolveCalculatorGovernance({
          category,
          subcategory,
          calculator,
          override,
        });
        const outputRelPath = (declaredUrl || normalizeRoutePath(`/${relPath}`)).replace(
          /^\/+|\/+$/g,
          ''
        );
        calculator.url = declaredUrl || normalizeRoutePath(`/${relPath}`);
        const entry = { category, subcategory, calculator, governance, relPath, outputRelPath };
        calcLookup.set(calculator.id, entry);
        allCalculatorEntries.push(entry);
      });
    });
  });

  if (scope.fullSite) {
    writeFile(NAV_PATH, JSON.stringify(navigation, null, 2) + '\n');
  }

  const selectedEntries = scope.fullSite
    ? allCalculatorEntries
    : allCalculatorEntries.filter((entry) => {
        const routeMatch = scope.targetRoute
          ? normalizeRoute(entry.calculator.url) === scope.targetRoute
          : true;
        const calcMatch = scope.targetCalcId ? entry.calculator.id === scope.targetCalcId : true;
        return routeMatch && calcMatch;
      });

  if (
    !selectedEntries.length &&
    !shouldWriteRootHomepage &&
    !shouldWriteCalculatorIndex &&
    !shouldWritePricingClusterLanding
  ) {
    throw new Error(
      `No calculators matched the requested scope (route=${scope.targetRoute ?? 'n/a'}, calcId=${scope.targetCalcId ?? 'n/a'}).`
    );
  }

  const headerHtml = readFile(HEADER_PATH);
  const footerHtml = readFile(FOOTER_PATH);

  selectedEntries.forEach((entry) => {
    const { category, subcategory, calculator, governance, relPath, outputRelPath } = entry;
    const isCreditCardClusterRoute =
      subcategory.id === 'credit-cards' && calculator.url.startsWith('/credit-card-calculators/');
    const isMigratedPercentageClusterRoute =
      calculator.url.startsWith('/percentage-calculators/') &&
      PERCENTAGE_CLUSTER_REDESIGN_IDS.has(calculator.id);
    const isMigratedPricingClusterRoute =
      calculator.url.startsWith('/pricing-calculators/') &&
      PRICING_CLUSTER_REDESIGN_IDS.has(calculator.id);
    const isMigratedMathClusterRoute =
      calculator.url.startsWith('/math/') && MATH_CLUSTER_REDESIGN_IDS.has(calculator.id);
    const isMigratedSalaryClusterRoute =
      calculator.url.startsWith('/salary-calculators/') &&
      SALARY_CLUSTER_REDESIGN_IDS.has(calculator.id);
    const isMigratedFinanceClusterRoute =
      calculator.url.startsWith('/finance-calculators/') &&
      FINANCE_CLUSTER_REDESIGN_IDS.has(calculator.id);
    const isMigratedTimeAndDateClusterRoute =
      calculator.url.startsWith('/time-and-date/') &&
      TIME_AND_DATE_CLUSTER_REDESIGN_IDS.has(calculator.id);
    const isMigratedAutoLoanClusterRoute =
      calculator.designFamily === 'auto-loans' &&
      calculator.url.startsWith('/car-loan-calculators/') &&
      AUTO_LOAN_CLUSTER_REDESIGN_IDS.has(calculator.id);
    const isMigratedHomeLoanClusterRoute =
      calculator.designFamily === 'home-loan' &&
      calculator.url.startsWith('/loan-calculators/') &&
      HOME_LOAN_CLUSTER_REDESIGN_IDS.has(calculator.id);
    const assetConfig = resolveAssetConfig(assetManifest, calculator.url);
    if (
      assetConfig?.options?.generationMode === 'manual' &&
      !isMigratedMathClusterRoute &&
      !isMigratedPercentageClusterRoute &&
      !isMigratedSalaryClusterRoute &&
      !isMigratedPricingClusterRoute &&
      !isMigratedTimeAndDateClusterRoute &&
      !isMigratedFinanceClusterRoute &&
      !isMigratedAutoLoanClusterRoute &&
      !isMigratedHomeLoanClusterRoute
    ) {
      console.log(`  SKIP (manual): ${relPath}`);
      return;
    }
    const fragmentDir = resolveCalculatorFragmentDir(relPath);
    const override = resolveCalculatorOverride(calculator);
    const fragments = loadRouteFragments(fragmentDir, calculator.id, governance.routeArchetype);
    const topNavHtml = buildTopNavHtml(
      navigation.categories,
      category.id,
      category.id === 'loans' ? subcategory.id : null
    );
    const leftNavHtml = buildLeftNavHtml(
      navigation.categories,
      category.id,
      category.id === 'loans' ? subcategory.id : null,
      calculator.id,
      calcLookup
    );
    if (category.id === 'percentage-calculators') {
      assertPercentageFinNavContract({
        leftNavHtml,
        calculatorId: calculator.id,
        routePath: calculator.url,
      });
    }
    const pageTitle = override?.title ?? buildTitle(calculator.name);
    const pageDescription = override?.description ?? buildDescription(calculator.name);
    const pageCanonical = buildCanonical(calculator.url);
    const routeBundleEntry =
      !assetConfig &&
      !isCreditCardClusterRoute &&
      !isMigratedMathClusterRoute &&
      !isMigratedPercentageClusterRoute &&
      !isMigratedSalaryClusterRoute &&
      !isMigratedPricingClusterRoute &&
      !isMigratedTimeAndDateClusterRoute &&
      !isMigratedFinanceClusterRoute &&
      !isMigratedAutoLoanClusterRoute &&
      ROUTE_BUNDLE_PILOT_IDS.has(calculator.id)
        ? resolveRouteBundleEntry(routeBundleManifest, calculator.url)
        : null;
    let cssBundleConfig = null;
    const topNavStatic =
      Boolean(assetConfig?.options?.topNavStatic) ||
      (ROUTE_BUNDLE_PILOT_IDS.has(calculator.id) &&
        !isMigratedMathClusterRoute &&
        !isMigratedPercentageClusterRoute &&
        !isMigratedSalaryClusterRoute &&
        !isMigratedPricingClusterRoute &&
        !isMigratedFinanceClusterRoute &&
        !isMigratedTimeAndDateClusterRoute);

    if (
      !assetConfig &&
      ROUTE_BUNDLE_PILOT_IDS.has(calculator.id) &&
      !isMigratedMathClusterRoute &&
      !isMigratedPercentageClusterRoute &&
      !isMigratedSalaryClusterRoute &&
      !isMigratedPricingClusterRoute &&
      !isMigratedTimeAndDateClusterRoute &&
      !isMigratedFinanceClusterRoute &&
      !routeBundleEntry
    ) {
      throw new Error(`Missing route CSS bundle entry for ${calculator.id} (${calculator.url})`);
    }

    if (routeBundleEntry) {
      const deferredHref = routeBundleEntry.deferredHref || routeBundleEntry.href;
      const criticalCssHref = routeBundleEntry.criticalCss;
      if (!deferredHref || typeof deferredHref !== 'string') {
        throw new Error(`Missing route bundle deferredHref for ${calculator.id} (${calculator.url})`);
      }
      if (!criticalCssHref || typeof criticalCssHref !== 'string') {
        throw new Error(`Missing route bundle criticalCss for ${calculator.id} (${calculator.url})`);
      }

      const criticalCssPath = path.join(PUBLIC_DIR, criticalCssHref.replace(/^\//, ''));
      if (!fs.existsSync(criticalCssPath)) {
        throw new Error(`Missing critical CSS artifact for ${calculator.id}: ${criticalCssPath}`);
      }
      const criticalCss = readFile(criticalCssPath)
        .trim()
        .replace(
          /\/calculators\/finance-calculators\//g,
          '/assets/css/calculators/finance-calculators/'
        );

      cssBundleConfig = {
        deferredHref,
        criticalCss,
      };
    }

    let staticStructuredData = null;
    let injectStaticStructuredData = false;
    if (isMigratedMathClusterRoute) {
      const faqEntries = extractCalculatorFaqEntries(fragments.explanationHtml, calculator.id);
      staticStructuredData = buildMathStructuredData({
        title: pageTitle,
        description: pageDescription,
        canonical: pageCanonical,
        faqEntries,
        breadcrumbLabel: override?.h1 ?? calculator.name,
        softwareName: override?.h1 ?? calculator.name,
        softwareDescription: pageDescription,
      });
      injectStaticStructuredData = true;
    }
    const homeLoanSchemaConfig = HOME_LOAN_SCHEMA_CONFIG[calculator.id];
    if (homeLoanSchemaConfig) {
      const faqEntries = extractCalculatorFaqEntries(fragments.explanationHtml, calculator.id);
      staticStructuredData = buildHomeLoanStructuredData({
        calculatorId: calculator.id,
        title: pageTitle,
        description: pageDescription,
        canonical: pageCanonical,
        faqEntries,
        ...homeLoanSchemaConfig,
      });
      injectStaticStructuredData = true;
    }
    const financeSchemaConfig = FINANCE_SCHEMA_CONFIG[calculator.id];
    if (financeSchemaConfig) {
      const faqEntries = extractCalculatorFaqEntries(fragments.explanationHtml, calculator.id);
      staticStructuredData = buildFinanceStructuredData({
        title: pageTitle,
        description: pageDescription,
        canonical: pageCanonical,
        faqEntries,
        ...financeSchemaConfig,
      });
      injectStaticStructuredData = true;
    }
    if (isMigratedSalaryClusterRoute && calculator.id !== 'salary-calculators-hub') {
      const faqEntries = extractCalculatorFaqEntries(fragments.explanationHtml, calculator.id);
      staticStructuredData = buildSalaryStructuredData({
        title: pageTitle,
        description: pageDescription,
        canonical: pageCanonical,
        faqEntries,
        softwareName: override?.h1 ?? calculator.name,
        softwareDescription: pageDescription,
      });
      injectStaticStructuredData = true;
    }
    if (calculator.id === 'salary-calculators-hub') {
      staticStructuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: 'CalcHowMuch',
            inLanguage: 'en',
          },
          {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'CalcHowMuch',
            url: `${SITE_URL}/`,
            logo: {
              '@type': 'ImageObject',
              url: OG_IMAGE,
            },
          },
          {
            '@type': 'CollectionPage',
            '@id': `${pageCanonical}#webpage`,
            name: pageTitle,
            url: pageCanonical,
            description: pageDescription,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            publisher: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'en',
          },
          {
            '@type': 'SoftwareApplication',
            '@id': `${pageCanonical}#softwareapplication`,
            name: 'Salary Calculators',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            url: pageCanonical,
            description: pageDescription,
            inLanguage: 'en',
            provider: { '@id': `${SITE_URL}/#organization` },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${pageCanonical}#breadcrumbs`,
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${SITE_URL}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Salary Calculators',
                item: pageCanonical,
              },
            ],
          },
        ],
      };
      injectStaticStructuredData = true;
    }

    const timeAndDateRelatedSections = isMigratedTimeAndDateClusterRoute
      ? buildTimeAndDateRelatedCalculatorsHtml(category, subcategory, calculator.id)
      : null;
    const percentageRelatedSections = isMigratedPercentageClusterRoute
      ? buildPercentageRelatedCalculatorsHtml(subcategory, calculator.id)
      : null;
    const pricingRelatedSections = isMigratedPricingClusterRoute
      ? buildPricingRelatedCalculatorsHtml(subcategory, calculator.id)
      : null;

    const pageHtml = buildPageHtml({
      title: pageTitle,
      description: pageDescription,
      canonical: pageCanonical,
      headerHtml,
      footerHtml,
      topNavHtml,
      leftNavHtml,
      calculatorTitle: override?.h1 ?? calculator.name,
      calculatorHtml: fragments.calculatorHtml,
      explanationHtml: fragments.explanationHtml,
      contentHtml: fragments.contentHtml,
      explanationHeading: Object.prototype.hasOwnProperty.call(override ?? {}, 'explanationHeading')
        ? override.explanationHeading
        : 'Explanation',
      paneLayout: governance.paneLayout,
      routeArchetype: governance.routeArchetype,
      designFamily: governance.designFamily,
      includeHomeContent: false,
      pageType: 'calculator',
      calculatorId: calculator.id,
      calculatorRelPath: governance.routeArchetype === 'content_shell' ? null : relPath,
      assetConfig,
      cssBundleConfig,
      topNavStatic,
      staticStructuredData,
      injectStaticStructuredData,
      suppressAdsColumn: Boolean(override?.suppressAdsColumn),
      calculatorPanelClass:
        typeof override?.calculatorPanelClass === 'string' ? override.calculatorPanelClass : '',
      layoutMainClass: typeof override?.layoutMainClass === 'string' ? override.layoutMainClass : '',
      relatedCalculatorsHtml: isCreditCardClusterRoute
        ? buildCreditCardRelatedCalculatorsHtml(subcategory, calculator.id)
        : isMigratedPercentageClusterRoute
        ? percentageRelatedSections.relatedHtml
        : isMigratedPricingClusterRoute
        ? pricingRelatedSections.relatedHtml
        : isMigratedTimeAndDateClusterRoute
        ? timeAndDateRelatedSections.relatedHtml
        : isMigratedFinanceClusterRoute
        ? buildFinanceRelatedCalculatorsHtml(category, calculator.id)
        : isMigratedAutoLoanClusterRoute
        ? buildAutoLoanRelatedCalculatorsHtml(subcategory, calculator.id)
        : '',
      routeSwitchHtml: isMigratedPercentageClusterRoute
        ? percentageRelatedSections.switcherHtml
        : isMigratedPricingClusterRoute
        ? pricingRelatedSections.switcherHtml
        : isMigratedTimeAndDateClusterRoute
        ? timeAndDateRelatedSections.switcherHtml
        : '',
    });

    const outputDir = path.join(PUBLIC_DIR, outputRelPath);
    writeFile(path.join(outputDir, 'index.html'), pageHtml);
  });

  const homeTitle = 'Online Calculators for Finance, Salary, Pricing, Time & Math | CalcHowMuch';
  const homeDescription =
    'Browse online calculators for mortgages, loans, credit cards, pricing, salary, time, percentage, and math. Compare scenarios and launch focused tools from one calculator hub.';

  if (shouldWriteRootHomepage) {
    writeFile(
      path.join(PUBLIC_DIR, 'index.html'),
      buildStandaloneHomepage({
        title: homeTitle,
        description: homeDescription,
        canonical: buildCanonical('/'),
        robots: 'index,follow',
      })
    );
  }

  if (shouldWriteCalculatorIndex) {
    writeFile(
      path.join(PUBLIC_DIR, 'calculators', 'index.html'),
      buildCalculatorIndex(navigation.categories)
    );
  }

  if (shouldWritePricingClusterLanding) {
    const pricingCategory = navigation.categories.find((category) => category.id === 'pricing');
    if (!pricingCategory) {
      throw new Error('Missing pricing category in public/config/navigation.json');
    }

    writeFile(
      path.join(PUBLIC_DIR, 'pricing-calculators', 'index.html'),
      buildPricingClusterLandingPage(pricingCategory)
    );
  }

  if (!scope.fullSite) {
    console.log(
      `Scoped generation complete for ${selectedEntries.length} route(s) (route=${scope.targetRoute ?? 'n/a'}, calcId=${scope.targetCalcId ?? 'n/a'}).`
    );
    return;
  }
  writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemapXml(navigation.categories));
}

main();
