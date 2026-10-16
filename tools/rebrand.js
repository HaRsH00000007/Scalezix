// Applies tools/content-map.js to the built site: JS chunks in altrdtech.com/assets and the
// prerendered HTML pages. Text must change in both places or React hydration falls back to
// client rendering, so every pair is applied to both and the hit counts are reported.
//
//   node tools/rebrand.js            apply in place
//   node tools/rebrand.js --dry      report only
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');

const SITE = path.join(__dirname, '..', 'altrdtech.com');
const ASSETS = path.join(SITE, 'assets');
const dry = process.argv.includes('--dry');
const map = require('./content-map');

const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Normalise pairs.
const pairs = map.text.map((p, i) => {
  const o = Array.isArray(p) ? { from: p[0], to: p[1] } : { ...p };
  o.id = i;
  o.jsHits = 0;
  o.htmlHits = 0;
  return o;
});
const seen = new Map();
for (const p of pairs) {
  const key = `${p.from}\u0000${(p.js || []).join(',')}\u0000${p.pre || ''}`;
  if (seen.has(key) && seen.get(key).to !== p.to) throw new Error(`Conflicting targets for "${p.from}"`);
  seen.set(key, p);
}

function jsPairFor(value, file) {
  for (const p of pairs) {
    if (p.from !== value) continue;
    if (p.js && !p.js.some((pre) => file.startsWith(pre))) continue;
    return p;
  }
  return null;
}

function literalSource(node, value, src) {
  const q = src[node.start];
  if (q === '`') return '`' + value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
  return q + value.replace(/\\/g, '\\\\').replace(new RegExp(q, 'g'), '\\' + q).replace(/\n/g, '\\n') + q;
}

function applyRaw(src, html) {
  for (const [from, to] of map.raw) {
    src = src.split(from).join(to);
    if (html && escHtml(from) !== from) src = src.split(escHtml(from)).join(escHtml(to));
  }
  return src;
}

// ── JS chunks ────────────────────────────────────────────────────────────────
for (const file of fs.readdirSync(ASSETS).filter((f) => f.endsWith('.js'))) {
  const fp = path.join(ASSETS, file);
  const src = fs.readFileSync(fp, 'utf8');
  const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module' });
  const edits = [];
  walk.full(ast, (node) => {
    if (node.type === 'Literal' && typeof node.value === 'string') {
      const p = jsPairFor(node.value, file);
      if (p) edits.push([node.start, node.end, literalSource(node, p.to, src), p]);
    } else if (node.type === 'TemplateLiteral' && node.quasis.length === 1) {
      const p = jsPairFor(node.quasis[0].value.cooked, file);
      if (p) edits.push([node.start, node.end, literalSource(node, p.to, src), p]);
    }
  });
  edits.sort((a, b) => b[0] - a[0]);
  let out = src;
  for (const [s, e, text, p] of edits) {
    out = out.slice(0, s) + text + out.slice(e);
    p.jsHits++;
  }
  out = applyRaw(out, false);
  if (out !== src && !dry) fs.writeFileSync(fp, out);
}

// ── Prerendered HTML ─────────────────────────────────────────────────────────
const DEFAULT_PRE = '(?:>|-->|=")';
for (const file of fs.readdirSync(SITE).filter((f) => f.endsWith('.html'))) {
  const fp = path.join(SITE, file);
  const src = fs.readFileSync(fp, 'utf8');
  const spans = [];
  for (const p of pairs) {
    if (p.html === false) continue;
    const re = new RegExp(`(?<=${p.pre || DEFAULT_PRE})${escRe(escHtml(p.from))}(?=<|")`, 'g');
    for (const m of src.matchAll(re)) spans.push([m.index, m.index + m[0].length, escHtml(p.to), p]);
  }
  // Single pass: earliest, longest match wins; no replacement is re-processed by another pair.
  spans.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  let out = '';
  let pos = 0;
  for (const [s, e, text, p] of spans) {
    if (s < pos) continue;
    out += src.slice(pos, s) + text;
    pos = e;
    p.htmlHits++;
  }
  out += src.slice(pos);
  out = applyRaw(out, true);
  if (out !== src && !dry) fs.writeFileSync(fp, out);
}

// ── Report ───────────────────────────────────────────────────────────────────
// Identical pairs listed twice (e.g. two tiles sharing a label) count as one.
const hitByFrom = new Map();
for (const p of pairs) hitByFrom.set(p.from, (hitByFrom.get(p.from) || 0) + p.jsHits);
const missingJs = pairs.filter((p) => hitByFrom.get(p.from) === 0);
const missingHtml = pairs.filter((p) => p.html !== false && p.htmlHits === 0 && p.jsHits > 0);
console.log(`${pairs.length} text pairs, ${map.raw.length} raw pairs${dry ? ' (dry run)' : ''}`);
console.log(`JS replacements: ${pairs.reduce((n, p) => n + p.jsHits, 0)}, HTML replacements: ${pairs.reduce((n, p) => n + p.htmlHits, 0)}`);
if (missingJs.length) {
  console.log(`\nNot found in JS (${missingJs.length}):`);
  for (const p of missingJs) console.log('  -', JSON.stringify(p.from).slice(0, 120));
}
if (missingHtml.length) {
  console.log(`\nIn JS but not in prerendered HTML (${missingHtml.length}) — fine for content that is not server-rendered (tabs, popups):`);
  for (const p of missingHtml) console.log('  -', JSON.stringify(p.from).slice(0, 120));
}
