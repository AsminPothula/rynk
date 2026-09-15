# Add Organization and SoftwareApplication schema sitewide

**Category:** schema

Inject Organization and SoftwareApplication JSON-LD into the global site head so Google and AI assistants can parse Rynk's identity and product details.

## Summary
No structured data currently exists on the site. This PR adds sitewide Organization schema and pricing-page SoftwareApplication/Offer schema so search engines and AI assistants can directly parse who Rynk is and what the Gold/Platinum plans cost.

## Changes
- Insert Organization JSON-LD in the shared header template
- Insert SoftwareApplication JSON-LD with Offer entries on the pricing page template

## Why
Addresses the high-severity audit finding: no structured data found on any crawled page.

## Changes

### `theme/header.php`

```
Add the Organization JSON-LD block generated above (with logo and sameAs links) inside the head tag so it renders on every page.
```

### `theme/page-pricing.php`

```
Add the SoftwareApplication JSON-LD block generated above, updating the Offer entries with the live Gold and Platinum plan prices from the CMS.
```

---
_Proposed by rynk. Review and apply._