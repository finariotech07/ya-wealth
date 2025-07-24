const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/blog.controller');
const { validateCreateBlog, validateUpdateBlog } = require('../validations/blogs.validations');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/blog_images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Public routes
router.get('/blogs', BlogController.getAll);
router.get('/blogs/:id', BlogController.getById);

// Admin/Author only routes
router.post('/blogs', authMiddleware, authMiddleware.authorOrAdminOnly, upload.single('image'), validateCreateBlog, BlogController.create);
router.put('/blogs/:id', authMiddleware, authMiddleware.authorOrAdminOnly, upload.single('image'), validateUpdateBlog, BlogController.update);
router.delete('/blogs/:id', authMiddleware, authMiddleware.authorOrAdminOnly, BlogController.remove);

module.exports = router; 