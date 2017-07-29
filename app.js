var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");
const resBuilder = require('./util/responseBuilder');

// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({defaultCharset: 'utf-8'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// index設定
app.use('/', require("./routes/index"));

var files = fs.readdirSync("./routes");
for (var i = 0, l = files.length; i < l; i++) {
  var file = files[i].substr(0, files[i].indexOf(".js"));
  app.use("/api/" + file, require("./routes/" + file));
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
  // res.status(err.status || 500);
  // res.render('error');
  res.json(resBuilder.error(err));
});

module.exports = app;
