const db = require('../../model/knex');
// const knex = require('../../model/knex');

const insert = async (req, res) => {
  const { id, ...rest } = req.body;
  let data;

  if (id === '') {
    data = await db('projectTodos').insert({ ...rest });
  } else {
    data = await db('projectTodos')
      .where({ id })
      .update({ ...rest });
  }

  if (data)
    return res.json({
      messages: 'Data Berhasil Disimpan',
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Disimpan',
    success: false,
  });
};

const getTodo = async (req, res) => {
  const { id, idProject } = req.body;
  const data = await db
    .from('projectTodos')
    .select('projectTodos.*')
    .where({ idProject, id });

  if (data)
    return res.json({
      messages: 'Berhasil Mengambil Data',
      data: data[0],
      success: true,
    });
  return res.json({
    messages: 'Gagal Mengambil Data',
    success: false,
  });
};

const getTodos = async (req, res) => {
  const { idProject } = req.body;
  const data = await db
    .from('projectTodos')
    .select('projectTodos.*')
    .count('projectTask.id AS tasks')
    // .count('projectTask.id')
    .leftJoin('projectTask', 'projectTask.idTodos', 'projectTodos.id')
    .where({ idProject })
    .groupBy('projectTodos.id');

  if (data)
    return res.json({
      messages: 'Berhasil Mengambil Data',
      data,
      success: true,
    });
  return res.json({
    messages: 'Gagal Mengambil Data',
    success: false,
  });
};

const deleteTodo = async (req, res) => {
  const { id, idProject } = req.body;
  console.log(req.body);
  const data = await db('projectTodos').where({ idProject, id }).del();
  await db('projectTask').where({ idTodos: id }).del();

  if (data)
    return res.json({
      messages: 'Berhasil Menghapus Data',
      data,
      success: true,
    });
  return res.json({
    messages: 'Gagal Menghapus Data',
    success: false,
  });
};

const getNamaTodos = async (req, res) => {
  const { id, idProject } = req.body;
  const data = await db
    .select('judul', 'namaProject')
    .from('projectTodos')
    .join('project', 'project.id', '=', 'projectTodos.idProject')
    .where({ idProject, 'projectTodos.id': id });

  if (data)
    return res.json({
      messages: 'Berhasil Mengambil Data',
      data: data[0],
      success: true,
    });
  return res.json({
    messages: 'Gagal Mengambil Data',
    success: false,
  });
};

const getNamaProject = async (req, res) => {
  const { id } = req.body;
  const data = await db.select('namaProject').from('project').where({ id });

  if (data)
    return res.json({
      messages: 'Berhasil Mengambil Data',
      data: data[0],
      success: true,
    });
  return res.json({
    messages: 'Gagal Mengambil Data',
    success: false,
  });
};

module.exports = {
  insert,
  getTodo,
  getTodos,
  deleteTodo,
  getNamaTodos,
  getNamaProject,
};
