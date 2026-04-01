const NAVIGATION_CONFIG_URL = '/config/navigation.json';
const CLUSTER_REGISTRY_URL = '/config/clusters/cluster-registry.json';
const MIN_CALCULATORS_PER_CARD = 3;
const MAX_CALCULATORS_PER_CARD = 4;
const MOBILE_MEDIA_QUERY = '(max-width: 760px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const MOBILE_PLACEHOLDER_CARD_COUNT = 7;
const DESKTOP_PLACEHOLDER_CARD_COUNT = 8;
const EXPANDED_RESULTS_ANIMATION_MS = 420;

const ROUTE_PREFIX_ALIASES = {
  '/finance/': ['/finance-calculators/'],
};

const CLUSTER_THEME = {
  math: { icon: '∑', accent: '#22d3ee' },
  'home-loan': { icon: '⌂', accent: '#c084fc' },
  'credit-cards': { icon: '💳', accent: '#f97316', flare: '#fb923c', warm: true },
  'auto-loans': { icon: '🚗', accent: '#60a5fa' },
  finance: { icon: '$', accent: '#f59e0b', flare: '#fb923c', warm: true },
  'time-and-date': { icon: '🕒', accent: '#818cf8' },
  percentage: { icon: '%', accent: '#34d399' },
  default: { icon: '*', accent: '#60a5fa' },
};

const CLUSTER_CARD_ROUTE_POLICY = {
  finance: {
    preferredRouteIds: [
      'inflation',
      'compound-interest',
      'investment-return',
      'time-to-savings-goal',
    ],
    exploreRouteId: 'inflation',
  },
  'home-loan': {
    hiddenRouteIds: ['home-loan'],
    preferredRouteIds: [
      'how-much-can-i-borrow',
      'loan-to-value',
      'personal-loan',
      'interest-rate-change-calculator',
    ],
    exploreRouteId: 'how-much-can-i-borrow',
  },
};

const gridNode = document.getElementById('homepage-grid') || document.getElementById('homepage-preview-grid');
const searchNode = document.getElementById('homepage-search') || document.getElementById('homepage-preview-search');
const searchButtonNode = document.querySelector('.search button');
const searchSuggestionsNode = document.getElementById('homepage-search-suggestions');
const emptyNode = document.getElementById('homepage-empty') || document.getElementById('homepage-preview-empty');
const categoriesNode =
  document.querySelector('.categories') || document.getElementById('homepage-categories');
let homepageClusters = [];
let currentSuggestions = [];
let activeSuggestionIndex = -1;
let expandedResultsQuery = '';
let expandedClusterId = '';
let expandedResultsAnimationTimeout = 0;

function isMobileViewport() {
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

function shouldDisableParticles() {
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  const saveData = navigator.connection?.saveData === true;
  return reducedMotion || isMobileViewport() || saveData;
}

function setLoadingState(isLoading, placeholderCount = 0) {
  if (!categoriesNode) {
    return;
  }

  if (!isLoading) {
    categoriesNode.removeAttribute('data-loading');
    categoriesNode.style.removeProperty('--loading-card-count');
    return;
  }

  categoriesNode.setAttribute('data-loading', 'true');
  categoriesNode.style.setProperty('--loading-card-count', String(Math.max(1, placeholderCount)));
}

function syncExpandedResultsState(normalizedQuery = '') {
  if (!categoriesNode) {
    return;
  }

  if (expandedResultsQuery && expandedResultsQuery === normalizedQuery) {
    categoriesNode.dataset.resultsMode = 'expanded';
    categoriesNode.dataset.expandedQuery = expandedResultsQuery;
    return;
  }

  delete categoriesNode.dataset.resultsMode;
  delete categoriesNode.dataset.expandedQuery;
}

function isExpandedResultsActive(normalizedQuery = '') {
  return Boolean(expandedResultsQuery && expandedResultsQuery === normalizedQuery);
}

function triggerExpandedResultsAnimation() {
  if (!gridNode || !categoriesNode) {
    return;
  }

  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    return;
  }

  clearTimeout(expandedResultsAnimationTimeout);
  delete gridNode.dataset.expandMotion;
  void gridNode.offsetWidth;
  gridNode.dataset.expandMotion = 'on';
  categoriesNode.dataset.resultsMode = 'expanded';

  expandedResultsAnimationTimeout = window.setTimeout(() => {
    delete gridNode.dataset.expandMotion;
  }, EXPANDED_RESULTS_ANIMATION_MS);
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeQuery(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function getQueryTokens(value) {
  return normalizeQuery(value)
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);
}

function matchesSearch(searchable, query) {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    return true;
  }

  const normalizedSearchable = normalizeQuery(searchable);
  if (normalizedSearchable.includes(normalizedQuery)) {
    return true;
  }

  const queryTokens = getQueryTokens(normalizedQuery);
  return queryTokens.length > 1 && queryTokens.every((token) => normalizedSearchable.includes(token));
}

