# CLAUDE.md — Instructions pour Claude Code

Ce fichier contient les règles et le contexte à respecter pour toute assistance sur ce projet.

## Contexte

Environnement de développement local pour un wiki DSFR (Design System de l'État Français) basé sur MediaWiki. Le code développé ici est déployé manuellement en production via copy-paste dans l'interface web MediaWiki.

## Stack locale

| Composant | Version |
|-----------|---------|
| MediaWiki | 1.31.16 (LTS) |
| Semantic MediaWiki | 3.2.3 (via Composer, dans `vendor/`) |
| PHP | 7.4 |
| MariaDB | 10.4 |
| Docker Compose | v2 |

## Règles absolues

### Déploiement
- Ne jamais suggérer de `git push` vers la prod ni de connexion SSH.
- La prod est mise à jour uniquement via copy-paste dans les pages `MediaWiki:NomDuFichier`.

### JavaScript — Compatibilité ES5 obligatoire
Le code JS dans `staging_area/` doit être compatible avec le minifier de la production.

**Interdit :**
```js
const x = 1;        // non
let y = 2;          // non
const fn = () => {}; // non
`template ${var}`   // non
```

**Obligatoire :**
```js
var x = 1;
var y = 2;
var fn = function() {};
'template ' + var
```

### PHP — LocalSettings.php
- Pour charger un CSS externe : `$out->addHeadItem('key', '<link rel="stylesheet" href="...">')`
- Pour charger un script : `$out->addScript('<script src="..."></script>')`
- `$out->addScriptFile()` est supprimé depuis MW 1.24 — ne pas l'utiliser.
- SMW est activé uniquement via `enableSemantics('localhost')` — ne pas ajouter `wfLoadExtension('SemanticMediaWiki')` (incompatible avec l'installation Composer).

## Architecture clé

### Fichiers importants
- `docker-compose.yml` — définition des services
- `Dockerfile` — image PHP 7.4 + MW 1.31.16 + SMW via Composer
- `LocalSettings.php` — config MW + chargement des assets DSFR locaux
- `staging_area/` — tout le code métier (JS/CSS)
- `CHANGELOG.md` — historique des versions et modifications

### Commandes fréquentes

```bash
# Démarrer l'environnement
docker compose up -d

# Rebuild après modif du Dockerfile
docker compose up -d --build

# Initialiser/mettre à jour la DB (premier démarrage ou après upgrade)
docker compose exec mediawiki php maintenance/update.php --quick

# Shell dans le container MW
docker compose exec mediawiki bash

# Reset complet (supprime la DB)
docker compose down -v
```

### Semantic MediaWiki
SMW est installé dans `vendor/mediawiki/semantic-media-wiki/` (pas dans `extensions/`).
Le script `maintenance/populateHashField.php` de SMW a un bug de chemin connu quand SMW est dans `vendor/` — il est patché dans le Dockerfile via `sed`.

## Ce qu'il ne faut pas faire
- Ne pas modifier `composer.json` manuellement — il est patché via `jq` dans le Dockerfile.
- Ne pas ajouter `wfLoadExtension('SemanticMediaWiki')` dans `LocalSettings.php`.
- Ne pas commiter `docker-compose.yml` avec des secrets en clair (les mots de passe actuels sont pour le dev local uniquement).
