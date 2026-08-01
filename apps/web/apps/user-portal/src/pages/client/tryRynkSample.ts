/**
 * Sample quick-scan result for the "Try rynk on your site" demo page.
 * Mirrors the pipeline QuickScanResult shape; the real scan (runQuickScan)
 * swaps in once the backend is hosted.
 */
export interface QuickScanAuditPoint {
  severity: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  detail: string;
}
export interface QuickScanStrategyPoint {
  title: string;
  detail: string;
  impact: 'high' | 'medium' | 'low';
}
export interface QuickScanCompetitor {
  name: string;
  domain: string;
  note: string;
}
export interface QuickScanResult {
  domain: string;
  scannedAt: string;
  headline: string;
  businessType: string;
  summary: string;
  targetCustomer: string;
  competitors: QuickScanCompetitor[];
  auditPoints: QuickScanAuditPoint[];
  strategyPoints: QuickScanStrategyPoint[];
}

export const SAMPLE_QUICK_SCAN: QuickScanResult = {
  domain: 'fadelabbarbers.com',
  scannedAt: new Date().toISOString(),
  headline: '5 quick wins and 3 growth opportunities',
  businessType: 'Local barbershop',
  summary: 'A barbershop in Plano, TX offering fades, beard trims, and hot-towel shaves with online booking.',
  targetCustomer: 'Men and families in Plano/Frisco looking for a reliable local barber.',
  competitors: [
    { name: 'Sharp Line Cuts', domain: 'sharplinecuts.com', note: 'Ranks #1 for "barber Plano" — stronger Google Business Profile and 300+ reviews.' },
    { name: 'Plano Barber Co.', domain: 'planobarber.co', note: 'Owns several "near me" searches with dedicated service pages you don\'t have yet.' },
  ],
  auditPoints: [
    { severity: 'high', category: 'Local', title: 'Not showing in the Google map pack', detail: "Google can't confirm your hours, services, or location, so you're missing the local 3-pack where most customers click." },
    { severity: 'high', category: 'Content', title: 'Weak page titles', detail: 'Your homepage title is just "Home" — it should say something like "Barber & Fades in Plano, TX".' },
    { severity: 'medium', category: 'Schema', title: 'No LocalBusiness structured data', detail: 'Adding it tells Google your category, price range, and opening hours.' },
    { severity: 'medium', category: 'Speed', title: 'Large, unoptimized images', detail: 'Your photos are several MB each — slow on phones, where most of your clients search.' },
    { severity: 'medium', category: 'Content', title: 'No services + prices page', detail: "Visitors (and Google) can't see what you offer or what it costs." },
    { severity: 'low', category: 'Trust', title: 'Reviews not shown on the site', detail: "You have strong Google reviews — showing them on-site builds trust and books more appointments." },
  ],
  strategyPoints: [
    { title: 'Win the map pack for "fade haircut Plano"', detail: 'Optimize your Google Business Profile and add local landing pages so you rank in the top 3.', impact: 'high' },
    { title: 'Build "near me" service pages', detail: '"Beard trim near me", "kids haircut Plano" — target the exact searches your customers type.', impact: 'high' },
    { title: 'Fix titles, meta, and add local schema', detail: 'Quick technical wins that make every page eligible to rank — done for you, automatically.', impact: 'medium' },
    { title: 'Turn on review generation', detail: 'Nudge happy clients to leave reviews and auto-draft replies to build local trust signals.', impact: 'medium' },
  ],
};