function normalizeRoute(route) {
  if (typeof route !== 'string' || !route.trim()) {
    return null;
  }
  let normalized = route.trim();
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  normalized = normalized.replace(/\/+/g, '/');
  if (normalized !== '/' && !normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

function tokenizeWords(value) {
  const stopWords = new Set([
    'and',
    'for',
    'the',
    'with',
    'of',
    'to',
    'calculator',
    'calculators',
    'calc',
    'suite',
    'cluster',
  ]);

  return normalizeQuery(value)
    .split(/[^a-z0-9]+/g)
    .filter((word) => word.length > 1 && !stopWords.has(word));
}

function humanizeRoute(route) {
  const normalized = normalizeRoute(route);
  if (!normalized) {
    return 'Open Route';
  }
  if (normalized === '/') {
    return 'Home';
  }

  const segments = normalized.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  const slug = segments[segments.length - 1] || segments[0] || 'route';
  return slug
    .replace(/-calculator$/i, '')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildPrefixVariants(prefix) {
  const normalizedPrefix = normalizeRoute(prefix);
  if (!normalizedPrefix) {
    return [];
  }

  const variants = new Set([normalizedPrefix]);
  toArray(ROUTE_PREFIX_ALIASES[normalizedPrefix]).forEach((alias) => {
    const normalizedAlias = normalizeRoute(alias);
    if (normalizedAlias) {
      variants.add(normalizedAlias);
    }
  });
  return Array.from(variants);
}

function chooseEntryPointRoutes(routes, clusterName) {
  if (routes.length <= MAX_CALCULATORS_PER_CARD) {
    return routes;
  }

  const clusterWords = tokenizeWords(clusterName);
  const scored = routes.map((route, index) => {
    const searchable = `${route.name} ${route.url}`;
    const routeWords = new Set(tokenizeWords(searchable));
    let score = 0;

    clusterWords.forEach((word) => {
      if (routeWords.has(word)) {
        score += 3;
      }
      if (normalizeQuery(route.name).includes(word)) {
        score += 2;
      }
    });

    return { route, score, index };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.index - b.index;
  });

  const selected = scored.slice(0, MAX_CALCULATORS_PER_CARD).map((item) => item.route);
  if (selected.length >= MIN_CALCULATORS_PER_CARD || routes.length <= MIN_CALCULATORS_PER_CARD) {
    return selected;
  }

  return routes.slice(0, MIN_CALCULATORS_PER_CARD);
}

function applyClusterCardRoutePolicy(clusterId, routes) {
  const policy = CLUSTER_CARD_ROUTE_POLICY[clusterId];
  if (!policy) {
    return {
      routes,
      exploreRoute: routes[0] || null,
    };
  }

  const hiddenRouteIds = new Set(toArray(policy.hiddenRouteIds));
  const preferredRouteOrder = new Map(
    toArray(policy.preferredRouteIds).map((routeId, index) => [routeId, index])
  );
  const originalIndex = new Map(routes.map((route, index) => [route.url, index]));

  let filteredRoutes = routes.filter((route) => !hiddenRouteIds.has(route.id));
  if (!filteredRoutes.length) {
    filteredRoutes = routes;
  }

  filteredRoutes.sort((left, right) => {
    const leftRank = preferredRouteOrder.has(left.id)
      ? preferredRouteOrder.get(left.id)
      : Number.POSITIVE_INFINITY;
    const rightRank = preferredRouteOrder.has(right.id)
      ? preferredRouteOrder.get(right.id)
      : Number.POSITIVE_INFINITY;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return (originalIndex.get(left.url) || 0) - (originalIndex.get(right.url) || 0);
  });

  const exploreRoute =
    filteredRoutes.find((route) => route.id === policy.exploreRouteId) || filteredRoutes[0] || null;

  return {
    routes: filteredRoutes,
    exploreRoute,
  };
}

function flattenNavigationRoutes(navigation) {
  return toArray(navigation?.categories).flatMap((category) =>
    toArray(category?.subcategories).flatMap((subcategory) =>
      toArray(subcategory?.calculators).flatMap((calculator) => {
        const url = normalizeRoute(calculator?.url);
        if (!url) {
          return [];
        }
        return [
          {
            id: calculator?.id || url,
            name: calculator?.name || humanizeRoute(url),
            url,
            categoryName: category?.name || 'Category',
            subcategoryName: subcategory?.name || 'General',
          },
        ];
      })
    )
  );
}

function resolveClusterRoutes(cluster, allRoutes) {
  const prefixes = toArray(cluster?.routePrefixes)
    .flatMap((prefix) => buildPrefixVariants(prefix))
    .filter(Boolean);

  const routeMap = new Map();
  allRoutes.forEach((route) => {
    const matches = prefixes.some((prefix) => route.url.startsWith(prefix));
    if (matches && !routeMap.has(route.url)) {
      routeMap.set(route.url, {
        id: route.id,
        name: route.name,
        url: route.url,
        categoryName: route.categoryName,
        subcategoryName: route.subcategoryName,
      });
    }
  });

  const matchedRoutes = Array.from(routeMap.values());
  if (matchedRoutes.length) {
    return matchedRoutes;
  }

  return prefixes
    .filter((prefix) => prefix !== '/')
    .map((prefix) => ({
      id: prefix,
      name: humanizeRoute(prefix),
      url: prefix,
    }));
}

function normalizeClusters(registry, navigation) {
  const allRoutes = flattenNavigationRoutes(navigation);
  return toArray(registry?.clusters)
    .filter((cluster) => cluster && cluster.clusterId !== 'homepage' && cluster.showOnHomepage !== false)
    .map((cluster) => {
      const resolvedRoutes = resolveClusterRoutes(cluster, allRoutes);
      const routePolicy = applyClusterCardRoutePolicy(cluster?.clusterId, resolvedRoutes);
      const clusterName = cluster?.displayName || cluster?.clusterId || 'Cluster';
      const annotateRoute = (route) => ({
        ...route,
        searchText: normalizeQuery(
          [clusterName, route.name, route.url, route.categoryName, route.subcategoryName]
            .filter(Boolean)
            .join(' ')
        ),
      });
      const fullRoutes = routePolicy.routes.map(annotateRoute);
      const selectedRoutes = chooseEntryPointRoutes(fullRoutes, clusterName);
      const searchableRoutes = resolvedRoutes.map(annotateRoute);

      return {
        id: cluster?.clusterId || 'unknown',
        name: clusterName,
        routes: selectedRoutes,
        fullRoutes,
        searchableRoutes,
        searchText: normalizeQuery(clusterName),
        totalRoutes: resolvedRoutes.length,
        exploreUrl: routePolicy.exploreRoute?.url || selectedRoutes[0]?.url || '/calculators/',
      };
    })
    .filter((cluster) => cluster.routes.length > 0);
}

function getVisibleClusterCount(registry) {
  return toArray(registry?.clusters).filter(
    (cluster) => cluster && cluster.clusterId !== 'homepage' && cluster.showOnHomepage !== false
  ).length;
}

function getMatchingRoutesForCluster(cluster, query) {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    return cluster.fullRoutes;
  }

  const matchingRoutes = cluster.searchableRoutes.filter((route) =>
    matchesSearch(route.searchText, normalizedQuery)
  );
  if (matchingRoutes.length) {
    return matchingRoutes;
  }

  return matchesSearch(cluster.searchText, normalizedQuery) ? cluster.fullRoutes : [];
}

function getVisibleRouteSet(cluster, query, expandAll = false) {
  const normalizedQuery = normalizeQuery(query);
  const isManuallyExpanded = expandedClusterId === cluster.id;
  const expandedRoutes = getMatchingRoutesForCluster(cluster, normalizedQuery);

  if (!expandedRoutes.length) {
    return {
      visible: false,
      routes: [],
      isExpanded: false,
      isManuallyExpanded: false,
      canToggle: false,
    };
  }

  const collapsedRoutes = normalizedQuery
    ? expandedRoutes.slice(0, MAX_CALCULATORS_PER_CARD)
    : cluster.routes;
  const canExpand = expandedRoutes.length > collapsedRoutes.length;
  const isExpanded = Boolean(expandAll || isManuallyExpanded);

  return {
    visible: true,
    routes: isExpanded ? expandedRoutes : collapsedRoutes,
    isExpanded,
    isManuallyExpanded,
    canToggle: canExpand || isManuallyExpanded,
  };
}

function renderClusterCards(clusters, query = '', expandAll = false) {
  const normalizedQuery = normalizeQuery(query);
  const visibleClusters = clusters
    .map((cluster) => ({
      cluster,
      visibleRouteSet: getVisibleRouteSet(cluster, query, expandAll),
    }))
    .filter(({ visibleRouteSet }) => visibleRouteSet.visible);

  const cardsHtml = visibleClusters
    .map(({ cluster, visibleRouteSet }, index) => {
      const theme = CLUSTER_THEME[cluster.id] || CLUSTER_THEME.default;
      const routeItems = visibleRouteSet.routes
        .map((route) => {
          return `<li data-route-item data-search="${escapeHtml(route.searchText || normalizeQuery(`${route.name} ${route.url}`))}">
            <a class="route-link" data-route-link href="${escapeHtml(route.url)}">
              <span class="route-name">${escapeHtml(route.name)}</span>
            </a>
          </li>`;
        })
        .join('');

      const totalCalculators = Math.max(cluster.totalRoutes, cluster.routes.length);
      const routeListId = `homepage-cluster-routes-${escapeHtml(cluster.id)}`;
      const expandLabel = visibleRouteSet.isManuallyExpanded ? 'Collapse' : 'Explore';
      return `<article
        class="category-card${theme.warm ? ' is-warm' : ''}${visibleRouteSet.isExpanded ? ' is-expanded' : ''}"
        data-cluster-card
        data-cluster-id="${escapeHtml(cluster.id)}"
        data-cluster-name="${escapeHtml(normalizeQuery(cluster.name))}"
        data-total-calculators="${totalCalculators}"
        data-total-routes="${totalCalculators}"
        data-expanded="${visibleRouteSet.isExpanded ? 'true' : 'false'}"
        data-manually-expanded="${visibleRouteSet.isManuallyExpanded ? 'true' : 'false'}"
        style="--card-accent: ${theme.accent}; --card-flare: ${theme.flare || theme.accent}; --float-delay: ${index * 0.3}s"
      >
        <div class="card-head">
          <div class="card-title">
            <span class="card-icon" aria-hidden="true">${escapeHtml(theme.icon)}</span>
            <h3>${escapeHtml(cluster.name)}</h3>
          </div>
          <span class="count-pill">${totalCalculators} calculators</span>
        </div>
        <ul id="${routeListId}" class="route-list">${routeItems}</ul>
        <button
          class="card-explore"
          type="button"
          data-cluster-toggle
          data-cluster-target="${escapeHtml(cluster.id)}"
          aria-controls="${routeListId}"
          aria-expanded="${visibleRouteSet.isManuallyExpanded ? 'true' : 'false'}"
          ${visibleRouteSet.canToggle ? '' : 'disabled'}
        >
          <span>${expandLabel}</span><span class="card-explore-arrow" aria-hidden="true">›</span>
        </button>
      </article>`;
    })
    .join('');

  gridNode.innerHTML = cardsHtml;
  emptyNode.hidden = !normalizedQuery || visibleClusters.length > 0;
}

function renderLoadingPlaceholders(countOverride = null) {
  const defaultCount = isMobileViewport() ? MOBILE_PLACEHOLDER_CARD_COUNT : DESKTOP_PLACEHOLDER_CARD_COUNT;
  const requestedCount = Number.isFinite(countOverride) ? countOverride : defaultCount;
  const placeholderCount = Math.max(1, Math.min(12, requestedCount));
  const placeholderRoutes = '<li><span class="route-link"></span></li>'.repeat(4);
  const placeholders = Array.from({ length: placeholderCount }, () => {
    return `<article class="category-card is-placeholder" aria-hidden="true">
      <div class="card-head">
        <div class="card-title">
          <span class="card-icon"></span>
          <span class="card-title-skeleton" aria-hidden="true"></span>
        </div>
        <span class="count-pill"></span>
      </div>
      <ul class="route-list">${placeholderRoutes}</ul>
      <span class="card-explore"><span>Explore</span><span class="card-explore-arrow">›</span></span>
    </article>`;
  }).join('');

  gridNode.innerHTML = placeholders;
}

function scoreSuggestion(route, clusterName, query) {
  const normalizedQuery = normalizeQuery(query);
  const normalizedName = normalizeQuery(route.name);
  const normalizedClusterName = normalizeQuery(clusterName);
  let score = 0;

  if (normalizedName.startsWith(normalizedQuery)) {
    score += 30;
  }
  if (normalizedName.includes(normalizedQuery)) {
    score += 18;
  }
  if (normalizeQuery(route.url).includes(normalizedQuery)) {
    score += 10;
  }
  if (normalizedClusterName.includes(normalizedQuery)) {
    score += 6;
  }

  const queryTokens = getQueryTokens(normalizedQuery);
  if (queryTokens.length > 1 && queryTokens.every((token) => normalizedName.includes(token))) {
    score += 12;
  }

  return score;
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMatch(text, query) {
  const tokens = Array.from(new Set(getQueryTokens(query))).sort((left, right) => right.length - left.length);
  if (!tokens.length) {
    return escapeHtml(text);
  }

  const matcher = new RegExp(`(${tokens.map((token) => escapeRegExp(token)).join('|')})`, 'gi');
  return String(text || '')
    .split(matcher)
    .filter((part) => part.length > 0)
    .map((part) => {
      const isMatch = tokens.some((token) => part.toLowerCase() === token.toLowerCase());
      const escapedPart = escapeHtml(part);
      return isMatch
        ? `<mark class="search-suggestion-match">${escapedPart}</mark>`
        : escapedPart;
    })
    .join('');
}

function getSuggestionSubtitle(route) {
  const parts = [route.categoryName, route.subcategoryName]
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .slice(0, 2);

  if (!parts.length) {
    return route.clusterName || '';
  }

  return parts.join(' • ');
}

function getSuggestionMatches(query) {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    return [];
  }

  const routeMap = new Map();
  homepageClusters.forEach((cluster) => {
    cluster.searchableRoutes.forEach((route) => {
      if (!matchesSearch(route.searchText, normalizedQuery)) {
        return;
      }

      const existing = routeMap.get(route.url);
      const suggestion = {
        kind: 'route',
        url: route.url,
        name: route.name,
        clusterName: cluster.name,
        categoryName: route.categoryName,
        subcategoryName: route.subcategoryName,
        score: scoreSuggestion(route, cluster.name, normalizedQuery),
      };

      if (!existing || suggestion.score > existing.score) {
        routeMap.set(route.url, suggestion);
      }
    });
  });

  const suggestions = Array.from(routeMap.values())
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.name.localeCompare(right.name);
    })
    .slice(0, 4);

  suggestions.push({
    kind: 'view-all',
    url: `/calculators/?q=${encodeURIComponent(query)}`,
    name: 'View all matching calculators',
    clusterName: `${routeMap.size} results for "${query}"`,
  });

  return suggestions;
}

