var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var newnotes = require('./routes/newnotes');
var checknotes = require('./routes/checknotes');
var visionProtector = require('./routes/visionProtector');
var mongoose = require('mongoose');
var session = require('express-session');
var Note = require(__dirname + '/public/javascripts/note_model.js');

mongoose.connect('mongodb://taoduo:Bonanza2016@ds015508.mongolab.com:15508/mynotes');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(session({
  secret:'TIML',
  resave: true,
  saveUninitialized: true
}));

// routes
app.use('/checknotes', checknotes);
app.use('/newnotes', newnotes);
app.use('/visionProtector', visionProtector);

//login
app.post('/adm', function(req, res, next) {
  if(req.body.pw === 'duotao'){
    req.session.login = true;
    res.send('adm');
  } else {
    res.send('err');
  }
});
//get the navpage
app.get('/', function(req, res, next) {
  res.render('navpage');
});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
