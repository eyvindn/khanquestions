var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(['/', '/trending', '/new'], function(req, res) {
    var db = req.db;
    
   // Math.floor((Math.random() * db.collection('khanquestions').count()) + 1);
    db.collection('questions').find().toArray(function (err, items) {
    	var item = items[Math.floor(Math.random()*items.length)];
        path_to_render = 'index';
        title = 'Home';
        if(req.path == '/trending') {
            path_to_render = 'trending';
            title = "Trending Questions";
        } else if (req.path == '/new') {
            path_to_render = 'new';
            title = "Latest Questions";
        }

//        has_voted = (req.session.voted_questions) ? (req.session.voted_questions.indexOf(item._id) > -1) : false;

        res.render(path_to_render, { title: title + ' | Khan Questions', voted_bool: false });
    });

    //db.collection('khanquestions')..next(
   // 	function(err, cursor){
    //		res.json(cursor.question);
    //	}
    //);
  
});


router.get(['/getquestion', '/trending/getquestion', '/new/getquestion'], function(req, res) {
    var db = req.db;
    
    recursive_find_question = function (err, items) {
        var item = items[Math.floor(Math.random()*items.length)];
        if ((item.upvotes - item.downvotes) < -10) {
            recursive_find_question(err, items);
        } else {
            item.has_voted_up = (req.session.upvoted_questions) ? (req.session.upvoted_questions.indexOf(item._id) > -1) : false;
            item.has_voted_down = (req.session.downvoted_questions) ? (req.session.downvoted_questions.indexOf(item._id) > -1) : false;
            res.json(item);
        }
    }
   // Math.floor((Math.random() * db.collection('khanquestions').count()) + 1);
    db.collection('questions').find().toArray(recursive_find_question);

    //db.collection('khanquestions')..next(
   //   function(err, cursor){
    //      res.json(cursor.question);
    //  }
    //);
  
});




router.get('/create', function(req, res) {
    res.render('create', { title: 'Create | Khan Questions' });
});

router.post('/create', function(req, res, next) {
    var db = req.db;
    req.body.time = Date.now();
    req.body.upvotes = 0;
    req.body.downvotes = 0;
    req.body.user = 1337;
    console.log(req.body);
    db.collection('questions').insert(req.body, function(err, docsinsert) {
        if(err) {
            return console.log('inser error', err);
        }
        res.send(docsinsert[0]._id);
    });

});

router.post('/upvote/:id', function(req, res, next) {
    var db = req.db;
    console.log(req.params.id);

    if(!req.session.upvoted_questions){
        req.session.upvoted_questions = [];
    }

    if (req.session.upvoted_questions.indexOf(req.params.id) > -1) { 
        res.send("FAIL");
    } else {
        db.collection('questions').updateById(req.params.id, {$inc: {upvotes: 1}},
        function (err) {
            req.session.upvoted_questions.push(req.params.id);
            res.send("UPVOTED");
        }); 
    }
   

});

router.post('/downvote/:id', function(req, res, next) {
    var db = req.db;
    console.log(req.params.id);

    if(!req.session.downvoted_questions){
        req.session.downvoted_questions = [];
    }

    if (req.session.downvoted_questions.indexOf(req.params.id) > -1) { 
        res.send("FAIL");
    } else {
        db.collection('questions').findById(req.params.id, function (err, cursor) {
            db.collection('questions').updateById(req.params.id, {$inc: {downvotes: 1}},
            function (err) {
                req.session.downvoted_questions.push(req.params.id);
                res.send("DOWNVOTED");
            }); 
        });
    }
    

});

router.get('/get/:id', function(req, res) {
    var db = req.db;

    db.collection('questions').findById(req.params.id, function (err, cursor) {
        cursor.has_voted_up = (req.session.upvoted_questions) ? (req.session.upvoted_questions.indexOf(req.params.id) > -1) : false;
        cursor.has_voted_down = (req.session.downvoted_questions) ? (req.session.downvoted_questions.indexOf(req.params.id) > -1) : false;
        res.json(cursor);
    });


    //db.collection('khanquestions')..next(
   //   function(err, cursor){
    //      res.json(cursor.question);
    //  }
    //);
  
});


module.exports = router;
