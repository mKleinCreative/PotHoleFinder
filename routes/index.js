var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

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

router.post('/upload/:id', function(req, res){
  const id = req.params.id
  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '../public');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.readFile(file.path, 'hex', function(err, imgData) {
      console.log('imgData uploaded at', form.uploadDir);
      imgData = '\\x' + imgData;
      db.updateImg(id, imgData)
    });
    fs.rename(file.path, path.join(form.uploadDir, 'img'+id));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

module.exports = router;