function setSuggestionsVisibility(isVisible) {
  if (!searchSuggestionsNode || !searchNode) {
    return;
  }

  searchSuggestionsNode.hidden = !isVisible;
  searchNode.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
  if (!isVisible) {
    searchNode.removeAttribute('aria-activedescendant');
  }
}

function updateActiveSuggestion() {
  if (!searchSuggestionsNode || !searchNode) {
    return;
  }

  const suggestionNodes = Array.from(searchSuggestionsNode.querySelectorAll('[data-suggestion-index]'));
  suggestionNodes.forEach((node, index) => {
    const isActive = index === activeSuggestionIndex;
    node.classList.toggle('is-active', isActive);
    node.setAttribute('aria-selected', isActive ? 'true' : 'false');
    if (isActive) {
      searchNode.setAttribute('aria-activedescendant', node.id);
    }
  });

  if (activeSuggestionIndex < 0) {
    searchNode.removeAttribute('aria-activedescendant');
  }
}

function renderSuggestions(rawQuery) {
  if (!searchSuggestionsNode) {
    return;
  }

  const normalizedQuery = normalizeQuery(rawQuery);
  if (!normalizedQuery) {
    currentSuggestions = [];
    activeSuggestionIndex = -1;
    searchSuggestionsNode.innerHTML = '';
    setSuggestionsVisibility(false);
    return;
  }

  currentSuggestions = getSuggestionMatches(normalizedQuery);
  if (!currentSuggestions.length) {
    activeSuggestionIndex = -1;
    searchSuggestionsNode.innerHTML =
      '<div class="search-suggestion-empty">No matching calculators found yet.</div>';
    setSuggestionsVisibility(true);
    return;
  }

  if (activeSuggestionIndex >= currentSuggestions.length) {
    activeSuggestionIndex = -1;
  }

  searchSuggestionsNode.innerHTML = currentSuggestions
    .map((suggestion, index) => {
      if (suggestion.kind === 'view-all') {
        return `<a
        id="homepage-search-suggestion-${index}"
        class="search-suggestion search-suggestion-view-all"
        data-suggestion-index="${index}"
        href="${escapeHtml(suggestion.url)}"
        role="option"
        aria-selected="false"
      >
        <span class="search-suggestion-label">
          <span class="search-suggestion-title">${escapeHtml(suggestion.name)}</span>
          <span class="search-suggestion-meta">${escapeHtml(suggestion.clusterName)}</span>
        </span>
        <span class="search-suggestion-arrow" aria-hidden="true">↗</span>
      </a>`;
      }

      const subtitle = getSuggestionSubtitle(suggestion);

      return `<a
        id="homepage-search-suggestion-${index}"
        class="search-suggestion"
        data-suggestion-index="${index}"
        href="${escapeHtml(suggestion.url)}"
        role="option"
        aria-selected="false"
      >
        <span class="search-suggestion-label">
          <span class="search-suggestion-title">${highlightMatch(suggestion.name, rawQuery)}</span>
          <span class="search-suggestion-meta">${escapeHtml(subtitle)}</span>
        </span>
        <span class="search-suggestion-arrow" aria-hidden="true">›</span>
      </a>`;
    })
    .join('');

  setSuggestionsVisibility(true);
  updateActiveSuggestion();
}

