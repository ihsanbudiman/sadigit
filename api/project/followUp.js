const db = require('../../model/knex');
const moment = require('moment');

const insertFollowUp = async (req, res) => {
  const tanggal = moment().format('YYYY-MM-DD HH:mm:ss');

  const prosesData = await db('followUp').insert({ ...req.body, tanggal });

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

const getFollowUp = async (req, res) => {
  const { lastId, idPenjualan } = req.body;
  const data = await db('followUp')
    .where({ idPenjualan })
    .where((q) => {
      if (lastId !== '') q.where('id', '<', lastId);
    })
    .orderBy('id', 'desc')
    .limit(10);
  let hasMore, latestId;
  if (data) {
    if (data.length < 10) {
      hasMore = false;
      latestId = '';
    } else {
      const afterId = data[9].id;
      const checkAfter = await db('followUp')
        .where({ idPenjualan })
        .where('id', '<', afterId)
        .orderBy('id', 'desc')
        .limit(1);
      if (checkAfter.length > 0) {
        latestId = checkAfter[0].id;
        hasMore = true;
      } else {
        latestId = afterId;
        hasMore = false;
      }
    }
  } else {
    hasMore = false;
    latestId = '';
  }

  if (data)
    return res.json({
      messages: 'Data Berhasil diambil',
      data,
      hasMore,
      lastId: latestId,
      success: true,
    });
  return res.json({
    messages: 'Data Gagal diambil',
    success: false,
  });
};

module.exports = { insertFollowUp, getFollowUp };
