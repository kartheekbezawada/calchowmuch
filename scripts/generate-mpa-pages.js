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
const ADSENSE_SNIPPET_PATH = path.join(
  ROOT,
  'requirements',
  'universal-rules',
  'AdSense code snippet.md'
);
const AD_UNIT_SNIPPET_PATH = path.join(ROOT, 'requirements', 'universal-rules', 'Ad Unit Code.md');
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
const ADSENSE_HEAD_MARKER_START = '<!-- CHM_ADSENSE_HEAD_START -->';
const ADSENSE_HEAD_MARKER_END = '<!-- CHM_ADSENSE_HEAD_END -->';
const ADSENSE_SLOT_MARKER_START = '<!-- CHM_AD_SLOT_START -->';
const ADSENSE_SLOT_MARKER_END = '<!-- CHM_AD_SLOT_END -->';
const ADSENSE_LOADER_SRC_RE =
  /https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i;
const ADSENSE_LOADER_SCRIPT_RE =
  /^[ \t]*<script\b[^>]*src=["']https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=[^"']+["'][^>]*>\s*<\/script>\s*\n?/gim;
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
  'compound-interest',
  'simple-interest',
  'present-value',
  'future-value',
  'future-value-of-annuity',
  'present-value-of-annuity',
]);
const FINANCE_CALCULATOR_IDS = new Set([
  'present-value',
  'future-value',
  'present-value-of-annuity',
  'future-value-of-annuity',
  'simple-interest',
  'compound-interest',
  'effective-annual-rate',
  'investment-growth',
  'investment-return',
  'time-to-savings-goal',
  'monthly-savings-needed',
]);
const CALCULATOR_OVERRIDES = {
  'home-loan': {
    title: 'Home Loan Calculator | Mortgage Payment Planner | CalcHowMuch',
    description:
      'Estimate monthly mortgage payments, amortization, payoff timeline, and interest savings from extra payments with our free Home Loan Calculator.',
    h1: 'Home Loan Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'how-much-can-i-borrow': {
    title: 'How Much Can I Borrow | Mortgage Affordability | CalcHowMuch',
    description:
      'Estimate your maximum mortgage borrowing using income multiples or payment-to-income checks, then compare monthly payments and total property budget.',
    h1: 'How Much Can I Borrow Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'remortgage-switching': {
    title: 'Remortgage Calculator (Switching) | Break-even | CalcHowMuch',
    description:
      'Compare your current mortgage with a new rate and term to see monthly savings, break-even month, and total savings over a 2 to 10 year horizon.',
    h1: 'Remortgage Calculator (Switching)',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'buy-to-let': {
    title: 'Buy-to-Let (Yield, Cashflow & Coverage) | CalcHowMuch',
    description:
      'Estimate buy-to-let yield, cashflow, and stress coverage using rent, property price, deposit, rate, and mortgage type inputs.',
    h1: 'Buy-to-Let Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'car-loan': {
    title: 'Car Loan Calculator | Monthly Payment & Cost',
    description:
      'Estimate car loan payments, total interest, and total cost using vehicle price, deposit, trade-in, fees, tax, APR, and term.',
    h1: 'Car Loan Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'hire-purchase': {
    title: 'Hire Purchase Calculator | Monthly Payment & Cost',
    description:
      'Estimate hire purchase payments, balloon amount, total interest, and total payable using vehicle price, deposit, APR, and term.',
    h1: 'Hire Purchase Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'pcp-calculator': {
    title: 'PCP Calculator | Monthly Payment, GFV & Cost',
    description:
      'Estimate PCP payments, GFV, option fee, total interest, and total payable using price, deposit, APR, and term.',
    h1: 'PCP Car Finance Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'leasing-calculator': {
    title: 'Car Lease Calculator | Payment, Residual & Cost',
    description:
      'Estimate car lease payments, residual value, finance charge, and total lease cost using price, money factor, upfront payment, and term.',
    h1: 'Car Lease Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'multiple-car-loan': {
    title: 'Auto Loan Comparison Calculator | Compare 2 Loans',
    description:
      'Compare two auto loans by monthly payment, total interest, total paid, and payoff timing to see which offer costs less.',
    h1: 'Auto Loan Comparison Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'offset-calculator': {
    title: 'Offset Calculator | Interest Savings & Payoff | CalcHowMuch',
    description:
      'See how offset savings balances and monthly contributions reduce mortgage interest, shorten payoff time, and improve total cost over monthly and yearly views.',
    h1: 'Offset Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'loan-to-value': {
    title: 'Loan-to-Value (LTV) Calculator | LTV Bands | CalcHowMuch',
    description:
      'Calculate mortgage loan-to-value instantly using property value and either loan amount or deposit, then view risk bands and target LTV levels.',
    h1: 'Loan-to-Value (LTV) Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'personal-loan': {
    title: 'Personal Loan Calculator - Monthly Payment, Interest & Total Cost | CalcHowMuch',
    description:
      'Calculate personal loan monthly payments, total interest, and payoff time. Add extra monthly payments to see interest savings and early payoff.',
    h1: 'Personal Loan Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'interest-rate-change-calculator': {
    title: 'Interest Rate Change Calculator | Rate Impact | CalcHowMuch',
    description:
      'Compare current and new mortgage rates to estimate monthly payment differences, total interest impact, and scenario timing over your remaining term.',
    h1: 'Interest Rate Change Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'fraction-calculator': {
    title: 'Fraction Calculator - Add, Subtract, Multiply, Divide & Simplify | CalcHowMuch',
    description:
      'Use this free fraction calculator to add, subtract, multiply, divide, simplify, and convert fractions with clear worked steps for students.',
    h1: 'Fraction Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'credit-card-minimum-payment': {
    title: 'Credit Card Minimum Payment Calculator | Payoff Cost',
    description:
      'See how long minimum-only credit card payments take, what your first payment may be, and how much interest you could pay overall.',
    h1: 'Credit Card Minimum Payment Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'balance-transfer-installment-plan': {
    title: 'Balance Transfer Calculator | Fees, Promo APR & Savings',
    description:
      'Compare transfer fee, promo months, post-promo APR, payoff time, and total cost to see whether a balance transfer saves money.',
    h1: 'Balance Transfer Credit Card Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'credit-card-repayment-payoff': {
    title: 'Credit Card Payment Calculator | Payoff & Interest',
    description:
      'Estimate credit card payoff time, monthly payment impact, total interest, and total repaid from your balance, APR, and payment plan.',
    h1: 'Credit Card Payment Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'credit-card-consolidation': {
    title: 'Credit Card Consolidation Calculator | Loan vs Cards',
    description:
      'Compare card repayment versus a consolidation loan by monthly payment, payoff time, fees, total interest, and total repaid.',
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
    title: 'Factoring Calculator | Polynomial Factoring Steps | CalcHowMuch',
    description:
      'Factor algebraic expressions using GCF, quadratic factoring, difference of squares, cubes, and grouping with readable result steps.',
    h1: 'Factoring Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'polynomial-operations': {
    title: 'Polynomial Operations Calculator | Add Subtract Multiply Divide',
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
  'overtime-hours-calculator': {
    title: 'Overtime Hours Calculator | Daily, Weekly and Night',
    description:
      'Calculate regular and overtime hours using daily or weekly limits, split shifts, rounding, and night-hour tracking.',
    h1: 'Overtime Hours Calculator',
  },
  'work-hours-calculator': {
    title: 'Work Hours Calculator | Shifts, Breaks and Totals',
    description:
      'Calculate single, split, or weekly work hours, subtract unpaid breaks, and view totals in HH:MM and decimal hours.',
    h1: 'Work Hours Calculator',
  },
  'time-between-two-dates-calculator': {
    title: 'Time Between Two Dates Calculator | Date Difference',
    description:
      'Calculate the difference between two dates or date-times in days, weeks, months, hours, and minutes.',
    h1: 'Time Between Two Dates Calculator',
  },
  'sleep-time-calculator': {
    title: 'Sleep Time Calculator | Bedtime and Wake-Up Cycles',
    description:
      'Find bedtime or wake-up times based on 90-minute sleep cycles and a fall-asleep buffer.',
    h1: 'Sleep Time Calculator',
  },
  'wake-up-time-calculator': {
    title: 'Wake-Up Time Calculator | Sleep Cycle Wake Times',
    description:
      'Find wake-up times based on 90-minute sleep cycles and compare 4, 5, or 6 cycle options.',
    h1: 'Wake-Up Time Calculator',
  },
  'nap-time-calculator': {
    title: 'Nap Time Calculator | Quick, Power or Afternoon Nap',
    description:
      'Choose a nap type and start time to get a suggested wake-up time with an optional wake buffer.',
    h1: 'Nap Time Calculator',
  },
  'power-nap-calculator': {
    title: 'Power Nap Calculator | Best Wake-Up Times',
    description:
      'Compare 10, 20, 30, 60, and 90-minute nap options and get wake-up times for each one.',
    h1: 'Power Nap Calculator',
  },
  'energy-based-nap-selector': {
    title: 'Energy-Based Nap Selector | Quick, Strong or Full',
    description:
      'Choose Quick, Strong, or Full to get a recommended nap length, wake-up time, and practical alternatives.',
    h1: 'Energy-Based Nap Selector',
  },
  'birthday-day-of-week': {
    title: 'Birthday Day-of-Week Calculator | Find Your Birth Weekday',
    description:
      'Find the weekday you were born on, preview a future birthday year, and spot the next Friday, Saturday, or Sunday birthday.',
    h1: 'Birthday Day-of-Week Calculator',
  },
  'countdown-timer-generator': {
    title: 'Countdown Timer | Live Time Left to Any Date',
    description:
      'Create a live countdown timer for birthdays, launches, trips, deadlines, and holidays. Set a future date, track time left, and add the event to your calendar.',
    h1: 'Countdown Timer',
  },
  'days-until-a-date-calculator': {
    title: 'Days Until a Date Calculator | Count Days to Any Date',
    description:
      'Count how many days remain until a future date or how many days have passed since a past date.',
    h1: 'Days Until a Date Calculator',
  },
  'age-calculator': {
    title: 'Age Calculator | Years, Months and Days',
    description:
      'Calculate exact age in years, months, and days from a date of birth and an optional as-of date.',
    h1: 'Age Calculator',
  },
  'discount-calculator': {
    title: 'Discount Calculator | Sale Price and Savings',
    description:
      'Calculate the sale price after a percentage discount and see exactly how much you save.',
    h1: 'Discount Calculator',
  },
  'markup-calculator': {
    title: 'Markup Calculator | Cost to Selling Price',
    description:
      'Calculate selling price from cost and markup, or find markup percentage from cost and price.',
    h1: 'Markup Calculator',
  },
  'percentage-finder-calculator': {
    title: 'What Percent Is X of Y Calculator | Ratio to Percent',
    description:
      'Find what percent one number is of another using the simple X divided by Y times 100 formula.',
    h1: 'What Percent Is X of Y',
  },
  'percentage-of-a-number-calculator': {
    title: 'Percentage of a Number Calculator | Find X% of Y',
    description:
      'Calculate what X percent of Y equals using the standard percent-to-decimal formula.',
    h1: 'Find Percentage of a Number Calculator',
  },
  'reverse-percentage-calculator': {
    title: 'Reverse Percentage Calculator | Find the Original Value',
    description:
      'Find the original number when a known value represents a given percentage of it.',
    h1: 'Reverse Percentage',
  },
  'present-value': {
    title: 'Present Value Calculator | Discount Future Money',
    description:
      'Estimate the present value of future money using discount rate, time period, and compounding frequency.',
    h1: 'Present Value Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'future-value': {
    title: 'Future Value Calculator | Growth Over Time',
    description:
      'Estimate the future value of money using starting amount, rate, time period, compounding, and optional recurring contributions.',
    h1: 'Future Value Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'present-value-of-annuity': {
    title: 'Present Value of Annuity Calculator | Ordinary or Due',
    description:
      'Estimate the present value of an annuity using payment amount, discount rate, periods, and annuity timing.',
    h1: 'Present Value of Annuity Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'future-value-of-annuity': {
    title: 'Future Value of Annuity Calculator | Ordinary or Due',
    description:
      'Estimate the future value of an annuity using payment amount, growth rate, periods, and annuity timing.',
    h1: 'Future Value of Annuity Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'simple-interest': {
    title: 'Simple Interest Calculator | Interest & Final Amount',
    description:
      'Estimate simple interest, total interest, and ending amount using principal, rate, and time period.',
    h1: 'Simple Interest Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'effective-annual-rate': {
    title: 'Effective Annual Rate Calculator | True Annual Rate',
    description:
      'Estimate the effective annual rate from a nominal rate and compounding frequency to compare the true yearly cost or return.',
    h1: 'Effective Annual Rate Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'time-to-savings-goal': {
    title: 'Time to Savings Goal Calculator | Reach Your Target',
    description:
      'Estimate how long it could take to reach a savings goal using current balance, contributions, interest rate, and compounding.',
    h1: 'Time to Savings Goal Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'monthly-savings-needed': {
    title: 'Monthly Savings Needed Calculator | Reach Your Goal',
    description:
      'Estimate the monthly savings needed to reach a goal using current balance, time horizon, interest rate, and compounding.',
    h1: 'Monthly Savings Needed Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'compound-interest': {
    title: 'Compound Interest Calculator | Ending Balance & Growth',
    description:
      'Estimate ending balance, total contributions, and compound growth using starting amount, rate, time, and compounding.',
    h1: 'Compound Interest Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'simple-interest': {
    title: 'Simple Interest Calculator | Interest & Final Amount',
    description:
      'Estimate simple interest, total interest, and ending amount using principal, rate, and time period.',
    h1: 'Simple Interest Calculator',
  },
  'investment-growth': {
    title: 'Investment Growth Calculator | Future Value Projection',
    description:
      'Estimate future value, total contributions, and total gains using return rate, time horizon, and optional inflation adjustment.',
    h1: 'Investment Growth Calculator',
  },
  'investment-return': {
    title: 'Investment Return Calculator | CAGR, Profit & Growth',
    description:
      'Estimate investment return, portfolio growth, profit, and CAGR using lump sums, contributions, inflation, and tax settings.',
    h1: 'Investment Return Calculator',
    paneLayout: 'single',
    explanationHeading: '',
  },
  'commission-calculator': {
    title: 'Commission Calculator – CalcHowMuch',
    description:
      'Calculate commission from sales using a flat rate or optional tiers. Free commission calculator for commission % on sales and earnings.',
    h1: 'Commission Calculator',
    paneLayout: 'single',
    suppressAdsColumn: true,
    calculatorPanelClass: 'panel--shellless',
    layoutMainClass: 'layout-main--no-ads',
  },
  'margin-calculator': {
    title: 'Margin Calculator – CalcHowMuch',
    description:
      'Calculate gross margin %, profit, and selling price instantly. Use our free margin calculator with simple formulas for pricing and profit.',
    h1: 'Margin Calculator',
  },
  'percent-change': {
    title: 'Percent Change Calculator – CalcHowMuch',
    description:
      'Calculate percent change from A to B with the correct +/− sign. Use our free percentage change calculator and formula instantly.',
    h1: 'Percent Change Calculator',
    explanationHeading: '',
  },
  'percentage-difference': {
    title: 'Percentage Difference Calculator | Compare Two Values',
    description:
      'Calculate the symmetric percentage difference between two values using their average as the baseline.',
    h1: 'Percentage Difference Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'percentage-increase': {
    title: 'Percentage Increase Calculator | Growth from Original',
    description:
      'Calculate how much a value increased from its original amount using the standard percentage growth formula.',
    h1: 'Percentage Increase Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'percentage-decrease': {
    title: 'Percentage Decrease Calculator | Drop from Original',
    description:
      'Calculate how much a value decreased from its original amount using the standard percentage drop formula.',
    h1: 'Percentage Decrease Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'percentage-composition': {
    title: 'Percentage Composition Calculator | Share of Total',
    description:
      "Calculate each item's share of a total and the remainder percentage from a known or calculated total.",
    h1: 'Percentage Composition Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'percent-to-fraction-decimal': {
    title: 'Percent to Fraction and Decimal Calculator | Convert %',
    description:
      'Convert a percentage into a decimal and simplified fraction using the standard divide-by-100 method.',
    h1: 'Percent to Fraction & Decimal Converter',
  },
  'percentage-of-a-number': {
    title: 'Find Percentage of a Number Calculator – CalcHowMuch',
    description:
      'Calculate what X% of Y is instantly. Use our free Find Percentage of a Number calculator for fast, accurate results.',
    h1: 'Find Percentage of a Number Calculator',
  },
};

const HOME_LOAN_SCHEMA_CONFIG = {
  'home-loan': {
    breadcrumbLabel: 'Home Loan',
    softwareName: 'Home Loan Calculator',
    softwareDescription:
      'Estimate monthly mortgage payments, amortization schedule, payoff timeline, and interest savings from extra payments.',
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
      'Estimate your borrowing power using income multiples or payment-to-income affordability checks.',
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
      'Compare your current mortgage against a new rate and term to measure break-even and total savings.',
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
      'Estimate rental yield, cashflow, and lender stress coverage for buy-to-let mortgage scenarios.',
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
      'Model how offset savings and monthly contributions reduce mortgage interest and payoff time.',
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
      'Compare payment and total interest impact when mortgage rates change now or after a selected period.',
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
      'Calculate mortgage LTV and review risk bands using property value with loan or deposit inputs.',
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
      'Estimate personal loan monthly payment, total interest, and payoff impact of extra monthly payments across a fixed-rate term.',
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
  'monthly-savings-needed': {
    breadcrumbLabel: 'Monthly Savings Needed',
    softwareName: 'Monthly Savings Needed Calculator',
    softwareDescription:
      'Estimate the monthly savings needed to reach a goal using current balance, time horizon, interest rate, and compounding.',
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
      'Calculate compound interest to estimate your ending balance, total interest earned, and growth over time.',
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
      'Estimate how long it will take to reach your savings target with regular contributions, interest, and compounding.',
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
      'Convert a nominal interest rate into an effective annual rate using compounding frequency.',
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
  'future-value': {
    breadcrumbLabel: 'Future Value (FV)',
    softwareName: 'Future Value (FV) Calculator',
    softwareDescription:
      'Calculate how much your money could grow over time using interest rate and compounding.',
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
      'Calculate the future value of an annuity and compare ordinary annuity vs annuity due.',
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
  'investment-growth': {
    breadcrumbLabel: 'Investment Growth',
    softwareName: 'Investment Growth Calculator',
    softwareDescription:
      'Calculate how your investments will grow over time with compound interest, regular contributions, and inflation adjustments.',
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
      'Estimate portfolio growth with lump sum and recurring contributions, with optional tax and inflation adjustment.',
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
    softwareDescription: 'Calculate the present value of future cash using discount rate and time.',
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
      'Calculate the present value of an annuity. Compare ordinary annuity vs annuity due.',
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
      'Calculate simple interest to find total interest and ending amount using principal, rate, and time.',
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function indentBlock(block, indent) {
  return block
    .split('\n')
    .map((line) => (line ? `${indent}${line}` : line))
    .join('\n');
}

function extractMandatoryMatch(source, regex, errorMessage) {
  const match = source.match(regex);
  if (!match) {
    throw new Error(errorMessage);
  }
  return match[0].trim();
}

function loadAdSenseSnippets() {
  const adSenseSnippetSource = readFile(ADSENSE_SNIPPET_PATH);
  const adUnitSnippetSource = readFile(AD_UNIT_SNIPPET_PATH);

  const headLoaderScript = extractMandatoryMatch(
    adSenseSnippetSource,
    /<script\b[\s\S]*?<\/script>/i,
    `Missing AdSense head loader script in ${ADSENSE_SNIPPET_PATH}`
  );
  if (!ADSENSE_LOADER_SRC_RE.test(headLoaderScript)) {
    throw new Error(
      `AdSense head snippet in ${ADSENSE_SNIPPET_PATH} does not contain the adsbygoogle.js loader`
    );
  }

  const adSlotCommentMatch = adUnitSnippetSource.match(/<!--[\s\S]*?-->/i);
  const adSlotComment = adSlotCommentMatch ? adSlotCommentMatch[0].trim() : '';
  const adSlotInsTag = extractMandatoryMatch(
    adUnitSnippetSource,
    /<ins\b[\s\S]*?<\/ins>/i,
    `Missing <ins class="adsbygoogle"> tag in ${AD_UNIT_SNIPPET_PATH}`
  );
  if (!/\badsbygoogle\b/i.test(adSlotInsTag)) {
    throw new Error(
      `Ad unit snippet in ${AD_UNIT_SNIPPET_PATH} does not include class="adsbygoogle"`
    );
  }

  const scriptMatches = Array.from(
    adUnitSnippetSource.matchAll(/<script\b[\s\S]*?<\/script>/gi)
  ).map((match) => match[0].trim());
  const adPushScript = scriptMatches.find(
    (scriptTag) => !/\bsrc\s*=/i.test(scriptTag) && /adsbygoogle/i.test(scriptTag)
  );
  if (!adPushScript) {
    throw new Error(
      `Missing inline adsbygoogle push script in ${AD_UNIT_SNIPPET_PATH}. Expected '(adsbygoogle = window.adsbygoogle || []).push({});'`
    );
  }

  return {
    headLoaderScript,
    adSlotComment,
    adSlotInsTag,
    adPushScript,
  };
}

const ADSENSE_SNIPPETS = loadAdSenseSnippets();
const ADSENSE_HEAD_MANAGED_BLOCK = [
  ADSENSE_HEAD_MARKER_START,
  ADSENSE_SNIPPETS.headLoaderScript,
  ADSENSE_HEAD_MARKER_END,
].join('\n');
const ADSENSE_SLOT_MANAGED_BLOCK = [
  ADSENSE_SLOT_MARKER_START,
  ADSENSE_SNIPPETS.adSlotComment,
  ADSENSE_SNIPPETS.adSlotInsTag,
  ADSENSE_SNIPPETS.adPushScript,
  ADSENSE_SLOT_MARKER_END,
]
  .filter(Boolean)
  .join('\n');

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

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
  ];

  if (breadcrumbLabel) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: breadcrumbLabel,
      item: `${SITE_URL}/${clusterSegment}/`,
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
  const cardRegex = /<(div|article)[^>]*class="[^"]*\bfaq-card\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi;
  const entries = [];

  for (const [, , cardHtml] of explanationHtml.matchAll(cardRegex)) {
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

function buildHomepageStructuredData({ title, description, canonical }) {
  const faqEntries = [
    {
      '@type': 'Question',
      name: 'Are the calculators free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All calculators on CalcHowMuch are free to use. You can use them as often as you like without creating an account.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to sign up to use the calculators?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. You do not need to register or sign in. Our calculators are available instantly in your browser.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store my inputs or calculation results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Calculator inputs and results stay in your browser and are not stored by us. We do not save the values you enter into calculator fields.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the calculator results accurate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The calculators are designed to provide accurate estimates based on the inputs and assumptions shown on each page. However, actual results may vary depending on rounding, timing, institution-specific rules, or real-world conditions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use these calculator results for financial, legal, or tax decisions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Calculator results are for informational and planning purposes only. They should not be treated as financial, legal, tax, or professional advice. For important decisions, consult a qualified professional or official source.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do results sometimes differ from banks, lenders, or other websites?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Results can differ because different tools may use different assumptions, rounding methods, compounding frequency, date handling, or fee/tax rules. We recommend checking the explanation and assumptions section on each calculator page.',
      },
    },
    {
      '@type': 'Question',
      name: 'What assumptions do your calculators use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each calculator includes its own assumptions and methodology. Common assumptions may include fixed interest rates, regular payment intervals, standard compounding periods, and simplified timing rules. Always review the page-specific explanation for details.',
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
      name: 'Can I use CalcHowMuch calculators for business or professional planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can use them for planning and estimation. However, because calculators simplify some real-world variables, final decisions should be verified with official documents, providers, or professionals.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do your calculators include fees, taxes, or penalties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on the calculator. Some calculators include optional fields for fees, taxes, or extra costs, while others focus on the core calculation only. Check the inputs and explanation section for what is included.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often are the calculators updated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We review and improve calculators regularly to keep formulas, explanations, and usability clear and reliable. The “Last updated” date on each page shows when that calculator was most recently reviewed.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I trust the formulas used on the site?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We aim to use standard formulas and clearly explain how each calculator works. Where relevant, we also provide formula sections, assumptions, and examples so you can verify the logic.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does the same input sometimes produce different results after changing options?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some options (such as compounding frequency, payment timing, rounding, or contribution intervals) can significantly affect the output. Even small changes in settings can change the final result.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are your calculators suitable for students and learning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many users use CalcHowMuch calculators for learning, homework support, and understanding formulas. The explanation and FAQ sections are designed to make the calculations easier to understand.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide professional advice or recommendations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. CalcHowMuch provides tools and explanations, not personalized advice. We do not recommend specific financial products, legal actions, or tax strategies.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I do if I think a calculator result is wrong?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'First, recheck your inputs (especially dates, rates, and frequencies). Then review the assumptions and explanation section on the calculator page. If something still looks incorrect, contact us and include the inputs you used so we can review it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share calculator results with someone else?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can share the calculator page and inputs, but remember that results are estimates and should be independently verified before making important decisions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the calculators available worldwide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Most calculators can be used from anywhere. However, some results may vary by country because local laws, taxes, lending rules, and financial products differ.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you use cookies or analytics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We may use basic analytics and site tools to improve performance and usability. Calculator inputs themselves are not stored as personal calculation records. For full details, see our Privacy Policy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I learn more about how a calculator works?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each calculator page includes an explanation section, formula details, and FAQs. You can also visit our About page and site policies for more information about how CalcHowMuch works.',
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
  return `${indentBlock(ADSENSE_HEAD_MANAGED_BLOCK, '    ')}\n`;
}

function renderManagedAdPanel(indent = '          ') {
  return `${indent}<div class="ad-panel">\n${indentBlock(
    ADSENSE_SLOT_MANAGED_BLOCK,
    `${indent}  `
  )}\n${indent}</div>`;
}

function stripManagedBlock(html, startMarker, endMarker) {
  const blockPattern = new RegExp(
    `^[ \\t]*${escapeRegExp(startMarker)}\\s*\\n[\\s\\S]*?^[ \\t]*${escapeRegExp(
      endMarker
    )}\\s*\\n?`,
    'gm'
  );
  return html.replace(blockPattern, '');
}

function normalizeAdSenseHead(html) {
  let normalized = stripManagedBlock(html, ADSENSE_HEAD_MARKER_START, ADSENSE_HEAD_MARKER_END);
  normalized = normalized.replace(ADSENSE_LOADER_SCRIPT_RE, '');
  normalized = normalized.replace(
    /^[ \t]*<!-- Cloudflare Web Analytics -->/gm,
    '    <!-- Cloudflare Web Analytics -->'
  );

  if (!/^[ \t]*<\/head>/im.test(normalized)) {
    return normalized;
  }

  return normalized.replace(/^[ \t]*<\/head>/im, `${renderManagedHeadAdsenseBlock()}  </head>`);
}

function normalizeAdPanelSlots(html) {
  if (!/class=["']ads-column["']/i.test(html)) {
    return html;
  }

  return html.replace(
    /(^[ \t]*)<div class="ad-panel"[^>]*>[\s\S]*?<\/div>/gm,
    (match, indent = '') => renderManagedAdPanel(indent)
  );
}

function collectHtmlFiles(rootDir) {
  const htmlFiles = [];
  const stack = [rootDir];

  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        return;
      }
      if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.html') {
        htmlFiles.push(fullPath);
      }
    });
  }

  return htmlFiles;
}

function syncAdsenseAcrossPublicHtml() {
  const htmlFiles = collectHtmlFiles(PUBLIC_DIR);
  htmlFiles.forEach((filePath) => {
    const currentHtml = readFile(filePath);
    if (!/<!doctype html>/i.test(currentHtml)) {
      return;
    }

    const withHead = normalizeAdSenseHead(currentHtml);
    const withAdPanels = normalizeAdPanelSlots(withHead);
    if (withAdPanels !== currentHtml) {
      writeFile(filePath, withAdPanels);
    }
  });
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

  if (category.id === 'time-and-date') {
    return buildTimeAndDateNav(category, activeCalculatorId, calcLookup);
  }

  return buildStandardNav(category, activeCalculatorId, activeSubcategoryId, calcLookup);
}

function assertPercentageFinNavContract({ leftNavHtml, calculatorId, routePath }) {
  // Hard gate (percentage only): keep legacy deletion deferred until all clusters migrate.
  const requiredTokens = ['class="fin-nav-container"', 'class="fin-nav-group"', 'class="fin-nav-item"'];
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
  calculatorRelPath,
  assetConfig = null,
  cssBundleConfig = null,
  topNavStatic = false,
  staticStructuredData = null,
  injectStaticStructuredData = false,
}) {
  const versionedCalculatorHtml = applyCalculatorFragmentVersioning(calculatorHtml);
  const sanitizedCalculatorHtml =
    assetConfig && typeof versionedCalculatorHtml === 'string'
      ? versionedCalculatorHtml.replace(
          /<style>\s*@import\s+url\(['"]\/calculators\/[^'"]+\/calculator\.css(?:\?[^'"]*)?['"]\);\s*<\/style>/gi,
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
      paneLayout === 'single'
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
    calcContent = `<div class="panel panel-scroll panel-span-all">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  <div class="calculator-page-single">
    ${sanitizedCalculatorHtml}
  </div>
</div>`;
  } else if (routeArchetype === 'exp_only') {
    calcContent = `<div class="panel panel-scroll panel-span-all">
  <h1 id="calculator-title">${calculatorTitle}</h1>
${explanationTitleHtml}  ${explanationHtml}
</div>`;
  } else if (routeArchetype === 'content_shell') {
    calcContent = `<div class="panel panel-scroll panel-span-all">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  ${contentHtml}
</div>`;
  } else {
    throw new Error(`Unsupported routeArchetype "${routeArchetype}" while building ${canonical}`);
  }

  const bodyAttribute = pageType ? ` data-page="${pageType}"` : '';
  const routeArchetypeAttribute = routeArchetype ? ` data-route-archetype="${routeArchetype}"` : '';
  const designFamilyAttribute = designFamily ? ` data-design-family="${designFamily}"` : '';
  const topNavStaticAttribute = topNavStatic ? ' data-top-nav-static="true"' : '';
  const routeModuleScriptHref = resolveCalculatorModuleScriptHref(calculatorRelPath);

  let scriptTagsHtml = '';
  if (assetConfig) {
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
  if (assetConfig) {
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
  const adsColumnHtml = suppressAdsColumn
    ? ''
    : `        <section class="ads-column" aria-label="Ad placeholders">
${adPanelHtml}
        </section>
`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${headMetaHtml}
${cssLinksHtml} 
${structuredDataScript}${adsenseHeadScript}    <!-- Cloudflare Web Analytics (manual beacon commented out for duplicate-beacon validation): <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script> -->
  </head>
  <body${bodyAttribute}${routeArchetypeAttribute}${designFamilyAttribute}${topNavStaticAttribute}>
    <div class="page">
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
    </div>
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

  const title = 'All Calculators | Calculate How Much Online Calculator Hub';
  const description =
    'Browse every calculator on Calculate How Much, organized by category with direct links to launch each tool and explore related finance or math topics.';
  const canonical = buildCanonical('/calculators/');
  const adsenseHeadScript = renderManagedHeadAdsenseBlock();
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
              Browse calculators by category. Select a calculator to launch it in the main
              calculator shell.
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

        const normalize = (value) => String(value || '').trim().toLowerCase();
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
                const isMatch = !query || normalize(searchable).includes(query);
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
            noResultsNode.hidden = visibleItemCount > 0;
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
    h1: 'Calculate How Much',
    isCalculatorPage: isCalculatorPathFromCanonical(canonical),
  });
  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${headMetaHtml}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Space+Grotesk:wght@600;700&display=swap"
      media="print"
      onload="this.media='all'"
    />
    <noscript>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Space+Grotesk:wght@600;700&display=swap"
      />
    </noscript>
    <link rel="stylesheet" href="/assets/css/homepage-preview.css" />
    <script type="application/ld+json" data-homepage-ld="true" data-calculator-ld="true">${stringifyStructuredData(
      homepageStructuredData
    )}</script>
${adsenseHeadScript}    <!-- Cloudflare Web Analytics (manual beacon commented out for duplicate-beacon validation): <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script> -->
  </head>
  <body data-page="home" data-route-archetype="content_shell" data-design-family="neutral">
    <canvas id="particleCanvas" aria-hidden="true"></canvas>
    <div class="homepage-preview-shell">
      <header class="preview-header">
        <div class="preview-header-inner">
          <a class="brand-link" href="/" aria-label="CalcHowMuch home">
            <span class="brand-logo" aria-hidden="true">#</span>
            <span class="brand-copy">
              <strong>CalcHowMuch</strong>
              <small>Premium Calculator Suite</small>
            </span>
          </a>
          <label class="search-wrap" for="homepage-search">
            <span class="sr-only">Search calculators</span>
            <input
              id="homepage-search"
              type="search"
              placeholder="Search calculators..."
              autocomplete="off"
              spellcheck="false"
            />
          </label>
        </div>
      </header>
      <main class="preview-main">
        <section class="hero" aria-labelledby="homepage-hero-title">
          <h1 id="homepage-hero-title">Calculate How Much</h1>
          <p>Quick calculations for everyday numbers.</p>
        </section>
        <section
          id="homepage-categories"
          class="categories"
          aria-labelledby="homepage-clusters-title"
          data-loading="true"
          style="--loading-card-count: 7"
        >
          <h2 id="homepage-clusters-title" class="categories-title">Browse Calculator Clusters</h2>
          <div id="homepage-empty" class="empty-state" hidden>
            No calculator matches your search.
          </div>
          <div id="homepage-grid" class="category-grid" aria-live="polite"></div>
        </section>
      </main>
      <footer class="site-footer">
        <nav aria-label="Footer links">
          <a href="/privacy/">Privacy</a>
          <span class="footer-divider">|</span>
          <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
          <span class="footer-divider">|</span>
          <a href="/contact-us/">Contact</a>
          <span class="footer-divider">|</span>
          <a href="/faq/">FAQs</a>
          <span class="footer-divider">|</span>
          <a href="/sitemap.xml">Sitemap</a>
        </nav>
        <p class="footer-branding">&copy; 2026 @CalcHowMuch</p>
      </footer>
    </div>
    <script type="module" src="/assets/js/homepage-preview.js"></script>
  </body>
</html>`;
}

function buildGtepFooter() {
  return `<footer class="gtep-footer">\n  <a href="/privacy/">Privacy</a>\n  <span class="footer-divider">|</span>\n  <a href="/terms-and-conditions/">Terms &amp; Conditions</a>\n  <span class="footer-divider">|</span>\n  <a href="/contact-us/">Contact</a>\n  <span class="footer-divider">|</span>\n  <a href="/faq/">FAQs</a>\n  <span class="footer-divider">|</span>\n  <a href="/sitemap.xml">Sitemap</a>\n  <span class="footer-divider">|</span>\n  <span class="footer-branding">&copy; 2026 @CalcHowMuch</span>\n</footer>`;
}

function buildGtepPage({ title, description, canonical, bodyHtml }) {
  const adsenseHeadScript = renderManagedHeadAdsenseBlock();
  const headMetaHtml = generateHeadMeta({
    canonicalUrl: canonical,
    seoTitle: title,
    seoDescription: description,
    ogImageUrl: OG_IMAGE,
    h1: title,
    isCalculatorPage: isCalculatorPathFromCanonical(canonical),
  });
  return `<!doctype html>\n<html lang="en">\n  <head>\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n${headMetaHtml}\n    <link rel="stylesheet" href="/assets/css/theme-premium-dark.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/gtep.css?v=${GTEP_CSS_VERSION}" />\n${adsenseHeadScript}    <!-- Cloudflare Web Analytics (manual beacon commented out for duplicate-beacon validation): <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script> -->\n  </head>\n  <body class="gtep-body">\n    <div class="gtep-page">\n      <header class="gtep-header">\n        <span class="gtep-header-title">Calculate How Much</span>\n      </header>\n      <main class="gtep-main">\n        <div class="gtep-content">\n          ${bodyHtml}\n        </div>\n      </main>\n      ${buildGtepFooter()}\n    </div>\n  </body>\n</html>`;
}

function buildGtepSitemap(categories) {
  const sitePages = `
          <section>
            <h2>Site Pages</h2>
            <ul>
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
  const staticUrls = [
    { path: '/sitemap.xml', changefreq: 'monthly', priority: '0.4' },
    { path: '/privacy/', changefreq: 'monthly', priority: '0.4' },
    {
      path: '/privacy-policy/',
      lastmod: '2026-02-09',
      changefreq: 'yearly',
      priority: '0.30',
    },
    {
      path: '/terms-and-conditions/',
      lastmod: '2026-02-09',
      changefreq: 'yearly',
      priority: '0.30',
    },
    {
      path: '/contact-us/',
      lastmod: '2026-02-09',
      changefreq: 'yearly',
      priority: '0.30',
    },
    { path: '/faq/', lastmod: '2026-02-09', changefreq: 'monthly', priority: '0.40' },
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
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://calchowmuch.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://calchowmuch.com/calculators/</loc>
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
              if (pathExistsAsDirectory(contentCandidateDir)) {
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
        const override = CALCULATOR_OVERRIDES[calculator.id];
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

  if (!selectedEntries.length && !shouldWriteRootHomepage && !shouldWriteCalculatorIndex) {
    throw new Error(
      `No calculators matched the requested scope (route=${scope.targetRoute ?? 'n/a'}, calcId=${scope.targetCalcId ?? 'n/a'}).`
    );
  }

  const headerHtml = readFile(HEADER_PATH);
  const footerHtml = readFile(FOOTER_PATH);

  selectedEntries.forEach((entry) => {
    const { category, subcategory, calculator, governance, relPath, outputRelPath } = entry;
    const assetConfig = resolveAssetConfig(assetManifest, calculator.url);
    if (assetConfig?.options?.generationMode === 'manual') {
      console.log(`  SKIP (manual): ${relPath}`);
      return;
    }
    const fragmentDir = resolveCalculatorFragmentDir(relPath);
    const override = CALCULATOR_OVERRIDES[calculator.id];
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
    const routeBundleEntry = !assetConfig && ROUTE_BUNDLE_PILOT_IDS.has(calculator.id)
      ? resolveRouteBundleEntry(routeBundleManifest, calculator.url)
      : null;
    let cssBundleConfig = null;
    const topNavStatic =
      Boolean(assetConfig?.options?.topNavStatic) || ROUTE_BUNDLE_PILOT_IDS.has(calculator.id);

    if (!assetConfig && ROUTE_BUNDLE_PILOT_IDS.has(calculator.id) && !routeBundleEntry) {
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
    });

    const outputDir = path.join(PUBLIC_DIR, outputRelPath);
    writeFile(path.join(outputDir, 'index.html'), pageHtml);
  });

  const homeTitle = 'All Calculators — Mortgage, Loan, Finance & Math Tools (Free & Easy)';
  const homeDescription =
    'Quick calculations for everyday numbers. Explore calculator clusters and launch focused tools for math, finance, loans, time, and percentage planning.';

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

  if (!scope.fullSite) {
    console.log(
      `Scoped generation complete for ${selectedEntries.length} route(s) (route=${scope.targetRoute ?? 'n/a'}, calcId=${scope.targetCalcId ?? 'n/a'}).`
    );
    return;
  }
  writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemapXml(navigation.categories));
  syncAdsenseAcrossPublicHtml();
}

main();
