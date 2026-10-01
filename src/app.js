const path = require('path');
const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'VideoBelajar Backend API aktif' });
});

app.use('/api', routes);

module.exports = app;