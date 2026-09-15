# Add FAQPage schema and llms.txt for AI assistant citations

**Category:** technical

Publish an llms.txt file and attach FAQPage JSON-LD to pages carrying Q&A content so AI assistants like ChatGPT and Perplexity can cite Rynk directly.

## Summary
The footer brands the product around SEO, AEO, and GEO, but no FAQPage schema exists anywhere and there is no llms.txt guiding AI crawlers.

## Changes
- Add llms.txt at the root describing Rynk's offering and key pages
- Attach FAQPage JSON-LD to the new small-business-seo and local-business-seo pages

## Why
Addresses the high-severity schema finding and supports the site's own AEO/GEO positioning.

## Changes

### `llms.txt`

```
Create a new root-level llms.txt summarizing Rynk AI's services, target customers, and links to the home, pricing, small-business-seo, and local-business-seo pages for AI crawlers.
```

### `theme/page-small-business-seo.php`

```
Add the FAQPage JSON-LD block generated above using that page's FAQ content.
```

### `theme/page-local-business-seo.php`

```
Add the FAQPage JSON-LD block generated above using that page's FAQ content.
```

---
_Proposed by rynk. Review and apply._