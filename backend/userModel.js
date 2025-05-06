const db = require('./db');

const getUserByUsernameOrEmail = (username, callback) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], callback);
};

const createUser = (username, password, callback) => {
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, password], callback);
};

const getUserByUsername = (username, callback) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], callback);
};

const verifyUser = (username, callback) => {
  const sql = 'UPDATE users SET isVerified = 1 WHERE username = ?';
  db.query(sql, [username], callback);
};

module.exports = {
  getUserByUsernameOrEmail,
  createUser,
  getUserByUsername,
  verifyUser
};
