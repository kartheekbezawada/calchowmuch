import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const NAVIGATION_PATH = path.join(PUBLIC_DIR, 'config', 'navigation.json');

// Base URLs that should always be present
const STATIC_URLS = [
    { loc: 'https://calchowmuch.com/', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://calchowmuch.com/calculators/', changefreq: 'monthly', priority: '0.85' },
    { loc: 'https://calchowmuch.com/pricing-calculators/', changefreq: 'monthly', priority: '0.75' },
    { loc: 'https://calchowmuch.com/sitemap.xml', changefreq: 'monthly', priority: '0.4' },
    { loc: 'https://calchowmuch.com/privacy/', changefreq: 'monthly', priority: '0.4' },
    { loc: 'https://calchowmuch.com/terms-and-conditions/', changefreq: 'yearly', priority: '0.30', lastmod: '2026-02-09' },
    { loc: 'https://calchowmuch.com/contact-us/', changefreq: 'yearly', priority: '0.30', lastmod: '2026-02-09' },
    { loc: 'https://calchowmuch.com/faq/', changefreq: 'monthly', priority: '0.40', lastmod: '2026-02-09' },
];

function normalizeRoutePath(route) {
    if (typeof route !== 'string') return null;
    const trimmed = route.trim();
    if (!trimmed.startsWith('/')) return null;
    if (trimmed === '/') return '/';
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
}

function getCalculatorsFromNavigation() {
    const navigation = JSON.parse(fs.readFileSync(NAVIGATION_PATH, 'utf8'));
    const categories = Array.isArray(navigation?.categories) ? navigation.categories : [];
    const calculators = [];
    const seen = new Set();

    for (const category of categories) {
        const subcategories = Array.isArray(category?.subcategories) ? category.subcategories : [];
        for (const subcategory of subcategories) {
            const categoryCalculators = Array.isArray(subcategory?.calculators)
                ? subcategory.calculators
                : [];
            for (const calculator of categoryCalculators) {
                const routePath = normalizeRoutePath(calculator?.url);
                if (!routePath || seen.has(routePath)) {
                    continue;
                }
                seen.add(routePath);
                calculators.push({
                    loc: `https://calchowmuch.com${routePath}`,
                    changefreq: 'monthly',
                    priority: '0.7',
                });
            }
        }
    }

    return calculators;
}

function generateSitemap() {
    const calculators = getCalculatorsFromNavigation();
    const allUrls = [...STATIC_URLS, ...calculators];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const url of allUrls) {
        xml += '  <url>\n';
        xml += `    <loc>${url.loc}</loc>\n`;
        if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += '  </url>\n';
    }

    xml += '</urlset>';

    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log(`Sitemap generated with ${allUrls.length} URLs at ${SITEMAP_PATH}`);
}

generateSitemap();
