const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

router.post('/', (req, res) => {
  const accessToken = req.headers['authorization'];

  jwt.verify(accessToken, SECRET_KEY, (err, userInfo) => {
    // if (userInfo !== undefined) {

    // } else {
    //   const { iat, exp, ...user } = userInfo;
    // }

    if (err)
      return res.status(401).json({
        success: false,
        message: 'anda tidak memiliki akses',
        cek: req.headers['Authorization'],
      });
    const { iat, exp, ...user } = userInfo;
    return res.json({
      success: true,
      message: 'selamat anda memiliki akses',
      user,
    });
  });
});

module.exports = router;
