/**
 * Normalize whatever the user typed (URL, with/without protocol, www,
 * path, trailing slash) into a bare lowercase host — e.g.
 *   "https://www.Example.com/pricing/" → "example.com"
 *
 * This is the canonical form used for the runs/{domain}/ directory name, so
 * the web entry scripts, the API routes, and the dashboard all agree on it.
 */
export function normalizeDomain(input: string): string {
  let s = input.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "");
  s = s.replace(/^www\./, "");
  s = s.split("/")[0] ?? s; // drop any path
  s = s.split("?")[0] ?? s; // drop any query
  s = s.split("#")[0] ?? s; // drop any fragment
  s = s.replace(/:\d+$/, ""); // drop any port
  return s.trim();
}
