const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/news.controller');
const { validateCreateNews, validateUpdateNews } = require('../validations/news.validations');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

// Multer setup for news images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/news_images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Public routes
router.get('/news', NewsController.getAll);

// Admin/Author only routes
router.post('/news', authMiddleware, authMiddleware.authorOrAdminOnly, upload.single('image'), validateCreateNews, NewsController.create);
router.put('/news/:id', authMiddleware, authMiddleware.authorOrAdminOnly, upload.single('image'), validateUpdateNews, NewsController.update);
router.delete('/news/:id', authMiddleware, authMiddleware.authorOrAdminOnly, NewsController.remove);

module.exports = router; 