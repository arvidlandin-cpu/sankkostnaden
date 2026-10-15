import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const checker = fileURLToPath(new URL('../scripts/check-site.mjs', import.meta.url));
function check(fragment) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-anchor-check-'));
  try {
    for (const dir of ['pages', 'components', 'public']) fs.mkdirSync(path.join(root, dir));
    const files = {
      'pages/index.tsx': `export default function Home(){return <a href='/target/#${fragment}'>Read</a>}`,
      'pages/target.tsx': "import Guide from '../components/Guide'; import Unused from '../components/Unused'; export default function Page(){return <Guide/>}",
      'components/Guide.tsx': "import Reading from './Reading'; export default function Guide(){return <Reading/>}",
      // A real JSX import cycle must terminate without losing its own anchors.
      'components/Reading.tsx': "import Guide from './Guide'; export default function Reading(){return <><div id='guide-summary'/><Guide/></>}",
      'components/Unused.tsx': "export default function Unused(){return <div id='unused-only'/>}",
    };
    for (const [file, source] of Object.entries(files)) fs.writeFileSync(path.join(root, file), source);
    return spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8', timeout: 5000 });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('wrapper anchors resolve through rendered local default imports and terminate cycles', () => {
  const result = check('guide-summary');
  assert.equal(result.status, 0, result.stderr);
});

test('unused component imports cannot manufacture a valid anchor', () => {
  const result = check('unused-only');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing target #unused-only in \/target/);
});

test('genuinely missing anchors still fail the source gate', () => {
  const result = check('does-not-exist');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing target #does-not-exist in \/target/);
});
