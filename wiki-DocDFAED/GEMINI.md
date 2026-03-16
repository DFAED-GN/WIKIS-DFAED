# CONTEXTE PROJET & RÈGLES DE L'IA

Ce projet est un environnement de **simulation locale** pour le wiki **DocDFAED** en production.
DocDFAED est la plateforme de recensement des processus internes du DFAED (Gendarmerie nationale), accessible uniquement aux agents du département. Hébergé par le BSII / Pôle judiciaire.
L'utilisateur développe ici, mais déploie manuellement ailleurs.

## ENVIRONNEMENT

| Élément | Local | Production |
|---------|-------|------------|
| URL | `localhost:8081/` | URL interne BSII |
| Script path | `/index.php` | chemin prod |
| Skin | Monobook | Vector / Monobook |
| MediaWiki | 1.31.16 (LTS) | 1.31.16 (LTS) |
| Semantic MediaWiki | 3.2.3 | 3.2.3 |
| PHP | 7.4 | 7.4 |
| MariaDB | 10.4 | 10.4 |

> Le port **8080** est réservé au wiki DFAED-NG. DocDFAED utilise le port **8081**.

## RÈGLES D'OR (THE COPY-PASTE SYSTEM)

1. **Pas de déploiement automatique** : Ne jamais suggérer de `git push` ou de SSH vers la prod. La prod est accessible uniquement via l'interface web (Page `MediaWiki:...`).
2. **Mirroring Strict** : Les fichiers dans `staging_area/` doivent porter le même nom que les pages Wiki cibles (ex: `Layout.js` -> `MediaWiki:Layout.js`).
3. **Double Environnement (Optimisé Vitesse)** :
   - **Local** : L'injection CSS critique se fait via PHP (`LocalSettings.php`) avec `$out->addHeadItem()` pour éviter le FOUC.
   - **Prod** : L'injection CSS doit se faire via `MediaWiki:Common.css` pour les styles critiques (DSFR) ou `Common.js`.
4. **Documentation In-Code** : Chaque fichier JS/CSS doit commencer par un commentaire d'en-tête indiquant clairement : `SOURCE FILE FOR: [[MediaWiki:NomDuFichier]]`
5. **Compatibilité ES5 Stricte (compatibilité prod)** :
   - **Interdit** : `const`, `let`, `=>` (arrow functions), `` ` `` (template literals/backticks).
   - **Obligatoire** : `var`, `function() {}`, concaténation `'a' + 'b'`.
   - La prod tourne sur une version dont le minifier casse le JS moderne. Tout code doit être "Old School".
6. **Pas de chemins hardcodés** : Ne **jamais** écrire `href="/"` ou `action="/index.php"`. Utiliser :
   - `mw.util.getUrl('NomDePage')` pour les liens vers des pages wiki
   - `mw.config.get('wgScript')` pour le chemin vers `index.php`

## ARCHITECTURE TECHNIQUE

### 1. Loader Immédiat (Common.js)

Pour masquer les "sauts" d'interface (Layout Shift) dus à la transformation JS, `Common.js` injecte **immédiatement** (dès la première ligne d'exécution) un overlay blanc avec spinner.

- Le chargement des modules utilise `$(function() {...})` (jQuery ready) — **ne pas utiliser `window.RLQ`** qui ne fonctionne pas sur la prod MW 1.31.
- Il reste affiché jusqu'à ce que `Header.js` signale qu'il est prêt via `window.DsfrHideLoader()`.
- Un failsafe retire le loader après 5s si le header échoue.

### 2. Header Résilient (Header.js)

Le header ne compte pas sur `mw.loader.using` (qui peut bloquer). Il utilise une boucle de **Polling** (`setInterval` de 50ms) pour attendre `jQuery` et `mw.util`.

- Une fois les dépendances là, il s'injecte.
- Une fois injecté, il détruit le Loader.

### 3. CSS Hybride

- **Local** : Chargé par `LocalSettings.php` (`$out->addHeadItem()`) pour la vitesse.
- **Secours** : `Layout.js` charge aussi les CSS via `mw.loader.load` au cas où le cache serveur serait vide (Fallback).

### 4. Semantic MediaWiki

SMW est installé via Composer dans `vendor/mediawiki/semantic-media-wiki/` et activé uniquement via `enableSemantics('localhost')` dans `LocalSettings.php` (pas de `wfLoadExtension` — incompatible avec l'installation Composer).

## STRUCTURE

- `/docker-compose.yml` : Infrastructure locale (port 8081).
- `/Dockerfile` : Image PHP 7.4 + MW 1.31.16 + SMW 3.2.3.
- `/LocalSettings.php` : Config locale + préchargement CSS DSFR.
- `/staging_area/` : **Seul dossier où le code métier réside.**
  - `Common.js` : **Chef d'orchestre**. Contient le Loader Inline + le chargeur de modules.
  - `Common.css` : Styles CSS natifs globaux.
  - `/dsfr/` : **Dossier modulaire pour le thème**
    - `Config.js` (Mappé sur `MediaWiki:Dsfr/Config.js`) : Navigation, service, footer config.
    - `Layout.js` (Mappé sur `MediaWiki:Dsfr/Layout.js`) : Nettoyage & Fallback CSS.
    - `Header.js` (Mappé sur `MediaWiki:Dsfr/Header.js`) : Header + Auth Link Logic.
    - `Footer.js` (Mappé sur `MediaWiki:Dsfr/Footer.js`) : Footer DSFR + Modal Outils.
    - `EditPage.js` (Mappé sur `MediaWiki:Dsfr/EditPage.js`) : Toolbar d'édition DSFR custom.
    - `Style.css` (Mappé sur `MediaWiki:Dsfr/Style.css`) : Surcharges Visuelles & Masquage.
    - `/components/` : **Composants Réutilisables**
      - `Accordion.js`, `Alert.js`, `Badge.js` : composants actifs.
      - *(+ stubs préparés pour implémentation future, non chargés par Common.js)*
