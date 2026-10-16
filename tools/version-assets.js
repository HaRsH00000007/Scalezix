// Renames each JS chunk in altrdtech.com/assets to <name>-<content hash>.js and updates every
// reference (imports, preload lists, <script>/<link> tags, router manifest), so browsers that cached
// an older version always fetch the new code. Run after editing chunks (npm run content does this).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SITE = path.join(__dirname, '..', 'altrdtech.com');
const ASSETS = path.join(SITE, 'assets');

const chunks = fs.readdirSync(ASSETS).filter((f) => f.endsWith('.js'));
const renames = new Map();
for (const f of chunks) {
  const content = fs.readFileSync(path.join(ASSETS, f));
  const hash = crypto.createHash('sha256').update(content).digest('base64url').slice(0, 8);
  const base = f.replace(/-[A-Za-z0-9_-]{8}\.js$/, '');
  const next = `${base}-${hash}.js`;
  if (next !== f) renames.set(f, next);
}
if (!renames.size) {
  console.log('asset names already up to date');
  process.exit(0);
}

const files = [...chunks.map((f) => path.join(ASSETS, f)), ...fs.readdirSync(SITE).filter((f) => f.endsWith('.html')).map((f) => path.join(SITE, f))];
for (const fp of files) {
  let src = fs.readFileSync(fp, 'utf8');
  const before = src;
  for (const [from, to] of renames) src = src.split(from).join(to);
  if (src !== before) fs.writeFileSync(fp, src);
}
for (const [from, to] of renames) fs.renameSync(path.join(ASSETS, from), path.join(ASSETS, to));
console.log(`renamed ${renames.size} chunks:`);
for (const [from, to] of renames) console.log(`  ${from} → ${to}`);
