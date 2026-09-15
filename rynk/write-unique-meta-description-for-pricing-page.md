# Write unique meta description for pricing page

**Category:** metadata

Replace the missing pricing page meta description with the Gold/Platinum-focused description generated above.

## Summary
The pricing page currently has no meta description, so Google auto-generates snippets from body text.

## Changes
- Add the unique, plan-specific meta description to the pricing page head

## Why
Addresses the medium-severity metadata finding on the pricing page.

## Changes

### `theme/page-pricing.php`

```
Set the meta description tag to the Pricing entry from metaTags above instead of leaving it blank, so Google stops auto-generating the snippet.
```

---
_Proposed by rynk. Review and apply._