const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const token = (data) => {
  const token = jwt.sign({ ...data }, SECRET_KEY, { expiresIn: 14400 }); // 1 hour
  const refreshToken = jwt.sign({ ...data }, REFRESH_TOKEN, {
    expiresIn: 86400,
  }); // 30 days
  const userInfo = jwt.verify(token, SECRET_KEY);
  // const cobaa = jwt.verify(refreshToken, REFRESH_TOKEN);
  return { token, refreshToken, userInfo, success: true };
};

// Middleware for dashboard
const loginCheck = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, userInfo) => {
    if (err) return res.sendStatus(401);
    req.userInfo = userInfo;
    next();
  });
};

module.exports = { token, loginCheck };
