// Measures every text/background and functional-border pair used, in both themes (WCAG 2.x formula).
// Exit code 1 if any required pair fails. Usage: npm run contrast
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (hex) => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const light = { surface: '#F6F3EE', surface2: '#EDE8E0', text: '#0A0A0B', text2: '#3A3A42', quiet: '#8A8A93', accent: '#7A5C34', focus: '#8C6B3F', stroke: '#8C6B3F', border: '#8A8273' };
const dark = { surface: '#0A0A0B', surface2: '#16161A', text: '#F6F3EE', text2: '#B4B0A8', quiet: '#8A8A93', accent: '#D6BC92', focus: '#D6BC92', stroke: '#B08D57', border: '#77736B' };

const checks = (t, theme) => [
  ['Body text', t.text, t.surface, 4.5], ['Body text on panel', t.text, t.surface2, 4.5],
  ['Secondary text', t.text2, t.surface, 4.5], ['Secondary text on panel', t.text2, t.surface2, 4.5],
  ['Accent text', t.accent, t.surface, 4.5], ['Accent text on panel', t.accent, t.surface2, 4.5],
  ['Button label (inverse)', t.surface, t.text, 4.5],
  ['Focus ring', t.focus, t.surface, 3], ['Focus ring on panel', t.focus, t.surface2, 3],
  ['Functional border', t.border, t.surface, 3], ['Functional border on panel', t.border, t.surface2, 3],
  ['CTA rule / stroke', t.stroke, t.surface, 3],
  [`Quiet text (>= 24px only)`, t.quiet, t.surface, 3],
].map(([name, fg, bg, min]) => ({ theme, name, fg, bg, ratio: ratio(fg, bg), min }));

const rows = [...checks(light, 'light'), ...checks(dark, 'dark')];
let failed = 0;
console.log('Theme  Pair                           FG       BG       Ratio  Min  Result');
for (const r of rows) {
  const ok = r.ratio >= r.min;
  if (!ok) failed++;
  console.log(`${r.theme.padEnd(6)} ${r.name.padEnd(30)} ${r.fg}  ${r.bg}  ${r.ratio.toFixed(2).padStart(5)}  ${String(r.min).padEnd(3)}  ${ok ? 'PASS' : 'FAIL'}`);
}
console.log(failed ? `\n${failed} pair(s) fail.` : '\nAll pairs pass.');
process.exit(failed ? 1 : 0);
