#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { glob } from "glob";
import chalk from "chalk";


// Lire le paramètre version en ligne de commande (ex: --version v2)
const args = process.argv.slice(2);
let version = null;
for (let i = 0; i < args.length; i++) {
  const arg = args[i].toLowerCase();
  if (arg.startsWith("--version")) {
    const parts = arg.split("=");
    version = parts[1] || args[i + 1] || null;
    break;
  }
}
if (version) {
  version = version.replace(/:$/, "").toLowerCase().trim();
  console.log(chalk.gray(`→ Filtrage version détecté : ${version}\n`));
}

// 1. Trouver tous les fichiers STORIES.md
let stories = await glob("src/**/STORIES.md");
let storiesAutre = await glob("STORIES.md");
stories = stories.concat(storiesAutre);

// 2. Trouver tous les dossiers sous src/ (sauf src/ lui-même)
const allDirs = (await glob("src/*/")).map((dir) => path.relative("src", dir));

// 3. Identifier les dossiers sans STORIES.md
const dirsWithStories = stories.map((file) =>
  path.relative("src", path.dirname(file))
);
const dirsWithoutStories = allDirs.filter(
  (dir) => !dirsWithStories.includes(dir)
);

// 4. Afficher les warnings pour les dossiers sans STORIES.md
if (dirsWithoutStories.length > 0) {
  console.log(chalk.red("⚠️ Dossiers sans fichier STORIES.md :\n"));
  dirsWithoutStories.forEach((dir) => {
    console.log(chalk.red(`  - ${dir}`));
  });
  console.log();
}

if (stories.length === 0) {
  console.log(chalk.yellow("⚠️ Aucun fichier STORIES.md trouvé.\n"));
  process.exit(0);
}

// 5. Parsing des stories
let results = [];

for (const file of stories) {
  const content = fs.readFileSync(file, "utf-8");

  // 🔹 Récupérer le premier H1 du markdown (# Titre)
  const h1Match = content.match(/^#\s+(.+)$/m);
  const h1Title = h1Match ? h1Match[1].trim() : path.basename(path.dirname(file));

  // Regex pour todo/done
  let doneRegex, todoRegex;
  if (version) {
    doneRegex = new RegExp(`-\\s*\\[[xX]\\]\\s*${version}\\s*:`, "g");
    todoRegex = new RegExp(`-\\s*\\[ \\]\\s*${version}\\s*:`, "g");
  } else {
    doneRegex = /- \[[xX]\](?!\s*\w+\s*:)/g;
    todoRegex = /- \[ \](?!\s*\w+\s*:)/g;
  }

  const done = (content.match(doneRegex) || []).length;
  const todo = (content.match(todoRegex) || []).length;
  const total = done + todo;
  const percent = total > 0 ? (done / total) * 100 : 0;

  results.push({
    name: h1Title,
    filePath: file,
    done,
    total,
    percent,
  });
}

// Trie par avancement
results.sort((a, b) => b.percent - a.percent);

// 6. Affichage
console.log(chalk.bold("\n📋 Progression des stories\n"));
if (version) console.log(chalk.gray(`Filtrage version : ${version}\n`));

for (const { name, filePath, done, total, percent } of results) {
  const barLength = 20;
  const filled = Math.round((percent / 100) * barLength);
  const bar =
    chalk.green("█".repeat(filled)) + chalk.gray("░".repeat(barLength - filled));
  const color =
    percent === 100
      ? chalk.green
      : percent > 60
      ? chalk.cyan
      : percent > 30
      ? chalk.yellow
      : chalk.red;

  const absolutePath = path.resolve(filePath);
  const fileUrl = `file://${absolutePath}`;
  const link = `\x1b]8;;${fileUrl}\x07${chalk.gray(filePath)}\x1b]8;;\x07`;

  console.log(
    `${chalk.bold(name.padEnd(30))} ${bar} ${color(
      `${Math.round(percent)}%`
    )}  (${done}/${total})`
  );
  console.log(`  ${link}\n`);
}

// 7. Résumé global
const totalTodos = results.reduce((a, b) => a + b.total, 0);
const doneTodos = results.reduce((a, b) => a + b.done, 0);
const globalPercent =
  totalTodos > 0 ? Math.round((doneTodos / totalTodos) * 100) : 0;

console.log("\n🌍 " + chalk.bold("Progression globale :"));
console.log(
  `   ${chalk.green(`${doneTodos} done`)} / ${chalk.gray(
    `${totalTodos} total`
  )}  → ${chalk.bold.cyan(`${globalPercent}%`)}\n`
);