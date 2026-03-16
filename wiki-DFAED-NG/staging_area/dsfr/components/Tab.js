/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Tab.js]] */
(function() {
    // DSFR Tab Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/onglet

    window.DsfrTab = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Tab component initialized');
        }
    };

    $(function() {
        if (window.DsfrTab) {
            window.DsfrTab.init();
        }
    });
})();
