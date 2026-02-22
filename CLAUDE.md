# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm link             # Link globally so story-compile and story-todo are available system-wide
node bin/story-compile.js   # Run compiler directly (dev mode, must be run from a project with STORIES.md)
node bin/story-todo.js      # Run todo analyzer directly
node bin/story-todo.js --version v2  # Filter by version prefix
```

There are no tests and no linter configured.

## Architecture

This is a Node.js CLI tool using ESM (`"type": "module"`). The two entry points in `bin/` are published as global commands via the `bin` field in `package.json`.

**Both scripts operate on the calling project's directory** (`process.cwd()`), not on this repository itself. They are meant to be linked globally and invoked from another project.

### `bin/story-compile.js` — Story compiler

1. Discovers `STORIES.md` files: root-level first, then `src/**/STORIES.md`
2. Builds a TOC from the H1 of each file (anchor = lowercase, special chars stripped, spaces → `-`)
3. Writes a compiled `README.md` to the target project's root
4. Converts the markdown to `README.pdf` via `md-to-pdf`

### `bin/story-todo.js` — TODO tracker

1. Discovers `src/**/STORIES.md` and root `STORIES.md`
2. Parses `- [ ]` (todo) and `- [x]` (done) checkboxes
3. Version-prefixed items (e.g. `- [ ] v2: task` or `- [ ] v2 : task`) are **excluded** from the default count and only included when `--version v2` is passed
4. Displays a colored progress bar per story file, sorted by completion %, plus a global summary
5. Also warns about `src/*/` subdirectories that have no `STORIES.md`
6. Reads optional time estimates per story (`<!-- estimate: N -->`) and shows remaining hours per story and a project-wide total

### STORIES.md conventions

- Must start with an H1 (`# Title`) — used as the section title in the compiled output and as the module name in the todo report
- Checkboxes: `- [ ] task` (todo), `- [x] task` (done)
- Versioned tasks: `- [ ] v2: task` or `- [ ] v2 : task` (space before colon accepted) — excluded from default counts, filterable with `--version v2`
- Time estimate: `<!-- estimate: 8 -->` or `<!-- estimate: 8h -->` (HTML comment, invisible in rendered markdown) — decimals accepted (e.g. `1.5`). Stories without this tag are excluded from the project time total.
