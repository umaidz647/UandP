let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStratagy = passportLocal.Strategy;
let flash = require('connect-flash');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

//Set up Express Session
app.use(session({
  secret:"SomeSecret",
  saveUninitialized:false,
  resave:false
}));

//Initialize flash
app.use(flash());

app.use('/', indexRouter); // local host
app.use('/users', usersRouter); // local host:3000/users

// Use body-parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
let DB = require('./config/db');
mongoose.connect(DB.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Create a user model instance
let userModel = require('./models/user')
let User = userModel.User;

//implement a User Authentication
passport.use(User.createStrategy());

//serialize and deserialize the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
