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

const sourceFiles = scanDirs.flatMap(walk).filter(file => /\.(tsx|ts|jsx|js)$/.test(file));
const errors = [];

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const currentRoute = file.startsWith(pagesDir) ? pageRoute(file) : null;
  const currentIds = idsIn(source);
  const hrefRegex = /href\s*=\s*['"]([^'"]+)['"]/g;
  let match;

  while ((match = hrefRegex.exec(source))) {
    const href = match[1];

    if (href.startsWith('#')) {
      const fragment = href.slice(1);
      if (currentRoute && fragment && !currentIds.has(fragment)) {
        errors.push(`${path.relative(root, file)}: missing #${fragment}`);
      }
      continue;
    }

    if (!href.startsWith('/') || href.startsWith('//')) continue;

    const pathname = normalizeRoute(href);
    const publicPath = path.join(publicDir, pathname.replace(/^\//, ''));
    if (fs.existsSync(publicPath)) continue;
    if (/\.[a-z0-9]{2,16}$/i.test(pathname)) continue;

    if (!routes.has(pathname)) {
      errors.push(`${path.relative(root, file)}: missing route ${href}`);
      continue;
    }

    const hashIndex = href.indexOf('#');
    if (hashIndex >= 0) {
      const fragment = href.slice(hashIndex + 1).split('?')[0];
      const targetFile = routeFiles.get(pathname);
      if (fragment && targetFile) {
        const targetSource = fs.readFileSync(targetFile, 'utf8');
        if (!idsIn(targetSource).has(fragment)) {
          errors.push(`${path.relative(root, file)}: missing target #${fragment} in ${pathname}`);
        }
      }
    }
  }
}

const redirectsPath = path.join(publicDir, '_redirects');
const redirectSources = new Set();
if (fs.existsSync(redirectsPath)) {
  for (const raw of fs.readFileSync(redirectsPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to] = line.split(/\s+/);
    redirectSources.add(normalizeRoute(from));
    if (to?.startsWith('/') && !routes.has(normalizeRoute(to))) {
      errors.push(`public/_redirects: target does not exist ${to}`);
    }
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

console.log(`Site validation passed: ${routes.size} routes checked, internal links and sitemap verified.`);
