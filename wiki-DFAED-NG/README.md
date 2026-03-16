# MediaWiki Dev Sandbox (Copy-Paste Workflow)

Environnement de développement local Dockerisé pour concevoir et tester les scripts (JS) et styles (CSS) d'un Wiki en production.

## Stack

| Composant | Version |
|-----------|---------|
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

4. **Accéder au Wiki local** : [http://localhost:8080](http://localhost:8080)
   - **User** : `admin`
   - **Pass** : `admin123`

## Workflow de développement

Toute l'édition se fait dans le dossier local `/staging_area`.

### 1. Développement

Éditez ces fichiers dans votre IDE préféré (VS Code).

> **CONTRAINTE TECHNIQUE — Compatibilité prod (MediaWiki 1.31 / wiki de production)**
> Le Wiki de production utilise une version qui ne supporte pas le JavaScript moderne dans son minifier.
> - **INTERDIT** : `const`, `let`, les backticks `` ` `` pour les chaînes multi-lignes, les fonctions fléchées `=>`.
> - **OBLIGATOIRE** : Utilisez `var`, la concaténation `'a' + 'b'`, et `function() {}` classique.

> **RÈGLE IMPORTANTE** : Chaque fichier doit commencer par un commentaire d'en-tête indiquant :
> - Le nom de la page cible en production (ex: `MediaWiki:Layout.js`)
> - La logique de chargement est gérée par `Common.js` de manière universelle.

Fichiers principaux :

- `staging_area/Common.css` : Styles globaux.
- `staging_area/Common.js` : **Script Maître**. Il injecte le Loader, détecte l'environnement (Local/Prod) et charge les modules.
- `staging_area/dsfr/` : Dossier contenant les composants DSFR (Header, Layout, etc.).

### 2. Test

Rafraîchissez simplement votre navigateur local.

> Le `Common.js` + `LocalSettings.php` (pour le CSS) travaillent main dans la main pour simuler un chargement rapide sans cache agressif.

### 3. Déploiement en Production (Le "Copy-Paste System")

Le Wiki de production **n'a pas** accès à ce dépôt Git. Vous devez mettre à jour les pages via l'interface web.

> **ATTENTION** : L'ordre de mise à jour n'est pas critique, mais commencer par `Common.js` assure que tout le monde voit l'écran de chargement.

| Fichier Local | Page Wiki de Production (Destination) | Rôle |
|--------------|--------------------------------------|------|
| `Common.css` | `MediaWiki:Common.css` | Styles de base |
| `Common.js` | `MediaWiki:Common.js` | **Loader & Chef d'orchestre** (À copier en priorité) |
| `dsfr/Config.js` | `MediaWiki:Dsfr/Config.js` | Textes & Logos |
| `dsfr/Layout.js` | `MediaWiki:Dsfr/Layout.js` | Nettoyage DOM & CSS Fallback |
| `dsfr/Header.js` | `MediaWiki:Dsfr/Header.js` | Header DSFR avec logique résiliente |
| `dsfr/Footer.js` | `MediaWiki:Dsfr/Footer.js` | Pied de page |
| `dsfr/Style.css` | `MediaWiki:Dsfr/Style.css` | Styles DSFR & Overrides |
| `dsfr/components/Badge.js` | `MediaWiki:Dsfr/components/Badge.js` | Composant Badge |
| `dsfr/components/Accordion.js` | `MediaWiki:Dsfr/components/Accordion.js` | Composant Accordéon |

---

## Architecture "Zéro FOUC"

Pour éviter les clignotements (FOUC) et garantir la stabilité :

1. **Loader Immédiat** : `Common.js` injecte un overlay blanc dès la première milliseconde.
2. **CSS Préchargé** (Local) : `LocalSettings.php` injecte le CSS DSFR côté serveur via `addHeadItem`.
3. **Header Résilient** : `Header.js` attend sagement que MediaWiki soit prêt avant de s'afficher et de retirer l'overlay.

Si vous ajoutez un nouveau fichier `MagicButton.js`, ajoutez-le simplement à la liste `dsfrModules` dans `Common.js`.

## Semantic MediaWiki

L'environnement local embarque Semantic MediaWiki 3.2.3, identique à la version de production. Cela permet de tester les requêtes `{{#ask:}}`, les propriétés SMW et les templates sémantiques directement en local.

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
