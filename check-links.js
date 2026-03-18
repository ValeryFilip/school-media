const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DIST_DIR = 'e:/school-media/dist';
const SITE_URL = 'https://egehim.ru';
const CONCURRENCY = 10;

function getAllHtmlFiles(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...getAllHtmlFiles(fullPath));
    } else if (item.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractHrefs(html) {
  const hrefs = [];
  const regex = /href=["']([^"'#][^"']*?)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    hrefs.push(match[1]);
  }
  return [...new Set(hrefs)];
}

function checkInternalLink(href) {
  // Remove query string and hash
  const clean = href.split('?')[0].split('#')[0];
  // Try exact path, then with index.html, then as file
  const candidates = [
    path.join(DIST_DIR, clean),
    path.join(DIST_DIR, clean, 'index.html'),
    path.join(DIST_DIR, clean.replace(/\/$/, ''), 'index.html'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return true;
  }
  return false;
}

function httpHead(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    try {
      const req = lib.request(url, { method: 'HEAD', timeout: 10000, headers: { 'User-Agent': 'LinkChecker/1.0' } }, (res) => {
        resolve({ status: res.statusCode, ok: res.statusCode < 400 || res.statusCode === 405 });
      });
      req.on('error', (e) => resolve({ status: null, ok: false, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 'TIMEOUT', ok: false }); });
      req.end();
    } catch (e) {
      resolve({ status: null, ok: false, error: e.message });
    }
  });
}

async function processQueue(tasks, concurrency) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  const workers = Array.from({ length: concurrency }, worker);
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('Scanning HTML files in', DIST_DIR);
  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  // Collect all links per page
  const pageLinks = {};
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const hrefs = extractHrefs(html);
    const pagePath = '/' + path.relative(DIST_DIR, file).replace(/\\/g, '/');
    pageLinks[pagePath] = hrefs;
  }

  // Separate internal vs external, deduplicate external
  const brokenLinks = [];
  const externalChecked = new Map(); // url -> result
  const externalTasks = [];
  const externalMeta = []; // { url, pages }

  // Build external url -> pages map
  const externalMap = new Map();
  const internalToCheck = []; // { href, pages }
  const internalMap = new Map();

  for (const [page, hrefs] of Object.entries(pageLinks)) {
    for (const href of hrefs) {
      if (href.startsWith('http://') || href.startsWith('https://')) {
        if (!externalMap.has(href)) externalMap.set(href, []);
        externalMap.get(href).push(page);
      } else if (href.startsWith('/')) {
        if (!internalMap.has(href)) internalMap.set(href, []);
        internalMap.get(href).push(page);
      }
      // skip mailto:, tel:, data:, etc.
    }
  }

  // Check internal links
  console.log(`Checking ${internalMap.size} unique internal links...`);
  for (const [href, pages] of internalMap.entries()) {
    const exists = checkInternalLink(href);
    if (!exists) {
      brokenLinks.push({ type: 'internal', href, pages, status: 'MISSING' });
    }
  }

  // Check external links
  console.log(`Checking ${externalMap.size} unique external links (concurrency=${CONCURRENCY})...`);
  const externalUrls = [...externalMap.keys()];
  const tasks = externalUrls.map(url => () => httpHead(url));
  const results = await processQueue(tasks, CONCURRENCY);

  for (let i = 0; i < externalUrls.length; i++) {
    const url = externalUrls[i];
    const res = results[i];
    if (!res.ok) {
      brokenLinks.push({ type: 'external', href: url, pages: externalMap.get(url), status: res.status || res.error });
    }
  }

  // Report
  console.log('\n========== BROKEN LINKS REPORT ==========\n');
  if (brokenLinks.length === 0) {
    console.log('No broken links found!');
  } else {
    console.log(`Total broken links: ${brokenLinks.length}\n`);

    const internals = brokenLinks.filter(l => l.type === 'internal');
    const externals = brokenLinks.filter(l => l.type === 'external');

    if (internals.length > 0) {
      console.log(`--- INTERNAL (missing files): ${internals.length} ---`);
      for (const l of internals) {
        console.log(`\n  LINK: ${l.href}`);
        console.log(`  STATUS: ${l.status}`);
        console.log(`  FOUND ON:`);
        for (const p of l.pages) console.log(`    - ${p}`);
      }
    }

    if (externals.length > 0) {
      console.log(`\n--- EXTERNAL (HTTP errors): ${externals.length} ---`);
      for (const l of externals) {
        console.log(`\n  LINK: ${l.href}`);
        console.log(`  STATUS: ${l.status}`);
        console.log(`  FOUND ON:`);
        for (const p of l.pages) console.log(`    - ${p}`);
      }
    }
  }

  console.log('\n=========================================');
  console.log(`Scanned: ${htmlFiles.length} pages | Internal: ${internalMap.size} unique | External: ${externalMap.size} unique`);
}

main().catch(console.error);
