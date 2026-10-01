## Mission BE Advanced: Autentikasi, Query Params, Email, Upload

### Library tambahan
bcrypt, jsonwebtoken, nodemailer, uuid, multer

### Endpoint

| Method | Endpoint | Keterangan | Token |
|---|---|---|---|
| POST | /api/register | Daftar user baru, kirim email verifikasi | Tidak |
| POST | /api/login | Login, mendapat token JWT | Tidak |
| GET | /api/verify-email?token=... | Verifikasi email | Tidak |
| GET | /api/course | Semua course (filter, sort, search) | Ya |
| GET | /api/course/:id | Satu course | Ya |
| POST | /api/course | Tambah course | Ya |
| PATCH | /api/course/:id | Ubah course | Ya |
| DELETE | /api/course/:id | Hapus course | Ya |
| POST | /api/upload | Upload gambar (field file, maks 2 MB) | Ya |

### Query params GET /api/course

| Param | Contoh | Fungsi |
|---|---|---|
| topic | ?topic=Desain | Filter berdasarkan kategori |
| search | ?search=pemasaran | Cari di judul dan deskripsi |
| sortBy | ?sortBy=harga | Urutkan: id, harga, judul, rating, terbaru |
| order | ?order=desc | Arah urutan: asc atau desc |

Contoh gabungan: /api/course?topic=Bisnis&sortBy=rating&order=desc

### Cara pakai token
Setelah login, kirim header: Authorization: Bearer (token dari login)

### Variabel .env tambahan
JWT_SECRET, JWT_EXPIRES_IN, APP_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM

### Tabel database baru
Jalankan database/mission3_pengguna.sql lalu database/mission3_verifikasi.sql

### Isi .env.example adalah isi .env

## Author

[Amala Al Fafan Karomi - 20012] - [Student of Harisenin.com FSD Bootcamp  ]