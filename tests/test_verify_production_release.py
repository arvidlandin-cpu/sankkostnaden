"""Offline regression checks for same-commit Cloudflare deployment races."""
import importlib.util
import json
import os
import hashlib
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location(
    'verify_production_release', Path(__file__).resolve().parents[1] / 'scripts/verify-production-release.py')
verifier = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(verifier)
SHA = 'a' * 40


def check(identifier, branch, summary, started='2026-10-14T19:30:00Z', conclusion='success'):
    return {'name': 'Cloudflare Pages', 'id': identifier, 'head_sha': SHA,
            'started_at': started, 'conclusion': conclusion,
            'check_suite': {'head_branch': branch} if branch is not None else {},
            'output': {'summary': summary, 'text': ''}}


class DeploymentDiscoveryTests(unittest.TestCase):
    def discover(self, checks, mode):
        requested = []

        def fetch(url, **kwargs):
            requested.append(url)
            self.assertTrue(kwargs['api'])
            return {'url': url, 'status': 200, 'errors': []}, json.dumps({'check_runs': checks}).encode()

        with patch.dict(os.environ, {'GITHUB_REPOSITORY': 'arvidlandin-cpu/sankkostnaden'}), patch.object(verifier, 'fetch', fetch):
            result = verifier.discover_reference(SHA, lambda: 30, mode)
        self.assertTrue(requested)
        self.assertTrue(all('filter=all' in url for url in requested))
        return result[0]

    def setUp(self):
        # Cloudflare's actual Markdown shape: immutable deployment, then alias.
        self.production = check(10, 'main', '**Deployment URL:** https://11111111.sankkostnaden.pages.dev')
        self.preview = check(20, 'ops/autopilot-daily-20261014',
                             '**Deployment URL:** https://22222222.sankkostnaden.pages.dev\n'
                             '**Branch Preview URL:** https://ops-autopilot-daily-20261014.sankkostnaden.pages.dev',
                             started='2026-10-14T19:31:00Z')

    def test_production_uses_earlier_main_not_newest_preview(self):
        for ordering in ([self.preview, self.production], [self.production, self.preview]):
            with self.subTest(ordering=[run['id'] for run in ordering]):
                self.assertEqual(self.discover(ordering, 'production'), 'https://11111111.sankkostnaden.pages.dev')

    def test_preview_uses_latest_successful_deployment(self):
        self.assertEqual(self.discover([self.production, self.preview], 'preview'),
                         'https://22222222.sankkostnaden.pages.dev')

    def test_preview_only_cannot_prove_production(self):
        self.assertIsNone(self.discover([self.preview], 'production'))

    def test_preview_summary_blocks_even_missing_or_conflicting_branch_metadata(self):
        for branch in (None, 'main'):
            with self.subTest(branch=branch):
                self.preview['check_suite'] = {'head_branch': branch}
                self.assertIsNone(self.discover([self.preview], 'production'))

    def test_explicit_non_main_branch_is_not_invented_as_production(self):
        self.preview['output']['summary'] = '**Deployment URL:** https://22222222.sankkostnaden.pages.dev'
        self.assertIsNone(self.discover([self.preview], 'production'))

    def test_confirmed_main_preferred_over_unknown_branch_summary(self):
        unknown = check(30, None, '**Deployment URL:** https://33333333.sankkostnaden.pages.dev',
                        started='2026-10-14T19:32:00Z')
        self.assertEqual(self.discover([unknown, self.production], 'production'),
                         'https://11111111.sankkostnaden.pages.dev')

    def test_missing_branch_can_use_non_preview_summary_evidence(self):
        self.production['check_suite'] = {}
        self.assertEqual(self.discover([self.production], 'production'),
                         'https://11111111.sankkostnaden.pages.dev')

    def test_failed_other_commit_and_non_immutable_urls_do_not_prove_release(self):
        for mutation in ('failure', 'other-sha', 'alias-only'):
            with self.subTest(mutation=mutation):
                run = json.loads(json.dumps(self.production))
                if mutation == 'failure':
                    run['conclusion'] = 'failure'
                elif mutation == 'other-sha':
                    run['head_sha'] = 'b' * 40
                else:
                    run['output']['summary'] = 'https://feat-kostnadskartan-20261014.sankkostnaden.pages.dev'
                self.assertIsNone(self.discover([run], 'production'))


class IllustrationIdentityTests(unittest.TestCase):
    def identity(self, mutation=None):
        report = {'errors': [], 'checks': [], 'assets': []}
        expected = ('/design/cost-map-home.webp',) + tuple(
            '/design/category-' + category + '.webp'
            for category in ('bredband', 'el', 'mobil', 'forsakring', 'ekonomi'))
        payloads = {path: ('source:' + path).encode() for path in expected}
        requested = []
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for path, body in payloads.items():
                source = root / 'public' / path.lstrip('/')
                source.parent.mkdir(parents=True, exist_ok=True)
                if mutation != ('missing-source', path):
                    source.write_bytes(body)

            def fetch(url, **kwargs):
                requested.append(url)
                row = {'url': url, 'status': 200, 'errors': []}
                if url.endswith('/?qa=1'):
                    return row, b'<html><script src="/_next/static/test.js"></script></html>'
                path = '/' + url.split('/', 3)[3]
                body = payloads.get(path, b'compiled-js')
                if mutation == ('served-mismatch', path) and url.startswith(verifier.PROD):
                    body = b'old-served-image'
                elif mutation == ('both-mismatch', path):
                    body = b'wrong-image-on-both-hosts'
                return row, body

            with patch.object(verifier, 'SOURCE_ROOT', root), patch.object(verifier, 'fetch', fetch):
                verifier.identity(report, 'https://11111111.sankkostnaden.pages.dev', verifier.PROD)
        return report, payloads, requested

    def test_all_six_illustrations_match_checkout_and_both_hosts(self):
        report, payloads, requested = self.identity()
        self.assertEqual(report['errors'], [])
        proofs = {proof['path']: proof for proof in report['assets']}
        self.assertIn('/_next/static/test.js', proofs)
        for path, body in payloads.items():
            with self.subTest(path=path):
                proof = proofs[path]
                self.assertEqual(proof['errors'], [])
                expected_hash = hashlib.sha256(body).hexdigest()
                for key in ('referenceSha256', 'servedSha256', 'sourceSha256'):
                    self.assertEqual(proof[key], expected_hash)
                self.assertEqual(sum(url.endswith(path) for url in requested), 2)
        self.assertEqual(len(requested), 16)  # Two homepages, seven assets on each host.

    def test_category_image_mismatch_or_missing_source_rejects_proof(self):
        for mutation in ('served-mismatch', 'both-mismatch', 'missing-source'):
            with self.subTest(mutation=mutation):
                report, _, _ = self.identity((mutation, '/design/category-mobil.webp'))
                proof = next(row for row in report['assets'] if row['path'] == '/design/category-mobil.webp')
                self.assertTrue(proof['errors'])
                self.assertTrue(any(row['errors'] for row in report['assets']))


if __name__ == '__main__':
    unittest.main()
