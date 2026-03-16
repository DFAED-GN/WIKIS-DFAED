/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Card.js]] */
(function() {
    // DSFR Card Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/carte

    window.DsfrCard = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Card component initialized');
        }
    };

    $(function() {
        if (window.DsfrCard) {
            window.DsfrCard.init();
        }
    });
})();
