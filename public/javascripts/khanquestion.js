var currentid = "";
    var KhanUtil = {
        debugLog: function() {}
    };
    var Khan = {
        Util: KhanUtil,
        error: function() {},
        query: {debug: ""},
        imageBase: "/perseus/ke/images/",
        scratchpad: {
            disable: function() {},
            enable: function() {}
        }
    };
    React.initializeTouchEvents(true);

(function() {

// Load khan-exercises modules, then perseus
require(["/perseus/ke-deps.js"], function() {
    // pre built
    // require(["build/perseus.js"], initPerseus);

    // pre built with source maps
    // require(["build/perseus.debug.js"], initPerseus);

    // built on demand
    require(["/perseus/build/perseus-1.js"], initPerseus);
});

$('#score').on('click', function() {
    console.log(zk.scoreInput());
    if(zk.scoreInput().correct == true){
        $('#score').text("Correct. Good job!")
    } else {
        $('#score').text("Inorrect. Try again!")
    }
});


function initPerseus(Perseus) {

$('#upvotebutton').on('click', function(e) {
    $('#upvotebutton').addClass( "button_disabled button_clicked" );
    $('#downvotebutton').addClass( "button_disabled" );
    console.log("SUBMITTING")

    $.ajax({
            url: 'upvote/' + currentid,
            type: 'POST',
             //dataType: "json",
            success: function(response) {
                $('#upvotenumber').html(Number($('#upvotenumber').text())+1);
            }   
        });

    e.preventDefault();
});

$('#downvotebutton').on('click', function(e) {
    $('#upvotebutton').addClass( "button_disabled" );
    $('#downvotebutton').addClass( "button_disabled button_clicked" );
    console.log("SUBMITTING")

    $.ajax({
            url: 'downvote/' + currentid,
            type: 'POST',
             //dataType: "json",
            success: function(response) {
                $('#downvotenumber').html(Number($('#downvotenumber').text())+1);
            }   
        });

    e.preventDefault();
});



var seedContent = {
    "question": {
        "content": "[[☃ image-widget 1]]\n\nThe graph of the four-petal flower $~r=\\cos(2\\theta)~$ is pictured above.  For each of the four labeled points, determine whether $~\\dfrac{dy}{d\\theta}~$ and $~\\dfrac{dx}{d\\theta}~$ are opposite in sign.\n\nPoint|YES or NO\n:-:|:-:\n$A$|[[☃ dropdown 6]]\n$B$|[[☃ dropdown 7]]\n$C$|[[☃ dropdown 8]]\n$D$|[[☃ dropdown 9]]\n",
        "images": {},
        "widgets": {
            "image-widget 1": {
                "type": "image-widget",
                "graded": true,
                "options": {
                    "backgroundImage": {
                        "url": "https://ka-perseus-graphie.s3.amazonaws.com/b66154ceca9d493db19512507f2ce2d33e5cbb61.png",
                        "width": 470,
                        "height": 470
                    },
                    "box": [
                        470,
                        470
                    ],
                    "range": [
                        [
                            0,
                            10
                        ],
                        [
                            0,
                            10
                        ]
                    ],
                    "labels": [
                        {
                            "content": "A",
                            "coordinates": [
                                8.2,
                                6
                            ],
                            "alignment": "center"
                        },
                        {
                            "content": "B",
                            "coordinates": [
                                4.2,
                                8.3
                            ],
                            "alignment": "center"
                        },
                        {
                            "content": "C",
                            "coordinates": [
                                1.8,
                                6
                            ],
                            "alignment": "center"
                        },
                        {
                            "content": "D",
                            "coordinates": [
                                4.2,
                                1.6
                            ],
                            "alignment": "center"
                        }
                    ]
                }
            },
            "dropdown 6": {
                "type": "dropdown",
                "graded": true,
                "options": {
                    "placeholder": "Yes/No",
                    "choices": [
                        {
                            "content": "Yes",
                            "correct": true
                        },
                        {
                            "content": "No",
                            "correct": false
                        }
                    ]
                }
            },
            "dropdown 7": {
                "type": "dropdown",
                "graded": true,
                "options": {
                    "placeholder": "Yes/No",
                    "choices": [
                        {
                            "content": "Yes",
                            "correct": false
                        },
                        {
                            "content": "No",
                            "correct": true
                        }
                    ]
                }
            },
            "dropdown 8": {
                "type": "dropdown",
                "graded": true,
                "options": {
                    "placeholder": "Yes/No",
                    "choices": [
                        {
                            "content": "Yes",
                            "correct": false
                        },
                        {
                            "content": "No",
                            "correct": true
                        }
                    ]
                }
            },
            "dropdown 9": {
                "type": "dropdown",
                "graded": true,
                "options": {
                    "placeholder": "Yes/No",
                    "choices": [
                        {
                            "content": "Yes",
                            "correct": true
                        },
                        {
                            "content": "No",
                            "correct": false
                        }
                    ]
                }
            }
        }
    },
    "answerArea": {
        "type": "multiple",
        "options": {
            "content": "Answer to left.",
            "images": {},
            "widgets": {}
        },
        "calculator": false
    },
    "hints": [
        {
            "content": "Recall that for a polar curve, the slope of the tangent line at a given point is given by $~\\displaystyle\\frac{dy}{dx}=\\frac{\\tfrac{dy}{d\\theta }}{\\tfrac{dx}{d\\theta }}\\,$.",
            "images": {},
            "widgets": {}
        },
        {
            "content": "Thus if $~\\dfrac{dy}{d\\theta}~$ and $~\\dfrac{dx}{d\\theta}~$ are opposite in sign, then $~\\dfrac{dy}{dx}<0\\,$.  Hence we need to examine the slopes of the tangent lines at the four points in question.",
            "images": {},
            "widgets": {}
        },
        {
            "content": "We see that the tangent lines at points $~A~$ and $~D~$ will have negative slopes, while the tangent lines drawn at points $~B~$ and $~C~$ will have positive slopes.",
            "images": {},
            "widgets": {}
        },
        {
            "content": "Therefore $~\\dfrac{dy}{d\\theta}~$ and $~\\dfrac{dx}{d\\theta}~$ are opposite in sign at points $~A~$ and $~D\\,$.",
            "images": {},
            "widgets": {}
        }
    ]
};

var idtoopen = location.hash ? location.hash.substring(1) : "getquestion";
$.getJSON( idtoopen, function( data ) {
    currentid = data._id;
    console.log(currentid);
    $( "#upvotenumber" )
    .html( data.upvotes );
    $( "#downvotenumber" )
    .html( data.downvotes );
    Perseus.init({}).then(function() {
        var itemMountNode = document.createElement("div");
        zk = React.renderComponent(Perseus.ItemRenderer({
            item: data,
            problemNum: Math.floor(Math.random() * 50) + 1,
            initialHintsVisible: 0,
            enabledFeatures: {
                highlight: true,
                toolTipFormats: true
            }
        }, null), itemMountNode);
        zk.focus();
    }).then(function() {
        console.log("all done.", +new Date/1000);
    }, function(err) {
        console.error(err);
    });
});



}

})();
