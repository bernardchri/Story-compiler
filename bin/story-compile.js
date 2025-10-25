#!/usr/bin/env node
// V2
import fs from "fs";
import path from "path";
import { glob } from "glob";
import chalk from "chalk";
import { mdToPdf } from "md-to-pdf";

const projectRoot = process.cwd(); // Dossier courant du projet où la commande est lancée

console.log(chalk.cyan("🔍 Compilation des stories...\n"));

const OUTPUT_MD = path.join(projectRoot, "README.md");
const OUTPUT_PDF = path.join(projectRoot, "README.pdf");
const ROOT_STORY = path.join(projectRoot, "STORIES.md");

// 1️⃣ Récupérer les fichiers STORIES.md
let stories = [];
if (fs.existsSync(ROOT_STORY)) stories.push(ROOT_STORY);

const srcStories = await glob("src/**/STORIES.md", { cwd: projectRoot });
stories = stories.concat(srcStories.map(f => path.join(projectRoot, f)));

if (stories.length === 0) {
  console.log(chalk.red("⚠️ Aucun fichier STORIES.md trouvé."));
  process.exit(0);
}

console.log(chalk.gray(`→ ${stories.length} fichiers trouvés.\n`));

// 1️⃣ Générer la table des matières
let toc = "## 🗂 Table des matières\n\n";
for (const file of stories) {
  const content = fs.readFileSync(file, "utf-8");
  const h1Match = content.match(/^#\s+(.+)$/m);
  const title = h1Match ? h1Match[1].trim() : path.basename(path.dirname(file));

  // Génère l’ancre Markdown
  const anchor = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // supprime caractères spéciaux
    .replace(/\s+/g, "-");    // remplace espaces par "-"
  
  toc += `- [${title}](#${anchor})\n`;
}
toc += "\n";

// 2️⃣ Compiler le contenu
let compiled = "# 📚 Compilation des stories\n\n";
compiled += `> Généré automatiquement le ${new Date().toLocaleString("fr-FR")}\n\n`;

// ajoute la table des matières
compiled += toc;

// puis ajoute toutes les stories comme avant
for (const file of stories) {
  const content = fs.readFileSync(file, "utf-8");
  const h1Match = content.match(/^#\s+(.+)$/m);
  const title = h1Match ? h1Match[1].trim() : path.basename(path.dirname(file));

  compiled += `\n---\n\n## ${title}\n\n`;
  compiled += content.replace(/^#\s+.+$/m, "").trimStart();
  compiled += "\n\n";
}

// 3️⃣ Écrire le README.md à la racine
fs.writeFileSync(OUTPUT_MD, compiled, "utf-8");
console.log(chalk.green(`✅ Fichier compilé : ${OUTPUT_MD}`));

// 4️⃣ Générer le PDF à la racine
console.log(chalk.cyan("🧾 Génération du PDF à partir du README.md..."));

try {
  const pdf = await mdToPdf({ content: compiled }, { dest: OUTPUT_PDF });
  if (pdf) console.log(chalk.green(`✅ PDF généré : ${OUTPUT_PDF}\n`));
} catch (error) {
  console.error(chalk.red("❌ Erreur lors de la génération du PDF :"), error);
}