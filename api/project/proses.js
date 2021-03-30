const db = require('../../model/db');
const knex = require('../../model/knex');

const proses = async (req, res) => {
  // const { namaProject } = req.body;
  const { id, ...rest } = req.body;
  // const checkNama = await validasi(req.body.namaProject);
  const checkNama = await knex
    .from('project')
    .where({ namaProject: req.body.namaProject });

  if (checkNama.length > 0) {
    if (
      checkNama[0].id != id &&
      checkNama[0].namaProject === req.body.namaProject
    ) {
      return res.json({
        messages: 'Nama Project Sudah digunakan',
        success: false,
      });
    }
  }

  // const checkInput = await input(req.body);
  let checkInput;
  if (id === '') {
    checkInput = await knex('project').insert({
      ...rest,
    });
  } else {
    checkInput = await knex('project')
      .update({
        ...rest,
      })
      .where({ id });
  }

  if (checkInput)
    return res.json({ messages: 'berhasil ditambahkan', success: true });
  return res.json({ messages: 'terjadi kesalahan', success: false });
};

const hapus = async (req, res) => {
  const { id } = req.body;
  const hapus = await knex('project').where({ id }).del();
  if (hapus)
    return res.json({
      messages: 'Data Berhasil Dihapus',
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Dihapus',
    success: false,
  });
};

module.exports = { proses, hapus };
