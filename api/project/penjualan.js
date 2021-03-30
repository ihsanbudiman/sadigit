const db = require('../../model/knex');
const moment = require('moment');

const prosesPenjualan = async (req, res) => {
  const { id, ...rest } = req.body;
  let prosesData;
  const tanggal = moment().format('YYYY-MM-DD HH:mm:ss');
  if (id === '')
    prosesData = await db('penjualan').insert({ ...rest, tanggal });
  if (id !== '')
    prosesData = await db('penjualan')
      .update({ ...rest })
      .where({ id });

  if (prosesData)
    return res.json({
      messages: 'Data Berhasil Disimpan',
      success: true,
    });
  return res.json({
    messages: 'Data Gagal Disimpan',
    success: false,
  });
};

const getSpecific = async (req, res) => {
  const { id } = req.body;
  const data = await db('penjualan').where({ id }).first();
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

const getDataPenjualan = async (req, res) => {
  const { idProject, search, pagination, nId, pId } = req.body;
  // console.log(pagination);
  const data = await db('penjualan')
    .where({ idProject })
    .where((query) => {
      query.orWhere('namaClient', 'like', `%${search}%`);
      query.orWhere('noHp', 'like', `%${search}%`);
    })
    .where((q) => {
      if (pagination === 'next') q.where('id', '<', nId);
      if (pagination === 'prev') q.where('id', '>', pId);
    })
    .orderBy('id', 'desc')
    .limit(10);
  let prev, next;
  if (data) {
    if (data.length < 10) {
      next = false;
    } else {
      const nextId = data[9].id;
      const nextData = await db('penjualan')
        .where({ idProject })
        .where((query) => {
          query.where('id', '<', nextId);
        })
        .where((query) => {
          query.orWhere('namaClient', 'like', `%${search}%`);
          query.orWhere('noHp', 'like', `%${search}%`);
        })
        .orderBy('id', 'desc')
        .limit(1);
      next = nextData.length > 0 ? true : false;
    }
    if (data.length > 0) {
      const prevId = data[0].id;
      const prevData = await db('penjualan')
        .where({ idProject })
        .where((query) => {
          query.where('id', '>', prevId);
        })
        .where((query) => {
          query.orWhere('namaClient', 'like', `%${search}%`);
          query.orWhere('noHp', 'like', `%${search}%`);
        })
        .orderBy('id', 'desc')
        .limit(1);

      prev = prevData.length > 0 ? true : false;
    } else {
      prev = false;
    }
  } else {
    next = false;
    prev = false;
  }

  // console.log(next, prev);
  if (data)
    return res.json({
      messages: 'Berhasil Mengambil Data',
      data,
      prev,
      next,
      success: true,
    });
  return res.json({
    messages: 'Gagal Mengambil Data',
    success: false,
  });
};

module.exports = { prosesPenjualan, getSpecific, getDataPenjualan };
