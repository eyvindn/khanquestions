var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var db = req.db;
    
   // Math.floor((Math.random() * db.collection('khanquestions').count()) + 1);
    db.collection('questions').find().toArray(function (err, items) {
    	var item = items[Math.floor(Math.random()*items.length)];
        res.render('index', { title: 'Express' });
    });

    //db.collection('khanquestions')..next(
   // 	function(err, cursor){
    //		res.json(cursor.question);
    //	}
    //);
  
});


router.get('/getquestion', function(req, res) {
    var db = req.db;
    
   // Math.floor((Math.random() * db.collection('khanquestions').count()) + 1);
    db.collection('questions').find().toArray(function (err, items) {
        var item = items[Math.floor(Math.random()*items.length)];
        res.json(item);
    });

    //db.collection('khanquestions')..next(
   //   function(err, cursor){
    //      res.json(cursor.question);
    //  }
    //);
  
});




router.get('/create', function(req, res) {
    res.render('create', { title: 'Express' });
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
    db.collection('questions').updateById(req.params.id, {$inc: {upvotes: 1}},
        function (err) {
            res.send("UPVOTED");
    }); 

});

router.post('/downvote/:id', function(req, res, next) {
    var db = req.db;
    console.log(req.params.id);
    db.collection('questions').updateById(req.params.id, {$inc: {downvotes: 1}},
        function (err) {
            res.send("DOWNVOTED");
    }); 

});

router.get('/:id', function(req, res) {
    var db = req.db;

    db.collection('questions').findById(req.params.id, function (err, cursor) {
        res.json(cursor);
    });


    //db.collection('khanquestions')..next(
   //   function(err, cursor){
    //      res.json(cursor.question);
    //  }
    //);
  
});


module.exports = router;
