/**
 * Добавляет в dist/.htaccess редиректы 301 с /media/ на /academy/.
 * Запускается после astro build. Хостинг: Таймвеб (Apache, .htaccess).
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');

async function getArticleRedirects() {
  const academyDir = join(distDir, 'academy');
  const entries = await readdir(academyDir, { withFileTypes: true });
  const redirects = [];

  const categoryDirs = entries.filter(
    (e) =>
      e.isDirectory() &&
      e.name !== 'articles' &&
      e.name !== 'tags' &&
      e.name !== 'search'
  );

  for (const cat of categoryDirs) {
    const catPath = join(academyDir, cat.name);
    const subEntries = await readdir(catPath, { withFileTypes: true });
    const articleDirs = subEntries.filter(
      (e) => e.isDirectory() && !e.name.startsWith('.')
    );
    for (const art of articleDirs) {
      redirects.push({
        from: `/media/articles/${art.name}`,
        to: `/academy/${cat.name}/${art.name}/`,
      });
    }
  }

  return redirects;
}

function buildRedirectBlock(articleRedirects) {
  const lines = [
    '',
    '# Canonical redirects: https + trailing slash for page-like URLs',
    'RewriteEngine On',
    '',
    'RewriteCond %{REQUEST_FILENAME} !-f',
    'RewriteCond %{REQUEST_URI} !\\.[A-Za-z0-9]{1,8}$',
    'RewriteCond %{REQUEST_URI} !/$',
    'RewriteRule ^ https://egehim.ru%{REQUEST_URI}/ [R=301,L]',
    '',
    'RewriteCond %{HTTPS} !=on',
    'RewriteRule ^ https://egehim.ru%{REQUEST_URI} [R=301,L]',
    '',
    '# Редиректы 301: /media/ → /academy/ (generate-htaccess-redirects.js)',
    'RewriteRule ^media/?$ /academy/ [R=301,L]',
    'RewriteRule ^media/articles/?$ /academy/articles/ [R=301,L]',
    '',
  ];

  for (const r of articleRedirects) {
    const from = r.from.replace(/^\//, '').replace(/\/$/, '');
    const to = r.to.startsWith('/') ? r.to : '/' + r.to;
    const fromEscaped = from.replace(/\./g, '\\.');
    lines.push(`RewriteRule ^${fromEscaped}/?$ ${to} [R=301,L]`);
  }
  lines.push('');

  lines.push(
    '',
    '# Конкретные редиректы для несовпадающих старых slug',
    'RewriteRule ^media/tags/neorganicheskaya-himiya/?$ /academy/neorganicheskaya-himiya/ [R=301,L]',
    'RewriteRule ^media/category/materialy-dlya-ege-i-oge-po-himii/?$ /academy/ [R=301,L]',
    '',
    '# Общие правила /media/',
    'RewriteRule ^media/category/(.+)$ /academy/$1/ [R=301,L]',
    'RewriteRule ^media/tags/(.+)$ /academy/tags/$1/ [R=301,L]',
    'RewriteRule ^media/search/?$ /academy/search/ [R=301,L]'
  );

  return lines.join('\n');
}

async function main() {
  const htaccessPath = join(distDir, '.htaccess');
  let existing = '';
  try {
    existing = await readFile(htaccessPath, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  const marker = '# Редиректы 301: /media/ → /academy/';
  const canonicalMarker = '# Canonical redirects: https + trailing slash for page-like URLs';
  if (existing.includes(canonicalMarker)) {
    existing = existing.split(canonicalMarker)[0].replace(/\n\n+$/, '\n').trimEnd();
  } else if (existing.includes(marker)) {
    existing = existing.split(marker)[0].replace(/\n\n+$/, '\n').trimEnd();
  }

  const articleRedirects = await getArticleRedirects();
  const redirectBlock = buildRedirectBlock(articleRedirects);
  await writeFile(htaccessPath, existing + redirectBlock + '\n', 'utf8');
  console.log(
    'Added',
    articleRedirects.length,
    'article redirects + static rules to .htaccess'
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
