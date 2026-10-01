require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log('Server jalan di port ' + PORT);
  try {
    await pool.query('SELECT 1');
    console.log('Database terhubung');
  } catch (error) {
    console.error('Database gagal terhubung:', error.message);
  }
});