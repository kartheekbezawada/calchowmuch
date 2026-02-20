let inputLimiterInitialized = false;

const INPUT_SELECTOR = [
  'input[type="text"]',
  'input[type="number"]',
  'input[type="email"]',
  'input[type="password"]',
  'input[type="search"]',
  'input[type="tel"]',
  'input[type="url"]',
  'input[type="date"]',
  'input[type="time"]',
  'input[type="datetime-local"]',
  'input[type="month"]',
  'input[type="week"]',
].join(',');

export function initInputLengthLimiter(maxLength = 12) {
  if (inputLimiterInitialized || typeof document === 'undefined') {
    return;
  }
  inputLimiterInitialized = true;

  function resolveMaxLength(input) {
    const attrValue = input.getAttribute('maxlength') ?? input.dataset.maxlength;
    const parsed = Number(attrValue);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return maxLength;
  }

  function applyMaxLength(input) {
    if (input.dataset.maxlengthApplied) {
      return;
    }
    const resolved = resolveMaxLength(input);
    if (input.type !== 'number' && !input.hasAttribute('maxlength')) {
      input.setAttribute('maxlength', String(resolved));
    }
    input.dataset.maxlengthApplied = 'true';
  }

  function enforceLimit(input) {
    const resolved = resolveMaxLength(input);
    if (input.value.length > resolved) {
      input.value = input.value.slice(0, resolved);
    }
  }

  document.querySelectorAll(INPUT_SELECTOR).forEach(applyMaxLength);

  document.addEventListener('focusin', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.matches(INPUT_SELECTOR)) {
      applyMaxLength(target);
    }
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.matches(INPUT_SELECTOR)) {
      applyMaxLength(target);
      enforceLimit(target);
    }
  });
}

export function setupButtonGroup(group, options = {}) {
  if (!group) {
    return null;
  }

  const buttons = Array.from(group.querySelectorAll('button[data-value]'));
  if (!buttons.length) {
    return null;
  }

  const defaultValue = options.defaultValue ?? buttons[0]?.dataset.value;
  const onChange = options.onChange;
  const activeAttribute =
    options.ariaAttribute ??
    (group.getAttribute('role') === 'tablist' ? 'aria-selected' : 'aria-pressed');

  function setActive(value) {
    let activeValue = value;
    let hasMatch = false;

    buttons.forEach((button) => {
      const isActive = button.dataset.value === value;
      button.classList.toggle('is-active', isActive);
      button.setAttribute(activeAttribute, isActive ? 'true' : 'false');
      if (isActive) {
        hasMatch = true;
      }
    });

    if (!hasMatch && defaultValue) {
      activeValue = defaultValue;
      buttons.forEach((button) => {
        const isActive = button.dataset.value === activeValue;
        button.classList.toggle('is-active', isActive);
        button.setAttribute(activeAttribute, isActive ? 'true' : 'false');
      });
    }

    return activeValue;
  }

  function getValue() {
    const active = buttons.find(
      (button) =>
        button.classList.contains('is-active') || button.getAttribute(activeAttribute) === 'true'
    );
    return active?.dataset.value ?? defaultValue ?? null;
  }

  const initialValue = getValue();
  if (initialValue) {
    setActive(initialValue);
  }

  group.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-value]');
    if (!button || !group.contains(button)) {
      return;
    }
    const nextValue = setActive(button.dataset.value);
    if (onChange) {
      onChange(nextValue, button);
    }
  });

  return { getValue, setValue: setActive };
}

const INITIAL_METADATA = (() => {
  if (typeof document === 'undefined') {
    return { title: '', description: '', canonical: '' };
  }
  const head = document.head;
  if (!head) {
    return { title: document.title ?? '', description: '', canonical: '' };
  }
  const descriptionMeta = head.querySelector('meta[name="description"]');
  const canonicalLink = head.querySelector('link[rel="canonical"]');
  return {
    title: document.title ?? '',
    description: descriptionMeta?.getAttribute('content') ?? '',
    canonical: canonicalLink?.getAttribute('href') ?? '',
  };
})();

function normalizePageSchema(schema) {
  const calculatorFAQ = Boolean(schema?.calculatorFAQ);
  const globalFAQ = Boolean(schema?.globalFAQ);
  return { calculatorFAQ, globalFAQ };
}

const UNIQUE_SCHEMA_TYPES = ['FAQPage', 'BreadcrumbList', 'SoftwareApplication'];

function collectSchemaTypeCounts(structuredData, counts) {
  if (!structuredData) {
    return;
  }
  if (Array.isArray(structuredData)) {
    structuredData.forEach((item) => collectSchemaTypeCounts(item, counts));
    return;
  }
  if (typeof structuredData !== 'object') {
    return;
  }

  const rawType = structuredData['@type'];
  if (typeof rawType === 'string' && Object.prototype.hasOwnProperty.call(counts, rawType)) {
    counts[rawType] += 1;
  } else if (Array.isArray(rawType)) {
    rawType.forEach((entry) => {
      if (typeof entry === 'string' && Object.prototype.hasOwnProperty.call(counts, entry)) {
        counts[entry] += 1;
      }
    });
  }

  if (Array.isArray(structuredData['@graph'])) {
    collectSchemaTypeCounts(structuredData['@graph'], counts);
  }
}

