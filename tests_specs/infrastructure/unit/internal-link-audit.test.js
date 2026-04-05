import { describe, expect, it } from 'vitest';
import {
  buildInternalLinkAudit,
  getClusterFamilyLabel,
  normalizeInternalHref,
  normalizePathnameToRoute,
  shouldAuditRoute,
} from '../../../scripts/audit-internal-links.mjs';

describe('internal link audit path normalization', () => {
  it('normalizes pathnames into canonical route format', () => {
    expect(normalizePathnameToRoute('/percentage-calculators/percent-change-calculator')).toBe(
      '/percentage-calculators/percent-change-calculator/'
    );
    expect(normalizePathnameToRoute('/percentage-calculators/percent-change-calculator/index.html')).toBe(
      '/percentage-calculators/percent-change-calculator/'
    );
    expect(normalizePathnameToRoute('/faq/index.html')).toBe('/faq/');
    expect(normalizePathnameToRoute('/assets/app.css')).toBeNull();
  });

  it('normalizes internal href values and rejects external or asset targets', () => {
    expect(
      normalizeInternalHref(
        'https://calchowmuch.com/percentage-calculators/percent-change-calculator/?source=test#top'
      )
    ).toBe('/percentage-calculators/percent-change-calculator/');
    expect(normalizeInternalHref('/math/basic/index.html')).toBe('/math/basic/');
    expect(normalizeInternalHref('#faq')).toBeNull();
    expect(normalizeInternalHref('mailto:test@example.com')).toBeNull();
    expect(normalizeInternalHref('https://example.com/finance-calculators/future-value-calculator/')).toBeNull();
    expect(normalizeInternalHref('/assets/css/app.css')).toBeNull();
  });
});

describe('internal link audit route filtering', () => {
  it('excludes root, gtep, and content shell routes from the audit set', () => {
    expect(shouldAuditRoute({ route: '/', routeArchetype: 'calc_exp' })).toBe(false);
    expect(shouldAuditRoute({ route: '/faq/', routeArchetype: 'content_shell' })).toBe(false);
    expect(shouldAuditRoute({ route: '/salary-calculators/', routeArchetype: 'content_shell' })).toBe(false);
    expect(
      shouldAuditRoute({
        route: '/percentage-calculators/percentage-composition-calculator/',
        routeArchetype: 'calc_exp',
      })
    ).toBe(true);
  });

  it('rolls home-loan and auto-loans into the shared Loans family', () => {
    expect(getClusterFamilyLabel('home-loan', 'Home Loan')).toBe('Loans');
    expect(getClusterFamilyLabel('auto-loans', 'Auto Loans')).toBe('Loans');
    expect(getClusterFamilyLabel('percentage', 'Percentage Calculators')).toBe('Percentage');
  });
});

describe('internal link audit graph building', () => {
  const routeRows = [
    {
      route: '/percentage-calculators/percent-change-calculator/',
      calculatorId: 'percent-change',
      activeOwnerClusterId: 'percentage',
    },
    {
      route: '/percentage-calculators/percentage-difference-calculator/',
      calculatorId: 'percentage-difference',
      activeOwnerClusterId: 'percentage',
    },
    {
      route: '/percentage-calculators/percentage-increase-calculator/',
      calculatorId: 'percentage-increase',
      activeOwnerClusterId: 'percentage',
    },
    {
      route: '/salary-calculators/',
      calculatorId: 'salary-calculators-hub',
      activeOwnerClusterId: 'salary',
    },
  ];

  const pageCatalog = new Map([
    [
      '/percentage-calculators/percent-change-calculator/',
      {
        name: 'Percent Change',
        routeArchetype: 'calc_exp',
        sourceFile: 'public/percentage-calculators/percent-change-calculator/index.html',
        links: [
          { href: '/percentage-calculators/percentage-difference-calculator/', text: 'Difference' },
          { href: '/percentage-calculators/percent-change-calculator/', text: 'Percent Change' },
          { href: '/calculators/percentage-calculators/percentage-finder-calculator/', text: 'Legacy finder' },
        ],
      },
    ],
    [
      '/percentage-calculators/percentage-difference-calculator/',
      {
        name: 'Percentage Difference',
        routeArchetype: 'calc_exp',
        sourceFile: 'public/percentage-calculators/percentage-difference-calculator/index.html',
        links: [{ href: '/percentage-calculators/percent-change-calculator/', text: 'Percent Change' }],
      },
    ],
    [
      '/percentage-calculators/percentage-increase-calculator/',
      {
        name: 'Percentage Increase',
        routeArchetype: 'calc_exp',
        sourceFile: 'public/percentage-calculators/percentage-increase-calculator/index.html',
        links: [],
      },
    ],
    [
      '/salary-calculators/',
      {
        name: 'Salary Calculators',
        routeArchetype: 'content_shell',
        sourceFile: 'public/salary-calculators/index.html',
        links: [{ href: '/percentage-calculators/percent-change-calculator/', text: 'Percent Change' }],
      },
    ],
  ]);

  const clusterLookup = new Map([
    ['percentage', { clusterId: 'percentage', displayName: 'Percentage Calculators' }],
    ['salary', { clusterId: 'salary', displayName: 'Salary Calculators' }],
  ]);

  it('builds canonical nodes, excludes content-shell hubs, and tracks orphans', () => {
    const audit = buildInternalLinkAudit({ routeRows, pageCatalog, clusterLookup });

    expect(audit.nodes.map((node) => node.route)).toEqual([
      '/percentage-calculators/percent-change-calculator/',
      '/percentage-calculators/percentage-difference-calculator/',
      '/percentage-calculators/percentage-increase-calculator/',
    ]);

    expect(audit.excludedRoutes).toEqual([
      { route: '/salary-calculators/', reason: 'content_shell' },
    ]);

    const orphanRoutes = audit.orphanRoutes.map((node) => node.route);
    expect(orphanRoutes).toEqual(['/percentage-calculators/percentage-increase-calculator/']);
  });

  it('computes same-cluster coverage from peer routes and ignores self-links', () => {
    const audit = buildInternalLinkAudit({ routeRows, pageCatalog, clusterLookup });
    const percentChange = audit.nodes.find(
      (node) => node.route === '/percentage-calculators/percent-change-calculator/'
    );

    expect(percentChange.sameClusterExpectedCount).toBe(2);
    expect(percentChange.sameClusterLinkedCount).toBe(1);
    expect(percentChange.sameClusterCoveragePct).toBe(50);
    expect(percentChange.missingSameClusterRoutes).toEqual([
      '/percentage-calculators/percentage-increase-calculator/',
    ]);
  });

  it('keeps shadow routes out of the main graph and records them separately', () => {
    const audit = buildInternalLinkAudit({ routeRows, pageCatalog, clusterLookup });

    expect(audit.edges).toEqual([
      expect.objectContaining({
        sourceRoute: '/percentage-calculators/percent-change-calculator/',
        targetRoute: '/percentage-calculators/percentage-difference-calculator/',
      }),
      expect.objectContaining({
        sourceRoute: '/percentage-calculators/percentage-difference-calculator/',
        targetRoute: '/percentage-calculators/percent-change-calculator/',
      }),
    ]);

    expect(audit.shadowRouteTargets).toEqual([
      expect.objectContaining({
        sourceRoute: '/percentage-calculators/percent-change-calculator/',
        targetRoute: '/calculators/percentage-calculators/percentage-finder-calculator/',
        count: 1,
      }),
    ]);
  });
});
