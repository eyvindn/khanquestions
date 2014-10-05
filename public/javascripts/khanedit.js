
    var icu = {
        getDecimalFormatSymbols: function() {
            return {
                decimal_separator: ".",
                grouping_separator: ",",
                minus: "-"
            };
        }
    };
    var KhanUtil = {
        debugLog: function() {},
        localeToFixed: function(num, precision) {
            return num.toFixed(precision);
        }
    };
    var Khan = {
        Util: KhanUtil,
        error: function() {},
        query: {debug: ""},
        imageBase: "/perseus/ke/images/",
        scratchpad: {
            enable: function() {},
            disable: function() {}
        }
    };
    React.initializeTouchEvents(true);

(function() {

requirejs.config({
    waitSeconds: 120
});

// Load khan-exercises modules, then perseus
require(["perseus/ke-deps.js"], function() {
    // pre built
    require(["perseus/build/perseus-1.js"], initPerseus);

    // pre built with source maps
    // require(["build/perseus.debug.js"], initPerseus);

    // built on demand
    // require(["src/perseus.js"], initPerseus);
});

function initPerseus(Perseus) {

window.Perseus = Perseus;

var defaultQuestion = "";

var editor;
var problemNum = _.random(1, 99);
var enabledFeatures = {
    highlight: true,
    toolTipFormats: true,
    useMathQuill: true
};

$('#serialize').on('click', function() {
    console.log(JSON.stringify(editor.serialize(), null, 4));
});
$('#scorePreview').on('click', function() {
    console.log(editor.scorePreview());
});
$('#submit').on('click', function(e) {
    console.log("SUBMITTING")
    $.post( "create", JSON.stringify(editor), function( data ) {
        console.log(data);
    });
    e.preventDefault();
});

$('#problemNum').text(problemNum);
$('#enabledFeatures').html(_.map(enabledFeatures, function(enabled, feature) {
    return '<span style="margin-left: 5px; background: ' +
            (enabled ? "#aaffaa" : "#ffcccc") + ';">' + feature + '</span>';
}).join(''));

var query = Perseus.Util.parseQueryString(window.location.hash.substring(1));
var question = query.content ? JSON.parse(query.content) : defaultQuestion;



$.getJSON( "getquestion", function( data ) {

    Perseus.init({skipMathJax: false}).then(function() {

    var editorProps = _.extend({question: data}, {
        problemNum: problemNum,
        enabledFeatures: enabledFeatures,
        developerMode: true,
        imageUploader: function(image, callback) {
            _.delay(callback, 1000, "http://fake.image.url");
        },
        apiOptions: {
            __onInputError: function() {
                var args = _.toArray(arguments);
                console.log.apply(console, ["onInputError:"].concat(args));
                return false;
            },
            __interceptInputFocus: function() {
                var args = _.toArray(arguments);
                console.log.apply(console, ["interceptInputFocus:"].concat(args));
                return;
            }
        }
    });

    editor = React.renderComponent(
        Perseus.StatefulEditorPage(editorProps, null),
        document.getElementById("perseus-container")
    );

    // Some hacks to make debugging nicer
    window.editorPage = editor.refs.editor;
    window.itemRenderer = window.editorPage.renderer;
    }).then(function() {
    }, function(err) {
        console.error(err);
    });


});


}

})();