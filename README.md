# 🧩 Story Compiler

**Story Compiler** est un outil CLI Node.js qui permet de compiler automatiquement tous les fichiers `STORIES.md` d’un projet en un seul document complet (`README.md`) avec une table des matières, puis de générer un fichier PDF.  
Il inclut également un outil compagnon `story-todo` pour suivre la progression des tâches dans les stories.

> 🛠️ Développé par [@bernardchri](https://github.com/bernardchri)

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/bernardchri/Story-compiler.git
cd Story-compiler
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lier le package globalement (pour l’utiliser partout)

```bash
npm link
```

💡 Cette commande te permet d’exécuter story-compile et story-todo depuis n’importe quel projet local, comme un vrai outil pro.


## 🧠 Utilisation dans un projet

```
mon-projet/
├─ STORIES.md          ← Story principale (racine)
├─ src/
│  ├─ moduleA/
│  │  └─ STORIES.md
│  ├─ moduleB/
│  │  └─ STORIES.md
└─ ...
```

Compiler toutes les stories

Depuis la racine de ton projet :

```bash
story-compile
```

ou sans installation globale :

```bash
npx story-compile
```

Résultat :
- Un fichier README.md est généré à la racine du projet.
- Il contient :
  - une table des matières cliquable 🗂
  - l’ensemble des STORIES.md (la racine en premier, puis les sous-dossiers).
- Un fichier README.pdf est automatiquement créé à partir du markdown compilé.


## ✅ Exemple de sortie

```markdown

# 📚 Compilation des stories

> Généré automatiquement le 26 octobre 2025

## 🗂 Table des matières

- [Introduction](#introduction)
- [Module A](#module-a)
- [Module B](#module-b)

---

## Introduction
(... contenu de la STORIES.md racine ...)

---

## Module A
(... contenu du module A ...)

---

## Module B
(... contenu du module B ...)
```

---

## 🧾 Analyse des TODOs

Le second outil du package, story-todo, analyse toutes les stories et affiche la progression des tâches (- [ ] et - [x]).

**Utilisation**

```bash
npx story-todo
```

**Exemple de sortie :**

```markdown

📋 Progression des stories

Module A                     ██████████░░░░░░░░░░ 50%  (3/6)
Module B                     ████████████████░░░░ 80%  (8/10)

🌍 Progression globale :
   11 done / 16 total → 68%

```

**Filtrer par version**

Si tu notes tes TODOs avec des préfixes de version (v2:, v3: etc.), tu peux filtrer :

```bash
story-todo --version v2
```

## ⚙️ Commandes disponibles

| Commande | Description | Sortie principale |
|-----------|--------------|-------------------|
| `story-compile` | Compile tous les `STORIES.md` du projet (en commençant par celui à la racine) en un seul `README.md`, puis génère automatiquement un `README.pdf`. | `README.md` + `README.pdf` à la racine du projet |
| `npx story-compile` | Exécute la compilation sans installation globale (idéal pour tester dans un projet ponctuel). | `README.md` + `README.pdf` |
| `story-todo` | Analyse toutes les stories du projet et affiche le taux de complétion (`TODO` / `DONE`). | Rapport coloré dans le terminal |
| `story-todo --version <version>` | Filtre les tâches selon une version spécifique (`v2`, `v3`, etc.). | Rapport filtré par version |
| `node bin/story-compile.js` | Exécution directe du script local (mode développement). | Même sortie que `story-compile` |
| `node bin/story-todo.js` | Exécution directe du script local (mode développement). | Même sortie que `story-todo` |


## 🧩 Technologies utilisées

- Node.js ≥ 18  
- marked — parsing Markdown  
- markdown-pdf — conversion en PDF  
- glob — recherche de fichiers  
- chalk — affichage coloré dans le terminal  


## 💡 Conseils d’utilisation

- Chaque STORIES.md doit commencer par un titre H1 (# Titre) pour apparaître dans la table des matières.
- Les TODOs doivent suivre le format :  
  ```markdown
  - [ ] tâche à faire
  - [x] tâche terminée
  - [ ] v2: tâche pour la v2 non prise en compte dans le comptage de la version initiale
  ```
- Créez à la racine de votre projet un fichier *STORIES.md* pour tout ce qui est documentation globale.
- Créez de même vos stories dans votre dossier /src dans des fichiers *STORIES.md*.


## Exemple de STORIES.md

```markdown
# Nom de mon bloc

## 🎯 Objectif
Description de l’objectif 

## Contribution

**En tant que** contributeur du site  
**je veux** insérer un bloc *Section Avis*  
**afin de** faire défiler plusieurs avis facilement.  

### ✅ Critères d’acceptation :
- [X] Le bloc est visible dans l’éditeur Gutenberg  
- [ ] ...
- [ ] v2: SEO : Les contenus sont codés pour être optimisés pour le SEO microformats

### ⚙️ Informations Techniques
- [x] Utilisation de swiper.js pour le slider
- [ ] ...

## Visualisation, Accessibilité & responsive
**En tant que** visiteur du site,  
**je veux** que les avis soient lisibles et accessibles sur tous les écrans,  
**afin de** garantir une expérience fluide.

### ✅ Critères :
- [x] Aucun overflow horizontal
- [ ] Aucun overflow horizontal
- [ ] v2: Visualisation : Navigation clavier possible
```