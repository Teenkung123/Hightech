var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors

// Mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:1234@hightech.dmuzq.mongodb.net/?retryWrites=true&w=majority&appName=Hightech')
    .then(() => console.log('MongoDB Connection Successfully!'))
    .catch((err) => console.error('MongoDB Connection failed:', err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var documentsRouter = require('./routes/documents'); // Import documents router

var app = express();

// Enable CORS
app.use(cors());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // ใช้ pug เป็น view engine

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // เสิร์ฟไฟล์ static จากโฟลเดอร์ public

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/documents', documentsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

