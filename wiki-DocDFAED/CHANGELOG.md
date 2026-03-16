# Journal des modifications — wiki-DocDFAED

Tous les changements notables de ce projet sont documentés ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [Non publié]

### Ajouts

- **`dsfr/components/Card.js`** : Composant carte DSFR complet.
  - Carte simple via `.dsfr-card` : titre, description, lien (interne via `mw.util.getUrl()` ou URL absolue), badge (types `new`, `info`, `success`, `warning`, `error`), détail avec icône optionnelle, image d'illustration.
  - Grille responsive via `.dsfr-card-grid` : 2, 3 (défaut) ou 4 colonnes, adaptatif mobile → tablette → bureau (`fr-grid-row--equal-height`).
  - Variantes : `data-horizontal`, `data-shadow`, `data-grey`, `data-no-arrow`.
  - Déballage automatique du `<p>` injecté par le parseur MediaWiki autour du contenu des `<div>`.
  - `data-image` : support des fichiers wiki (`File:Image.png` / `Fichier:Image.png`) en plus des URL directes, via `Special:FilePath`.
  - `data-image-ratio` : contrôle du ratio de l'image (`16x9`, `32x9`, `3x4`, `2x3`, `4x3`, `1x1`) via les classes DSFR `fr-ratio-*`.
  - `data-horizontal` étendu : `"tier"` (⅓ image / ⅔ contenu) et `"half"` (50/50) en plus de `"true"` (défaut).
- **`dsfr/EditPage.js`** : ajout de 5 entrées dans le menu déroulant "Composants DSFR" : Carte (simple), Carte (avec badge et détail), Grille de cartes (2 colonnes), Grille de cartes (3 colonnes), Grille de cartes (4 colonnes).
- **`Common.js`** : ajout du module `components/Card` dans la liste de chargement.

### Corrections

- **`dsfr/Style.css`** : fix pastilles bleues sur les listes DSFR. MediaWiki applique `list-style: disc` sur tous les `<ul>`, polluant les composants `.fr-nav__list`, `.fr-grid-row`, `.fr-btns-group`, `.fr-menu__list`, etc. Ajout d'un reset `list-style: none !important` ciblant tous les éléments `ul[class*="fr-"]` et `li[class*="fr-"]`.

---

## [1.0.0] — 2026-03-16

### Ajouts

- **Environnement Docker** basé sur l'architecture du wiki DFAED-NG.
  - Stack : MediaWiki 1.31.16, Semantic MediaWiki 3.2.3, PHP 7.4, MariaDB 10.4.
  - Port **8081** (8080 réservé à DFAED-NG).
  - Volume DB : `db_data_docdfa`.
- **`LocalSettings.php`** : configuration MediaWiki avec sitename *DocDFAED*, chargement des assets DSFR v1.12.1 (CDN jsDelivr) et des assets locaux via hook `BeforePageDisplay`.
- **Extension WikiEditor** activée.
- **Workflow copy-paste** `staging_area/` → pages `MediaWiki:`.
- **Architecture "Zéro FOUC"** : overlay blanc injecté immédiatement par `Common.js` + CSS DSFR préchargé côté serveur.
- **Thème DSFR complet** (porté depuis DFAED-NG) :
  - `Common.js` : orchestrateur de chargement avec anti-FOUC et détection d'environnement.
  - `dsfr/Config.js` : navigation spécifique DocDFAED — **7 entrées** : Accueil (lien direct), Documentation (sous-menus : ASQ, Veille professionnelle), Formation (Formations internes, Formations externes), Planning (Consultation, Gestion), OCE (Consultation, Gestion), Historique (lien direct), Application FAED (lien direct).
  - `dsfr/Layout.js` : nettoyage DOM MediaWiki + fil d'Ariane dynamique.
  - `dsfr/Header.js` : header DSFR avec polling jQuery/mw.util, menus de navigation et authentification.
  - `dsfr/Footer.js` : footer Marianne avec modale d'outils.
  - `dsfr/EditPage.js` : barre d'édition DSFR avec icônes SVG personnalisées.
  - `Common.css` + `dsfr/Style.css` : surcharges CSS DSFR.
- **Composants DSFR actifs** : Accordion, Alert, Badge (portés depuis DFAED-NG).
- **49 stubs de composants DSFR** prêts à implémenter (liste complète dans `staging_area/dsfr/components/`).
