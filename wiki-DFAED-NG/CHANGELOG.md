# Changelog

## [Unreleased]

---

## [2.1.0] — 2026-02-26

### Ajouts

- **Éditeur DSFR (`EditPage.js`)** : nouveau module qui remplace intégralement la toolbar WikiEditor native par une interface DSFR.
  - **Barre d'outils de formatage** : boutons Gras, Italique, Souligné, Titres H2-H4, Alignements (gauche, centre, droite, justifié), Listes ordonnées/non-ordonnées, Liens internes/externes, Images.
  - **Menu déroulant "Composants DSFR"** : insertion rapide d'alertes (info, succès, erreur), accordéons, badges, callouts et citations, avec lien vers la documentation officielle DSFR.
  - **Barre d'actions sticky** : boutons Annuler, Voir les modifications, Prévisualiser et Publier, affichés en haut de page avec le nom de la page en cours d'édition.
  - **Restyling des options d'édition** : champ résumé en `fr-input`, checkboxes en `fr-checkbox-group`, notice copyright en `fr-notice` repliable, boutons d'action dupliqués en bas de page.
- **Icônes SVG custom** : 4 classes d'icônes (`dsfr-icon-underline`, `dsfr-icon-align-center`, `dsfr-icon-align-right`, `dsfr-icon-align-justify`) qui reproduisent le système `mask-image` du DSFR pour les icônes absentes de la v1.12.1.

### Corrections

- **Fix carrés bleus** : les boutons avec icônes custom apparaissaient comme des carrés bleus car les classes `dsfr-icon-*` ne matchaient pas le sélecteur `[class^="fr-icon-"]` du DSFR — ajout des propriétés de base du pseudo-élément (`content`, `display`, `width`, `height`, `background-color`, `mask-size`, `mask-repeat`) pour reproduire le comportement natif.

### Changements

- **Style.css** : ajout de styles pour l'éditeur (toolbar, barre d'actions, options d'édition, masquage des éléments MW natifs).
- **Common.js** : ajout du chargement du module `EditPage.js` sur les pages d'édition.

---

## [2.0.0] — 2026-02-26

### Ajouts

- **Semantic MediaWiki 3.2.3** : installé via Composer, activé avec `enableSemantics('localhost')`. Permet de tester les requêtes `{{#ask:}}`, propriétés SMW et templates sémantiques en local.

### Changements

- **MediaWiki** : passage de `1.23.8` à `1.31.16` (LTS — dernière version de la branche 1.31).
- **PHP** : passage de `5.6` (Debian Stretch, EOL) à `7.4` (Debian Bullseye).
- **LocalSettings.php** : suppression des options obsolètes (`$wgScriptExtension`, `$wgDBmysql5`), migration du hook `BeforePageDisplay` vers `addHeadItem()` / `addScript()` (remplacement de `addScriptFile()` supprimé en MW 1.24), passage à `wfLoadExtension('WikiEditor')`.
- **Dockerfile** : refonte complète — nouvelle image de base, ajout de Composer 2, patch du `composer.json` de MW 1.31 via `jq` pour compatibilité Composer 2 (suppression de `wikimedia/composer-merge-plugin` v1.4.1 incompatible, désactivation du blocage des security advisories), correctif du chemin `populateHashField.php` de SMW.

### Infrastructure

- Composer 2 (installé en multi-stage depuis `composer:2`).
- Extensions PHP ajoutées : `mbstring`, `xml`, `zip`, `libonig`.
- Limites PHP relevées : `upload_max_filesize=100M`, `post_max_size=100M`, `memory_limit=256M`.

---

## [1.0.0] — 2024 (initial)

### Ajouts

- Environnement Docker initial : MediaWiki 1.23.8, PHP 5.6, MariaDB 10.4.
- `LocalSettings.php` avec chargement des assets DSFR via `BeforePageDisplay`.
- Extension WikiEditor activée.
- Workflow copy-paste `staging_area/` → pages `MediaWiki:`.
- Architecture "Zéro FOUC" : overlay blanc via `Common.js` + CSS préchargé via `LocalSettings.php`.
