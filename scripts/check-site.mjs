import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagesDir = path.join(root, 'pages');
const publicDir = path.join(root, 'public');
const scanDirs = [pagesDir, path.join(root, 'components')];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function normalizeRoute(value) {
  const bare = value.split('#')[0].split('?')[0] || '/';
  if (bare === '/') return '/';
  return bare.replace(/\/$/, '');
}

function pageRoute(file) {
  const rel = path.relative(pagesDir, file).replace(/\\/g, '/');
  if (rel.startsWith('_')) return null;
  let route = '/' + rel.replace(/\.(tsx|ts|jsx|js)$/, '');
  route = route.replace(/\/index$/, '') || '/';
  return normalizeRoute(route);
}

function idsIn(source) {
  const ids = new Set();
  const regex = /\bid\s*=\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(source))) ids.add(match[1]);
  return ids;
}

const pageFiles = walk(pagesDir).filter(file => /\.(tsx|ts|jsx|js)$/.test(file));
const routes = new Set(['/']);
const routeFiles = new Map();

for (const file of pageFiles) {
  const route = pageRoute(file);
  if (!route) continue;
  routes.add(route);
  routeFiles.set(route, file);
}

const errors = [];
const redirectSources = new Set();
const redirectsPath = path.join(publicDir, '_redirects');

if (fs.existsSync(redirectsPath)) {
  for (const raw of fs.readFileSync(redirectsPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to] = line.split(/\s+/);
    const sourceRoute = normalizeRoute(from);
    const targetRoute = to?.startsWith('/') ? normalizeRoute(to) : null;
    // A redirect that only canonicalizes the trailing slash points to the same route.
    // Do not treat canonical internal links as links to a superseded alias.
    if (targetRoute !== sourceRoute) redirectSources.add(sourceRoute);
    if (targetRoute && !routes.has(targetRoute)) {
      errors.push(`public/_redirects: target does not exist ${to}`);
    }
  }
}

const sourceFiles = scanDirs.flatMap(walk).filter(file => /\.(tsx|ts|jsx|js)$/.test(file));

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const currentRoute = file.startsWith(pagesDir) ? pageRoute(file) : null;
  const currentIds = idsIn(source);
  const checked = new Set();

  function validateInternal(value, origin = 'link') {
    if (!value || checked.has(`${origin}:${value}`)) return;
    checked.add(`${origin}:${value}`);

    if (value.includes('${')) return;

    if (/^\.\.?\//.test(value)) {
      errors.push(`${path.relative(root, file)}: relative internal ${origin} ${value}`);
      return;
    }

    if (/^#[0-9a-f]{3,8}$/i.test(value)) return;

    if (value.startsWith('#')) {
      const fragment = value.slice(1);
      if (fragment && !currentIds.has(fragment)) {
        errors.push(`${path.relative(root, file)}: fragile or missing local target #${fragment}`);
      }
      return;
    }

    if (!value.startsWith('/') || value.startsWith('//')) return;

    const pathname = normalizeRoute(value);
    const publicPath = path.join(publicDir, pathname.replace(/^\//, ''));
    if (fs.existsSync(publicPath)) return;
    if (/\.[a-z0-9]{2,16}$/i.test(pathname)) return;

    if (!routes.has(pathname)) {
      errors.push(`${path.relative(root, file)}: missing route ${value}`);
      return;
    }

    if (redirectSources.has(pathname)) {
      errors.push(`${path.relative(root, file)}: links to redirected alias ${value}`);
      return;
    }

    const hashIndex = value.indexOf('#');
    if (hashIndex >= 0) {
      const fragment = value.slice(hashIndex + 1).split('?')[0];
      const targetFile = routeFiles.get(pathname);
      if (fragment && targetFile) {
        const targetSource = fs.readFileSync(targetFile, 'utf8');
        if (!idsIn(targetSource).has(fragment)) {
          errors.push(`${path.relative(root, file)}: missing target #${fragment} in ${pathname}`);
        }
      }
    }
  }

  // Explicit hrefs.
  const hrefRegex = /href\s*=\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = hrefRegex.exec(source))) validateInternal(match[1], 'href');

  // Catch route values hidden in config objects, ternaries and component props.
  // This specifically prevents clickable UI from silently pointing at a missing
  // route or fragment even when the final href is assembled indirectly.
  const routeLiteralRegex = /['"]((?:\/|#)[^'"\s<>]*)['"]/g;
  while ((match = routeLiteralRegex.exec(source))) {
    const value = match[1];
    if (value.startsWith('/http')) continue;
    validateInternal(value, 'route literal');
  }
}

const sitemapPath = path.join(publicDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const seen = new Set();
  const locRegex = /<loc>https:\/\/sankkostnaden\.se([^<]*)<\/loc>/g;
  let match;

  while ((match = locRegex.exec(sitemap))) {
    const route = normalizeRoute(match[1] || '/');
    if (seen.has(route)) errors.push(`public/sitemap.xml: duplicate route ${route}`);
    seen.add(route);
    if (!routes.has(route)) errors.push(`public/sitemap.xml: missing route ${route}`);
    if (redirectSources.has(route)) errors.push(`public/sitemap.xml: redirected route included ${route}`);
  }
}

if (errors.length) {
  console.error('Site validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site validation passed: ${routes.size} routes checked, internal links, anchors, redirects and sitemap verified.`);
