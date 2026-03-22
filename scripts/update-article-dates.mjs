/**
 * update-article-dates.mjs
 *
 * Вызывается git pre-commit хуком.
 * Для каждого staged MDX-файла в src/content/articles/ автоматически:
 *   - проставляет/обновляет поле `updated: YYYY-MM-DD`
 *   - проставляет/обновляет поле `readingTime: N`
 *
 * Также можно запустить вручную с флагом --all для обработки всех статей:
 *   node scripts/update-article-dates.mjs --all
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

function calcReadingTime(text) {
  const words = text
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/).length;

  const tables = (text.match(/<table[\s>]/g) ?? []).length;
  const images = (text.match(/<img[\s>]/g) ?? []).length;

  const minutes = words / 200 + tables * 0.5 + images * 0.25;
  return Math.max(1, Math.ceil(minutes));
}

function processFile(absPath, relPath, { isStaged = false, updateDate = true } = {}) {
  let content = readFileSync(absPath, "utf-8");

  // Нормализуем переносы строк (CRLF → LF) для корректного парсинга
  const normalized = content.replace(/\r\n/g, "\n");

  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return;

  // Тело статьи — всё после фронтматтера
  const body = normalized.slice(match[0].length);
  const readingTime = calcReadingTime(body);

  let fm = match[1];

  // updated — только если разрешено (при коммите)
  if (updateDate) {
    if (/^updated:/m.test(fm)) {
      fm = fm.replace(/^updated:.*$/m, `updated: "${today}"`);
    } else {
      fm = fm.replace(/^(date:.*)$/m, `$1\nupdated: "${today}"`);
      if (!fm.includes(`updated: "${today}"`)) fm += `\nupdated: "${today}"`;
    }
  }

  // readingTime
  if (/^readingTime:/m.test(fm)) {
    fm = fm.replace(/^readingTime:.*$/m, `readingTime: ${readingTime}`);
  } else {
    // вставляем после updated если есть, иначе после date
    if (/^updated:/m.test(fm)) {
      fm = fm.replace(/^(updated:.*)$/m, `$1\nreadingTime: ${readingTime}`);
    } else {
      fm = fm.replace(/^(date:.*)$/m, `$1\nreadingTime: ${readingTime}`);
    }
    if (!fm.includes(`readingTime: ${readingTime}`)) fm += `\nreadingTime: ${readingTime}`;
  }

  // Записываем с нормализованными переносами (LF)
  const result = normalized.replace(/^---\n[\s\S]*?\n---/, `---\n${fm}\n---`);
  writeFileSync(absPath, result, "utf-8");

  if (isStaged) execSync(`git add "${relPath}"`);
  console.log(`[update-article-dates] ${relPath} → readingTime: ${readingTime}${updateDate ? `, updated: ${today}` : ""}`);
}

const today = new Date().toISOString().slice(0, 10);
const allFlag = process.argv.includes("--all");

if (allFlag) {
  // Обрабатываем все MDX-файлы
  const articlesDir = resolve(process.cwd(), "src/content/articles");
  const files = readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const absPath = join(articlesDir, file);
    const relPath = `src/content/articles/${file}`;
    processFile(absPath, relPath, { isStaged: false, updateDate: false });
  }
} else {
  // Обрабатываем только staged файлы
  let stagedFiles;
  try {
    stagedFiles = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf-8",
    })
      .trim()
      .split("\n")
      .filter((f) => f.startsWith("src/content/articles/") && f.endsWith(".mdx"));
  } catch {
    process.exit(0);
  }

  if (stagedFiles.length === 0) process.exit(0);

  for (const relPath of stagedFiles) {
    const absPath = resolve(process.cwd(), relPath);

    // Проверяем, изменилось ли тело статьи (не фронтматтер)
    let bodyChanged = true; // новый файл — считаем что изменилось
    try {
      const committed = execSync(`git show HEAD:"${relPath}"`, { encoding: "utf-8" });
      const committedNorm = committed.replace(/\r\n/g, "\n");
      const committedMatch = committedNorm.match(/^---\n[\s\S]*?\n---/);
      const committedBody = committedMatch ? committedNorm.slice(committedMatch[0].length) : committedNorm;

      const current = readFileSync(absPath, "utf-8").replace(/\r\n/g, "\n");
      const currentMatch = current.match(/^---\n[\s\S]*?\n---/);
      const currentBody = currentMatch ? current.slice(currentMatch[0].length) : current;

      bodyChanged = committedBody !== currentBody;
    } catch {
      // файл новый — HEAD не знает о нём
    }

    processFile(absPath, relPath, { isStaged: true, updateDate: bodyChanged });
  }
}
