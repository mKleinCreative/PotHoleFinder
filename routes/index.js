var express = require('express');
var router = express.Router();

var db = require('../config/database');

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
  const { lat, lng, label, rating } = req.body
  db.create( id, lat, lng, label, rating*10).then( val => {
    res.send(val)
  })
})

router.post('/marker/getAll', function(req, res, next) {
  db.getAllMarkers().then( val => {
    console.log("Value:", val)
    res.send(val)
  })
})

router.post('/marker/update', function(req, res, next) {
  const { id, rating } = req.body
  db.update(id, rating).then( val => {
    res.send(val)
  })
})

router.post('/marker/delete', function(req, res, next) {
  const { id } = req.body
  db.deleteItem(id).then( val => {
    res.send(val)
  })
})

module.exports = router;
