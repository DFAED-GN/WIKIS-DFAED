# Changelog — DocDFAED

## [Unreleased]

---

## [1.0.0] — 2026-03-16

### Ajouts

- Environnement Docker initial basé sur l'architecture du wiki DFAED-NG.
- Stack : MediaWiki 1.31.16, Semantic MediaWiki 3.2.3, PHP 7.4, MariaDB 10.4.
- `LocalSettings.php` avec chargement des assets DSFR via `BeforePageDisplay` (port 8081).
- Extension WikiEditor activée.
- Workflow copy-paste `staging_area/` → pages `MediaWiki:`.
- Architecture "Zéro FOUC" : overlay blanc via `Common.js` + CSS préchargé via `LocalSettings.php`.
- Thème DSFR v1.12.1 : Header, Footer, Layout, EditPage, Config.
- Composants DSFR actifs : Accordion, Alert, Badge.
- 50+ stubs de composants préparés pour implémentation future.
