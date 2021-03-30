const db = require('../../model/db');
const md5 = require('md5');
const { token } = require('../auth/token');

const login = async (req, res) => {
  const { username, password } = req.body;
  const hashPassword = md5(password);

  const dataUser = await checkUser(username, hashPassword);
  if (dataUser.length === 0) {
    return res.json({
      message: 'username atau passwaord salah',
      success: false,
    });
  }
  const userToken = token(dataUser[0]);
  res.json(userToken);
};

const checkUser = (username, password) => {
  const query = `select user.id idUser, user.username, hakAkses.* from user join hakAkses on user.idHakAkses = hakAkses.id where username ='${username}' and password = '${password}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

module.exports = login;
