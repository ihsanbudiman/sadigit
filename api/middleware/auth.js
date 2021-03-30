const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Middleware for dashboard
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  // console.log(token);
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, userInfo) => {
    if (err) return res.sendStatus(401);
    req.userInfo;
    next();
  });
};

module.exports = { auth };
