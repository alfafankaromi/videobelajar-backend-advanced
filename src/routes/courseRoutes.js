const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ success: false, message: 'ID harus berupa angka' });
  }
  next();
});

router.get('/', authMiddleware.verifyToken, courseController.getList);
router.get('/:id', authMiddleware.verifyToken, courseController.getDetail);
router.post('/', authMiddleware.verifyToken, courseController.create);
router.patch('/:id', authMiddleware.verifyToken, courseController.update);
router.delete('/:id', authMiddleware.verifyToken, courseController.remove);

module.exports = router;