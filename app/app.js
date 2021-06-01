var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const fs = require('fs');
var logger = require('morgan');
var df = require('node-df');
const multer = require('multer');
const helpers = require('./helpers');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/uploads/');
  },

  filename: function(req, file, cb) {
      cb(null, file.originalname);
  }
});


const byos = process.env.BYOS;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/MySiteStaticContents', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<html><body>');
  res.write(`Static file 1: <hr/><img src="/public/banner1.jpg" width="500">`);
  res.write('<br/>');
  res.write(`Static file 2: <hr/><img src="/public/banner2.jpg" width="500">`);
  res.end('</body></html>');
});

app.get('/upload', (req, res) => {
  res.sendFile(__dirname + '/upload.html');
});

app.get('/mounts', (req, res) => {

df(function (error, response) {
    if (error) { throw error; }
 
    res.json(response);
});

/* Replacing drivelist with node-df since it isn't showing mounted network drives
drivelist.list().then(
  drives => res.json(drives),
  err => console.log(err)
)
*/

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
