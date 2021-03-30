const db = require('../../model/knex');
const _ = require('lodash');
const knex = require('../../model/knex');

const prosesTodo = async (req, res) => {
  const { id, ...rest } = req.body;
  let data;
  const latestUpdate = new Date();

  if (id === '') {
    const getIdFirst = await db('projectTask')
      .select('id')
      .where({ status: req.body.status, after: 0, idTodos: req.body.idTodos });
    if (getIdFirst.length < 1) {
      data = await db('ProjectTask').insert({ ...rest, latestUpdate });
      if (data)
        return res.json({
          messages: 'Data Berhasil Disimpan',
          success: true,
        });
    }
    const updateIdFirst = await db('projectTask')
      .update({ after: 99999999 })
      .where({ id: getIdFirst[0].id });
    if (updateIdFirst) {
      data = await db('ProjectTask').insert({ ...rest, latestUpdate });
      if (data) {
        const getNewFirst = await db('projectTask').select('id').where({
          status: req.body.status,
          after: 0,
          idTodos: req.body.idTodos,
        });
        const updateAfterFirst = await db('projectTask')
          .update({ after: getNewFirst[0].id })
          .where({ id: getIdFirst[0].id });
        if (updateAfterFirst) {
          return res.json({
            messages: 'Data Berhasil Disimpan akhir',
            success: true,
          });
        } else {
          return res.json({
            messages: 'Data Gagal Disimpan akhir',
            success: false,
          });
        }
      } else {
        return res.json({
          messages: 'Data Gagal Disimpan insert',
          success: false,
        });
      }
    } else {
      return res.json({
        messages: 'Data Gagal Disimpan gagal update id lama',
        success: false,
      });
    }
  } else {
    data = await db('ProjectTask')
      .where({ id })
      .update({ ...rest, latestUpdate });
    if (data)
      return res.json({
        messages: 'Data Berhasil Disimpan',
        success: true,
      });
    return res.json({
      messages: 'Data Gagal Disimpan',
      success: false,
    });
  }
};

const getTask = async (req, res) => {
  const { idTodos } = req.body;
  const data = await db
    .select('projectTask.*', 'username')
    .from('projectTask')
    .leftJoin('user', 'user.id', '=', 'projectTask.idUser')
    .where({ idTodos });
  if (data)
    return res.json({
      messages: 'Data Berhasil Diambil',
      data,
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Diambil',
    success: false,
  });
};

const deleteTask = async (req, res) => {
  const { id, after } = req.body;
  try {
    await db('projectTask').where({ after: id }).update({ after: after });
    const hapus = await db('projectTask').where({ id }).del();
    if (hapus)
      return res.json({
        messages: 'Data Berhasil Dihapus',
        success: true,
      });
    return res.json({
      messages: 'Data Gagal Dihapus',
      success: false,
    });
  } catch (error) {
    console.log(error);
  }
};

const taskChange = async (req, res) => {
  const { itemUpdate, idUser } = req.body;

  const updateTask = (val) => {
    return new Promise(async (resolve, reject) => {
      const update = await db('projectTask')
        .update({ after: val.after, status: val.status, idUser })
        .where({ id: val.id });
      if (update) resolve(true);
      reject(false);
    });
  };

  Promise.all(
    itemUpdate.map(async (task) => {
      return await updateTask(task);
    }),
  ).then((data) => {
    return res.json({
      messages: 'Data Berhasil Disimpan',
      success: true,
    });
  });
  // Promise.all(
  //   itemUpdate.map(async (val, idx) => {
  //     const isEmpty = _.isEmpty(val);

  //     if (!isEmpty) {
  //       // console.log(val);
  //       await db('projectTask')
  //         .update({ after: val.after, status: val.status, idUser })
  //         .where({ id: val.id });
  //       return true;
  //     }
  //   }),
  // ).then((val) => {
  //   return res.json({
  //     messages: 'Data Berhasil Disimpan',
  //     success: true,
  //   });
  // });
};

