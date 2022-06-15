var express = require('express');
var router = express.Router();

/* POST random number to DB. */
router.get('/', function(req, res, next) {

  try {
    var random_number= Math.floor(Math.random() * 1000);
  
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
        request.query(`INSERT INTO mytable ([key], value) VALUES (${random_number}, ${random_number});`, function (err, recordset) {
            if (err) console.log(err)
            // send records as a response
            res.send({"Message" : `Successfully written number ${random_number}`});
        });
    });
  } catch (error) {
      console.log('My error:')
      console.log(error)
      res.status(200).send({"Error" : JSON.stringify(error)});
  }

});

module.exports = router;
