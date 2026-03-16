/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Table.js]] */
(function() {
    // DSFR Table Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/tableau

    window.DsfrTable = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Table component initialized');
        }
    };

    $(function() {
        if (window.DsfrTable) {
            window.DsfrTable.init();
        }
    });
})();
