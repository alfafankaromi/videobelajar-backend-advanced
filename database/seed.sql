INSERT INTO tutor (nama, email, keahlian) VALUES
('Michael Sitorus', 'michael@videobelajar.com', 'Senior Accountant di Gojek'),
('Amanda Putri', 'amanda@videobelajar.com', 'Marketing Lead di Tokopedia'),
('Rizky Ramadhan', 'rizky@videobelajar.com', 'UI/UX Designer di Traveloka'),
('Sarah Wijaya', 'sarah@videobelajar.com', 'Career Coach di Glints');

INSERT INTO kategori_kelas (nama_kategori) VALUES
('Bisnis'), ('Pemasaran'), ('Desain'), ('Pengembangan Diri');

INSERT INTO produk_kelas (id_tutor, id_kategori, judul, deskripsi, harga, rating, jumlah_ulasan) VALUES
(1, 1, 'Big 4 Auditor Financial Analyst', 'Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan kurikulum standar industri.', 300000, 3.5, 86),
(2, 2, 'Strategi Pemasaran Digital untuk Pemula', 'Pelajari dasar-dasar digital marketing yang aplikatif untuk bisnis kecil dan menengah.', 250000, 4.2, 54),
(3, 3, 'Dasar-Dasar UI/UX Design', 'Rancang antarmuka aplikasi yang ramah pengguna dari nol sampai siap portofolio.', 350000, 4.7, 112),
(4, 4, 'Membangun Kebiasaan Produktif', 'Kelas pengembangan diri untuk membangun rutinitas kerja yang sehat dan berkelanjutan.', 200000, 4.0, 39);