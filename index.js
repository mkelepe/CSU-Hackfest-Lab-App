
'use strict';

const express = require('express');

const app = express();

app.get('/', async (req, res) => {
  res.status(200).send('CSU-Hackfest-Lab-App is running!').end();
});


// Start the server
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


module.exports = app;