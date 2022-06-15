'use strict';

require('dotenv').config();
const express = require('express');
const Pool = require('pg').Pool;

console.log('NODE_ENV: ' + process.env.NODE_ENV);

console.log('Version: 1.0');

const pool= new Pool({
    host: process.env.DBHOST,
    port: 5432,
    user: process.env.DBUSER,
    database: process.env.DBNAME,
    password: process.env.DBPASS,
    ssl: { rejectUnauthorized: false }
});

const app = express();

app.use(express.raw({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb', }));

app.get('/api/', async (req, res) => {
  res.status(200).send('Eurobank SendGrid Webhook is running!').end();
});

app.get('/api/testdb/', async (req, res) => {
  try {
    const client= await pool.connect()
    try {
      // await client.query('BEGIN')
      let resDB = await client.query('SELECT NOW()');
      res.status(200).send(resDB['rows']).end();
      // await client.query('COMMIT')

    } catch (error) {
      // await client.query('ROLLBACK')
      throw error

    } finally {
      await client.release()
    }

  } catch (error) {
    console.log(error);
    res.status(400).send(error).end();
  }
});

app.post('/api/webhook/', async (req, res) => {
  try {
    const client= await pool.connect()
    let resDB;
    try {
      await client.query('BEGIN')
      const events= req.body;
      console.log(events);
      for (let i= 0; i< events.length; i++){
        const e= events[i];

        const email= JSON.stringify(e.email);
        const timestamp= e.timestamp;
        const event= JSON.stringify(e.event);
        const smtp_id= JSON.stringify(e["smtp-id"]);
        const useragent= JSON.stringify(e.useragent);
        const ip= JSON.stringify(e.ip);
        const sg_event_id= JSON.stringify(e.sg_event_id);
        const sg_message_id= JSON.stringify(e.sg_message_id);
        const reason= JSON.stringify(e.reason);
        const status= JSON.stringify(e.status);
        const response= JSON.stringify(e.response);
        const tls= JSON.stringify(e.tls);
        const url= JSON.stringify(e.url);
        const category= JSON.stringify(e.category);
        const asm_group_id= JSON.stringify(e.asm_group_id);
        const unique_args= JSON.stringify(e.unique_args);
        const marketing_campaign_id= JSON.stringify(e.marketing_campaign_id);
        const attempt= JSON.stringify(e.attempt);
        const event_pool= JSON.stringify(e.pool);
        const sg_machine_open= JSON.stringify(e.sg_machine_open);
        const event_json_unprocessed= e;

        resDB = await client.query(`
        INSERT INTO public.events ("email", "timestamp", "event", "smtp_id", "useragent", "ip", "sg_event_id", "sg_message_id", "reason", "status", "response", "tls", "url", "category", "asm_group_id", "unique_args", "marketing_campaign_id", "attempt", "pool", "sg_machine_open", "event_json_unprocessed") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        ON CONFLICT (id) DO NOTHING;
              `
          , [email, timestamp, event, smtp_id, useragent, ip, sg_event_id, sg_message_id, reason, status, response, tls, url, category, asm_group_id, unique_args, marketing_campaign_id, attempt, event_pool, sg_machine_open, event_json_unprocessed]);

      }

      await client.query('COMMIT')
      res.status(200).send("Success").end();

    } catch (error) {
      await client.query('ROLLBACK')
      throw error

    } finally {
      await client.release()
    }

  } catch (error) {
    console.log(error);
    res.status(400).send(error).end();
    // console.log(req.body[0].email)
    // return;
  }
});

// Start the server
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


module.exports = app;