var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  throw new Error('Exception: custom exception!');

  res.render('index', { title: 'CSU-Hackfest-Lab-App' });
});

module.exports = router;
