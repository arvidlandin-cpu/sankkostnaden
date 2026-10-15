#!/usr/bin/env python3
"""Read-only release and metadata verification. Uses only Python stdlib."""
import argparse
import concurrent.futures
import datetime
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET

PROD = 'https://sankkostnaden.se'
MAX_BYTES = 5_000_000
SOURCE_ROOT = Path(__file__).resolve().parents[1]
ILLUSTRATION_PATHS = (
    '/design/cost-map-home.webp',
    *(f'/design/category-{category}.webp' for category in ('bredband', 'el', 'mobil', 'forsakring', 'ekonomi')),
)


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.titles, self.descriptions, self.canonicals, self.robots = [], [], [], []
        self.assets = set()
        self.title = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title':
            self.title = ''
        if tag == 'meta':
            name = attrs.get('name', '').lower()
            if name == 'description':
                self.descriptions.append(attrs.get('content', ''))
            if name in ('robots', 'googlebot', 'googlebot-news'):
                self.robots.append(attrs.get('content', ''))
        if tag == 'link' and 'canonical' in attrs.get('rel', '').lower().split():
            self.canonicals.append(attrs.get('href', ''))
        candidate = attrs.get('src') if tag == 'script' else attrs.get('href') if tag == 'link' else None
        if candidate:
            parsed = urllib.parse.urlsplit(candidate)
            if parsed.path.startswith('/_next/') and parsed.path.endswith(('.js', '.css')):
                self.assets.add(parsed.path + ('?' + parsed.query if parsed.query else ''))

    def handle_data(self, text):
        if self.title is not None:
            self.title += text

    def handle_endtag(self, tag):
        if tag == 'title' and self.title is not None:
            self.titles.append(self.title.strip())
            self.title = None


def metadata(body):
    parser = Metadata()
    parser.feed(body.decode('utf-8-sig'))
    parser.close()
    return parser


def noindex(value):
    return bool(re.search(r'\bnoindex\b|(?:^|[\s,:;])none(?:$|[\s,;])', value, re.I))


def fetch(url, timeout=15, api=False):
    row = {'url': url, 'status': None, 'errors': []}
    headers = {'User-Agent': 'SankKostnaden-ReadOnly-Release/1.0'}
    if api:
        headers['Accept'] = 'application/vnd.github+json'
        token = os.environ.get('GITHUB_TOKEN')
        if token:
            headers['Authorization'] = 'Bearer ' + token
    try:
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=timeout) as response:
            row['status'] = response.status
            row['finalUrl'] = response.geturl()
            row['headerNoindex'] = noindex(','.join(response.headers.get_all('X-Robots-Tag', [])))
            body = response.read(MAX_BYTES + 1)
            if len(body) > MAX_BYTES:
                raise ValueError('Response larger than 5 MB')
            if response.status != 200:
                row['errors'].append('Expected HTTP 200')
            return row, body
    except urllib.error.HTTPError as exc:
        row['status'] = exc.code
        row['errors'].append('HTTP request failed')
    except Exception as exc:
        row['errors'].append('Fetch failed: ' + type(exc).__name__)
    return row, None


def emit(report, row):
    report['checks'].append(row)
    print(json.dumps({'url': row['url'], 'status': row['status'], 'errors': row['errors']}), flush=True)


def workflow_escape(value):
    """Escape the data portion of a GitHub Actions workflow command."""
    return str(value).replace('%', '%25').replace('\r', '%0D').replace('\n', '%0A')


