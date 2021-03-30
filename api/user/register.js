const db = require('../../model/db');
const md5 = require('md5');

const register = async (req, res) => {
  const { username, password } = req.body;
  const hashPassword = md5(password);
  // check if username alredy registered

  const check = await checkUser(username);

  if (check.length > 0) {
    return res.json({
      messages: 'username telah digunakan',
      success: false,
    });
  }
  const regis = await doRegis(username, hashPassword);
  if (regis)
    return res.json({ messages: 'akun telah terdaftar', success: true });
  return res.json({ messages: 'pendaftaran gagal', success: false });
};

const doRegis = (username, password) => {
  const query = `INSERT INTO user (username, password) VALUES ('${username}', '${password}')`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        return reject(false);
      }
      return resolve(true);
    });
  });
};

const checkUser = (username) => {
  const query = `select * from user where username = '${username}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

module.exports = register;
