<?php
/**
 * Template Name: Rynk Pricing
 *
 * /pricing - port of `(public)/pricing/page.tsx`.
 *
 * Two tiers + a one-time site-build offer + the free-scan CTA. Same layout
 * grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10
 *   - content: mx-auto max-w-screen-xl
 *
 * @package rynk-ai
 */

get_header();

$tier_styles = rynk_tier_styles();
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name