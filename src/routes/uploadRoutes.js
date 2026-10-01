const express = require('express');
const router = express.Router();
const upload = require('../services/uploadService');
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'Ukuran file maksimal 2 MB'
        : err.message;
      return res.status(400).json({ success: false, message: message });
    }
    next();
  });
};

router.post('/', authMiddleware.verifyToken, handleUpload, uploadController.uploadFile);

module.exports = router;