function getDuplicateSchemaTypes(structuredData) {
  const counts = UNIQUE_SCHEMA_TYPES.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {});

  collectSchemaTypeCounts(structuredData, counts);

  return UNIQUE_SCHEMA_TYPES.filter((type) => counts[type] > 1).map((type) => ({
    type,
    count: counts[type],
  }));
}

function assertUniqueSchemaTypes(structuredData) {
  const duplicates = getDuplicateSchemaTypes(structuredData);
  if (duplicates.length === 1) {
    const [{ type, count }] = duplicates;
    throw new Error(`Invalid structured data: found ${count} ${type} schemas on one URL.`);
  }
  if (duplicates.length > 1) {
    throw new Error(
      `Invalid structured data: duplicate schema types on one URL (${duplicates
        .map((entry) => `${entry.type}:${entry.count}`)
        .join(', ')}).`
    );
  }
}

function ensureSchemaContext(base, fallback = 'https://schema.org') {
  if (base && typeof base === 'object' && !Array.isArray(base) && base['@context']) {
    return base['@context'];
  }
  return fallback;
}

function mergeStructuredDataWithFaq({ base, faqSchema }) {
  if (!faqSchema) {
    return base ?? null;
  }

  const context = ensureSchemaContext(base);

  if (!base) {
    return {
      '@context': context,
      ...faqSchema,
    };
  }

  if (Array.isArray(base)) {
    return {
      '@context': context,
      '@graph': [...base, faqSchema],
    };
  }

  if (typeof base === 'object') {
    const graph = base['@graph'];
    if (Array.isArray(graph)) {
      return {
        ...base,
        '@graph': [...graph, faqSchema],
      };
    }
    return {
      '@context': context,
      '@graph': [base, faqSchema],
    };
  }

  return {
    '@context': context,
    ...faqSchema,
  };
}

function buildGuardedStructuredData(metadata) {
  const schemaFlags = normalizePageSchema(metadata?.pageSchema);
  const hasFlags = schemaFlags.calculatorFAQ || schemaFlags.globalFAQ;
  const calculatorFAQSchema = metadata?.calculatorFAQSchema ?? null;
  const globalFAQSchema = metadata?.globalFAQSchema ?? null;
  const baseStructuredData = Object.prototype.hasOwnProperty.call(metadata, 'structuredData')
    ? metadata.structuredData
    : null;

  if (schemaFlags.calculatorFAQ && schemaFlags.globalFAQ) {
    throw new Error('Invalid schema flags: both calculatorFAQ and globalFAQ are true.');
  }

  if (!hasFlags && !calculatorFAQSchema && !globalFAQSchema) {
    assertUniqueSchemaTypes(baseStructuredData);
    return baseStructuredData;
  }

  const pathname = typeof window !== 'undefined' ? (window.location?.pathname ?? '') : '';
  const isFaqPath = pathname === '/faq' || pathname === '/faq/';
  if (schemaFlags.globalFAQ && !isFaqPath) {
    throw new Error(`Invalid schema flags: globalFAQ is true on non-FAQ path (${pathname}).`);
  }
  if (schemaFlags.calculatorFAQ && isFaqPath) {
    throw new Error(`Invalid schema flags: calculatorFAQ is true on FAQ path (${pathname}).`);
  }

  const selectedFaqSchema = schemaFlags.calculatorFAQ
    ? calculatorFAQSchema
    : schemaFlags.globalFAQ
      ? globalFAQSchema
      : null;

  const merged = mergeStructuredDataWithFaq({
    base: baseStructuredData,
    faqSchema: selectedFaqSchema,
  });

  assertUniqueSchemaTypes(merged);
  return merged;
}

export function setPageMetadata(metadata = {}) {
  if (typeof document === 'undefined') {
    return;
  }
  const head = document.head;
  if (!head) {
    return;
  }

  if ('title' in metadata && metadata.title !== undefined) {
    document.title = metadata.title ?? '';
  }

  if ('description' in metadata) {
    let descriptionMeta = head.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.setAttribute('name', 'description');
      head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute('content', metadata.description ?? '');
  }

  if ('canonical' in metadata) {
    let canonicalLink = head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', metadata.canonical ?? '');
  }

  const hasSchemaUpdate =
    Object.prototype.hasOwnProperty.call(metadata, 'structuredData') ||
    Object.prototype.hasOwnProperty.call(metadata, 'pageSchema') ||
    Object.prototype.hasOwnProperty.call(metadata, 'calculatorFAQSchema') ||
    Object.prototype.hasOwnProperty.call(metadata, 'globalFAQSchema');

  if (hasSchemaUpdate) {
    const scriptSelector = 'script[data-calculator-ld]';
    const existingScript = head.querySelector(scriptSelector);
    const guardedStructuredData = buildGuardedStructuredData(metadata);
    if (guardedStructuredData) {
      let script = existingScript;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.calculatorLd = 'true';
        head.appendChild(script);
      }
      script.textContent = JSON.stringify(guardedStructuredData);
    } else if (existingScript) {
      existingScript.remove();
    }
  }
}

export function resetPageMetadata() {
  setPageMetadata({
    title: INITIAL_METADATA.title,
    description: INITIAL_METADATA.description,
    canonical: INITIAL_METADATA.canonical,
    structuredData: null,
  });
}

initInputLengthLimiter();
