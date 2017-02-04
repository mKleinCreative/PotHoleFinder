var express = require('express');
var router = express.Router();

var {create, getAllMarkers} = require('../config/database');

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Find The Hole', id: req.session.passport.user.fbID, name: req.session.passport.user.displayName });
});

router.get('/landing', function(req, res, next) {
  // console.log( "=====>", req.session.passport.user.fbID)
  res.render('landing', { title: 'Find The Hole' });
});

router.post('/marker/save/:id', function(req, res, next) {
  const id = req.params.id
  const { lat, lng, label } = req.body
  create( id, lat, lng, label, 100010101, 5).then( val => {
    res.send(val)
  })
})

router.get('/marker/getAll', function(req, res, next) {
  getAllMarkers().then( val => {
    console.log(val[3])
    // res.send(val)
  })
})



module.exports = router;
