import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const ROUTE_BUNDLE_DIR = path.join(PUBLIC_DIR, 'assets', 'css', 'route-bundles');
const ROUTE_BUNDLE_MANIFEST_PATH = path.join(ROUTE_BUNDLE_DIR, 'manifest.json');
const ASSET_MANIFEST_PATH = path.join(PUBLIC_DIR, 'config', 'asset-manifest.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function listRouteBundleFiles() {
  return fs.readdirSync(ROUTE_BUNDLE_DIR).filter((name) => name.endsWith('.css'));
}

function stripBundleHash(filename) {
  return filename
    .replace(/\.critical\.[0-9a-f]{8}\.css$/i, '')
    .replace(/\.[0-9a-f]{8}\.css$/i, '');
}

function findCurrentBundleFiles(prefix, files) {
  const fullMatches = files.filter((name) =>
    new RegExp(`^${escapeRegExp(prefix)}\\.[0-9a-f]{8}\\.css$`, 'i').test(name)
  );
  const criticalMatches = files.filter((name) =>
    new RegExp(`^${escapeRegExp(prefix)}\\.critical\\.[0-9a-f]{8}\\.css$`, 'i').test(name)
  );

  const pickLatest = (matches) =>
    matches
      .map((name) => ({
        name,
        mtimeMs: fs.statSync(path.join(ROUTE_BUNDLE_DIR, name)).mtimeMs,
      }))
      .sort((a, b) => b.mtimeMs - a.mtimeMs || a.name.localeCompare(b.name))[0]?.name ?? null;

  return {
    full: pickLatest(fullMatches),
    critical: pickLatest(criticalMatches),
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fileHref(filename) {
  return `/assets/css/route-bundles/${filename}`;
}

function fileOutput(filename) {
  return `public/assets/css/route-bundles/${filename}`;
}

function syncRouteBundleManifest(routeBundleManifest, files) {
  const unresolved = [];
  let changes = 0;

  for (const entry of Object.values(routeBundleManifest.routes ?? {})) {
    const prefix = entry?.relPath ? entry.relPath.replace(/\//g, '-') : null;
    if (!prefix) {
      continue;
    }

    const { full, critical } = findCurrentBundleFiles(prefix, files);
    if (!full || !critical) {
      unresolved.push({ prefix, full, critical });
      continue;
    }

    const fullPath = path.join(ROUTE_BUNDLE_DIR, full);
    const criticalPath = path.join(ROUTE_BUNDLE_DIR, critical);
    const nextValues = {
      href: fileHref(full),
      deferredHref: fileHref(full),
      criticalCss: fileHref(critical),
      hash: full.match(/\.([0-9a-f]{8})\.css$/i)?.[1] ?? entry.hash,
      criticalHash: critical.match(/\.critical\.([0-9a-f]{8})\.css$/i)?.[1] ?? entry.criticalHash,
      outputFile: fileOutput(full),
      criticalOutputFile: fileOutput(critical),
      fullBytes: fs.statSync(fullPath).size,
      criticalBytes: fs.statSync(criticalPath).size,
    };

    for (const [key, value] of Object.entries(nextValues)) {
      if (entry[key] !== value) {
        entry[key] = value;
        changes += 1;
      }
    }
  }

  return { unresolved, changes };
}

function extractPrefixFromAssetEntry(routeCssHref, criticalHref) {
  const candidate = [routeCssHref, criticalHref].find(
    (href) => typeof href === 'string' && href.includes('/assets/css/route-bundles/')
  );
  if (!candidate) {
    return null;
  }

  return stripBundleHash(path.basename(candidate));
}

function syncAssetManifest(assetManifest, files) {
  const unresolved = [];
  let changes = 0;

  for (const entry of Object.values(assetManifest.routes ?? {})) {
    const routeCss = Array.isArray(entry?.css?.route) ? entry.css.route : [];
    const criticalHref = typeof entry?.css?.critical === 'string' ? entry.css.critical : null;
    const prefix = extractPrefixFromAssetEntry(routeCss[0], criticalHref);

    if (!prefix) {
      continue;
    }

    const { full, critical } = findCurrentBundleFiles(prefix, files);
    if (!full || !critical) {
      unresolved.push({ prefix, full, critical });
      continue;
    }

    const nextRouteHref = fileHref(full);
    const nextCriticalHref = fileHref(critical);

    if (routeCss.length > 0) {
      const normalizedRouteCss = [];
      let routeBundleSeen = false;

      for (const href of routeCss) {
        if (typeof href !== 'string') {
          continue;
        }
        if (href.startsWith('/assets/css/route-bundles/') && !href.includes('.critical.')) {
          if (!routeBundleSeen) {
            normalizedRouteCss.push(nextRouteHref);
            routeBundleSeen = true;
          }
          continue;
        }
        normalizedRouteCss.push(href);
      }

      if (!routeBundleSeen) {
        normalizedRouteCss.unshift(nextRouteHref);
      }

      const dedupedRouteCss = normalizedRouteCss.filter(
        (href, index) => normalizedRouteCss.indexOf(href) === index
      );

      if (JSON.stringify(routeCss) !== JSON.stringify(dedupedRouteCss)) {
        entry.css.route = dedupedRouteCss;
        changes += 1;
      }
    } else if (entry.css) {
      entry.css.route = [nextRouteHref];
      changes += 1;
    }

    if (entry.css?.critical !== nextCriticalHref) {
      entry.css.critical = nextCriticalHref;
      changes += 1;
    }
  }

  return { unresolved, changes };
}

function main() {
  if (!fs.existsSync(ROUTE_BUNDLE_MANIFEST_PATH)) {
    throw new Error(`Missing route bundle manifest: ${ROUTE_BUNDLE_MANIFEST_PATH}`);
  }
  if (!fs.existsSync(ASSET_MANIFEST_PATH)) {
    throw new Error(`Missing asset manifest: ${ASSET_MANIFEST_PATH}`);
  }

  const files = listRouteBundleFiles();
  const routeBundleManifest = readJson(ROUTE_BUNDLE_MANIFEST_PATH);
  const assetManifest = readJson(ASSET_MANIFEST_PATH);

  const routeBundleResult = syncRouteBundleManifest(routeBundleManifest, files);
  const assetManifestResult = syncAssetManifest(assetManifest, files);
  const unresolved = [...routeBundleResult.unresolved, ...assetManifestResult.unresolved];

  if (unresolved.length > 0) {
    throw new Error(
      `Unable to resolve route bundle assets for: ${unresolved
        .map((item) => item.prefix)
        .sort()
        .join(', ')}`
    );
  }

  writeJson(ROUTE_BUNDLE_MANIFEST_PATH, routeBundleManifest);
  writeJson(ASSET_MANIFEST_PATH, assetManifest);

  console.log(
    `Synced route bundle manifests (${routeBundleResult.changes} route-manifest updates, ${assetManifestResult.changes} asset-manifest updates).`
  );
}

main();
