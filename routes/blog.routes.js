const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/blog.controller');
const { validateCreateBlog, validateUpdateBlog } = require('../validations/blogs.validations');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/blogs', BlogController.getAll);
router.get('/blogs/:id', BlogController.getById);

// Admin/Author only routes
router.post('/blogs', authMiddleware, authMiddleware.authorOrAdminOnly, validateCreateBlog, BlogController.create);
router.put('/blogs/:id', authMiddleware, authMiddleware.authorOrAdminOnly, validateUpdateBlog, BlogController.update);
router.delete('/blogs/:id', authMiddleware, authMiddleware.authorOrAdminOnly, BlogController.remove);

module.exports = router; 