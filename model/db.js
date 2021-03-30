const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'ihsan123',
  database: 'sadigit',
});

let coba = {};
coba.data = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * from user', (err, result) => {
      if (err) reject(err);
      return resolve(result);
    });
  });
};

module.exports = connection;
