var express = require('express');
var router = express.Router();

var {create} = require('../config/database');

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Find The Hole' });
});

router.get('/landing', function(req, res, next) {
  res.render('landing', { title: 'Find The Hole' });
});

router.post('/marker/save/:id', function(req, res, next) {
  console.log("IVE BEEN CALLED!")
  const id = req.params.id
  const { lat, lng, label } = req.body
  console.log('body', req.body, 'label', label, 'id', id);
  // TODO: DELETE ME: result
  create( id, lat, lng, label, 100010101, 5).then( val => {
    console.log('VALUES', val );
  })
})

module.exports = router;
