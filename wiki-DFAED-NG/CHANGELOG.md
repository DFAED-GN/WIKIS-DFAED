# Journal des modifications — wiki-DFAED-NG

Tous les changements notables de ce projet sont documentés ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [Non publié]

*(Aucun changement en attente de la prochaine version.)*

---

## [2.1.0] — 2026-02-26

### Ajouts

- **`dsfr/components/Accordion.js`** : Composant accordéon DSFR. Convertit les éléments portant la classe `.dsfr-accordion-item` en structure `fr-accordion` standard, avec gestion `aria-expanded`, IDs uniques générés dynamiquement et dépliage par délégation d'événements sur le bouton.
- **`dsfr/components/Alert.js`** : Composant alerte DSFR. Prend en charge les types `info`, `success`, `warning`, `error`, avec titre (balise h3) et bouton de fermeture optionnels configurés via attributs `data-*`.
- **`dsfr/components/Badge.js`** : Composant badge DSFR. Supporte les variantes de type (`success`, `error`, `info`, `warning`, `new`), couleur personnalisée, taille réduite (`sm`) et masquage d'icône.
- **46 stubs de composants DSFR** prêts à implémenter : Breadcrumb, Button, Callout, Card, Checkbox, Combobox, Composition, Connect, Consent, Content, Display, Download, Dropdown, Follow, Form, Highlight, Input, Link, Logo, Modal, Navigation, Notice, Pagination, Password, Quote, Radio, Range, Search, Segmented, Select, Share, Sidemenu, Skiplink, Stepper, Summary, Tab, Tabnav, Table, Tag, Tile, Toggle, Tooltip, Transcription, Translate, Upload, User.
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
- **`dsfr/Config.js`** : Configuration centralisée de l'interface.
  - Identité du service (titre, tagline, texte du logo Marianne).
  - Navigation principale avec 7 rubriques : Accueil, Signalisation, Consultation FAED, Traces papillaires, Échanges Prüm, Appui aux unités, Systèmes d'information, NéoDK — chacune avec sous-menus configurables.
  - Footer : liens institutionnels (Légifrance, Gouvernement, Service-Public), liens de bas de page (Mentions légales, Plan du site, Outils) et outils de la page (7 liens vers pages spéciales MediaWiki).
- **`dsfr/Layout.js`** : Préparation du DOM MediaWiki pour l'intégration DSFR.
  - Masquage des éléments natifs de la skin MonoBook (sidebar `#mw-panel`, footer `#footer`, classe `.mw-footer`, etc.).
  - Injection d'un fil d'Ariane DSFR dynamique construit depuis `wgPageName`, avec analyse des séparateurs `:` et `/` et liens reconstruits via `mw.util.getUrl()`.
  - Remplacement du titre H1 par le dernier segment du chemin de page. Désactivé sur la page d'accueil.
- **`dsfr/Header.js`** : Header DSFR résilient au chargement asynchrone de MediaWiki.
  - Mécanisme de polling sur jQuery et `mw.util` toutes les 50 ms (maximum 300 tentatives = 15 secondes).
  - Extraction des actions natives MediaWiki depuis `#p-views` et `#p-cactions` (Lire, Modifier, Historique, Suivre).
  - Construction des menus de navigation DSFR (liens simples et menus déroulants).
  - Gestion de l'authentification : menus distincts pour utilisateur connecté et anonyme.
  - Retrait de l'overlay loader une fois le header injecté.
- **`dsfr/Footer.js`** : Footer DSFR complet.
  - Structure Marianne avec liens institutionnels configurables depuis `Config.js`.
  - Modale d'outils de la page (dialog avec accès aux pages spéciales MediaWiki).
  - Utilise l'ID `dsfr-footer` pour éviter tout conflit avec l'élément natif `#footer` de MediaWiki.
- **`Common.js`** (refonte) : Orchestrateur de chargement principal.
  - Injection immédiate d'un overlay blanc avec spinner CSS (anti-FOUC), failsafe à 5 secondes.
  - Détection automatique de l'environnement : `localhost` → chargement depuis `staging_area/` ; production → chargement depuis les pages `MediaWiki:Dsfr/*` avec cache-busting horodaté.
  - Chargement séquentiel des modules : Config → Layout → Header → Footer → EditPage → composants.

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
- `LocalSettings.php` avec chargement des assets DSFR via le hook `BeforePageDisplay` : CSS DSFR v1.12.1 (CDN jsDelivr) + `Common.js` (attribut `defer`).
- Extension WikiEditor activée.
- Workflow copy-paste `staging_area/` → pages `MediaWiki:`.
- Architecture "Zéro FOUC" : overlay blanc injecté immédiatement par `Common.js` + CSS DSFR préchargé côté serveur via `LocalSettings.php`.
- `staging_area/` servi directement par le conteneur Docker en développement local (hot reload sans rebuild d'image).
