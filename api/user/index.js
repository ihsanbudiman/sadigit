const express = require('express');
const router = express.Router();
const register = require('./register');
const login = require('./login');
const { loginCheck } = require('../auth/token');

router.post('/register', register);
router.post('/login', login);
// router.get('/data', loginCheck, (req, res) => {
//   res.json({ data: req.userInfo });
// });

module.exports = router;
