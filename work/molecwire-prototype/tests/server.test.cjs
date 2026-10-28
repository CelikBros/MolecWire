const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs/promises');
const { createPreviewServer } = require('../server.cjs');

test('preview serves only its own static files and rejects traversal and writes', async t => {
  const fixture = await fs.mkdtemp(path.join(os.tmpdir(), 'molecwire-server-test-'));
  const root = path.join(fixture, 'dist');
  await fs.mkdir(root);
  await fs.writeFile(path.join(root, 'index.html'), '<h1>MolecWire demo</h1>');
  await fs.writeFile(path.join(root, 'app.js'), 'console.log("demo");');
  await fs.writeFile(path.join(fixture, 'outside.html'), 'outside fixture');
  const server = createPreviewServer({ root });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    const checkedFixture = path.resolve(fixture);
    assert.equal(path.dirname(checkedFixture), path.resolve(os.tmpdir()));
    assert(path.basename(checkedFixture).startsWith('molecwire-server-test-'));
    await fs.rm(checkedFixture, { recursive: true, force: true });
  });
  assert.equal(server.address().address, '127.0.0.1');
  const request = (url, method = 'GET') => new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: server.address().port, path: url, method }, res => {
      const chunks = []; res.on('data', c => chunks.push(c)); res.on('end', () => resolve({ code: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    }); req.on('error', reject); req.end();
  });
  const home = await request('/');
  assert.equal(home.code, 200);
  assert.match(home.body, /MolecWire demo/);
  assert.match(home.headers['content-security-policy'], /connect-src 'none'/);
  assert.equal((await request('/app.js')).headers['content-type'], 'text/javascript; charset=utf-8');
  assert.equal((await request('/app.js', 'HEAD')).body, '');
  for (const target of ['/../outside.html', '/%2e%2e/outside.html', '/..%5coutside.html', '/%2e%2e%2foutside.html']) assert.equal((await request(target)).code, 403, target);
  assert.equal((await request('/%00index.html')).code, 400);
  assert.equal((await request('/missing.js')).code, 404);
  assert.equal((await request('/', 'POST')).code, 405);
  await fs.symlink(fixture, path.join(root, 'escape'), 'junction');
  assert.equal((await request('/escape/outside.html')).code, 403);
});
