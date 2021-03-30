const db = require('../../model/knex');
const _ = require('lodash');
const moment = require('moment');

const taskChange = async (req, res) => {
  const { from, to, ...rest } = req.body;
  const namaTask = await db('projectTask').where({ id: rest.idTask }).first();

  const keterangan = `${namaTask.task} from ${from} to ${to}`;
  const action = 'moved';
  const insert = await db('historyTask').insert({
    ...rest,
    keterangan,
    action,
  });
  if (insert)
    return res.json({
      messages: 'Data Berhasil Disimpan',
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Disimpan',
    success: false,
  });
};

const taskInsert = async (req, res) => {
  const { idTodos, status, ...rest } = req.body;

  const action = 'added';
  const newTask = await db('projectTask').where({
    status,
    after: 0,
    idTodos,
    idUser: rest.idUser,
  });
  const idTask = newTask[0].id;
  const namaTask = await db('projectTask').where({ id: idTask }).first();

  const keterangan = `${namaTask.task} to ${status}`;
  const insert = await db('historyTask').insert({
    ...rest,
    keterangan,
    idTask,
    idTodos,
    action,
  });
  if (insert)
    return res.json({
      messages: 'Data Berhasil Disimpan',
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Disimpan',
    success: false,
  });
};

const taskUpdate = async (req, res) => {
  const { task, oldTask, ...rest } = req.body;

  const action = 'edited';
  const keterangan = `${oldTask} from ${oldTask} to ${task}`;
  const update = await db('historyTask').insert({
    ...rest,
    keterangan,
    action,
  });
  if (update)
    return res.json({
      messages: 'Data Berhasil Disimpan',
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Disimpan',
    success: false,
  });
};

const taskDelete = async (req, res) => {
  const { judul, task, ...rest } = req.body;

  const action = 'removed';

  const keterangan = `${task}`;
  const update = await db('historyTask').insert({
    ...rest,
    keterangan,
    action,
  });
  if (update)
    return res.json({
      messages: 'Data Berhasil Disimpan',
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Disimpan',
    success: false,
  });
};

module.exports = { taskChange, taskInsert, taskUpdate, taskDelete };