function openActiveSuggestion() {
  const suggestion = currentSuggestions[activeSuggestionIndex];
  if (!suggestion) {
    return false;
  }

  if (suggestion.kind === 'view-all') {
    expandAllMatches();
    return true;
  }

  window.location.assign(suggestion.url);
  return true;
}

function applySearchFilter() {
  const normalizedQuery = normalizeQuery(searchNode.value);
  if (expandedResultsQuery && expandedResultsQuery !== normalizedQuery) {
    expandedResultsQuery = '';
  }

  if (expandedClusterId) {
    const expandedCluster = homepageClusters.find((cluster) => cluster.id === expandedClusterId);
    if (!expandedCluster || !getMatchingRoutesForCluster(expandedCluster, normalizedQuery).length) {
      expandedClusterId = '';
    }
  }

  syncExpandedResultsState(normalizedQuery);
  renderClusterCards(homepageClusters, searchNode.value, isExpandedResultsActive(normalizedQuery));
  renderSuggestions(searchNode.value);
}

function expandAllMatches() {
  const rawQuery = String(searchNode?.value || '').trim();
  const normalizedQuery = normalizeQuery(rawQuery);
  if (!normalizedQuery) {
    return;
  }

  expandedResultsQuery = normalizedQuery;
  activeSuggestionIndex = -1;
  syncExpandedResultsState(normalizedQuery);
  renderClusterCards(homepageClusters, rawQuery, true);
  triggerExpandedResultsAnimation();
  setSuggestionsVisibility(false);
  revealFilteredResults();
}

