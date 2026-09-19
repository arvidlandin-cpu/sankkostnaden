import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagesDir = path.join(root, 'pages');
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

const pageFiles = walk(pagesDir).filter(file => /\.(tsx|ts|jsx|js)$/.test(file));
const routes = new Set(['/']);

for (const file of pageFiles) {
  const rel = path.relative(pagesDir, file).replace(/\\/g, '/');
  if (rel.startsWith('_')) continue;
  let route = '/' + rel.replace(/\.(tsx|ts|jsx|js)$/, '');
  route = route.replace(/\/index$/, '') || '/';
  routes.add(normalizeRoute(route));
}

const sourceFiles = scanDirs.flatMap(walk).filter(file => /\.(tsx|ts|jsx|js)$/.test(file));
const missing = [];

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const hrefRegex = /href\s*=\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = hrefRegex.exec(source))) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const pathname = normalizeRoute(href);
    const publicPath = path.join(root, 'public', pathname.replace(/^\//, ''));
    if (fs.existsSync(publicPath)) continue;
    if (/\.[a-z0-9]{2,16}$/i.test(pathname)) continue;
    if (!routes.has(pathname)) {
      missing.push({ file: path.relative(root, file), href });
    }
  }
}

if (missing.length) {
  console.error('Broken static internal routes:');
  for (const item of missing) console.error(`- ${item.file}: ${item.href}`);
  process.exit(1);
}

console.log(`Internal route check passed: ${routes.size} routes scanned.`);
