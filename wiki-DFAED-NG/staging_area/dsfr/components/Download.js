/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Download.js]] */
(function() {
    // DSFR Download Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/telechargement-de-fichier

    window.DsfrDownload = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Download component initialized');
        }
    };

    $(function() {
        if (window.DsfrDownload) {
            window.DsfrDownload.init();
        }
    });
})();
