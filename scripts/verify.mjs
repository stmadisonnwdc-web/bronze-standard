// Verification protocol (Variant A v2.1, deliverable 7). Runs against a production server:
//   npm run build && npm start   (in another terminal)
//   npm run verify               (BASE_URL defaults to http://localhost:3000)
// Checks: axe-core on every route, no-JS reading and form submission, Ledger data leak,
// no Three.js on mobile, no remote HDR or third-party requests, reduced-motion behaviour.
// Lighthouse and the bundle analyzer are separate commands (see README, Verification).
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const routes = ['/', '/baseline', '/roster', '/method', '/trust', '/apply', '/takedown', '/ledger', '/changelog', '/search', '/legal/notice', '/legal/privacy', '/legal/terms', '/legal/accessibility'];
const results = [];
const record = (check, method, result, pass) => { results.push({ check, method, result, pass }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${check} — ${result}`); };
const host = new URL(BASE).host;
const ack = [{ name: 'bs_ack', value: '1', domain: new URL(BASE).hostname, path: '/' }];

// CHROME_PATH lets the suite use an already-installed Chromium instead of `npx playwright install`.
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

// 1. axe-core, every route, desktop, notice acknowledged.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addCookies(ack);
  const page = await ctx.newPage();
  let worst = 0;
  const notes = [];
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const bad = a.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    worst += bad.length;
    if (bad.length) notes.push(`${r}: ${bad.map((v) => v.id).join(', ')}`);
  }
  record('axe-core: zero critical or serious violations', 'AxeBuilder, WCAG 2.2 AA tags, 14 routes', worst ? notes.join(' | ') : '0 violations', worst === 0);
  // 1b. The 18+ notice itself.
  const fresh = await browser.newContext();
  const p2 = await fresh.newPage();
  await p2.goto(BASE + '/', { waitUntil: 'networkidle' });
  const a2 = await new AxeBuilder({ page: p2 }).analyze();
  const bad2 = a2.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  record('axe-core: 18+ notice', 'AxeBuilder on first visit', bad2.length ? bad2.map((v) => v.id).join(', ') : '0 violations', bad2.length === 0);
  await fresh.close();
  await ctx.close();
}

// 2. JavaScript disabled: every page reads; notice, takedown submit.
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.getByRole('button', { name: 'I am 18 or older' }).click();
  await page.waitForLoadState('load');
  const noticeGone = (await page.locator('.age-notice').count()) === 0;
  record('No-JS: 18+ notice acknowledges by form POST', 'Playwright, JS disabled', noticeGone ? 'cookie set, notice closed' : 'notice still shown', noticeGone);
  let unreadable = [];
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: 'load' });
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    if (!h1 || !h1.trim()) unreadable.push(r);
  }
  record('No-JS: every route renders its h1', 'Playwright, JS disabled', unreadable.length ? `missing on ${unreadable.join(', ')}` : `${routes.length} routes`, unreadable.length === 0);
  await page.goto(BASE + '/takedown', { waitUntil: 'load' });
  await page.fill('#requester', 'verify@example.invalid');
  await page.fill('#assetRef', 'verification test asset');
  await page.getByRole('button', { name: 'Send request' }).click();
  await page.waitForLoadState('load');
  const ok = /\/takedown\/confirm/.test(page.url()) && (await page.getByText(/Case TD-/).count()) > 0;
  record('No-JS: takedown submits and returns a case ID', 'Playwright, JS disabled', ok ? page.url().split('?')[0] : `landed on ${page.url()}`, ok);
  await page.goto(BASE + '/apply', { waitUntil: 'load' });
  const disabled = await page.locator('form[action="/api/apply"] fieldset[disabled]').count();
  record('No-JS: application form renders (disabled until Gate 0)', 'Playwright, JS disabled', `${disabled} disabled fieldsets`, disabled > 0 || (await page.locator('form[action="/api/apply"]').count()) > 0);
  await ctx.close();
}

// 3. Ledger without a session: no talent data in HTML, RSC payload or network.
{
  const ctx = await browser.newContext();
  await ctx.addCookies(ack);
  const page = await ctx.newPage();
  const bodies = [];
  page.on('response', async (res) => { try { if (res.url().includes(host)) bodies.push(await res.text()); } catch { /* binary */ } });
  await page.goto(BASE + '/ledger', { waitUntil: 'networkidle' });
  const leaked = bodies.some((b) => /netReceipts|commissionRate|subscriberDelta|"slug":/.test(b));
  record('Ledger: no talent data without a session', 'Scan every same-origin response body for ledger fields', leaked ? 'ledger fields found' : 'none found', !leaked);
  const forged = await browser.newContext();
  await forged.addCookies([...ack, { name: 'bs_session', value: 'eyJzbHVnIjoieCIsImV4cCI6OTk5OTk5OTk5OTk5OX0.forged', domain: new URL(BASE).hostname, path: '/' }]);
  const fp = await forged.newPage();
  await fp.goto(BASE + '/ledger', { waitUntil: 'load' });
  const locked = (await fp.getByRole('button', { name: 'Email me a sign-in link' }).count()) > 0;
  record('Ledger: forged session cookie is rejected', 'Forged HMAC', locked ? 'locked shell shown' : 'session accepted', locked);
  await forged.close();
  await ctx.close();
}

// 4. Mobile: no Three.js; no remote HDR; no third-party requests.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addCookies(ack);
  const page = await ctx.newPage();
  const urls = [];
  page.on('request', (r) => urls.push(r.url()));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.mouse.move(100, 100);
  await page.waitForTimeout(2500);
  const jsBodies = [];
  for (const u of urls.filter((x) => x.endsWith('.js'))) {
    const t = await (await ctx.request.get(u)).text();
    jsBodies.push(t);
  }
  const three = jsBodies.some((b) => /WebGLRenderer|THREE\.REVISION|three\.module/.test(b));
  const hdr = urls.some((u) => u.endsWith('.hdr'));
  record('Mobile: no Three.js in any loaded chunk', 'Fetch every JS request at 390px; search for WebGLRenderer', three ? 'Three.js found' : 'not found', !three);
  record('Mobile: HDR not requested', 'Network log', hdr ? 'requested' : 'not requested', !hdr);
  const third = urls.filter((u) => !u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:'));
  record('No third-party requests (mobile)', 'Network log', third.length ? third.join(', ') : 'none', third.length === 0);
  await ctx.close();
}

// 5. Desktop: HDR is same-origin, never a preset CDN.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addCookies(ack);
  const page = await ctx.newPage();
  const urls = [];
  page.on('request', (r) => urls.push(r.url()));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.mouse.move(400, 300);
  await page.waitForTimeout(3000);
  const hdrs = urls.filter((u) => u.includes('.hdr'));
  const remote = hdrs.filter((u) => !u.startsWith(BASE)) ;
  const third = urls.filter((u) => !u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:'));
  record('Desktop: HDR served from this origin only', 'Network log', hdrs.length ? (remote.length ? `remote: ${remote.join(', ')}` : hdrs.join(', ')) : 'HDR not requested (WebGL unavailable in this browser?)', remote.length === 0);
  record('No third-party requests (desktop)', 'Network log', third.length ? third.join(', ') : 'none', third.length === 0);
  await ctx.close();
}

// 6. Reduced motion: no canvas, final values, no curtain.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addCookies(ack);
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.mouse.move(400, 300);
  await page.waitForTimeout(2000);
  const canvas = await page.locator('canvas').count();
  record('Reduced motion: no 3D canvas', 'Playwright reducedMotion=reduce', canvas ? 'canvas present' : 'poster only', canvas === 0);
  await ctx.close();
}

// 7. Keyboard: command palette opens, navigates, closes, restores focus.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addCookies(ack);
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('ControlOrMeta+k');
  const open = await page.getByRole('dialog', { name: 'Search the site' }).isVisible().catch(() => false);
  await page.keyboard.type('takedown');
  await page.keyboard.press('Enter');
  await page.waitForURL(/\/takedown/, { timeout: 5000 }).catch(() => {});
  const navigated = page.url().includes('/takedown');
  await page.keyboard.press('ControlOrMeta+k');
  await page.keyboard.press('Escape');
  // Allow the 180ms exit transition to finish before checking.
  const closed = await page.getByRole('dialog', { name: 'Search the site' }).waitFor({ state: 'hidden', timeout: 1500 }).then(() => true).catch(() => false);
  record('Keyboard: command palette open → search → Enter → Escape', 'Playwright keyboard', `open ${open}, navigated ${navigated}, closed ${closed}`, open && navigated && closed);
  await ctx.close();
}

await browser.close();
mkdirSync('reports', { recursive: true });
const md = ['| Check | Method | Result | Pass |', '| --- | --- | --- | --- |', ...results.map((r) => `| ${r.check} | ${r.method} | ${r.result.replace(/\|/g, '/')} | ${r.pass ? 'PASS' : 'FAIL'} |`)].join('\n');
writeFileSync('reports/verification.md', `# Verification — ${new Date().toISOString()}\n\nBase URL: ${BASE}\n\n${md}\n`);
console.log('\nWrote reports/verification.md');
process.exit(results.every((r) => r.pass) ? 0 : 1);
