
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

    $.ajax({
            url: 'create',
            type: 'POST',
             //dataType: "json",
        contentType: "application/json; charset=utf-8",
            data: JSON.stringify(editor.serialize()), // Some data e.g. Valid JSON as a string
            success: function(response) {
            }   
        });

    e.preventDefault();
});


$('#problemNum').text(problemNum);
$('#enabledFeatures').html(_.map(enabledFeatures, function(enabled, feature) {
    return '<span style="margin-left: 5px; background: ' +
            (enabled ? "#aaffaa" : "#ffcccc") + ';">' + feature + '</span>';
}).join(''));

var defaultQuestion = {
    "question": {
        "content": "[[☃ example-graphie-widget 1]]",
        "widgets": {
            "example-graphie-widget 1": {
                "type": "example-graphie-widget",
                "graded": true,
                "options": {
                    "correct": [
                        -1,
                        -3
                    ],
                    "graph": {
                        "box": [
                            340,
                            340
                        ],
                        "labels": [
                            "x",
                            "y"
                        ],
                        "range": [
                            [
                                -10,
                                10
                            ],
                            [
                                -10,
                                10
                            ]
                        ],
                        "step": [
                            1,
                            1
                        ],
                        "gridStep": [
                            1,
                            1
                        ],
                        "valid": true,
                        "backgroundImage": null,
                        "markings": "grid",
                        "showProtractor": false
                    }
                }
            }
        }
    },
    "answerArea": {
        "type": "multiple",
        "options": {
            "content": "",
            "widgets": {}
        },
        "calculator": false
    },
    "hints": []
};


var query = Perseus.Util.parseQueryString(window.location.hash.substring(1));
var question = query.content ? JSON.parse(query.content) : defaultQuestion;



    Perseus.init({skipMathJax: false}).then(function() {

    var editorProps = _.extend(question, {
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



}

})();