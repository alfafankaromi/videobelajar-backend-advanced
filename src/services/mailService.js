const nodemailer = require('nodemailer');

const smtpSiap = () => {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const buatTransporter = () => {
  const portEnv = Number(process.env.SMTP_PORT);
  const port = portEnv > 0 ? portEnv : 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendVerificationEmail = async (to, fullname, token) => {
  const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';
  const link = baseUrl + '/api/verify-email?token=' + token;

  // Kalau SMTP belum diisi, link dicetak di Termux supaya tetap bisa dites
  if (!smtpSiap()) {
    console.log('[EMAIL] SMTP belum diisi di .env. Link verifikasi untuk ' + to + ':');
    console.log(link);
    return { sent: false };
  }

  await buatTransporter().sendMail({
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
    to: to,
    subject: 'Verifikasi Email VideoBelajar',
    text: 'Halo ' + fullname + ', klik link ini untuk verifikasi email: ' + link,
    html:
      '<p>Halo <b>' + fullname + '</b>,</p>' +
      '<p>Terima kasih sudah mendaftar di VideoBelajar. Klik link di bawah untuk verifikasi email kamu:</p>' +
      '<p><a href="' + link + '">Verifikasi Email</a></p>' +
      '<p>Kalau link tidak bisa diklik, salin alamat ini ke browser:<br>' + link + '</p>'
  });

  return { sent: true };
};

module.exports = { sendVerificationEmail };