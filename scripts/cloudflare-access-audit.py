#!/usr/bin/env python3
"""Read-only, fixed-zone Cloudflare access diagnostic. Never logs credentials."""
import datetime
import ipaddress
import json
import os
from pathlib import Path
import re
import urllib.error
import urllib.parse
import urllib.request

DOMAIN = 'sankkostnaden.se'
WWW = 'www.' + DOMAIN
API = 'https://api.cloudflare.com/client/v4/'
TOKEN_NAMES = ('CLOUDFLARE_API_TOKEN', 'CF_API_TOKEN')
KEY_NAMES = ('CLOUDFLARE_API_KEY', 'CF_API_KEY')
EMAIL_NAMES = ('CLOUDFLARE_EMAIL', 'CF_API_EMAIL')
NAMES = TOKEN_NAMES + KEY_NAMES + EMAIL_NAMES
IDENTIFIER = re.compile(r'^[a-f0-9]{32}$')
HOSTNAME = re.compile(r'^(?=.{1,253}\.?$)[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+\.?$')
PATH_EXPRESSION = 'concat("https://sankkostnaden.se", http.request.uri.path)'


def credentials(environment):
    values = {name: environment.get(name, '').strip() for name in NAMES}
    if any('\n' in value or '\r' in value or len(value) > 8192 for value in values.values()):
        raise ValueError('Invalid credential configuration')
    for name in TOKEN_NAMES:
        if values[name]:
            return {'Authorization': 'Bearer ' + values[name]}, [name], values
    key = next((name for name in KEY_NAMES if values[name]), None)
    email = next((name for name in EMAIL_NAMES if values[name]), None)
    if key and email:
        return {'X-Auth-Key': values[key], 'X-Auth-Email': values[email]}, [key, email], values
    return None, [], values


def scoped_url(path):
    allowed = (path == 'zones?name=' + DOMAIN
               or re.fullmatch(r'zones/[a-f0-9]{32}/dns_records\?name=www\.sankkostnaden\.se', path)
               or re.fullmatch(r'zones/[a-f0-9]{32}/rulesets/phases/http_request_dynamic_redirect/entrypoint', path))
    if not allowed:
        raise ValueError('Request outside fixed audit scope')
    return API + path


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, message, headers, new_url):
        return None


def get_json(path, headers):
    request = urllib.request.Request(scoped_url(path), headers={**headers, 'Accept': 'application/json'}, method='GET')
    try:
        with urllib.request.build_opener(NoRedirect()).open(request, timeout=25) as response:
            raw = response.read(500_001)
            if len(raw) > 500_000:
                return {'http_status': response.status, 'transport': 'response_too_large', 'data': None}
            return {'http_status': response.status, 'transport': 'ok', 'data': json.loads(raw)}
    except urllib.error.HTTPError as error:
        # Only numeric provider error codes survive. Never return bodies/headers.
        try:
            raw = error.read(50_001)
            data = json.loads(raw) if len(raw) <= 50_000 else None
        except (ValueError, OSError):
            data = None
        return {'http_status': error.code, 'transport': 'http_error', 'data': data}
    except Exception:
        return {'http_status': None, 'transport': 'request_failed', 'data': None}


def provider_status(result):
    data = result.get('data')
    errors = data.get('errors', []) if isinstance(data, dict) else []
    return {'http_status': result.get('http_status'), 'transport': result.get('transport'),
            'success': data.get('success') is True if isinstance(data, dict) else False,
            'error_codes': [item['code'] for item in errors if isinstance(item, dict) and type(item.get('code')) is int][:10]}


def successful(result):
    return result.get('http_status') == 200 and isinstance(result.get('data'), dict) and result['data'].get('success') is True


def public_dns(record):
    kind = record.get('type')
    content = str(record.get('content', ''))
    valid = False
    if kind in ('A', 'AAAA'):
        try:
            valid = ipaddress.ip_address(content).version == (4 if kind == 'A' else 6)
        except ValueError:
            pass
    elif kind == 'CNAME':
        valid = bool(HOSTNAME.fullmatch(content))
    return {'type': kind if kind in ('A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS', 'CAA') else 'other',
            'content': content if valid else '[redacted non-address content]',
            'proxied': record.get('proxied') if type(record.get('proxied')) is bool else None}


def safe_target(value):
    try:
        url = urllib.parse.urlsplit(value)
        if url.scheme not in ('http', 'https') or not url.hostname:
            return '[redacted unsupported target]'
        host = url.hostname + (':' + str(url.port) if url.port else '')
        # Query names and values can both contain credentials. Omit all of them.
        return urllib.parse.urlunsplit((url.scheme, host, url.path, 'redacted' if url.query else '', ''))
    except (TypeError, ValueError):
        return '[redacted unsupported target]'


