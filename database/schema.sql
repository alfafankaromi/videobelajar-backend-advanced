CREATE TABLE IF NOT EXISTS tutor (
  id_tutor SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  keahlian VARCHAR(150),
  foto_profil VARCHAR(255),
  bio TEXT,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kategori_kelas (
  id_kategori SERIAL PRIMARY KEY,
  nama_kategori VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS produk_kelas (
  id_kelas SERIAL PRIMARY KEY,
  id_tutor INT REFERENCES tutor(id_tutor),
  id_kategori INT REFERENCES kategori_kelas(id_kategori),
  judul VARCHAR(150) NOT NULL,
  deskripsi TEXT,
  harga DECIMAL(10,2) NOT NULL,
  harga_coret DECIMAL(10,2),
  rating DECIMAL(2,1) DEFAULT 0,
  jumlah_ulasan INT DEFAULT 0,
  url_thumbnail VARCHAR(255),
  bahasa_pengantar VARCHAR(30) DEFAULT 'Bahasa Indonesia',
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_produk_kelas_tutor ON produk_kelas(id_tutor);
CREATE INDEX IF NOT EXISTS idx_produk_kelas_kategori ON produk_kelas(id_kategori);
CREATE INDEX IF NOT EXISTS idx_produk_kelas_judul ON produk_kelas(judul);

CREATE TABLE IF NOT EXISTS modul_kelas (
  id_modul SERIAL PRIMARY KEY,
  id_kelas INT NOT NULL REFERENCES produk_kelas(id_kelas),
  judul_modul VARCHAR(150) NOT NULL,
  urutan INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_modul_kelas_kelas ON modul_kelas(id_kelas);

CREATE TABLE IF NOT EXISTS material (
  id_material SERIAL PRIMARY KEY,
  id_modul INT NOT NULL REFERENCES modul_kelas(id_modul),
  tipe_material VARCHAR(20) NOT NULL CHECK (tipe_material IN ('rangkuman', 'video', 'quiz')),
  judul VARCHAR(150) NOT NULL,
  url_konten VARCHAR(255),
  durasi_detik INT,
  urutan INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_material_modul ON material(id_modul);

CREATE TABLE IF NOT EXISTS pretest (
  id_pretest SERIAL PRIMARY KEY,
  id_kelas INT NOT NULL REFERENCES produk_kelas(id_kelas),
  pertanyaan TEXT NOT NULL,
  pilihan_a VARCHAR(255),
  pilihan_b VARCHAR(255),
  pilihan_c VARCHAR(255),
  pilihan_d VARCHAR(255),
  jawaban_benar CHAR(1)
);

CREATE TABLE IF NOT EXISTS kelas_saya (
  id_kelas_saya SERIAL PRIMARY KEY,
  id_pengguna INT NOT NULL,
  id_kelas INT NOT NULL REFERENCES produk_kelas(id_kelas),
  tanggal_mulai TIMESTAMP,
  progress_persen SMALLINT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'belum_mulai' CHECK (status IN ('belum_mulai', 'berjalan', 'selesai'))
);

CREATE INDEX IF NOT EXISTS idx_kelas_saya_pengguna_kelas ON kelas_saya(id_pengguna, id_kelas);

CREATE TABLE IF NOT EXISTS pesanan (
  id_pesanan SERIAL PRIMARY KEY,
  id_pengguna INT NOT NULL,
  id_kelas INT NOT NULL REFERENCES produk_kelas(id_kelas),
  tanggal_pesan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_harga DECIMAL(10,2) NOT NULL,
  status_pesanan VARCHAR(20) DEFAULT 'menunggu_bayar' CHECK (status_pesanan IN ('menunggu_bayar', 'berhasil', 'dibatalkan'))
);

CREATE INDEX IF NOT EXISTS idx_pesanan_pengguna ON pesanan(id_pengguna);

CREATE TABLE IF NOT EXISTS pembayaran (
  id_pembayaran SERIAL PRIMARY KEY,
  id_pesanan INT NOT NULL UNIQUE REFERENCES pesanan(id_pesanan),
  metode_pembayaran VARCHAR(50),
  jumlah_bayar DECIMAL(10,2) NOT NULL,
  status_pembayaran VARCHAR(20) DEFAULT 'pending' CHECK (status_pembayaran IN ('pending', 'berhasil', 'gagal')),
  tanggal_bayar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  no_referensi VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS ulasan (
  id_ulasan SERIAL PRIMARY KEY,
  id_pengguna INT NOT NULL,
  id_kelas INT NOT NULL REFERENCES produk_kelas(id_kelas),
  rating SMALLINT NOT NULL,
  komentar TEXT,
  tanggal_ulasan TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ulasan_kelas ON ulasan(id_kelas);