requirejs.config({
    paths: {
        "jquery": "../local-only/jquery",
    }
});

requirejs([
    "jquery",
    "../local-only/katex/katex.js",
    "../local-only/underscore.js",
    "../local-only/kas.js",
    "../local-only/jed.js",
    "../local-only/localeplanet/icu." + getLang() + ".js"
], function($, katex) {
    // Only 'jquery' and 'katex' have amd wrappers (and jQuery sets the global
    // regardless); the other files export globally directly and we don't use
    // their return values
    window.katex = katex;

    // These scripts depend on jQuery, so we wait to load them
    requirejs([
        "../local-only/jquery-migrate-1.1.1.js",
        "../local-only/jquery-ui.js",
        "../local-only/jquery.qtip.js",
        "../local-only/i18n.js"
    ], function() {
        requirejs([
            "../exercises-stub.js",
            "../history.js",
            "../interface.js",
        ], function() {
            requirejs(["../khan-exercise.js"], function() {
                Khan.loadLocalModeSiteWhenReady();
            });
        });
    });
});

function getLang() {
    var match = /[?&]lang=([^&]+)/.exec(window.location.search);
    return match ? match[1] : "en-US";
}