def safe_rule(rule):
    expression = rule.get('expression', '')
    exact = bool(re.fullmatch(r'\s*\(?\s*http\.host\s+eq\s+"www\.sankkostnaden\.se"\s*\)?\s*', expression))
    result = {'id': rule.get('id') if IDENTIFIER.fullmatch(str(rule.get('id', ''))) else None,
              'action': rule.get('action') if rule.get('action') in ('redirect', 'skip', 'execute', 'block', 'challenge', 'managed_challenge', 'log') else 'other',
              'enabled': rule.get('enabled') if type(rule.get('enabled')) is bool else None,
              'exact_www_host': exact}
    if exact and rule.get('action') == 'redirect':
        source = rule.get('action_parameters', {}).get('from_value', {})
        target = source.get('target_url', {})
        result['status_code'] = source.get('status_code') if source.get('status_code') in (301, 302, 307, 308) else None
        result['preserve_query_string'] = source.get('preserve_query_string') if type(source.get('preserve_query_string')) is bool else None
        if isinstance(target.get('value'), str):
            result['target'] = safe_target(target['value'])
        elif target.get('expression') == PATH_EXPRESSION:
            result['target_expression'] = PATH_EXPRESSION
        else:
            result['target_expression'] = '[redacted unsupported expression]'
    return result


def redact(value, secrets):
    if isinstance(value, dict):
        return {key: redact(item, secrets) for key, item in value.items()}
    if isinstance(value, list):
        return [redact(item, secrets) for item in value]
    if isinstance(value, str):
        for secret in secrets:
            if secret:
                value = value.replace(secret, '[redacted]')
    return value


def audit(environment=None, fetch=get_json):
    environment = os.environ if environment is None else environment
    report = {'read_only': True, 'domain': DOMAIN, 'status': 'no_configured_credential',
              'credential_scope': 'Only the six named bindings exposed to this job; this does not establish absence in the account or other configurations.',
              'selected_bindings': [], 'credential_presence': {name: bool(environment.get(name, '').strip()) for name in NAMES}}
    try:
        headers, bindings, values = credentials(environment)
    except (ValueError, AttributeError):
        return {**report, 'status': 'invalid_credential_configuration'}
    if headers is None:
        return report
    report['selected_bindings'] = bindings
    try:
        zones = fetch('zones?name=' + DOMAIN, headers)
        report['zone_lookup'] = provider_status(zones)
        if not successful(zones):
            report['status'] = 'zone_lookup_failed'
            return redact(report, values.values())
        rows = zones['data'].get('result')
        if not isinstance(rows, list) or len(rows) != 1 or rows[0].get('name') != DOMAIN:
            report['status'] = 'zone_missing_or_ambiguous'
            return redact(report, values.values())
        zone = rows[0]
        zone_id, account_id = str(zone.get('id', '')), str(zone.get('account', {}).get('id', ''))
        if not IDENTIFIER.fullmatch(zone_id) or not IDENTIFIER.fullmatch(account_id):
            report['status'] = 'invalid_zone_metadata'
            return redact(report, values.values())
        report['zone'] = {'id': zone_id, 'account_id': account_id, 'name': DOMAIN}
        dns = fetch('zones/' + zone_id + '/dns_records?name=' + WWW, headers)
        report['www_dns_lookup'] = provider_status(dns)
        dns_rows = dns.get('data', {}).get('result') if isinstance(dns.get('data'), dict) else None
        if successful(dns) and isinstance(dns_rows, list) and all(isinstance(row, dict) and row.get('name') == WWW for row in dns_rows):
            report['www_dns'] = [public_dns(row) for row in dns_rows]
        rules = fetch('zones/' + zone_id + '/rulesets/phases/http_request_dynamic_redirect/entrypoint', headers)
        report['redirect_lookup'] = provider_status(rules)
        ruleset = rules.get('data', {}).get('result') if isinstance(rules.get('data'), dict) else None
        if successful(rules) and isinstance(ruleset, dict):
            report['redirect_ruleset'] = {'id': ruleset.get('id') if IDENTIFIER.fullmatch(str(ruleset.get('id', ''))) else None,
                                          'phase': ruleset.get('phase') if ruleset.get('phase') == 'http_request_dynamic_redirect' else 'unexpected',
                                          'rules': [safe_rule(row) for row in ruleset.get('rules', []) if isinstance(row, dict)]}
        report['status'] = 'inspected' if 'www_dns' in report and 'redirect_ruleset' in report else 'partially_inspected'
    except Exception:
        report['status'] = 'audit_failed'
    return redact(report, values.values())


if __name__ == '__main__':
    result = audit()
    result['generated_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    output = Path('cloudflare-access-audit')
    output.mkdir(exist_ok=True)
    (output / 'report.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))
