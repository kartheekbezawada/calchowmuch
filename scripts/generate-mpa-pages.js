import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CALC_DIR = path.join(PUBLIC_DIR, 'calculators');
const NAV_PATH = path.join(PUBLIC_DIR, 'config', 'navigation.json');
const HEADER_PATH = path.join(PUBLIC_DIR, 'layout', 'header.html');
const FOOTER_PATH = path.join(PUBLIC_DIR, 'layout', 'footer.html');

const CSS_VERSION = '20260125';
const SITE_URL = 'https://calchowmuch.com';

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

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function findCalculatorDirs(rootDir) {
  const map = new Map();
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    let hasIndex = false;
    let hasModule = false;
    for (const entry of entries) {
      if (entry.isFile()) {
        if (entry.name === 'index.html') hasIndex = true;
        if (entry.name === 'module.js') hasModule = true;
      }
    }
    if (hasIndex && hasModule) {
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
  log:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
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
          icon: category.icon,
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
  const activeId =
    activeCategoryId === 'loans' ? `loans:${activeSubcategoryId}` : activeCategoryId;

  return items
    .map((item) => {
      const icon = item.icon
        ? `<span class="nav-icon" aria-hidden="true">${item.icon}</span>`
        : '';
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

function buildLeftNavHtml(categories, activeCategoryId, activeSubcategoryId, activeCalculatorId, calcLookup, mode) {
  if (!activeCategoryId && mode === 'home') {
    const sections = categories
      .map((category) => {
        const items = category.subcategories
          .map((subcategory) => {
            const calculators = subcategory.calculators
              .map((calculator) => `<a class="nav-item" href="${calculator.url}">${calculator.name}</a>`)
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
  includeHomeContent,
}) {
  const calcContent = includeHomeContent
    ? `<div class="panel panel-scroll">
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
</div>`
    : `<div class="panel panel-scroll">
  <h1 id="calculator-title">${calculatorTitle}</h1>
  ${calculatorHtml}
</div>
<div class="panel panel-scroll">
  <h3>Explanation</h3>
  ${explanationHtml}
</div>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/layout.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/calculator.css?v=${CSS_VERSION}" />
  </head>
  <body>
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
          <div class="ad-panel">Ad Pane</div>
        </section>
      </main>
      ${footerHtml}
    </div>
    <script type="module" src="/assets/js/core/mpa-nav.js"></script>
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
    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/layout.css?v=${CSS_VERSION}" />
    <link rel="stylesheet" href="/assets/css/calculator.css?v=${CSS_VERSION}" />
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

function buildSitemapXml(categories) {
  const urls = [];
  categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.calculators.forEach((calculator) => {
        urls.push(calculator.url);
      });
    });
  });

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
${urlItems}
</urlset>`;
}

function main() {
  const navigation = JSON.parse(readFile(NAV_PATH));
  const calculatorDirs = findCalculatorDirs(CALC_DIR);

  const calcLookup = new Map();
  navigation.categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.calculators.forEach((calculator) => {
        const relPath = calculatorDirs.get(calculator.id);
        if (!relPath) {
          throw new Error(`Unable to locate calculator folder for ${calculator.id}`);
        }
        calculator.url = `/${relPath}`;
        calcLookup.set(calculator.id, { category, subcategory, calculator });
      });
    });
  });

  writeFile(NAV_PATH, JSON.stringify(navigation, null, 2) + '\n');

  const headerHtml = readFile(HEADER_PATH);
  const footerHtml = readFile(FOOTER_PATH);

  navigation.categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.calculators.forEach((calculator) => {
        const relPath = calculatorDirs.get(calculator.id);
        const fragmentDir = path.join(CALC_DIR, relPath);
        const calculatorHtml = readFile(path.join(fragmentDir, 'index.html'));
        const explanationHtml = readFile(path.join(fragmentDir, 'explanation.html'));
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

        const pageHtml = buildPageHtml({
          title: buildTitle(calculator.name),
          description: buildDescription(calculator.name),
          canonical: buildCanonical(calculator.url),
          headerHtml,
          footerHtml,
          topNavHtml,
          leftNavHtml,
          calculatorTitle: calculator.name,
          calculatorHtml,
          explanationHtml,
          includeHomeContent: false,
        });

        const outputDir = path.join(PUBLIC_DIR, relPath);
        writeFile(path.join(outputDir, 'index.html'), pageHtml);
      });
    });
  });

  const homeTopNav = buildTopNavHtml(navigation.categories, null, null);
  const homeLeftNav = buildLeftNavHtml(
    navigation.categories,
    null,
    null,
    null,
    calcLookup,
    'home'
  );

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
    includeHomeContent: true,
  });

  writeFile(path.join(PUBLIC_DIR, 'index.html'), homeHtml);
  writeFile(path.join(PUBLIC_DIR, 'calculators', 'index.html'), buildCalculatorIndex(navigation.categories));
  writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemapXml(navigation.categories));
}

main();
