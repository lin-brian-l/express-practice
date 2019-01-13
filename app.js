require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const expressSession = require('express-session');

var app = express();

const passport = require('passport');
require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(expressSession({
	secret: process.env.SECRET,
	resave: true,
	saveUninitialized: true,
	duration: 1000 * 60 * 60, // 1 hour in milliseconds
	activeDuration: 1000 * 60 * 30 // 30 min in milliseconds
}))
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
var playersRouter = require('./routes/players');
var authRouter = require('./routes/auth');

app.use('/', playersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
