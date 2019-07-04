var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const raceRouter = require('./routes/race');
const apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/user', userRouter);
app.get('/user/:user', userRouter);
app.get('/race', raceRouter)
app.get('/race/:race', raceRouter)
app.get('/api', apiRouter.api);
app.get('/api/users', apiRouter.getUsersSearch);
app.get('/api/user/:user', apiRouter.getUserStats);
app.get('/api/race', apiRouter.getLastTwentyRaces);
app.get('/api/race/:race', apiRouter.getRaceInfo);


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

if (app.get('env') === 'development') {
  console.log("loaded @ " + Date());
}

module.exports = app;
