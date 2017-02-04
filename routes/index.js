var express = require('express');
var router = express.Router();

var {create} = require('../config/database');

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Find The Hole', id: req.session.passport.user.fbID });
});

router.get('/landing', function(req, res, next) {
  // console.log( "=====>", req.session.passport.user.fbID)
  res.render('landing', { title: 'Find The Hole' });
});

router.post('/marker/save/:id', function(req, res, next) {
  const id = req.params.id
  const { lat, lng, label } = req.body
  // TODO: DELETE ME: result
  create( id, lat, lng, label, 100010101, 5).then( val => {
    console.log('VALUES', val );
  })
})

module.exports = router;
