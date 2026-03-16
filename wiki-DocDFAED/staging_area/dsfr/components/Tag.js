/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Tag.js]] */
(function() {
    // DSFR Tag Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/tag

    window.DsfrTag = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Tag component initialized');
        }
    };

    $(function() {
        if (window.DsfrTag) {
            window.DsfrTag.init();
        }
    });
})();
