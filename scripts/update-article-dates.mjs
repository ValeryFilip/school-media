/**
 * update-article-dates.mjs
 *
 * Вызывается git pre-commit хуком.
 * Для каждого staged MDX-файла в src/content/articles/ автоматически
 * проставляет/обновляет поле `updated: YYYY-MM-DD` в frontmatter.
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const today = new Date().toISOString().slice(0, 10); // "2025-03-21"

// Получаем список staged файлов
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
  let content = readFileSync(absPath, "utf-8");

  // Frontmatter ограничен ---
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) continue;

  const frontmatter = match[1];
  let updated;

  if (/^updated:/m.test(frontmatter)) {
    // Обновляем существующее поле
    updated = frontmatter.replace(/^updated:.*$/m, `updated: "${today}"`);
  } else {
    // Добавляем после поля date
    updated = frontmatter.replace(
      /^(date:.*)$/m,
      `$1\nupdated: "${today}"`
    );
    // Если date нет — добавляем в конец frontmatter
    if (updated === frontmatter) {
      updated = frontmatter + `\nupdated: "${today}"`;
    }
  }

  content = content.replace(/^---\n[\s\S]*?\n---/, `---\n${updated}\n---`);
  writeFileSync(absPath, content, "utf-8");

  // Добавляем обратно в stage
  execSync(`git add "${relPath}"`);
  console.log(`[update-dates] ${relPath} → updated: ${today}`);
}
