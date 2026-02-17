import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, statSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pubDir = path.join(__dirname, 'public');

const MIME = {
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.mjs':'application/javascript; charset=utf-8',
  '.json':'application/json',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.svg':'image/svg+xml',
  '.ico':'image/x-icon',
  '.woff2':'font/woff2',
};

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let fpath = path.join(pubDir, decodeURIComponent(url.pathname));

  if (!existsSync(fpath)) { res.writeHead(404); res.end('Not found: ' + fpath); return; }
  if (statSync(fpath).isDirectory()) fpath = path.join(fpath, 'index.html');
  if (!existsSync(fpath)) { res.writeHead(404); res.end('Not found'); return; }

  const ext = path.extname(fpath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(readFileSync(fpath));
});

server.listen(0, async () => {
  const port = server.address().port;
  console.log('Server on port', port);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  const errors = [];
  const failedRequests = [];
  page.on('pageerror', e => errors.push('PAGE_ERROR: ' + e.message));
  page.on('requestfailed', req => {
    const u = req.url();
    if (!u.includes('cloudflare')) failedRequests.push(u);
  });

  try {
    await page.goto(`http://localhost:${port}/loans/loan-to-value/`, { waitUntil: 'networkidle', timeout: 15000 });

    // Check CSS loaded
    const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log('Body bg:', bgColor);

    await page.screenshot({ path: 'ltv-screenshot-top.png', fullPage: false });

    // Scroll down to see explanation
    await page.evaluate(() => {
      const exp = document.querySelector('#loan-ltv-explanation');
      if (exp) exp.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: 'ltv-screenshot-explanation.png', fullPage: false });

    console.log('Screenshots saved');
    if (errors.length) console.log('JS Errors:', JSON.stringify(errors, null, 2));
    if (failedRequests.length) console.log('Failed requests:', JSON.stringify(failedRequests, null, 2));
  } catch(e) {
    console.error('Error:', e.message);
  }
  await browser.close();
  server.close();
});
