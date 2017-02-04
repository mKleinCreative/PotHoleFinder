var express = require('express');
var router = express.Router();
const db = require('../config/database')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/createUser', function(req, res, next) {
  res.send('respond with a resource');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  return next;

  res.redirect('/');
}

module.exports = router;
