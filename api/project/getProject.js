const db = require('../../model/db');
const knex = require('../../model/knex');

const getData = async (req, res) => {
  const { search, filter } = req.body;
  const status = filter == 'All' ? '' : filter;

  const data = await knex('project')
    .where((query) => {
      if (filter !== 'All') {
        query.where({ status: filter });
      }
    })
    .andWhere((query) => {
      query.where('namaProject', 'like', `%${search}%`);
      query.orWhere('namaClient', 'like', `%${search}%`);
    });
  // .where('namaProject', 'like', `%${search}%`);
  // .orWhere('namaClient', 'like', `%${search}%`);
  // const data1 = await knex.select('*').from('project')

  if (data)
    return res.json({
      messages: 'Data Berhasil Diambil',
      data,
      success: true,
    });
};

module.exports = getData;
