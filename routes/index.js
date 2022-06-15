var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send('CSU-Hackfest-Lab-App is running!' + process.env.DefaultConnection).end();
});

module.exports = router;
