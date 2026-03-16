/* SOURCE FILE FOR: [[MediaWiki:Dsfr/components/Stepper.js]] */
(function() {
    // DSFR Stepper Component
    // Documentation: https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/indicateur-d-etapes

    window.DsfrStepper = {
        transform: function() {
            // Transformation logic if needed
        },
        init: function() {
            this.transform();
            console.log('[DSFR] Stepper component initialized');
        }
    };

    $(function() {
        if (window.DsfrStepper) {
            window.DsfrStepper.init();
        }
    });
})();
