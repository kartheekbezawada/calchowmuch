import { afterEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

function setupDom(pathname) {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: `https://calchowmuch.com${pathname}`,
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLInputElement = dom.window.HTMLInputElement;
}

afterEach(() => {
  delete global.window;
  delete global.document;
  delete global.HTMLInputElement;
});

describe('UI schema guard for FAQPage injection', () => {
  it('does not require FAQPage when no FAQ schema flag is enabled', async () => {
    setupDom('/finance-calculators/simple-interest-calculator/');
    const { setPageMetadata } = await import('../../../public/assets/js/core/ui.js');

    setPageMetadata({
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [{ '@type': 'WebPage', name: 'Simple Interest Calculator' }],
      },
      pageSchema: {
        calculatorFAQ: false,
        globalFAQ: false,
      },
    });

    const script = document.head.querySelector('script[data-calculator-ld]');
    expect(script).not.toBeNull();
    const parsed = JSON.parse(script.textContent);
    const faqNodes = parsed['@graph'].filter((node) => node['@type'] === 'FAQPage');
    expect(faqNodes).toHaveLength(0);
  });

  it('injects calculator FAQ schema on calculator routes', async () => {
    setupDom('/finance-calculators/simple-interest-calculator/');
    const { setPageMetadata } = await import('../../../public/assets/js/core/ui.js');

    setPageMetadata({
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [{ '@type': 'WebPage', name: 'Simple Interest Calculator' }],
      },
      pageSchema: {
        calculatorFAQ: true,
        globalFAQ: false,
      },
      calculatorFAQSchema: {
        '@type': 'FAQPage',
        mainEntity: [],
      },
    });

    const script = document.head.querySelector('script[data-calculator-ld]');
    expect(script).not.toBeNull();
    const parsed = JSON.parse(script.textContent);
    const faqNodes = parsed['@graph'].filter((node) => node['@type'] === 'FAQPage');
    expect(faqNodes).toHaveLength(1);
  });

  it('rejects global FAQ schema on non-FAQ routes', async () => {
    setupDom('/finance-calculators/simple-interest-calculator/');
    const { setPageMetadata } = await import('../../../public/assets/js/core/ui.js');

    expect(() =>
      setPageMetadata({
        structuredData: { '@context': 'https://schema.org', '@type': 'WebPage' },
        pageSchema: {
          calculatorFAQ: false,
          globalFAQ: true,
        },
        globalFAQSchema: {
          '@type': 'FAQPage',
          mainEntity: [],
        },
      })
    ).toThrow(/globalFAQ is true on non-FAQ path/);
  });

  it('allows global FAQ schema on /faq/', async () => {
    setupDom('/faq/');
    const { setPageMetadata } = await import('../../../public/assets/js/core/ui.js');

    setPageMetadata({
      structuredData: { '@context': 'https://schema.org', '@type': 'WebPage' },
      pageSchema: {
        calculatorFAQ: false,
        globalFAQ: true,
      },
      globalFAQSchema: {
        '@type': 'FAQPage',
        mainEntity: [],
      },
    });

    const script = document.head.querySelector('script[data-calculator-ld]');
    expect(script).not.toBeNull();
    const parsed = JSON.parse(script.textContent);
    const faqCount = parsed['@graph'].filter((node) => node['@type'] === 'FAQPage').length;
    expect(faqCount).toBe(1);
  });

  it('rejects duplicate FAQPage schema on a single URL', async () => {
    setupDom('/finance-calculators/simple-interest-calculator/');
    const { setPageMetadata } = await import('../../../public/assets/js/core/ui.js');

    expect(() =>
      setPageMetadata({
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [{ '@type': 'FAQPage', mainEntity: [] }],
        },
        pageSchema: {
          calculatorFAQ: true,
          globalFAQ: false,
        },
        calculatorFAQSchema: {
          '@type': 'FAQPage',
          mainEntity: [],
        },
      })
    ).toThrow(/found 2 FAQPage schemas/);
  });

  it('rejects duplicate BreadcrumbList schema on a single URL', async () => {
    setupDom('/finance-calculators/simple-interest-calculator/');
    const { setPageMetadata } = await import('../../../public/assets/js/core/ui.js');

    expect(() =>
      setPageMetadata({
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [{ '@type': 'BreadcrumbList' }, { '@type': 'BreadcrumbList' }],
        },
      })
    ).toThrow(/BreadcrumbList/);
  });

  it('rejects duplicate SoftwareApplication schema on a single URL', async () => {
    setupDom('/finance-calculators/simple-interest-calculator/');
    const { setPageMetadata } = await import('../../../public/assets/js/core/ui.js');

    expect(() =>
      setPageMetadata({
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'SoftwareApplication', name: 'A' },
            { '@type': 'SoftwareApplication', name: 'B' },
          ],
        },
      })
    ).toThrow(/SoftwareApplication/);
  });
});
