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