def failure_annotations(report):
    """Public, bounded diagnostics; never include observed content or API bodies."""
    controlled = {
        'Expected HTTP 200', 'HTTP request failed',
        'GITHUB_REPOSITORY must identify owner/repository',
        'Expected commit must be a full 40-character SHA',
        'Preview requires HTTP X-Robots-Tag noindex',
        'Production noindex directive found', 'Googlebot blocked baseline routes',
        'Global crawler disallow found', 'Sitemap missing baseline URLs',
        'Cannot retrieve release homepage',
        'Homepage JS/CSS path sets differ or are empty',
        'Immutable deployment and served asset SHA256 differ or fetch failed',
        'Cannot read illustration from expected commit source',
        'Illustration differs from expected commit source',
        'Expected 63 unique baseline routes',
        'Preview URL must be an HTTPS sankkostnaden.pages.dev deployment',
        'Expected release not ready',
        'Deployment readiness timed out (maximum 180 seconds)',
    }
    controlled.update('Exact ' + key + ' mismatch (missing or duplicate elements also fail)'
                      for key in ('title', 'description', 'canonical'))
    exception_classes = {'ValueError', 'TypeError', 'KeyError', 'IndexError', 'OSError',
                         'TimeoutError', 'URLError', 'HTTPError', 'ParseError',
                         'JSONDecodeError', 'UnicodeDecodeError', 'RuntimeError'}

    def error_text(error):
        if not isinstance(error, str):
            return 'Unclassified verifier error (see verification artifact)'
        if error in controlled or error in exception_classes:
            return error
        for prefix in ('Fetch failed: ', 'HTML parse failed: '):
            if error.startswith(prefix) and error[len(prefix):] in exception_classes:
                return error
        return 'Unclassified verifier error (see verification artifact)'

    def safe_path(value):
        try:
            parsed = urllib.parse.urlsplit(value or '')
            resource = parsed.path
            if (parsed.netloc and parsed.hostname != 'sankkostnaden.se'
                    and not re.fullmatch(r'[a-zA-Z0-9-]+\.sankkostnaden\.pages\.dev', parsed.hostname or '')):
                return '(external resource)'
            if resource.startswith('/') and len(resource) <= 240 and re.fullmatch(r'/[a-zA-Z0-9._~%/+-]*', resource):
                return resource
        except (ValueError, TypeError):
            pass
        return '(unavailable)'

    rows = [{'kind': 'report', 'errors': report.get('errors', [])}]
    rows.extend(row for row in report.get('checks', [])
                if not str(row.get('kind', '')).startswith('readiness-'))
    rows.extend({'kind': 'asset-identity', 'url': asset.get('path'), 'errors': asset.get('errors', [])}
                for asset in report.get('assets', []))
    output = []
    for row in rows:
        kind = row.get('kind', '')
        kind = kind if isinstance(kind, str) and re.fullmatch(r'[a-z][a-z-]{0,63}', kind) else 'unknown'
        status = row.get('status')
        status = str(status) if type(status) is int and 100 <= status <= 599 else 'UNKNOWN'
        for error in row.get('errors', []):
            message = ('kind=' + kind + '; path=' + safe_path(row.get('url'))
                       + '; status=' + status + '; error=' + error_text(error))
            output.append('::error title=Release verification failure::' + workflow_escape(message))
            if len(output) == 20:
                return output
    return output


def discover_reference(commit, remaining, mode):
    repository = os.environ.get('GITHUB_REPOSITORY', '')
    if not re.fullmatch(r'[\w.-]+/[\w.-]+', repository):
        raise ValueError('GITHUB_REPOSITORY must identify owner/repository')
    if not re.fullmatch(r'[0-9a-fA-F]{40}', commit):
        raise ValueError('Expected commit must be a full 40-character SHA')
    rows, runs = [], []
    for page in range(1, 11):
        url = f'https://api.github.com/repos/{repository}/commits/{commit}/check-runs?filter=all&per_page=100&page={page}'
        row, body = fetch(url, timeout=max(.1, min(15, remaining())), api=True)
        row['kind'] = 'github-checks'
        rows.append(row)
        if body is None:
            return None, rows
        batch = json.loads(body).get('check_runs', [])
        runs.extend(batch)
        if len(batch) < 100:
            break
        if remaining() <= 0:
            return None, rows
    candidates = sorted((run for run in runs if run.get('name') == 'Cloudflare Pages'),
                        key=lambda run: (mode == 'production' and (run.get('check_suite') or {}).get('head_branch') == 'main',
                                         run.get('started_at') or '', run.get('id', 0)), reverse=True)
    for run in candidates:
        if run.get('conclusion') != 'success' or run.get('head_sha', '').lower() != commit.lower():
            continue
        output = run.get('output') or {}
        text = (output.get('summary') or '') + '\n' + (output.get('text') or '')
        branch = (run.get('check_suite') or {}).get('head_branch')
        if mode == 'production':
            # One SHA can have successful production AND branch-preview checks.
            # Never use a known preview as production proof, even when it is newer.
            is_preview = bool(re.search(r'branch[\s_*`-]*preview[\s_*`-]*url', text, re.I))
            if is_preview or (branch is not None and branch != 'main'):
                continue
        urls = re.findall(r'https://[0-9a-f]{8,64}\.sankkostnaden\.pages\.dev(?=[/\s)\]<>"\x27]|$)', text, re.I)
        if urls:
            rows[-1]['referenceCheckId'] = run.get('id')
            return urls[0].rstrip('/'), rows
    return None, rows


