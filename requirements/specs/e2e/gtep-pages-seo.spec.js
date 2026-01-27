import { expect, test } from '@playwright/test';

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

const pages = [
  {
    name: 'Sitemap',
    path: '/sitemap/',
    title: ensureLength('Sitemap | Calculate How Much', 50, 60),
    description: ensureLength(
      'Browse the full list of calculators on Calculate How Much, organized by category.',
      150,
      160
    ),
    canonical: 'https://calchowmuch.com/sitemap/',
    h1: 'Sitemap',
  },
  {
    name: 'Privacy',
    path: '/privacy/',
    title: 'Privacy Policy | Calculate How Much - Data & Cookies',
    description:
      'Learn how Calculate How Much handles analytics, cookies, and data privacy when you use our calculators and informational pages, plus how to manage preferences.',
    canonical: 'https://calchowmuch.com/privacy/',
    h1: 'Privacy Policy',
  },
  {
    name: 'Terms',
    path: '/terms/',
    title: 'Terms & Conditions | Calculate How Much - Usage & Liability',
    description:
      'Review the terms and conditions for using Calculate How Much calculators, including accuracy limitations, permitted use, updates, and content ownership.',
    canonical: 'https://calchowmuch.com/terms/',
    h1: 'Terms & Conditions',
  },
  {
    name: 'Contact',
    path: '/contact/',
    title: 'Contact | Calculate How Much - Feedback and Support',
    description:
      'Reach the Calculate How Much team for feedback, questions, or support. Learn how to get in touch without sharing personal email addresses or mailto links.',
    canonical: 'https://calchowmuch.com/contact/',
    h1: 'Contact',
  },
  {
    name: 'FAQs',
    path: '/faqs/',
    title: 'FAQs | Calculate How Much - Calculator Help and Answers',
    description:
      'Find answers about how Calculate How Much calculators work, data assumptions, accuracy, and when to verify results with professionals for important decisions.',
    canonical: 'https://calchowmuch.com/faqs/',
    h1: 'FAQs',
  },
];

pages.forEach(({ name, path, title, description, canonical, h1 }) => {
  test(`${name} page metadata`, async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveTitle(title);

    const descriptionTag = page.locator('meta[name="description"]');
    await expect(descriptionTag).toHaveCount(1);
    await expect(descriptionTag).toHaveAttribute('content', description);

    const canonicalTag = page.locator('link[rel="canonical"]');
    await expect(canonicalTag).toHaveCount(1);
    await expect(canonicalTag).toHaveAttribute('href', canonical);

    const h1Tag = page.locator('h1');
    await expect(h1Tag).toHaveCount(1);
    await expect(h1Tag).toHaveText(h1);
  });
});

