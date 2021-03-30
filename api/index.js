const express = require('express');
const router = express.Router();
const user = require('./user');
const auth = require('./auth/auth');
const refresh = require('./auth/refresh');
const project = require('./project');
const history = require('./history');
const db = require('../model/knex');

// login etc.
router.use('/user', user);

// auth
router.use('/auth', auth);

// refresh token
router.use('/refresh', refresh);

// project
router.use('/project', project);

// Update All History
router.use('/history', history);

router.get('/percobaan', async (req, res) => {
  const coba = await db.select('*').from('project');
  // console.log(coba[0]);
  return res.json({ coba });
});
module.exports = router;
