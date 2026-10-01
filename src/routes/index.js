const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const uploadRoutes = require('./uploadRoutes');

router.use('/', authRoutes);
router.use('/course', courseRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;