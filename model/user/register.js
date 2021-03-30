const db = require('../model/db');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const data = new Promise((resolve, reject) => {
    db.query('SELECT * from user', (err, result) => {
      if (err) reject(err);
      return resolve(result);
    });
  });
  res.send(await data);
});

module.exports = router;
