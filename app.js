var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('pg-promise')
var session = require('express-session')

var index = require('./routes/index');
var users = require('./routes/users');
var pgSession = require('connect-pg-simple')(session)

var app = express();

const User = {
  findOrCreate: (info, callback) => {
    callback(null, info)
  }
}

var conString = 'postgres://localhost:5432/FindTheHole'

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  store: new pgSession({
    conString : process.env.DATABASE_URL || conString
  }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
   }
}))

app.use('/', index);
app.use('/users', users);

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

app.use(passport.initialize());
passport.use(new FacebookStrategy({
    clientID: '675333105982659',
    clientSecret: '0385cdb71eae35ffaf20d8492f89a67a',
    callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOrCreate({fbID: profile.id}, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
      });
    })
  }
));

passport.serializeUser(function(user, callback) {
  callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
})

app.get('/', function(req, res, next) {
  res.redirect('/landing');
});

app.get('/auth/facebook',
passport.authenticate('facebook'))

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/',  successRedirect: '/index'}))

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('/index.ejs', {
    user : req.user
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next()
    res.redirect('/')
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
