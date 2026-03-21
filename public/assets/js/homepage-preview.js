const NAVIGATION_CONFIG_URL = '/config/navigation.json';
const CLUSTER_REGISTRY_URL = '/config/clusters/cluster-registry.json';
const MIN_CALCULATORS_PER_CARD = 3;
const MAX_CALCULATORS_PER_CARD = 4;
const MOBILE_MEDIA_QUERY = '(max-width: 760px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const MOBILE_PLACEHOLDER_CARD_COUNT = 7;
const DESKTOP_PLACEHOLDER_CARD_COUNT = 8;

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
const emptyNode = document.getElementById('homepage-empty') || document.getElementById('homepage-preview-empty');
const categoriesNode =
  document.querySelector('.categories') || document.getElementById('homepage-categories');

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
  return String(value || '').trim().toLowerCase();
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
      const selectedRoutes = chooseEntryPointRoutes(
        routePolicy.routes,
        cluster?.displayName || cluster?.clusterId || 'Cluster'
      );

      return {
        id: cluster?.clusterId || 'unknown',
        name: cluster?.displayName || cluster?.clusterId || 'Cluster',
        routes: selectedRoutes,
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

function renderClusterCards(clusters) {
  const cardsHtml = clusters
    .map((cluster, index) => {
      const theme = CLUSTER_THEME[cluster.id] || CLUSTER_THEME.default;
      const routeItems = cluster.routes
        .map((route) => {
          const combined = `${route.name} ${route.url}`;
          return `<li data-route-item data-search="${escapeHtml(normalizeQuery(combined))}">
            <a class="route-link" data-route-link href="${escapeHtml(route.url)}">
              <span class="route-name">${escapeHtml(route.name)}</span>
            </a>
          </li>`;
        })
        .join('');

      const exploreHref = cluster.exploreUrl || cluster.routes[0]?.url || '/calculators/';
      const totalCalculators = Math.max(cluster.totalRoutes, cluster.routes.length);
      return `<article
        class="category-card${theme.warm ? ' is-warm' : ''}"
        data-cluster-card
        data-cluster-id="${escapeHtml(cluster.id)}"
        data-cluster-name="${escapeHtml(normalizeQuery(cluster.name))}"
        data-total-calculators="${totalCalculators}"
        data-total-routes="${totalCalculators}"
        style="--card-accent: ${theme.accent}; --card-flare: ${theme.flare || theme.accent}; --float-delay: ${index * 0.3}s"
      >
        <div class="card-head">
          <div class="card-title">
            <span class="card-icon" aria-hidden="true">${escapeHtml(theme.icon)}</span>
            <h3>${escapeHtml(cluster.name)}</h3>
          </div>
          <span class="count-pill">${totalCalculators} calculators</span>
        </div>
        <ul class="route-list">${routeItems}</ul>
        <a class="card-explore" href="${escapeHtml(exploreHref)}">
          <span>Explore</span><span class="card-explore-arrow" aria-hidden="true">›</span>
        </a>
      </article>`;
    })
    .join('');

  gridNode.innerHTML = cardsHtml;
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

function applySearchFilter() {
  const query = normalizeQuery(searchNode.value);
  const cards = Array.from(gridNode.querySelectorAll('[data-cluster-card]'));
  let visibleCardCount = 0;

  cards.forEach((card) => {
    const clusterName = card.getAttribute('data-cluster-name') || '';
    const routeItems = Array.from(card.querySelectorAll('[data-route-item]'));

    if (!query) {
      routeItems.forEach((item) => {
        item.hidden = false;
      });
      card.hidden = false;
      visibleCardCount += 1;
      return;
    }

    const clusterMatch = clusterName.includes(query);
    let hasRouteMatch = false;

    routeItems.forEach((item) => {
      const routeSearch = item.getAttribute('data-search') || '';
      const routeMatch = clusterMatch || routeSearch.includes(query);
      item.hidden = !routeMatch;
      if (routeMatch) {
        hasRouteMatch = true;
      }
    });

    card.hidden = !hasRouteMatch;
    if (hasRouteMatch) {
      visibleCardCount += 1;
    }
  });

  emptyNode.hidden = visibleCardCount > 0;
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
    const clusters = normalizeClusters(registry, navigation);
    renderClusterCards(clusters);
    applySearchFilter();
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
  loadHomepage();
  initParticles();
}
