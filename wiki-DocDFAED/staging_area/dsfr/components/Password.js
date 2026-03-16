/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Password.js]] */
(function() {
    // DSFR Password Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/mot-de-passe

    window.DsfrPassword = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Password component initialized');
        }
    };

    $(function() {
        if (window.DsfrPassword) {
            window.DsfrPassword.init();
        }
    });
})();
