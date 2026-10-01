const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const authService = require('../services/authService');
const mailService = require('../services/mailService');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/register
const register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body ?? {};

    if (!(fullname && username && email && password)) {
      return res.status(400).json({
        success: false,
        message: 'fullname, username, email, dan password wajib diisi'
      });
    }

    const emailBersih = String(email).trim().toLowerCase();
    const usernameBersih = String(username).trim();
    const passwordText = String(password);

    if (!emailRegex.test(emailBersih)) {
      return res.status(400).json({ success: false, message: 'Format email tidak valid' });
    }

    if (passwordText.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }

    if (await authService.findByEmail(emailBersih)) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    }

    if (await authService.findByUsername(usernameBersih)) {
      return res.status(409).json({ success: false, message: 'Username sudah dipakai' });
    }

    // enkripsi password sebelum disimpan
    const passwordHash = await bcrypt.hash(passwordText, 10);
    // token unik untuk verifikasi email
    const token = uuidv4();

    const user = await authService.createUser({
      fullname: String(fullname).trim(),
      username: usernameBersih,
      email: emailBersih,
      password: passwordHash,
      token: token
    });

    // kirim email verifikasi (kalau gagal, registrasi tetap berhasil)
    let emailTerkirim = false;
    try {
      const hasil = await mailService.sendVerificationEmail(user.email, user.fullname, token);
      emailTerkirim = hasil.sent;
    } catch (error) {
      console.error('Gagal kirim email:', error.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
      email_terkirim: emailTerkirim,
      data: user
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Email atau username sudah terdaftar' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!(email && password)) {
      return res.status(400).json({ success: false, message: 'email dan password wajib diisi' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET belum diisi di file .env' });
    }

    const user = await authService.findByEmail(String(email).trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const cocok = await bcrypt.compare(String(password), user.password);
    if (!cocok) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id_pengguna, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token: token,
      data: {
        id_pengguna: user.id_pengguna,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/verify-email?token=...
const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token ? String(req.query.token) : '';
const user = token ? await authService.findByToken(token) : null;
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid Verification Token' });
    }

    await authService.verifyUser(user.id_pengguna);
    return res.status(200).json({ success: true, message: 'Email Verified Successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, verifyEmail };