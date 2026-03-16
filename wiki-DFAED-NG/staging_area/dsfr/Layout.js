/* SOURCE FILE FOR: [[MediaWiki:Dsfr/Layout.js]] */
/* 
    Responsabilités : 
    1. Charger les libs externes (CSS/JS DSFR)
    2. Nettoyer le DOM natif MediaWiki
    3. Préparer le conteneur de contenu
*/

// 1. Load DSFR Resources
// We load CSS here AS A FALLBACK in case LocalSettings.php isn't restarted or cached.
// Redundant loading is handled by browser cache, so no harm done.
mw.loader.load('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/dsfr.min.css', 'text/css');
mw.loader.load('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/utility/utility.min.css', 'text/css');
mw.loader.load('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/utility/icons/icons.min.css', 'text/css');

// Load DSFR JS Module
var script = document.createElement('script');
script.type = 'module';
script.src = 'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/dsfr.module.min.js';
document.head.appendChild(script);

$(function() {
    console.log('[DSFR] Layout Cleaning starting...');

    // 2. Add DSFR classes to main content container
    $('#content').addClass('fr-container fr-my-4w');

    // 3. Hide native elements (Sidebar, Footer, etc.) BUT Keep #mw-head for Tabs/Tools
    $('#mw-panel, #siteNotice, .mw-footer, #footer, .vector-sticky-header').hide();

    // Remove useless MW chrome
    $('#mw-page-base, #mw-head-base, .mw-editTools, .limitreport').remove();

    // 4. BREADCRUMB — Replaces the H1 page title with a DSFR fil d'Ariane
    var pageName = mw.config.get('wgPageName') || '';
    var pageTitle = mw.config.get('wgTitle') || '';
    var action = mw.config.get('wgAction');

    // Only show breadcrumb in view mode (not edit/submit)
    if (action === 'view' && pageName) {
        // Parse page name into segments
        // e.g. "Signalisation:Procédure" → ["Signalisation", "Procédure"]
        // e.g. "NeoDK:Fiches_pratiques/Detail" → ["NeoDK", "Fiches_pratiques", "Detail"]
        var raw = pageName.replace(/_/g, ' ');
        var segments = [];
        var parts = raw.split(':');
        
        // Namespace part
        if (parts.length > 1) {
            segments.push(parts[0]);
            var rest = parts.slice(1).join(':');
            // Subpage parts (split by /)
            var subParts = rest.split('/');
            for (var i = 0; i < subParts.length; i++) {
                segments.push(subParts[i]);
            }
        } else {
            // No namespace, just subpages
            var subParts = parts[0].split('/');
            for (var i = 0; i < subParts.length; i++) {
                segments.push(subParts[i]);
            }
        }

        // Don't show breadcrumb on the homepage
        if (pageName !== 'Accueil' && segments.length > 0) {
            var breadcrumbId = 'breadcrumb-' + Date.now();
            var breadcrumbHtml = '' +
                '<nav role="navigation" class="fr-breadcrumb" aria-label="vous êtes ici :">' +
                '  <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="' + breadcrumbId + '">Voir le fil d\'Ariane</button>' +
                '  <div class="fr-collapse" id="' + breadcrumbId + '">' +
                '    <ol class="fr-breadcrumb__list">' +
                '      <li><a class="fr-breadcrumb__link" href="' + mw.util.getUrl('Accueil') + '">Accueil</a></li>';

            // Build intermediate links (all segments except the last one)
            var cumulativePath = '';
            for (var s = 0; s < segments.length - 1; s++) {
                // Build link target: reconstruct the wiki page name
                if (s === 0 && parts.length > 1) {
                    // First segment is namespace
                    cumulativePath = segments[s] + ':';
                } else {
                    cumulativePath += (cumulativePath.slice(-1) === ':' ? '' : '/') + segments[s].replace(/ /g, '_');
                }
                breadcrumbHtml += '<li><a class="fr-breadcrumb__link" href="' + mw.util.getUrl(cumulativePath) + '">' + segments[s] + '</a></li>';
            }

            // Last segment = current page (no link)
            var lastSegment = segments[segments.length - 1];
            breadcrumbHtml += '<li><a class="fr-breadcrumb__link" aria-current="page">' + lastSegment + '</a></li>';

            breadcrumbHtml += '' +
                '    </ol>' +
                '  </div>' +
                '</nav>';

            // Find the H1 and replace with breadcrumb + clean title
            var $h1 = $('#firstHeading, .firstHeading, .mw-first-heading').first();
            if ($h1.length) {
                $h1.before(breadcrumbHtml);
                // Replace H1 content with just the last segment (clean title)
                $h1.text(lastSegment);
            }
        }
    }

    console.log('[DSFR] Layout Cleaning done.');
});
