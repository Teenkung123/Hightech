var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// Mongoose connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:1234@hightech.dmuzq.mongodb.net/?retryWrites=true&w=majority&appName=Hightech', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

var indexRouter = require('./routes/index');
var documentsRouter = require('./routes/documents');
var usersRouter = require('./routes/users');

var app = express();

// Enable CORS
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api', indexRouter);
app.use('/documents', documentsRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
