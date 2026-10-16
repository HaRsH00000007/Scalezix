// Zero-dependency static server for the Scalezix site.
//   node server.js            -> http://localhost:4173
//   PORT=8080 node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'altrdtech.com');
const SUBMISSIONS = path.join(__dirname, 'submissions', 'contact.jsonl');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

// Clean route -> prerendered page. Mirrors the TanStack routes in the bundle.
const ROUTES = {
  '/': 'index.html',
  '/customer': 'customer.html',
  '/what-we-do': 'what-we-do.html',
  '/who-we-are': 'who-we-are.html',
  '/privacy-policy': 'privacy-policy.html',
  '/terms-of-use': 'terms-of-use.html',
};

function send(res, status, body, type, extra = {}) {
  res.writeHead(status, { 'Content-Type': type, ...extra });
  res.end(body);
}

// Every file revalidates on each load (cheap 304s via ETag). The asset filenames are not content
// hashes any more (tools/rebrand.js edits them in place), so long-lived caching would serve stale code.
function serveFile(req, res, file, status = 200) {
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) return notFound(res);
    const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
    const headers = { 'Cache-Control': 'no-cache', ETag: etag };
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, headers);
      return res.end();
    }
    fs.readFile(file, (err2, data) => {
      if (err2) return notFound(res);
      const ext = path.extname(file).toLowerCase();
      send(res, status, data, TYPES[ext] || 'application/octet-stream', headers);
    });
  });
}

function notFound(res) {
  send(
    res,
    404,
    '<!doctype html><meta charset="utf-8"><title>Not found — Scalezix</title>' +
      '<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0c0d0f;color:#fff;font:16px system-ui">' +
      '<div style="text-align:center"><h1 style="font-weight:400">Page not found</h1><a href="/" style="color:#9a9a9a">Back to home</a></div>',
    'text/html; charset=utf-8'
  );
}

// Stand-in for the site's contact-form server function (POST /_serverFn/<id>).
// Locally we just record them; replace this to forward leads to email or a CRM.
function handleServerFn(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1e6) req.destroy();
  });
  req.on('end', () => {
    let payload = body;
    try {
      payload = JSON.parse(body);
    } catch {}
    fs.mkdirSync(path.dirname(SUBMISSIONS), { recursive: true });
    fs.appendFileSync(SUBMISSIONS, JSON.stringify({ at: new Date().toISOString(), payload }) + '\n');
    console.log(`  contact form submission saved to ${path.relative(__dirname, SUBMISSIONS)}`);
    // `{ result: { ok: true } }` in the seroval wire format the TanStack client expects
    // (t:10 = object, t:2/s:2 = the constant `true`).
    const ok = { t: 10, i: 1, p: { k: ['ok'], v: [{ t: 2, s: 2 }] }, o: 0 };
    const okResult = { t: 10, i: 0, p: { k: ['result'], v: [ok] }, o: 0 };
    send(res, 200, JSON.stringify(okResult), 'application/json', { 'x-tss-serialized': 'true' });
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return notFound(res);
  }

  if (req.method === 'POST' && pathname.startsWith('/_serverFn/')) return handleServerFn(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', 'text/plain');

  // Trailing slash -> canonical form.
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return send(res, 301, '', 'text/plain', { Location: pathname.slice(0, -1) + url.search });
  }

  const page = ROUTES[pathname];
  if (page) return serveFile(req, res, path.join(ROOT, page));

  // /favicon.ico is requested by browsers automatically; the site's icon is a PNG.
  if (pathname === '/favicon.ico') return serveFile(req, res, path.join(ROOT, 'img', 'brand', 'favicon.png'));

  const file = path.normalize(path.join(ROOT, pathname));
  if (!file.startsWith(ROOT + path.sep)) return notFound(res);
  fs.stat(file, (err, stat) => (!err && stat.isFile() ? serveFile(req, res, file) : notFound(res)));
});

server.on('error', (err) => {
  if (err.code !== 'EADDRINUSE') throw err;
  console.error(`Port ${PORT} is already in use. Try: PORT=4174 node server.js`);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Scalezix site running at http://localhost:${PORT}`);
});
