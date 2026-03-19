# WIKIS-DFAED — Dépôt de développement

Dépôt regroupant les environnements de développement locaux des deux wikis du **Département du Fichier Automatisé des Empreintes Digitales (DFAED)** de la Gendarmerie nationale.

## Les deux wikis

### Wiki DFAED-NG

Wiki de documentation destiné à l'ensemble des **enquêteurs de la gendarmerie nationale** pour les accompagner dans l'utilisation de l'application FAED.

- **Public** : Enquêteurs GN (accès intranet)
- **Hébergeur** : STIG (niveau national)
- **URL prod** : Intranet gendarmerie

### Wiki DocDFAED

Wiki de recensement des **processus internes du département DFAED**. Accès restreint aux agents du département.

- **Public** : Agents DFAED uniquement
- **Hébergeur** : BSII / Pôle judiciaire

---

## Stack commune

| Composant | Version |
|-----------|---------|
| MediaWiki | 1.31 (LTS) |
| Semantic MediaWiki | 3.2.3 |
| PHP | 7.4 |
| MariaDB | 10.4 |

---

## Mission : Transformation DSFR

L'objectif de ce dépôt est de transformer progressivement l'interface des deux wikis pour qu'elle soit conforme au **[Système de Design de l'État Français (DSFR)](https://www.systeme-de-design.gouv.fr/)**.

Cette transformation se fait **sans modifier le cœur de MediaWiki** : elle repose uniquement sur des pages `MediaWiki:Common.js`, `MediaWiki:Common.css` et des sous-pages JS/CSS injectées côté client.

### Principes de l'approche

- **Zéro FOUC** : un overlay loader est injecté immédiatement pour masquer l'interface native MediaWiki le temps que le thème DSFR se charge.
- **Pas de skin personnalisée** : le skin MonoBook reste actif, le DOM natif est nettoyé et remplacé par des composants DSFR via JavaScript.
- **ES5 strict** : la prod MediaWiki 1.31 requiert du JavaScript ES5 pur (pas de `const`, `let`, arrow functions, ni backticks).
- **Déploiement manuel** : aucun accès SSH/Git vers la production — le code est copié-collé dans l'interface web MediaWiki.
- **Environnement Docker local** : un environnement Dockerisé reproduit fidèlement la stack de production pour le développement et les tests.

---

## Structure du dépôt

```bash
WIKIS-DFAED/
├── README.md               ← ce fichier
├── CLAUDE.md               ← instructions pour Claude Code
├── CHANGELOG.md            ← résumé des versions des deux wikis
│
├── wiki-DFAED-NG/          ← chantier DSFR actif
│   ├── README.md           ← démarrage rapide (Docker)
│   ├── CLAUDE.md           ← règles techniques détaillées
│   ├── CHANGELOG.md        ← historique des versions
│   ├── docker-compose.yml  ← orchestration des services
│   ├── Dockerfile          ← image MW 1.31.16 + SMW 3.2.3
│   ├── LocalSettings.php   ← config MediaWiki locale
│   ├── staging_area/       ← code source JS/CSS (éditer ici)
│   │   ├── Common.css      ← styles globaux
│   │   ├── Common.js       ← loader maître + orchestrateur
│   │   └── dsfr/
│   │       ├── Config.js   ← navigation, textes, logos
│   │       ├── Layout.js   ← nettoyage DOM + fil d'Ariane
│   │       ├── Header.js   ← header DSFR + auth
│   │       ├── Footer.js   ← pied de page + modal outils
│   │       ├── EditPage.js ← barre d'édition DSFR
│   │       ├── Style.css   ← overrides CSS
│   │       └── components/ ← composants DSFR (Accordion, Alert, Badge…)
│   └── imports_externes/   ← exports XML pour tests
│
└── wiki-DocDFAED/          ← chantier actif (wiki interne département)
```

---

## Démarrage rapide (wiki-DFAED-NG)

**Prérequis** : Docker Desktop installé.

```bash
cd wiki-DFAED-NG

# Lancer l'environnement
docker compose up -d

# Premier démarrage uniquement : initialiser les tables
docker compose exec mediawiki php maintenance/update.php --quick
```

Accès : [http://localhost:8080](http://localhost:8080) — `admin` / `admin123`

Pour la documentation complète du workflow de développement et du déploiement, voir [`wiki-DFAED-NG/README.md`](wiki-DFAED-NG/README.md).

---

## Workflow de développement

1. **Éditer** les fichiers dans `wiki-DFAED-NG/staging_area/`
2. **Tester** en rafraîchissant [http://localhost:8080](http://localhost:8080)
3. **Déployer** en copiant-collant le contenu dans les pages `MediaWiki:*` via l'interface web de production

### Table de correspondance (DFAED-NG)

| Fichier local (`staging_area/`) | Page de production |
|---------------------------------|--------------------|
| `Common.css` | `MediaWiki:Common.css` |
| `Common.js` | `MediaWiki:Common.js` ← déployer en premier |
| `dsfr/Config.js` | `MediaWiki:Dsfr/Config.js` |
| `dsfr/Layout.js` | `MediaWiki:Dsfr/Layout.js` |
| `dsfr/Header.js` | `MediaWiki:Dsfr/Header.js` |
| `dsfr/Footer.js` | `MediaWiki:Dsfr/Footer.js` |
| `dsfr/EditPage.js` | `MediaWiki:Dsfr/EditPage.js` |
| `dsfr/Style.css` | `MediaWiki:Dsfr/Style.css` |
| `dsfr/components/Accordion.js` | `MediaWiki:Dsfr/components/Accordion.js` |
| `dsfr/components/Alert.js` | `MediaWiki:Dsfr/components/Alert.js` |
| `dsfr/components/Badge.js` | `MediaWiki:Dsfr/components/Badge.js` |

---

## État d'avancement

| Wiki | Statut | Version |
|------|--------|---------|
| DFAED-NG | Chantier actif — thème DSFR opérationnel | v2.1.0 |
| DocDFAED | Environnement initialisé — thème DSFR importé de DFAED-NG | v1.0.0 |

### Composants DSFR disponibles (DFAED-NG)

- Header avec navigation configurée, authentification, outils de page
- Footer avec modal outils
- Fil d'Ariane automatique
- Barre d'édition personnalisée (DSFR)
- Accordéon, Alerte, Badge
- 50+ stubs de composants prêts à implémenter
