/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Tooltip.js]] */
(function() {
    // DSFR Tooltip Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/infobulle

    window.DsfrTooltip = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Tooltip component initialized');
        }
    };

    $(function() {
        if (window.DsfrTooltip) {
            window.DsfrTooltip.init();
        }
    });
})();