def check_page(page, origin, mode):
    row, body = fetch(origin + page['path'] + '?qa=1')
    row['kind'] = mode + '-metadata'
    if body is not None:
        try:
            meta = metadata(body)
            row['observed'] = {'titles': meta.titles, 'descriptions': meta.descriptions, 'canonicals': meta.canonicals}
            for key, values in [('title', meta.titles), ('description', meta.descriptions), ('canonical', meta.canonicals)]:
                if values != [page[key]]:
                    row['errors'].append('Exact ' + key + ' mismatch (missing or duplicate elements also fail)')
            if mode == 'preview' and not row['headerNoindex']:
                row['errors'].append('Preview requires HTTP X-Robots-Tag noindex')
            if mode == 'production' and (row['headerNoindex'] or any(map(noindex, meta.robots))):
                row['errors'].append('Production noindex directive found')
        except Exception as exc:
            row['errors'].append('HTML parse failed: ' + type(exc).__name__)
    return row


def discovery(report, pages):
    row, body = fetch(PROD + '/robots.txt')
    row['kind'] = 'production-robots'
    if body is not None:
        text = body.decode('utf-8-sig')
        parser = urllib.robotparser.RobotFileParser()
        parser.parse(text.splitlines())
        blocked = [p['path'] for p in pages if not parser.can_fetch('Googlebot', PROD + p['path'])]
        if blocked:
            row['errors'].append('Googlebot blocked baseline routes')
            row['blockedPaths'] = blocked
        groups, agents, rules = [], [], []
        for line in text.splitlines() + ['User-agent: __end__']:
            clean = line.split('#', 1)[0].strip()
            if ':' not in clean:
                continue
            key, value = (part.strip() for part in clean.split(':', 1))
            if key.lower() == 'user-agent':
                if rules:
                    groups.append((agents, rules))
                    agents, rules = [], []
                agents.append(value.lower())
            elif key.lower() in ('allow', 'disallow'):
                rules.append((key.lower(), value))
        if any(('*' in agents or 'googlebot' in agents) and any(key == 'disallow' and value in ('/', '/*') for key, value in rules) for agents, rules in groups):
            row['errors'].append('Global crawler disallow found')
    emit(report, row)
    row, body = fetch(PROD + '/sitemap.xml')
    row['kind'] = 'production-sitemap'
    if body is not None:
        tree = ET.fromstring(body)
        locations = {node.text.strip() for node in tree.iter() if node.tag.split('}')[-1] == 'loc' and node.text}
        row['missingBaselineUrls'] = [p['canonical'] for p in pages if p['canonical'] not in locations]
        if row['missingBaselineUrls']:
            row['errors'].append('Sitemap missing baseline URLs')
    emit(report, row)


