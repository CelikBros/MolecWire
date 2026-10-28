const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');

const defaultRoot = path.join(__dirname, 'dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
const headers = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
};
const within = (root, target) => { const rel = path.relative(root, target); return rel === '' || (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel)); };

function createPreviewServer({ root = defaultRoot, onRequest = () => {} } = {}) {
  const absoluteRoot = path.resolve(root);
  return http.createServer(async (req, res) => {
    onRequest();
    const finish = (code, message) => { res.writeHead(code, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' }); res.end(req.method === 'HEAD' ? undefined : message); };
    if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); finish(405, 'Method not allowed'); return; }
    let pathname;
    try { pathname = decodeURIComponent((req.url || '/').split('?')[0]); } catch { finish(400, 'Invalid request'); return; }
    if (!pathname.startsWith('/') || pathname.includes('\0')) { finish(400, 'Invalid request'); return; }
    if (pathname === '/') pathname = '/index.html';
    const candidate = path.resolve(absoluteRoot, '.' + pathname);
    if (!within(absoluteRoot, candidate)) { finish(403, 'Forbidden'); return; }
    if (!mime[path.extname(candidate).toLowerCase()]) { finish(404, 'Not found'); return; }
    try {
      const [realRoot, realTarget] = await Promise.all([fs.realpath(absoluteRoot), fs.realpath(candidate)]);
      if (!within(realRoot, realTarget)) { finish(403, 'Forbidden'); return; }
      const stat = await fs.stat(realTarget);
      if (!stat.isFile()) { finish(404, 'Not found'); return; }
      const contents = req.method === 'HEAD' ? null : await fs.readFile(realTarget);
      res.writeHead(200, { ...headers, 'Content-Type': mime[path.extname(realTarget).toLowerCase()], 'Content-Length': stat.size });
      res.end(contents);
    } catch { finish(404, 'Not found'); }
  });
}

if (require.main === module) {
  const portFlag = process.argv.indexOf('--port');
  const port = portFlag >= 0 ? Number(process.argv[portFlag + 1]) : 4318;
  if (!Number.isInteger(port) || port < 0 || port > 65535) { console.error('Invalid port'); process.exit(1); }
  let lastRequest = Date.now();
  const server = createPreviewServer({ onRequest: () => { lastRequest = Date.now(); } });
  const idleTimer = setInterval(() => {
    if (Date.now() - lastRequest > 30 * 60 * 1000) server.close();
  }, 60 * 1000);
  idleTimer.unref();
  server.on('close', () => clearInterval(idleTimer));
  server.on('error', err => { console.error('Preview could not start:', err.code); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`MolecWire Local: http://127.0.0.1:${server.address().port}/ (30 minutes idle timeout)`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
}

module.exports = { createPreviewServer };
