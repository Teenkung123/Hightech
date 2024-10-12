var express = require('express');
var router = express.Router();

// API test route
router.get('/test', function(req, res, next) {
  res.json({ message: 'API is working!' });
});

module.exports = router;

