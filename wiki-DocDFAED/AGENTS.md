# AGENTS.md — Instructions for AI Agents

This file outlines the development workflow, constraints, and commands for agents working in this repository.

## 1. Project Context & Environment

**Goal:** Local simulation of the DocDFAED production MediaWiki instance (DSFR Design System).
**Wiki:** Internal process documentation for DFAED department agents (Gendarmerie nationale). Hosted by BSII / Pôle judiciaire.
**Deployment:** MANUAL copy-paste to production Wiki pages. NO git push to production.
**Stack:**
- MediaWiki: 1.31.16 (LTS)
- Semantic MediaWiki: 3.2.3 (Composer)
- PHP: 7.4
- MariaDB: 10.4
- Docker Compose: v2

## 2. Build, Run, and Test Commands

There is no automated test suite. "Testing" implies running the local environment and verifying behavior manually or ensuring commands execute without error.

### Core Commands
- **Start Environment:** `docker compose up -d`
- **Rebuild (after Dockerfile changes):** `docker compose up -d --build`
- **Reset (Wipe DB):** `docker compose down -v`
- **Shell Access:** `docker compose exec mediawiki bash`

### Database Maintenance
- **Initialize/Update DB:** `docker compose exec mediawiki php maintenance/update.php --quick`
  *Run this after the first start or after upgrading dependencies.*

### Access
- **URL:** `http://localhost:8081` (port 8080 is reserved for wiki-DFAED-NG)
- **Credentials:** `admin` / `admin123`

### Code Quality / Linting
- **Strict ES5 Compatibility:** There is no automatic linter configured. You MUST mentally lint for ES5 compliance (see "Code Style" below).
- **Verification:** Ensure the container starts and the wiki is accessible at `http://localhost:8081`.

## 3. Code Style & Architecture Guidelines

### A. JavaScript (CRITICAL: Strict ES5)
The production minifier breaks modern JS. You MUST write "Old School" JavaScript.

**Allowed:**
- `var`
- `function() {}`
- `'string' + ' concatenation'`

**FORBIDDEN:**
- `const`, `let`
- `=>` (arrow functions)
- `` `template literals` ``

**File Headers:**
Every JS/CSS file in `staging_area/` MUST start with a comment indicating its target MediaWiki page:
```javascript
/* SOURCE FILE FOR: [[MediaWiki:PageName]] */
```

### B. Directory Structure & Mirroring
- **`staging_area/`**: The ONLY place for business logic (JS/CSS).
- **Mapping:** Files here strictly mirror production Wiki pages.
  - `staging_area/Layout.js` -> `MediaWiki:Layout.js`
  - `staging_area/dsfr/Config.js` -> `MediaWiki:Dsfr/Config.js`
  - `staging_area/dsfr/Header.js` -> `MediaWiki:Dsfr/Header.js`

### C. PHP & Configuration
- **`LocalSettings.php`**: Use this for local configuration and asset loading.
  - Load CSS: `$out->addHeadItem('key', '<link rel="stylesheet" href="...">')`
  - Load JS: `$out->addScript('<script src="..."></script>')`
  - **Do NOT** use `$out->addScriptFile()` (deprecated/removed in MW 1.24+).
  - **SMW:** Enable via `enableSemantics('localhost')`. Do NOT use `wfLoadExtension` for SMW.

### D. Architectural Patterns
1.  **Loader (Common.js):** Injects a white overlay *immediately* to prevent FOUC/layout shifts.
2.  **Header (Header.js):** Uses `setInterval` polling (50ms) to wait for `jQuery` and `mw.util` before injecting itself and removing the loader.
3.  **CSS Loading:**
    - **Local:** Injected via PHP (`LocalSettings.php`) for speed.
    - **Prod Fallback:** Loaded via JS (`mw.loader.load`) in `Layout.js` as a backup.

## 4. Semantic MediaWiki (SMW) Specifics
- Installed in `vendor/mediawiki/semantic-media-wiki/` (not `extensions/`).
- **Known Bug:** `populateHashField.php` has a path issue when SMW is in `vendor`. This is patched in the `Dockerfile` via `sed`.
- Do not modify `composer.json` manually; it is patched in the `Dockerfile` via `jq`.

## 5. Agent Behavior Rules
- **Safety:** Never suggest SSH or direct Git deployment to production.
- **Conventions:** Always check `staging_area/` for existing patterns before creating new files.
- **Refactoring:** When modifying JS, double-check for any accidental ES6+ syntax usage.
- **Secrets:** Do not commit secrets in `docker-compose.yml`.
- **Port:** This wiki uses port **8081**. Never reference port 8080 (reserved for DFAED-NG).
