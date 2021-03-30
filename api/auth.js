const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = {
    username,
    password,
  };

  const token = jwt.sign(user, SECRET_KEY, { expiresIn: 3600 }); // 1 hour
  const refreshToken = jwt.sign(user, REFRESH_TOKEN, { expiresIn: 2592000 }); // 30 days
  const coba = jwt.verify(token, SECRET_KEY);
  const cobaa = jwt.verify(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsImxldmVsIjoiYWRtaW4iLCJsZWFkIjoiTiIsImFkZFVzZXIiOiJZIiwiZW5yb2xsIjoiWSIsImlhdCI6MTYxNDQzMDcxOCwiZXhwIjoxNjE0NTE3MTE4fQ.NmVPED5NXoDpy_mQaN2T1B4L-JKsAkvly5y8ewuOxLg',
    REFRESH_TOKEN,
  );
  res.json({ token, refreshToken, coba, cobaa });
});

module.exports = router;
