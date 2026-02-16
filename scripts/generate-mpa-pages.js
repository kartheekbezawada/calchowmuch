import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CALC_DIR = path.join(PUBLIC_DIR, 'calculators');
const NAV_PATH = path.join(PUBLIC_DIR, 'config', 'navigation.json');
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
const ROUTE_BUNDLE_PILOT_IDS = new Set([
  'present-value',
  'future-value',
  'future-value-of-annuity',
  'present-value-of-annuity',
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
    explanationHeading: '',
    paneLayout: 'single',
  },
  'hire-purchase': {
    explanationHeading: '',
    paneLayout: 'single',
  },
  'pcp-calculator': {
    title: 'PCP Calculator - Monthly Payment, GFV & Total Cost',
    description:
      'Estimate PCP monthly payment, final payment (GFV + option fee), total interest, and total payable with premium slider inputs, three table views, and FAQs.',
    h1: 'PCP Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'leasing-calculator': {
    title: 'Leasing Calculator - Monthly Payment, Residual & Total Cost',
    description:
      'Estimate lease monthly payment, residual impact, finance charge, and total lease cost with premium sliders, three table views, and FAQs.',
    h1: 'Leasing Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'multiple-car-loan': {
    title: 'Multiple Car Loan Calculator - Compare Two Auto Loans',
    description:
      'Compare two car loans side by side and estimate combined monthly payment, total interest, and total paid with amortization views and FAQs.',
    h1: 'Multiple Car Loan Calculator',
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
  'interest-rate-change-calculator': {
    title: 'Interest Rate Change Calculator | Rate Impact | CalcHowMuch',
    description:
      'Compare current and new mortgage rates to estimate monthly payment differences, total interest impact, and scenario timing over your remaining term.',
    h1: 'Interest Rate Change Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'credit-card-minimum-payment': {
    h1: 'Credit Card Minimum Payment',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'balance-transfer-installment-plan': {
    title: 'Balance Transfer Calculator – Savings with Promo APR & Fees',
    description:
      'Calculate your balance transfer savings including transfer fees, promo APR periods, and post-promo rates. See total cost and payoff timeline.',
    h1: 'Balance Transfer Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'credit-card-repayment-payoff': {
    explanationHeading: '',
    paneLayout: 'single',
  },
  'credit-card-consolidation': {
    title: 'Credit Card Consolidation Calculator -- Compare & Save',
    description:
      'Compare paying credit cards separately vs consolidating into a fixed-rate loan. See monthly payment, interest savings, and total cost difference.',
    h1: 'Credit Card Consolidation Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'overtime-hours-calculator': {
    title: 'Overtime Hours Calculator – Regular Hours vs Overtime (Daily & Weekly)',
    description:
      'Calculate total work hours and split them into regular and overtime hours. Supports single shifts, split shifts, custom weekly cycles, night shifts, and night overtime.',
    h1: 'Overtime Hours Calculator',
  },
  'work-hours-calculator': {
    title: 'Work Hours Calculator – Calculate Hours Worked (With Breaks)',
    description:
      'Calculate total hours worked between start and end times, subtract breaks, and view results in hours and decimal format. Simple, fast, and free.',
    h1: 'Work Hours Calculator',
  },
  'nap-time-calculator': {
    title: 'Nap Time Calculator – Quick Nap, Power Nap, or Afternoon Nap',
    description:
      'Choose a nap type and start time to get a recommended wake-up time. Compare quick naps, power naps, and afternoon naps with pros, cons, and FAQs.',
    h1: 'Nap Time Calculator',
  },
  'birthday-day-of-week': {
    title: 'Birthday Day-of-Week Calculator – What Day Were You Born?',
    description:
      'Find the day of the week you were born on, and see what weekday your birthday falls on in any year. Simple, fast, and free.',
    h1: 'Birthday Day-of-Week Calculator',
  },
  'present-value': {
    title: 'Present Value (PV) Calculator – CalcHowMuch',
    description:
      'Calculate the present value of future money using discount rate and time period. Simple, accurate PV calculator.',
    h1: 'Present Value Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'future-value': {
    title: 'Future Value (FV) Calculator – CalcHowMuch',
    description:
      'Calculate how much your money could grow in the future using interest rate and time period. Simple FV calculator.',
    h1: 'Future Value Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'present-value-of-annuity': {
    title: 'Present Value of Annuity Calculator (Ordinary & Due) – CalcHowMuch',
    description:
      'Calculate the present value of an annuity. Compare ordinary annuity vs annuity due using payment amount, rate, and periods with our free calculator.',
    h1: 'Present Value of Annuity Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'future-value-of-annuity': {
    title: 'Future Value of Annuity Calculator (Ordinary & Due) – CalcHowMuch',
    description:
      'Calculate the future value of an annuity. Compare ordinary annuity vs annuity due using payment amount, interest rate, and periods.',
    h1: 'Future Value of Annuity Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'simple-interest': {
    title: 'Simple Interest Calculator – CalcHowMuch',
    description:
      'Calculate simple interest to find total interest and ending amount using principal, rate, and time. Compare simple vs compound interest quickly.',
    h1: 'Simple Interest Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'effective-annual-rate': {
    title: 'Effective Annual Rate (EAR) Calculator – CalcHowMuch',
    description:
      'Calculate the effective annual rate (EAR) from a nominal interest rate and compounding frequency. Compare true annual interest rates accurately.',
    h1: 'Effective Annual Rate Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'time-to-savings-goal': {
    title: 'Time to Savings Goal Calculator – CalcHowMuch',
    description:
      'Estimate how long it will take to reach your savings target with regular contributions, interest, and compounding. Plan your path to financial goals.',
    h1: 'Time to Savings Goal Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'compound-interest': {
    title: 'Compound Interest Calculator – CalcHowMuch',
    description:
      'Calculate compound interest to estimate your ending balance, total interest earned, and growth over time. Supports annual, semi-annual, and quarterly compounding.',
    h1: 'Compound Interest Calculator',
    explanationHeading: '',
    paneLayout: 'single',
  },
  'simple-interest': {
    title: 'Simple Interest Calculator – CalcHowMuch',
    description:
      'Calculate simple interest to find total interest and ending amount using principal, rate, and time. Compare simple vs compound interest quickly.',
    h1: 'Simple Interest Calculator',
  },
  'savings-goal': {
    title: 'Savings Goal Calculator – CalcHowMuch',
    description:
      'Plan your savings goal. Calculate how long it will take to reach a target amount or how much you need to save per month. Optional interest and compounding.',
    h1: 'Savings Goal Calculator',
  },
  'investment-growth': {
    title: 'Investment Growth Calculator \u2013 CalcHowMuch',
    description:
      'Estimate investment growth over time. Calculate future value, total contributions, and total gains using an expected annual return. Optional inflation adjustment.',
    h1: 'Investment Growth Calculator',
  },
  'commission-calculator': {
    title: 'Commission Calculator – CalcHowMuch',
    description:
      'Calculate commission from sales using a flat rate or optional tiers. Free commission calculator for commission % on sales and earnings.',
    h1: 'Commission Calculator',
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
  },
  'percentage-increase': {
    title: 'Percentage Increase Calculator – CalcHowMuch',
    description:
      'Calculate percentage increase from an original value to a new value instantly. Use our free percent increase calculator and formula.',
    h1: 'Percentage Increase Calculator',
  },
  'percent-to-fraction-decimal': {
    title: 'Percent to Fraction & Decimal Converter – CalcHowMuch',
    description:
      'Convert any percentage to a decimal and simplified fraction instantly. Free percent to fraction and percent to decimal converter with steps.',
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
  'monthly-savings-needed': {
    breadcrumbLabel: 'Monthly Savings Needed',
    softwareName: 'Monthly Savings Needed Calculator',
    softwareDescription:
      'Calculate required monthly savings to reach a financial goal with compound interest.',
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
  const overridePaneLayout = override?.paneLayout;

  if (calculator.paneLayout && overridePaneLayout && calculator.paneLayout !== overridePaneLayout) {
    throw new Error(
      `Conflicting paneLayout for ${calculator.id}: navigation=${calculator.paneLayout} override=${overridePaneLayout}`
    );
  }

  let paneLayout = calculator.paneLayout ?? overridePaneLayout ?? 'split';

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

function ensureLength(text, min, max) {
  let result = text.trim().replace(/\s+/g, ' ');
  const filler = ' - Free Tool';
  while (result.length < min) {
    result = `${result}${filler}`;
    if (result.length > max) {
      break;
    }
  }
  if (result.length > max) {
    result = result.slice(0, Math.max(max - 3, 0)).trimEnd();
    result = `${result}...`;
  }
  return result;
}

function buildTitle(name) {
  const longTitle = `${name} | Calculate How Much Online Calculator`;
  return ensureLength(longTitle, 50, 60);
}

function buildDescription(name) {
  const base =
    `${name} calculator with fast inputs and clear results. ` +
    'Calculate How Much provides explanations, examples, and assumptions to help you plan confidently.';
  return ensureLength(base, 150, 160);
}

function buildCanonical(pathname) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`;
  return `${SITE_URL}${withSlash}`;
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
          name: 'Loans',
          item: `${SITE_URL}/loans/`,
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
          item: `${SITE_URL}/loans/home-loan/`,
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

function buildFinanceRouteBundles() {
  execSync('node scripts/build-route-css-bundles.mjs', {
    cwd: ROOT,
    stdio: 'inherit',
  });
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
  'time-to-savings-goal': '🎯',
  'monthly-savings-needed': '🏦',
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

function buildStandardNav(category, activeCalculatorId, activeSubcategoryId, calcLookup) {
  if (category.id === 'percentage-calculators') {
    const calculators = category.subcategories.flatMap((subcategory) => subcategory.calculators);
    const itemsHtml = calculators
      .map((calculator) => {
        const isActive = calculator.id === activeCalculatorId;
        return `<a class="nav-item${isActive ? ' is-active' : ''}" href="${calculator.url}">${calculator.name}</a>`;
      })
      .join('');

    return `
<div class="nav-category" data-id="percentage-calculators-flat">
  <div class="nav-category-items">
    ${itemsHtml}
  </div>
</div>`;
  }

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

  return buildStandardNav(category, activeCalculatorId, activeSubcategoryId, calcLookup);
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
  includeHomeContent,
  pageType,
  calculatorRelPath,
  cssBundleConfig = null,
  topNavStatic = false,
  staticStructuredData = null,
  injectStaticStructuredData = false,
}) {
  const explanationTitleHtml =
    explanationHeading === '' || explanationHeading === null
      ? ''
      : `  <h3>${explanationHeading}</h3>\n`;

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
      <li><a href="/loans/home-loan">Home Loan Calculator</a></li>
      <li><a href="/loans/car-loan">Car Loan Calculator</a></li>
      <li><a href="/math/percentage-increase">Percentage Calculator</a></li>
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
        ? `<div class="panel panel-scroll panel-span-all">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  <div class="calculator-page-single">
    ${calculatorHtml}
${explanationTitleHtml}    ${explanationHtml}
  </div>
</div>`
        : `<div class="panel panel-scroll">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  ${calculatorHtml}
</div>
<div class="panel panel-scroll">
${explanationTitleHtml}  ${explanationHtml}
</div>`;
  } else if (routeArchetype === 'calc_only') {
    calcContent = `<div class="panel panel-scroll panel-span-all">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  <div class="calculator-page-single">
    ${calculatorHtml}
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
  const calculatorScript = calculatorRelPath
    ? `\n    <script type="module" src="/calculators/${calculatorRelPath}/module.js"></script>`
    : '';
  const structuredDataScript =
    injectStaticStructuredData && staticStructuredData
      ? `    <script type="application/ld+json" data-static-ld="true" data-calculator-ld="true">${stringifyStructuredData(
          staticStructuredData
        )}</script>\n`
      : '';
  const cssLinksHtml = cssBundleConfig
    ? `    <style data-route-critical="true">\n${indentBlock(cssBundleConfig.criticalCss, '      ')}\n    </style>\n    <link rel="stylesheet" href="${cssBundleConfig.deferredHref}" media="print" onload="this.onload=null;this.media='all';" />\n    <noscript>\n      <link rel="stylesheet" href="${cssBundleConfig.deferredHref}" />\n    </noscript>\n`
    : `    <link rel="stylesheet" href="/assets/css/theme-premium-dark.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/layout.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/calculator.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/shared-calculator-ui.css?v=${CSS_VERSION}" />\n`;
  const adsenseHeadScript = renderManagedHeadAdsenseBlock();
  const adPanelHtml = renderManagedAdPanel('          ');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <meta name="robots" content="index,follow" />
${cssLinksHtml} 
${structuredDataScript}${adsenseHeadScript}    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
  </head>
  <body${bodyAttribute}${routeArchetypeAttribute}${designFamilyAttribute}${topNavStaticAttribute}>
    <div class="page">
      ${headerHtml}
      <nav class="top-nav" aria-label="Category navigation">${topNavHtml}</nav>
      <main class="layout-main">
        <aside class="left-nav" aria-label="Left navigation">
          <div id="left-nav-content">${leftNavHtml}</div>
        </aside>
        <section class="center-column">
          ${calcContent}
        </section>
        <section class="ads-column" aria-label="Ad placeholders">
${adPanelHtml}
        </section>
      </main>
      ${footerHtml}
    </div>
    <script type="module" src="/assets/js/core/mpa-nav.js"></script>${calculatorScript}
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

  const title = ensureLength('All Calculators | Calculate How Much', 50, 60);
  const description = ensureLength(
    'Browse every calculator on Calculate How Much, organized by category with direct links to launch each tool and explore related finance or math topics.',
    150,
    160
  );
  const adsenseHeadScript = renderManagedHeadAdsenseBlock();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="${description}"
    />
    <link rel="canonical" href="${buildCanonical('/calculators/')}" />
    <meta name="robots" content="index,follow" />
    <link rel="stylesheet" href="/assets/css/theme-premium-dark.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/layout.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/calculator.css?v=${CSS_VERSION}" />
${adsenseHeadScript}    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
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
            ${sections}
          </div>
        </section>
      </main>
    </div>
  </body>
</html>`;
}

function buildGtepFooter() {
  return `<footer class="gtep-footer">\n  <a href="/privacy/">Privacy</a>\n  <span class="footer-divider">|</span>\n  <a href="/terms-and-conditions/">Terms &amp; Conditions</a>\n  <span class="footer-divider">|</span>\n  <a href="/contact-us/">Contact</a>\n  <span class="footer-divider">|</span>\n  <a href="/faqs/">FAQs</a>\n  <span class="footer-divider">|</span>\n  <a href="/sitemap/">Sitemap</a>\n  <span class="footer-divider">|</span>\n  <span class="footer-branding">&copy; 2026 @CalcHowMuch</span>\n</footer>`;
}

function buildGtepPage({ title, description, canonical, bodyHtml }) {
  const adsenseHeadScript = renderManagedHeadAdsenseBlock();
  return `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <title>${title}</title>\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <meta name="description" content="${description}" />\n    <link rel="canonical" href="${canonical}" />\n    <meta name="robots" content="index,follow" />\n    <link rel="stylesheet" href="/assets/css/theme-premium-dark.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/gtep.css?v=${GTEP_CSS_VERSION}" />\n${adsenseHeadScript}    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->\n  </head>\n  <body class="gtep-body">\n    <div class="gtep-page">\n      <header class="gtep-header">\n        <span class="gtep-header-title">Calculate How Much</span>\n      </header>\n      <main class="gtep-main">\n        <div class="gtep-content">\n          ${bodyHtml}\n        </div>\n      </main>\n      ${buildGtepFooter()}\n    </div>\n  </body>\n</html>`;
}

function buildGtepSitemap(categories) {
  const sitePages = `
          <section>
            <h2>Site Pages</h2>
            <ul>
              <li><a href="/privacy/">Privacy</a></li>
              <li><a href="/terms-and-conditions/">Terms &amp; Conditions</a></li>
              <li><a href="/contact-us/">Contact</a></li>
              <li><a href="/faqs/">FAQs</a></li>
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
    canonical: buildCanonical('/sitemap/'),
    bodyHtml,
  });
}

function buildSitemapXml(categories) {
  const staticUrls = [
    { path: '/sitemap/', changefreq: 'monthly', priority: '0.4' },
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
    { path: '/faqs/', lastmod: '2026-02-09', changefreq: 'monthly', priority: '0.40' },
  ];
  const urls = [];
  categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.calculators.forEach((calculator) => {
        urls.push(calculator.url);
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
    <loc>https://calchowmuch.com${url.endsWith('/') ? url : `${url}/`}</loc>
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
  const navigation = JSON.parse(readFile(NAV_PATH));
  const calculatorDirs = findCalculatorDirs(CALC_DIR);
  buildFinanceRouteBundles();
  const routeBundleManifest = readRouteBundleManifest();

  const calcLookup = new Map();
  navigation.categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.calculators.forEach((calculator) => {
        const relPath = calculatorDirs.get(calculator.id);
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
        calculator.url = `/${relPath}`;
        calcLookup.set(calculator.id, { category, subcategory, calculator, governance });
      });
    });
  });

  writeFile(NAV_PATH, JSON.stringify(navigation, null, 2) + '\n');

  const headerHtml = readFile(HEADER_PATH);
  const footerHtml = readFile(FOOTER_PATH);

  // Pages with manual performance optimizations — do not overwrite during generation
  const MANUAL_PAGES = new Set(['loans/home-loan']);

  navigation.categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.calculators.forEach((calculator) => {
        const relPath = calculatorDirs.get(calculator.id);
        if (MANUAL_PAGES.has(relPath)) {
          console.log(`  SKIP (manual): ${relPath}`);
          return;
        }
        const fragmentDir = path.join(CALC_DIR, relPath);
        const override = CALCULATOR_OVERRIDES[calculator.id];
        const governance = resolveCalculatorGovernance({
          category,
          subcategory,
          calculator,
          override,
        });
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
        const pageTitle = override?.title ?? buildTitle(calculator.name);
        const pageDescription = override?.description ?? buildDescription(calculator.name);
        const pageCanonical = buildCanonical(calculator.url);
        const routeBundleEntry = ROUTE_BUNDLE_PILOT_IDS.has(calculator.id)
          ? resolveRouteBundleEntry(routeBundleManifest, calculator.url)
          : null;
        let cssBundleConfig = null;
        const topNavStatic = ROUTE_BUNDLE_PILOT_IDS.has(calculator.id);

        if (ROUTE_BUNDLE_PILOT_IDS.has(calculator.id) && !routeBundleEntry) {
          throw new Error(`Missing route CSS bundle entry for ${calculator.id} (${calculator.url})`);
        }

        if (routeBundleEntry) {
          const deferredHref = routeBundleEntry.deferredHref || routeBundleEntry.href;
          const criticalCssHref = routeBundleEntry.criticalCss;
          if (!deferredHref || typeof deferredHref !== 'string') {
            throw new Error(
              `Missing route bundle deferredHref for ${calculator.id} (${calculator.url})`
            );
          }
          if (!criticalCssHref || typeof criticalCssHref !== 'string') {
            throw new Error(
              `Missing route bundle criticalCss for ${calculator.id} (${calculator.url})`
            );
          }

          const criticalCssPath = path.join(PUBLIC_DIR, criticalCssHref.replace(/^\//, ''));
          if (!fs.existsSync(criticalCssPath)) {
            throw new Error(
              `Missing critical CSS artifact for ${calculator.id}: ${criticalCssPath}`
            );
          }

          cssBundleConfig = {
            deferredHref,
            criticalCss: readFile(criticalCssPath).trim(),
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
          explanationHeading: Object.prototype.hasOwnProperty.call(
            override ?? {},
            'explanationHeading'
          )
            ? override.explanationHeading
            : 'Explanation',
          paneLayout: governance.paneLayout,
          routeArchetype: governance.routeArchetype,
          designFamily: governance.designFamily,
          includeHomeContent: false,
          pageType: 'calculator',
          calculatorRelPath: governance.routeArchetype === 'content_shell' ? null : relPath,
          cssBundleConfig,
          topNavStatic,
          staticStructuredData,
          injectStaticStructuredData,
        });

        const outputDir = path.join(PUBLIC_DIR, relPath);
        writeFile(path.join(outputDir, 'index.html'), pageHtml);
      });
    });
  });

  const homeTopNav = buildTopNavHtml(navigation.categories, null, null);
  const homeLeftNav = buildLeftNavHtml(navigation.categories, null, null, null, calcLookup, 'home');

  const homeHtml = buildPageHtml({
    title: ensureLength('Calculate How Much | Free Online Calculators', 50, 60),
    description: ensureLength(
      'Browse free online calculators for math, finance, and time. Calculate How Much offers clear inputs, helpful explanations, and fast results to support everyday planning.',
      150,
      160
    ),
    canonical: buildCanonical('/'),
    headerHtml,
    footerHtml,
    topNavHtml: homeTopNav,
    leftNavHtml: homeLeftNav,
    calculatorTitle: '',
    calculatorHtml: '',
    explanationHtml: '',
    contentHtml: '',
    routeArchetype: 'content_shell',
    designFamily: 'neutral',
    paneLayout: 'single',
    includeHomeContent: true,
    pageType: 'home',
  });

  writeFile(path.join(PUBLIC_DIR, 'index.html'), homeHtml);
  writeFile(
    path.join(PUBLIC_DIR, 'calculators', 'index.html'),
    buildCalculatorIndex(navigation.categories)
  );
  writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemapXml(navigation.categories));
  writeFile(
    path.join(PUBLIC_DIR, 'sitemap', 'index.html'),
    buildGtepSitemap(navigation.categories)
  );
  syncAdsenseAcrossPublicHtml();
}

main();
