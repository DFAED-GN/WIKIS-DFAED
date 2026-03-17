/*
 * -------------------------------------------------------------------------
 * SOURCE FILE FOR: MediaWiki:Common.js (AUTO-DETECT PATH)
 * -------------------------------------------------------------------------
 */

(function () {

    // -------------------------------------------------------------------------
    // CHARGEMENT DES MODULES + RÉVÉLATION ANTI-FOUC
    // -------------------------------------------------------------------------
    // Les modules sont chargés en parallèle. Un compteur onload surveille
    // leur chargement. Quand tous sont prêts, html.dsfr-ready est ajouté,
    // déclenchant la révélation CSS (transition opacity dans Common.css).
    //
    // Deux failsafes garantissent que le contenu devient toujours visible :
    //   — JS  : setTimeout 5000ms ci-dessous
    //   — CSS : animation différée 4s dans Common.css
    // -------------------------------------------------------------------------

    $(function () {
        var apiPath = mw.config.get('wgScript');
        var isLocal = window.location.hostname === 'localhost';

        var dsfrModules = [
            'Config',
            'Layout',
            'Header',
            'Footer',
            'EditPage',
            'components/Accordion',
            'components/Alert',
            'components/Badge',
            'components/Card',
            'components/Stepper',
            'components/Tooltip',
            'components/Table',
            'components/Tab',
            'components/Download',
            'components/Tag',
            'components/Summary'
        ];

        var total    = dsfrModules.length;
        var loaded   = 0;
        var revealed = false;

        function reveal() {
            if (revealed) return;
            revealed = true;
            document.documentElement.classList.add('dsfr-ready');
            console.log('[DSFR] Ready — all modules loaded (' + total + ')');
        }

        // Failsafe JS : révéler après 5s si les onload ne se déclenchent pas
        var failsafe = setTimeout(function() {
            console.warn('[DSFR] Failsafe triggered — revealing after timeout');
            reveal();
        }, 5000);

        function onModuleLoaded() {
            loaded++;
            if (loaded >= total) {
                clearTimeout(failsafe);
                reveal();
            }
        }

        console.log('[DSFR] Loading ' + total + ' modules — env: ' + (isLocal ? 'local' : 'prod'));

        if (isLocal) {
            dsfrModules.forEach(function(m) {
                var s = document.createElement('script');
                s.src = '/staging_area/dsfr/' + m + '.js?v=' + Date.now();
                s.onload  = onModuleLoaded;
                s.onerror = onModuleLoaded; // Compter même en cas d'erreur
                document.head.appendChild(s);
            });
        } else {
            // PROD : charger le CSS de personnalisation
            var cssLink = document.createElement('link');
            cssLink.rel  = 'stylesheet';
            cssLink.type = 'text/css';
            cssLink.href = apiPath + '?title=MediaWiki:Dsfr/Style.css&action=raw&ctype=text/css';
            document.head.appendChild(cssLink);

            // PROD : charger les modules JS
            dsfrModules.forEach(function(m) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src  = apiPath + '?title=MediaWiki:Dsfr/' + m + '.js&action=raw&ctype=text/javascript';
                s.onload  = onModuleLoaded;
                s.onerror = onModuleLoaded;
                document.head.appendChild(s);
                console.log('[DSFR] Loading module:', m);
            });
        }
    });

}());
