// Measures gzipped JavaScript actually downloaded: initial load, then after the 3D layer loads.
// Usage (server running): CHROME_PATH=... node scripts/bundle-budget.mjs
import { chromium } from 'playwright';
import { gzipSync } from 'node:zlib';
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } : {});
async function measure(viewport) {
  const ctx = await b.newContext({ viewport });
  await ctx.addCookies([{ name: 'bs_ack', value: '1', domain: new URL(BASE).hostname, path: '/' }]);
  const p = await ctx.newPage();
  const seen = new Map();
  let phase = 'initial';
  p.on('response', async (r) => {
    const u = r.url();
    if (!u.endsWith('.js') || seen.has(u)) return;
    try { const body = await r.body(); seen.set(u, { phase, gz: gzipSync(body).length, three: /WebGLRenderer/.test(body.toString()) }); } catch {}
  });
  // "Initial" = everything requested before the load event; the deferred layers wait for
  // first interaction or 1.2s idle, which is after load.
  await p.goto(BASE + '/', { waitUntil: 'load' });
  phase = 'after-3d';
  await p.mouse.move(300, 300);
  await p.waitForTimeout(4000);
  const sum = (ph) => [...seen.values()].filter((v) => v.phase === ph).reduce((a, v) => a + v.gz, 0);
  const canvas = await p.locator('canvas').count();
  await ctx.close();
  const threeKB = [...seen.values()].filter((v) => v.three).reduce((a, v) => a + v.gz, 0);
  return { initialKB: +(sum('initial') / 1024).toFixed(1), deferredKB: +(sum('after-3d') / 1024).toFixed(1), threeChunkKB: +(threeKB / 1024).toFixed(1), canvas };
}
const desktop = await measure({ width: 1440, height: 900 });
const mobile = await measure({ width: 390, height: 844 });
console.log(JSON.stringify({ desktop, mobile }, null, 2));
await b.close();
