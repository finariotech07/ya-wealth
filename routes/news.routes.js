const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/news.controller');
const { validateCreateNews, validateUpdateNews } = require('../validations/news.validations');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/news', NewsController.getAll);

// Admin/Author only routes
router.post('/news', authMiddleware, authMiddleware.authorOrAdminOnly, validateCreateNews, NewsController.create);
router.put('/news/:id', authMiddleware, authMiddleware.authorOrAdminOnly, validateUpdateNews, NewsController.update);
router.delete('/news/:id', authMiddleware, authMiddleware.authorOrAdminOnly, NewsController.remove);

module.exports = router; 