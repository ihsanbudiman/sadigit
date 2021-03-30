const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { proses, hapus } = require('./proses');
const getData = require('./getProject');
const {
  insert,
  getTodo,
  getTodos,
  deleteTodo,
  getNamaTodos,
  getNamaProject,
} = require('./todos');

const {
  prosesTodo,
  getTask,
  deleteTask,
  taskChange,
  editTask,
  getProgress,
  getHistory,
} = require('./todo.js');

const {
  prosesPenjualan,
  getSpecific,
  getDataPenjualan,
} = require('./penjualan');

const { insertFollowUp, getFollowUp } = require('./followUp');

router.post('/proses', auth, proses);
router.post('/hapus', auth, hapus);
router.post('/addTodos', auth, insert);
router.post('/getTodo', auth, getTodo);
router.post('/getTodos', auth, getTodos);
router.post('/deleteTodo', auth, deleteTodo);
router.post('/getData', auth, getData);
router.post('/getNamaTodos', auth, getNamaTodos);
router.post('/getNamaProject', auth, getNamaProject);
router.post('/prosesTodo', auth, prosesTodo);
router.post('/getTask', auth, getTask);
router.post('/deleteTask', auth, deleteTask);
router.post('/taskChange', auth, taskChange);
router.post('/editTask', auth, editTask);
router.post('/getProgress', auth, getProgress);
router.post('/getHistory', auth, getHistory);

// Route Penjualan
router.post('/prosesPenjualan', auth, prosesPenjualan);
router.post('/getSpecific', auth, getSpecific);
router.post('/getDataPenjualan', auth, getDataPenjualan);
router.post('/insertFollowUp', auth, insertFollowUp);
router.post('/getFollowUp', auth, getFollowUp);

module.exports = router;
