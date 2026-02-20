/**
 * Генерирует sitemap-index.xml и sitemap-0.xml из собранного dist/.
 * Запускается после `astro build`, чтобы не зависеть от @astrojs/sitemap (падает в CI на .reduce).
 */
import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const SITE = 'https://egehim.ru';

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function collectPaths(dir, base = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = [];
  for (const e of entries) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) {
      paths.push(...(await collectPaths(join(dir, e.name), rel)));
    } else if (e.isFile() && (e.name === 'index.html' || e.name.endsWith('.html'))) {
      paths.push(rel);
    }
  }
  return paths;
}

function pathToUrl(pathStr) {
  const normalized = pathStr.replace(/\\/g, '/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) return '/' + normalized.slice(0, -11) + '/';
  if (normalized.endsWith('.html')) return '/' + normalized.slice(0, -5);
  return '/' + normalized;
}

async function main() {
  const paths = await collectPaths(distDir);
  const base = SITE.replace(/\/$/, '');
  const urls = paths
    .map((p) => base + pathToUrl(p))
    .filter((u) => !u.endsWith('/404') && !u.endsWith('/404/'));

  const sitemap0 = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escapeXml(u)}</loc></url>`).join('\n')}
</urlset>
`;

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${escapeXml(base + '/sitemap-0.xml')}</loc></sitemap>
</sitemapindex>
`;

  await writeFile(join(distDir, 'sitemap-0.xml'), sitemap0, 'utf8');
  await writeFile(join(distDir, 'sitemap-index.xml'), sitemapIndex, 'utf8');
  console.log('Generated sitemap-index.xml and sitemap-0.xml with', urls.length, 'URLs');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
