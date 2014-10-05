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
   // 	function(err, cursor){
    //		res.json(cursor.question);
    //	}
    //);
  
});

router.get('/create', function(req, res) {
    res.render('create', { title: 'Express' });
});


module.exports = router;