function toggleClusterExpansion(clusterId) {
  if (!clusterId) {
    return;
  }

  const rawQuery = String(searchNode?.value || '').trim();
  const normalizedQuery = normalizeQuery(rawQuery);
  const expandAllActive = expandedResultsQuery && expandedResultsQuery === normalizedQuery;
  const cluster = homepageClusters.find((entry) => entry.id === clusterId);
  const routeSet = cluster ? getVisibleRouteSet(cluster, rawQuery, false) : null;

  if (!routeSet?.canToggle && expandedClusterId !== clusterId) {
    return;
  }

  if (expandAllActive) {
    expandedResultsQuery = '';
  }

  expandedClusterId = expandedClusterId === clusterId && !expandAllActive ? '' : clusterId;
  syncExpandedResultsState(normalizedQuery);
  renderClusterCards(homepageClusters, rawQuery, isExpandedResultsActive(normalizedQuery));
  setSuggestionsVisibility(false);
  triggerExpandedResultsAnimation();
}

function revealFilteredResults() {
  const rawQuery = String(searchNode?.value || '').trim();
  applySearchFilter();

  if (!rawQuery || !categoriesNode) {
    return;
  }

  categoriesNode.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) {
    return;
  }
  if (shouldDisableParticles()) {
    canvas.hidden = true;
    return;
  }
  canvas.hidden = false;

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }
  const particles = [];
  const count = 80;
  let width = 0;
  let height = 0;

  function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.4 + 0.25,
    };
  }

  function seedParticles() {
    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      particles.push(createParticle());
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x <= 0 || particle.x >= width) {
        particle.vx *= -1;
      }
      if (particle.y <= 0 || particle.y >= height) {
        particle.vy *= -1;
      }

      context.fillStyle = `rgba(34, 211, 238, ${particle.alpha})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }

    requestAnimationFrame(draw);
  }

  resizeCanvas();
  seedParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    seedParticles();
  });

  requestAnimationFrame(draw);
}

async function loadHomepage() {
  renderLoadingPlaceholders();
  setLoadingState(true, isMobileViewport() ? MOBILE_PLACEHOLDER_CARD_COUNT : DESKTOP_PLACEHOLDER_CARD_COUNT);
  emptyNode.hidden = true;

  try {
    const registryResponse = await fetch(CLUSTER_REGISTRY_URL, { cache: 'no-store' });

    if (!registryResponse.ok) {
      throw new Error(`Failed to fetch cluster registry (${registryResponse.status})`);
    }

    const registry = await registryResponse.json();
    const expectedClusterCount = getVisibleClusterCount(registry);
    renderLoadingPlaceholders(expectedClusterCount);
    setLoadingState(true, expectedClusterCount);

    const navigationResponse = await fetch(NAVIGATION_CONFIG_URL, { cache: 'no-store' });
    if (!navigationResponse.ok) {
      throw new Error(`Failed to fetch navigation config (${navigationResponse.status})`);
    }

    const navigation = await navigationResponse.json();
    homepageClusters = normalizeClusters(registry, navigation);
    const normalizedQuery = normalizeQuery(searchNode.value);
    syncExpandedResultsState(normalizedQuery);
    renderClusterCards(homepageClusters, searchNode.value, isExpandedResultsActive(normalizedQuery));
    renderSuggestions(searchNode.value);
  } catch (error) {
    gridNode.innerHTML =
      '<p class="empty-state" role="alert">Unable to load calculator clusters.</p>';
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    setLoadingState(false);
  }
}

if (gridNode && searchNode && emptyNode) {
  searchNode.addEventListener('input', applySearchFilter);
  searchNode.addEventListener('focus', () => {
    renderSuggestions(searchNode.value);
  });
  searchNode.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && currentSuggestions.length) {
      event.preventDefault();
      activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, currentSuggestions.length - 1);
      updateActiveSuggestion();
      return;
    }

    if (event.key === 'ArrowUp' && currentSuggestions.length) {
      event.preventDefault();
      activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
      updateActiveSuggestion();
      return;
    }

    if (event.key === 'Escape') {
      activeSuggestionIndex = -1;
      setSuggestionsVisibility(false);
      return;
    }

    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();

    if (openActiveSuggestion()) {
      return;
    }

    revealFilteredResults();
  });
  searchButtonNode?.addEventListener('click', revealFilteredResults);
  searchSuggestionsNode?.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });
  searchSuggestionsNode?.addEventListener('mouseover', (event) => {
    const suggestionNode = event.target.closest('[data-suggestion-index]');
    if (!suggestionNode) {
      return;
    }

    activeSuggestionIndex = Number(suggestionNode.getAttribute('data-suggestion-index'));
    updateActiveSuggestion();
  });
  searchSuggestionsNode?.addEventListener('click', (event) => {
    const suggestionNode = event.target.closest('[data-suggestion-index]');
    if (!suggestionNode) {
      return;
    }

    const suggestionIndex = Number(suggestionNode.getAttribute('data-suggestion-index'));
    const suggestion = currentSuggestions[suggestionIndex];
    if (suggestion?.kind !== 'view-all') {
      return;
    }

    event.preventDefault();
    expandAllMatches();
  });
  gridNode.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-cluster-toggle]');
    if (!toggle || !(toggle instanceof HTMLButtonElement)) {
      return;
    }

    toggleClusterExpansion(toggle.dataset.clusterTarget || '');
  });
  document.addEventListener('click', (event) => {
    if (
      event.target === searchNode ||
      searchNode.contains(event.target) ||
      searchSuggestionsNode?.contains(event.target)
    ) {
      return;
    }

    activeSuggestionIndex = -1;
    setSuggestionsVisibility(false);
  });
  loadHomepage();
  initParticles();
}
