const pool = require('../config/db');

const BASE_SELECT =
  'SELECT pk.*, t.nama AS nama_tutor, t.keahlian, kk.nama_kategori ' +
  'FROM produk_kelas pk ' +
  'LEFT JOIN tutor t ON pk.id_tutor = t.id_tutor ' +
  'LEFT JOIN kategori_kelas kk ON pk.id_kategori = kk.id_kategori';

// Daftar kolom yang boleh dipakai untuk sortBy (ORDER BY tidak bisa pakai $1)
const SORT_COLUMNS = {
  id: 'pk.id_kelas',
  harga: 'pk.harga',
  judul: 'pk.judul',
  rating: 'pk.rating',
  terbaru: 'pk.dibuat_pada'
};
const SORT_OPTIONS = Object.keys(SORT_COLUMNS);

// GET all data + filter (topic), search, sort (sortBy, order)
const getAllCourses = async (query = {}) => {
  const conditions = [];
  const params = [];

  if (query.topic) {
    params.push(String(query.topic));
    conditions.push('LOWER(kk.nama_kategori) = LOWER($' + params.length + ')');
  }

  if (query.search) {
    params.push('%' + String(query.search) + '%');
    const n = params.length;
    conditions.push('(pk.judul ILIKE $' + n + ' OR pk.deskripsi ILIKE $' + n + ')');
  }

  let sql = BASE_SELECT;
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  const kolom = SORT_COLUMNS[query.sortBy] ?? SORT_COLUMNS.id;
  const arah = String(query.order ?? 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  sql += ' ORDER BY ' + kolom + ' ' + arah;
  if (kolom !== SORT_COLUMNS.id) {
    sql += ', pk.id_kelas ASC';
  }

  const result = await pool.query(sql, params);
  return result.rows;
};

const getCourseById = async (id) => {
  const result = await pool.query(BASE_SELECT + ' WHERE pk.id_kelas = $1', [id]);
  return result.rows[0];
};

const createCourse = async (data) => {
  const { id_tutor, id_kategori, judul, deskripsi, harga, harga_coret, url_thumbnail, bahasa_pengantar } = data;

  const result = await pool.query(
    'INSERT INTO produk_kelas (id_tutor, id_kategori, judul, deskripsi, harga, harga_coret, url_thumbnail, bahasa_pengantar) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ' +
    'RETURNING id_kelas',
    [id_tutor, id_kategori, judul, deskripsi, harga, harga_coret ?? null, url_thumbnail ?? null, bahasa_pengantar ?? 'Bahasa Indonesia']
  );

  return getCourseById(result.rows[0].id_kelas);
};

const updateCourse = async (id, data) => {
  const existing = await getCourseById(id);
  if (!existing) {
    return null;
  }

  const { judul, deskripsi, harga, harga_coret, id_tutor, id_kategori, url_thumbnail, bahasa_pengantar } = data;

  await pool.query(
    'UPDATE produk_kelas ' +
    'SET judul = $1, deskripsi = $2, harga = $3, harga_coret = $4, id_tutor = $5, id_kategori = $6, url_thumbnail = $7, bahasa_pengantar = $8 ' +
    'WHERE id_kelas = $9',
    [
      judul ?? existing.judul,
      deskripsi ?? existing.deskripsi,
      harga ?? existing.harga,
      harga_coret ?? existing.harga_coret,
      id_tutor ?? existing.id_tutor,
      id_kategori ?? existing.id_kategori,
      url_thumbnail ?? existing.url_thumbnail,
      bahasa_pengantar ?? existing.bahasa_pengantar,
      id
    ]
  );

  return getCourseById(id);
};

const deleteCourse = async (id) => {
  const existing = await getCourseById(id);
  if (!existing) {
    return null;
  }

  await pool.query('DELETE FROM produk_kelas WHERE id_kelas = $1', [id]);
  return existing;
};

module.exports = {
  SORT_OPTIONS,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};