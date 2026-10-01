const pool = require('../config/db');

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM pengguna WHERE email = $1', [email]);
  return result.rows[0];
};

const findByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM pengguna WHERE username = $1', [username]);
  return result.rows[0];
};

const findByToken = async (token) => {
  const result = await pool.query('SELECT * FROM pengguna WHERE verification_token = $1', [token]);
  return result.rows[0];
};

const createUser = async (data) => {
  const { fullname, username, email, password, token } = data;
  const result = await pool.query(
    'INSERT INTO pengguna (fullname, username, email, password, verification_token) ' +
    'VALUES ($1, $2, $3, $4, $5) ' +
    'RETURNING id_pengguna, fullname, username, email, is_verified, dibuat_pada',
    [fullname, username, email, password, token]
  );
  return result.rows[0];
};

const verifyUser = async (id) => {
  await pool.query(
    'UPDATE pengguna SET is_verified = TRUE, verification_token = NULL WHERE id_pengguna = $1',
    [id]
  );
};

module.exports = { findByEmail, findByUsername, findByToken, createUser, verifyUser };