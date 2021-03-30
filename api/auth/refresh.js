const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

router.post('/', (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken === '')
    return res.json({
      success: false,
    });

  const sumberData = jwt.verify(refreshToken, REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).send({
        success: false,
      });
    } else {
      return user;
    }
  });

  const { iat, exp, ...info } = sumberData;

  // if (info.length === undefined) return res.json({ success: false });
  // console.log(info.length);
  const accessToken = jwt.sign(info, SECRET_KEY, { expiresIn: 14400 });
  const userInfo = jwt.verify(accessToken, SECRET_KEY);
  res.json({ accessToken, userInfo, success: true });
});

module.exports = router;
