const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { taskChange, taskInsert, taskUpdate, taskDelete } = require('./task');

router.post('/taskChange', auth, taskChange);
router.post('/taskInsert', auth, taskInsert);
router.post('/taskUpdate', auth, taskUpdate);
router.post('/taskDelete', auth, taskDelete);

module.exports = router;
