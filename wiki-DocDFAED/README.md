# DocDFAED — Environnement de développement

Environnement de développement local Dockerisé pour concevoir et tester les scripts (JS) et styles (CSS) du wiki **DocDFAED** en production.

DocDFAED est la plateforme de documentation interne du Département du Fichier Automatisé des Empreintes Digitales (DFAED — Gendarmerie nationale). Accès restreint aux agents du département, hébergé par le BSII / Pôle judiciaire.

## Stack

| Composant | Version |
| ----------- | --------- |
| MediaWiki | 1.31.16 (LTS) |
| Semantic MediaWiki | 3.2.3 |
| PHP | 7.4 |
| MariaDB | 10.4 |

## Démarrage rapide

1. **Prérequis** : Docker Desktop installé.

2. **Lancer le serveur** :

   ```bash
   docker compose up -d
   ```

3. **Premier démarrage uniquement** — initialiser les tables (MediaWiki + SMW) :

   ```bash
   docker compose exec mediawiki php maintenance/update.php --quick
   ```

4. **Accéder au Wiki local** : [http://localhost:8081](http://localhost:8081)
   - **User** : `admin`
   - **Pass** : `admin123`

> Le wiki DFAED-NG tourne sur le port **8080**. DocDFAED utilise le port **8081** pour éviter les conflits.

## Workflow de développement

L'édition se fait dans `staging_area/` (Config.js + Common.js propres à DocDFAED) et dans `../shared/` (base commune aux deux wikis).

> **CONTRAINTE TECHNIQUE — Compatibilité prod (MediaWiki 1.31)**
> Le Wiki de production ne supporte pas le JavaScript moderne dans son minifier.
>
> - **INTERDIT** : `const`, `let`, les backticks `` ` ``, les fonctions fléchées `=>`.
> - **OBLIGATOIRE** : `var`, la concaténation `'a' + 'b'`, et `function() {}` classique.
> **RÈGLE IMPORTANTE** : Chaque fichier doit commencer par `/* SOURCE FILE FOR: [[MediaWiki:NomDeLaPage]] */`

### Déploiement en Production (Copy-Paste)

Le Wiki de production n'a pas accès à ce dépôt Git. Mise à jour via l'interface web uniquement.

| Source locale | Page Wiki de production | Rôle |
| -------------- | ------------------------- | ------ |
| `staging_area/Common.js` | `MediaWiki:Common.js` | Loader & chef d'orchestre (À copier en priorité) |
| `staging_area/dsfr/Config.js` | `MediaWiki:Dsfr/Config.js` | Navigation, branding, footer DocDFAED |
| `shared/Common.css` | `MediaWiki:Common.css` | Styles de base |
| `shared/dsfr/Layout.js` | `MediaWiki:Dsfr/Layout.js` | Nettoyage DOM & fil d'Ariane |
| `shared/dsfr/Header.js` | `MediaWiki:Dsfr/Header.js` | Header DSFR |
| `shared/dsfr/Footer.js` | `MediaWiki:Dsfr/Footer.js` | Pied de page |
| `shared/dsfr/EditPage.js` | `MediaWiki:Dsfr/EditPage.js` | Barre d'édition DSFR |
| `shared/dsfr/Style.css` | `MediaWiki:Dsfr/Style.css` | Styles DSFR & overrides |
| `shared/dsfr/components/*.js` | `MediaWiki:Dsfr/components/*.js` | Composants DSFR (voir liste ci-dessous) |

### Navigation configurée (Config.js)

| Entrée | Type | Sous-éléments |
| -------- | ------ | --------------- |
| Accueil | Lien | — |
| Documentation | Menu | ASQ, Veille professionnelle |
| Formation | Menu | Formations internes, Formations externes |
| Planning | Menu | Consultation, Gestion |
| OCE | Menu | Consultation, Gestion |
| Historique | Lien | — |
| Application FAED | Lien | — |

### Composants DSFR (stubs)

49 composants présents dans `staging_area/dsfr/components/` — tous structurés, à implémenter selon les besoins :

**Actifs** : Accordion, Alert, Badge, Card, Stepper, Download, Summary, Tab, Table, Tag, Tooltip (11 composants chargés dans `sharedModules`)

**Disponibles dans `shared/`, non encore activés** : Breadcrumb, Button, Callout, Checkbox, Dropdown, Form, Highlight, Input, Link, Modal, Notice, Pagination, Quote, Radio, Search, Segmented, Select, Share, Sidemenu, Skiplink, Tabnav, Tile, Toggle, Transcription, Upload

---

## Architecture "Zéro FOUC"

1. **Loader immédiat** : `Common.js` injecte un overlay blanc dès la première milliseconde.
2. **CSS préchargé** : `LocalSettings.php` injecte le CSS DSFR côté serveur via `addHeadItem`.
3. **Header résilient** : `Header.js` attend que MediaWiki soit prêt avant de s'afficher et retirer l'overlay.

Ordre de chargement : `Config → Layout → Header → Footer → EditPage → components`

## Semantic MediaWiki

L'environnement local embarque SMW 3.2.3, identique à la version de production. Permet de tester les requêtes `{{#ask:}}`, propriétés SMW et templates sémantiques directement en local.

## Commandes utiles

```bash
# Démarrer
docker compose up -d

# Arrêter
docker compose down

# Reconstruire l'image (après modif du Dockerfile)
docker compose up -d --build

# Logs en temps réel
docker compose logs -f mediawiki

# Accès shell dans le container
docker compose exec mediawiki bash

# Réinitialiser la base de données (supprime toutes les données)
docker compose down -v
docker compose up -d
docker compose exec mediawiki php maintenance/update.php --quick
```
