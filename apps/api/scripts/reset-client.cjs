#!/usr/bin/env node
/**
 * Reset a client's pipeline data so the same URL can be re-onboarded / re-run
 * from scratch during demos and testing.
 *
 *   node apps/api/scripts/reset-client.cjs <domain> [--keep-client]
 *
 * Default: deletes the client row + its runs + the runs/<slug>/ directory
 * (a full wipe — re-add the site via the onboard flow to start fresh).
 * --keep-client: keeps the client row but clears its context/status + runs +
 * files (re-onboarding refreshes it in place).
 *
 * Connects to Postgres over TCP (matches docker-compose: localhost:5433).
 */
const { Client } = require('pg');
const { rmSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

function normalizeDomain(input) {
  let s = String(input).trim().toLowerCase();
  s = s.replace(/^https?:\/\//, '').replace(/^www\./, '');
  s = s.split('/')[0].split('?')[0].split('#')[0].replace(/:\d+$/, '');
  return s.trim();
}
const safeSlug = (d) => d.replace(/[^a-z0-9.-]/gi, '_');

(async () => {
  const arg = process.argv[2];
  const keepClient = process.argv.includes('--keep-client');
  if (!arg) {
    console.error('usage: node apps/api/scripts/reset-client.cjs <domain> [--keep-client]');
    process.exit(1);
  }
  const domain = normalizeDomain(arg);
  const repoRoot = resolve(__dirname, '..', '..', '..');
  const runsDir = resolve(repoRoot, 'runs', safeSlug(domain));

  const db = new Client({ host: 'localhost', port: 5433, user: 'rynk', password: 'rynk', database: 'rynk' });
  await db.connect();

  const found = await db.query('select "id" from "Client" where "domain"=$1', [domain]);
  const clientId = found.rows[0]?.id ?? null;

  // 1) delete runs for this domain/client
  const delRuns = await db.query('delete from "Run" where "domain"=$1', [domain]);

  // 2) client row: delete or reset in place
  let clientMsg;
  if (clientId) {
    if (keepClient) {
      await db.query(`update "Client" set "context"=null, "status"='Onboarding' where "id"=$1`, [clientId]);
      clientMsg = 'client reset (kept row)';
    } else {
      await db.query('delete from "Client" where "id"=$1', [clientId]);
      clientMsg = 'client row deleted';
    }
  } else {
    clientMsg = 'no client row found';
  }
  await db.end();

  // 3) wipe the runs/<slug>/ directory the pipeline writes to
  let filesMsg = 'no runs dir';
  if (existsSync(runsDir)) {
    rmSync(runsDir, { recursive: true, force: true });
    filesMsg = `removed ${runsDir}`;
  }

  console.log(`reset ${domain}: ${delRuns.rowCount} run(s) deleted; ${clientMsg}; ${filesMsg}`);
})().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});