def identity(report, reference, origin):
    pairs = []
    for name, base in [('reference', reference), ('served', origin)]:
        row, body = fetch(base + '/?qa=1')
        row['kind'] = 'release-homepage-' + name
        emit(report, row)
        if body is None:
            raise ValueError('Cannot retrieve release homepage')
        pairs.append(metadata(body).assets)
    if not pairs[0] or pairs[0] != pairs[1]:
        report['errors'].append('Homepage JS/CSS path sets differ or are empty')
    paths = sorted(pairs[0] | pairs[1] | set(ILLUSTRATION_PATHS))
    source_hashes = {}
    for path in ILLUSTRATION_PATHS:
        try:
            source_hashes[path] = hashlib.sha256((SOURCE_ROOT / 'public' / path.lstrip('/')).read_bytes()).hexdigest()
        except OSError:
            source_hashes[path] = None

    def compare(path):
        proof = {'path': path, 'errors': []}
        rows = []
        for name, base in [('reference', reference), ('served', origin)]:
            row, body = fetch(base + path)
            row['kind'] = 'release-asset-' + name
            rows.append(row)
            proof[name + 'Sha256'] = hashlib.sha256(body).hexdigest() if body is not None else None
        if not proof['referenceSha256'] or proof['referenceSha256'] != proof['servedSha256']:
            proof['errors'].append('Immutable deployment and served asset SHA256 differ or fetch failed')
        if path in source_hashes:
            source_hash = source_hashes[path]
            proof['sourceSha256'] = source_hash
            if source_hash is None:
                proof['errors'].append('Cannot read illustration from expected commit source')
            elif proof['referenceSha256'] != source_hash:
                proof['errors'].append('Illustration differs from expected commit source')
        return proof, rows

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for proof, rows in pool.map(compare, paths):
            report['assets'].append(proof)
            for row in rows:
                emit(report, row)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode', choices=['preview', 'production'], default=os.environ.get('SEO_MODE', 'production'))
    parser.add_argument('--preview-url', default=os.environ.get('SEO_PREVIEW_URL'))
    args = parser.parse_args()
    report = {'passed': False, 'expectedCommit': os.environ.get('VERIFY_COMMIT') or os.environ.get('GITHUB_SHA'),
              'referenceUrl': None, 'verifiedAt': None, 'mode': args.mode, 'checks': [], 'errors': [], 'assets': [],
              'scope': 'HTTP metadata/discovery and immutable release identity; not Google indexing or ranking evidence.'}
    output = Path(os.environ.get('SEO_REPORT_PATH', 'seo-continuity-report.json'))
    try:
        root = Path(__file__).resolve().parents[1]
        pages = json.loads((root / 'tests/fixtures/seo-continuity-baseline.json').read_text())['pages']
        if len(pages) != 63 or len({p['path'] for p in pages}) != 63:
            raise ValueError('Expected 63 unique baseline routes')
        if args.preview_url and not re.fullmatch(r'https://[a-zA-Z0-9-]+\.sankkostnaden\.pages\.dev/?', args.preview_url):
            raise ValueError('Preview URL must be an HTTPS sankkostnaden.pages.dev deployment')
        deadline = time.monotonic() + 180
        remaining = lambda: deadline - time.monotonic()
        target = None
        ready = False
        while remaining() > 0:
            reference, rows = discover_reference(report['expectedCommit'] or '', remaining, args.mode)
            for row in rows:
                row['kind'] = 'readiness-' + row['kind']
                emit(report, row)
            report['referenceUrl'] = reference
            target = PROD if args.mode == 'production' else (args.preview_url or reference)
            if reference and target and remaining() > 0:
                row, body = fetch(target + '/bredband/?qa=1', timeout=max(.1, min(15, remaining())))
                row['kind'] = 'readiness-deployment'
                expected = next(p['title'] for p in pages if p['path'] == '/bredband/')
                ready = body is not None and metadata(body).titles == [expected]
                # Check the live homepage references the immutable release before ending polling.
                if ready and args.mode == 'production' and remaining() > 0:
                    sets = []
                    for base in (reference, target):
                        check, html = fetch(base + '/?qa=1', timeout=max(.1, min(15, remaining())))
                        check['kind'] = 'readiness-release-identity'
                        emit(report, check)
                        sets.append(metadata(html).assets if html is not None else set())
                    ready = bool(sets[0]) and sets[0] == sets[1]
                if not ready:
                    row['errors'].append('Expected release not ready')
                emit(report, row)
                if ready:
                    break
            if remaining() > 0:
                time.sleep(min(10, remaining()))
        if not ready:
            raise ValueError('Deployment readiness timed out (maximum 180 seconds)')
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            for row in pool.map(lambda page: check_page(page, target, args.mode), pages):
                emit(report, row)
        discovery(report, pages)
        identity(report, reference, target)
    except Exception as exc:
        # Exception class and controlled messages only; never dump API responses/auth headers.
        message = str(exc) if isinstance(exc, ValueError) else type(exc).__name__
        report['errors'].append(message)
    finally:
        failures = [row for row in report['checks'] if not row['kind'].startswith('readiness-') and row['errors']]
        report['passed'] = not report['errors'] and not failures and not any(proof['errors'] for proof in report['assets'])
        report['verifiedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        for annotation in failure_annotations(report):
            print(annotation, flush=True)
        commit = report.get('expectedCommit') or ''
        commit = commit if re.fullmatch(r'[0-9a-fA-F]{40}', commit) else 'UNKNOWN'
        reference = report.get('referenceUrl') or ''
        reference = reference if re.fullmatch(r'https://[0-9a-f]{8,64}\.sankkostnaden\.pages\.dev', reference, re.I) else 'UNKNOWN'
        routes = sum(row.get('kind') in ('production-metadata', 'preview-metadata') for row in report['checks'])
        notice = (f"passed={str(report['passed']).lower()}; mode={args.mode}; expectedCommit={commit}"
                  f"; metadata={routes}/63; assets={len(report['assets'])}; reference={reference}"
                  f"; verifiedAt={report['verifiedAt']}")
        print('::notice title=Release verification result::' + workflow_escape(notice), flush=True)
        print('Release verification: ' + ('PASS' if report['passed'] else 'FAIL'), flush=True)
    return 0 if report['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
