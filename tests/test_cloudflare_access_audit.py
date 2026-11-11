import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location('audit', Path(__file__).resolve().parents[1] / 'scripts/cloudflare-access-audit.py')
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
ZONE = 'a' * 32
ACCOUNT = 'b' * 32
SECRET = 'credential-must-never-appear'


def ok(result):
    return {'http_status': 200, 'transport': 'ok', 'data': {'success': True, 'result': result}}


class AuditTests(unittest.TestCase):
    def test_absence_is_explicit_and_performs_no_requests(self):
        def forbidden(*args):
            self.fail('No request is allowed without configured credentials')
        result = MODULE.audit({}, forbidden)
        self.assertEqual(result['status'], 'no_configured_credential')
        self.assertEqual(result['selected_bindings'], [])

    def test_partial_global_key_is_not_treated_as_configured(self):
        result = MODULE.audit({'CF_API_KEY': SECRET}, lambda *args: self.fail('Incomplete auth'))
        self.assertEqual(result['status'], 'no_configured_credential')
        self.assertTrue(result['credential_presence']['CF_API_KEY'])
        self.assertNotIn(SECRET, json.dumps(result))

    def test_only_fixed_scope_can_be_requested(self):
        for path in ['zones?name=other.example', 'zones/' + ZONE + '/dns_records',
                     'zones/' + ZONE + '/settings', 'https://other.example/',
                     '../accounts', 'zones/' + ZONE + '/dns_records?name=' + MODULE.WWW + '&extra=1']:
            with self.assertRaises(ValueError):
                MODULE.scoped_url(path)
        self.assertEqual(MODULE.scoped_url('zones?name=' + MODULE.DOMAIN), MODULE.API + 'zones?name=' + MODULE.DOMAIN)

    def test_http_client_uses_get_without_request_body(self):
        captured = []
        class Response:
            status = 200
            def __enter__(self): return self
            def __exit__(self, *args): return False
            def read(self, size): return b'{"success":true,"result":[]}'
        class Opener:
            def open(self, request, timeout):
                captured.append(request)
                return Response()
        with patch.object(MODULE.urllib.request, 'build_opener', return_value=Opener()):
            result = MODULE.get_json('zones?name=' + MODULE.DOMAIN, {'Authorization': 'Bearer ' + SECRET})
        self.assertEqual(result['http_status'], 200)
        self.assertEqual(len(captured), 1)
        self.assertEqual(captured[0].get_method(), 'GET')
        self.assertIsNone(captured[0].data)
        self.assertEqual(captured[0].full_url, MODULE.API + 'zones?name=' + MODULE.DOMAIN)

    def test_unavailable_entrypoint_remains_distinct_from_access_success(self):
        responses = [ok([{'id': ZONE, 'name': MODULE.DOMAIN, 'account': {'id': ACCOUNT}}]),
                     ok([{'name': MODULE.WWW, 'type': 'CNAME', 'content': 'sankkostnaden.pages.dev', 'proxied': False}]),
                     {'http_status': 404, 'transport': 'http_error', 'data': {'success': False, 'errors': [{'code': 10003}]}}]
        report = MODULE.audit({'CF_API_TOKEN': SECRET}, lambda *args: responses.pop(0))
        self.assertEqual(report['status'], 'partially_inspected')
        self.assertFalse(report['www_dns'][0]['proxied'])
        self.assertEqual(report['redirect_lookup']['http_status'], 404)
        self.assertNotIn('redirect_ruleset', report)

    def test_exact_zone_dns_and_rules_are_get_only_and_safe(self):
        calls = []
        responses = [
            ok([{'id': ZONE, 'name': MODULE.DOMAIN, 'account': {'id': ACCOUNT}}]),
            ok([{'name': MODULE.WWW, 'type': 'CNAME', 'content': 'sankkostnaden.pages.dev', 'proxied': True}]),
            ok({'id': 'c' * 32, 'phase': 'http_request_dynamic_redirect', 'rules': [{
                'id': 'd' * 32, 'action': 'redirect', 'enabled': True,
                'expression': '(http.host eq "www.sankkostnaden.se")',
                'action_parameters': {'from_value': {'status_code': 301, 'preserve_query_string': True,
                    'target_url': {'expression': MODULE.PATH_EXPRESSION}}}}]})]
        def fetch(path, headers):
            MODULE.scoped_url(path)
            self.assertEqual(headers, {'Authorization': 'Bearer ' + SECRET})
            calls.append(path)
            return responses[len(calls) - 1]
        report = MODULE.audit({'CLOUDFLARE_API_TOKEN': SECRET}, fetch)
        self.assertEqual(report['status'], 'inspected')
        self.assertEqual(calls, ['zones?name=' + MODULE.DOMAIN, 'zones/' + ZONE + '/dns_records?name=' + MODULE.WWW,
                               'zones/' + ZONE + '/rulesets/phases/http_request_dynamic_redirect/entrypoint'])
        self.assertEqual(report['selected_bindings'], ['CLOUDFLARE_API_TOKEN'])
        self.assertTrue(report['www_dns'][0]['proxied'])
        self.assertEqual(report['redirect_ruleset']['rules'][0]['status_code'], 301)
        self.assertNotIn(SECRET, json.dumps(report))

    def test_global_key_pair_uses_existing_names_only(self):
        headers, bindings, _ = MODULE.credentials({'CF_API_KEY': SECRET, 'CLOUDFLARE_EMAIL': 'owner@example.com'})
        self.assertEqual(bindings, ['CF_API_KEY', 'CLOUDFLARE_EMAIL'])
        self.assertEqual(set(headers), {'X-Auth-Key', 'X-Auth-Email'})

    def test_wrong_ambiguous_or_invalid_zone_stops_before_followups(self):
        cases = [[], [{'name': 'other.example', 'id': ZONE}],
                 [{'name': MODULE.DOMAIN, 'id': ZONE}] * 2,
                 [{'name': MODULE.DOMAIN, 'id': '../bad', 'account': {'id': ACCOUNT}}]]
        for rows in cases:
            calls = []
            def fetch(path, headers):
                calls.append(path)
                return ok(rows)
            report = MODULE.audit({'CF_API_TOKEN': SECRET}, fetch)
            self.assertEqual(len(calls), 1)
            self.assertIn(report['status'], ('zone_missing_or_ambiguous', 'invalid_zone_metadata'))

    def test_provider_errors_do_not_leak_raw_messages_or_headers(self):
        def fetch(path, headers):
            return {'http_status': 403, 'transport': 'http_error', 'data': {
                'success': False, 'errors': [{'code': 10000, 'message': SECRET + ' private error'}],
                'Authorization': SECRET}}
        report = MODULE.audit({'CF_API_TOKEN': SECRET}, fetch)
        self.assertEqual(report['status'], 'zone_lookup_failed')
        self.assertEqual(report['zone_lookup']['error_codes'], [10000])
        self.assertNotIn(SECRET, json.dumps(report))
        self.assertNotIn('private error', json.dumps(report))

    def test_query_userinfo_and_unsupported_expressions_are_redacted(self):
        value = MODULE.safe_target('https://username:password@sankkostnaden.se/path?token=' + SECRET + '#private')
        self.assertEqual(value, 'https://sankkostnaden.se/path?redacted')
        rule = MODULE.safe_rule({'expression': 'http.cookie eq "' + SECRET + '"', 'action': 'redirect'})
        self.assertNotIn(SECRET, json.dumps(rule))
        self.assertFalse(rule['exact_www_host'])
        self.assertEqual(MODULE.public_dns({'type': 'TXT', 'content': SECRET})['content'], '[redacted non-address content]')

    def test_redirects_are_not_followed_and_header_injection_is_rejected(self):
        self.assertIsNone(MODULE.NoRedirect().redirect_request(None, None, 302, '', {}, 'https://other.example/'))
        report = MODULE.audit({'CF_API_TOKEN': SECRET + '\r\nX-Foo: nope'}, lambda *args: self.fail('Invalid auth'))
        self.assertEqual(report['status'], 'invalid_credential_configuration')
        self.assertNotIn(SECRET, json.dumps(report))


if __name__ == '__main__':
    unittest.main()
