import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Base URLs that should always be present
const STATIC_URLS = [
    { loc: 'https://calchowmuch.com/', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://calchowmuch.com/calculators/', changefreq: 'monthly', priority: '0.85' },
    { loc: 'https://calchowmuch.com/sitemap/', changefreq: 'monthly', priority: '0.4' },
    { loc: 'https://calchowmuch.com/privacy/', changefreq: 'monthly', priority: '0.4' },
    { loc: 'https://calchowmuch.com/privacy-policy/', changefreq: 'yearly', priority: '0.30', lastmod: '2026-02-09' },
    { loc: 'https://calchowmuch.com/terms-and-conditions/', changefreq: 'yearly', priority: '0.30', lastmod: '2026-02-09' },
    { loc: 'https://calchowmuch.com/contact-us/', changefreq: 'yearly', priority: '0.30', lastmod: '2026-02-09' },
    { loc: 'https://calchowmuch.com/faqs/', changefreq: 'monthly', priority: '0.40', lastmod: '2026-02-09' },
];

const EXCLUDED_DIRS = ['assets', 'config', 'layout', 'test'];

function getCalculators() {
    const calculators = [];
    const categories = fs.readdirSync(path.join(PUBLIC_DIR, 'calculators'), { withFileTypes: true });

    for (const category of categories) {
        if (!category.isDirectory() || EXCLUDED_DIRS.includes(category.name)) continue;

        const categoryPath = path.join(PUBLIC_DIR, 'calculators', category.name);
        const subdirs = fs.readdirSync(categoryPath, { withFileTypes: true });

        for (const subdir of subdirs) {
            if (subdir.isDirectory()) {
                calculators.push({
                    loc: `https://calchowmuch.com/${category.name}/${subdir.name}/`,
                    changefreq: 'monthly',
                    priority: '0.7'
                });
            }
        }
    }
    return calculators;
}

function generateSitemap() {
    const calculators = getCalculators();
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
