const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'ihsan123',
    database: 'sadigit',
  },
});

module.exports = knex;
