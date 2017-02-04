var express = require('express');
var router = express.Router();

var db = require('../config/database');

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Find The Hole' });
});

router.get('/landing', function(req, res, next) {
  res.render('landing', { title: 'Find The Hole' });
});

module.exports = router;