const editTask = async (req, res) => {
  const { task, id } = req.body;
  const oldName = await db.select('task').from('projectTask').where({ id });
  const update = await db('projectTask').update({ task }).where({ id });
  if (update)
    return res.json({
      messages: 'Data Berhasil Disimpan',
      taskName: oldName[0].task,
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Disimpan',
    success: false,
  });
};

const getProgress = async (req, res) => {
  const { id } = req.body;

  db.raw(
    `select (select count(ptask.id) from projectTask ptask
  join projectTodos ptodos on ptodos.id = ptask.idTodos
  join project p on p.id = ptodos.idProject
  where ptask.status = 'selesai' and p.id = ${id}) selesai, 
  (select count(ptask.id) from projectTask ptask
  join projectTodos ptodos on ptodos.id = ptask.idTodos
  join project p on p.id = ptodos.idProject
  where ptask.status != 'selesai' and p.id = ${id}) belumSelesai`,
  ).then((data) => {
    if (data)
      return res.json({
        messages: 'Berhasil menghitung progress',
        data: data[0][0],
        success: true,
      });
    return res.json({
      messages: 'Data Gagal Disimpan',
      success: false,
    });
  });
};

const getHistory = async (req, res) => {
  const {
    lastId,
    idProject,
    bagian,
    worker,
    tanggalAwal,
    tanggalAkhir,
  } = req.body;
  const history = await db(`historyTask as hTask`)
    .select(
      'hTask.id',
      'user.username',
      'hTask.action',
      'pTask.task',
      'pTodos.judul',
      'hTask.keterangan',
      'hTask.tanggal',
    )
    .leftJoin('projectTask as pTask', 'pTask.id', 'hTask.idTask')
    .join('projectTodos as pTodos', function () {
      this.on('pTodos.id', 'pTask.idTodos').orOn('pTodos.id', 'hTask.idTodos');
    })
    .join('project as p', 'p.id', 'pTodos.idProject')
    .join('user', 'user.id', 'hTask.idUser')
    .where('p.id', idProject)
    //
    .where((query) => {
      if (lastId !== '') query.where('hTask.id', '<', lastId);
      //   if (bagian !== '' && bagian !== undefined) query.where('idTodos', bagian);

      //   if (worker !== '' && worker !== undefined) query.where('user.id', worker);

      //   // if (bagian !== '' && bagian !== undefined) query.where('idTodos', bagian);
    })
    .orderBy('hTask.tanggal', 'desc')
    .limit(10);
  const latestId = history.length === 10 && history[history.length - 1].id;
  let loadMore;
  if (history.length < 10) {
    loadMore = false;
  } else {
    const checkData = await db(`historyTask as hTask`)
      .select(
        'hTask.id',
        'user.username',
        'hTask.action',
        'pTask.task',
        'pTodos.judul',
        'hTask.keterangan',
        'hTask.tanggal',
      )
      .leftJoin('projectTask as pTask', 'pTask.id', 'hTask.idTask')
      .join('projectTodos as pTodos', function () {
        this.on('pTodos.id', 'pTask.idTodos').orOn(
          'pTodos.id',
          'hTask.idTodos',
        );
      })
      .join('project as p', 'p.id', 'pTodos.idProject')
      .join('user', 'user.id', 'hTask.idUser')
      .where('p.id', idProject)
      //
      .where((query) => {
        if (lastId !== '') query.where('hTask.id', '<', latestId);
        //   if (bagian !== '' && bagian !== undefined) query.where('idTodos', bagian);

        //   if (worker !== '' && worker !== undefined) query.where('user.id', worker);

        //   // if (bagian !== '' && bagian !== undefined) query.where('idTodos', bagian);
      })
      .orderBy('hTask.tanggal', 'desc')
      .limit(10);
    loadMore = checkData.length > 0 ? true : false;
  }

  if (history)
    return res.json({
      messages: 'Berhasil Mengambil data',
      data: history,
      loadMore,
      lastId: latestId,
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Disimpan',
    success: false,
  });
};

module.exports = {
  prosesTodo,
  getTask,
  deleteTask,
  taskChange,
  editTask,
  getProgress,
  getHistory,
};
