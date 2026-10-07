# Google organic performance

This workflow removes the reporting dependency on Windsor.ai for Sänk Kostnaden's two core Google sources:

- Google Analytics 4
- Google Search Console

It runs daily and can also be triggered manually. The report stores only aggregate traffic/search metrics.

## One-time setup

Create a Google Cloud service account, enable the Google Analytics Data API, Google Analytics Admin API and Google Search Console API, then grant the service-account email Viewer access to the Sänk Kostnaden GA4 property and Full/Restricted read access to the Search Console property.

Store the complete service-account JSON key in the GitHub repository secret:

`GOOGLE_SERVICE_ACCOUNT_JSON`

No GA4 property ID or Search Console property ID is normally required. The report discovers the GA4 property by measurement ID `G-E2XTJVY5EX` and the Search Console property by hostname `sankkostnaden.se`.

Optional overrides are `GA4_PROPERTY_ID` and `GSC_SITE_URL`.
