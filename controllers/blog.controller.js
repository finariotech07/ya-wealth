const BlogModel = require('../models/blog.model');

const BlogController = {
    async create(req, res) {
        try {
            const blog = req.body;
            const result = await BlogModel.createBlog(blog);
            res.status(201).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async getAll(req, res) {
        try {
            // Optionally filter by status or category via query params
            const filters = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.category) filters.category = req.query.category;
            const blogs = await BlogModel.getAllBlogs(filters);
            res.status(200).json({ success: true, blogs });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async getById(req, res) {
        try {
            const blog = await BlogModel.getBlogById(req.params.id);
            if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
            res.status(200).json({ success: true, blog });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async update(req, res) {
        try {
            const updated = await BlogModel.updateBlogById(req.params.id, req.body);
            if (!updated) return res.status(404).json({ success: false, message: 'Blog not found' });
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async remove(req, res) {
        try {
            const deleted = await BlogModel.deleteBlogById(req.params.id);
            if (!deleted) return res.status(404).json({ success: false, message: 'Blog not found' });
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
};

module.exports = BlogController; 