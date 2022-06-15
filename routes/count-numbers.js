var express = require('express');
var router = express.Router();

/* POSTrandom number to DB. */
router.get('/', function(req, res, next) {
  
  var sql = require("mssql");

  // config for your database
  var config = {
    user: process.env.db_user || 'dbadminuser',
    password: process.env.db_password || '44!,h{/FugEVnw+V',
    server: process.env.db_host || 'sqlserver7ukmp7nzntfpk.database.windows.net', 
    database: process.env.db_name || 'sampledb' 
   };

  // connect to your database
  sql.connect(config, function (err) {
  
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
         
      // query to the database and get the records
      request.query('select count(*) AS count_numbers from mytable', function (err, recordset) {
          if (err) console.log(err)
          // send records as a response
          res.send(recordset.recordsets[0][0]);
      });
  });

});

module.exports = router;
