const BlogModel = require('../models/blog.model');
const path = require('path');

const getPublicImageUrl = (req, filename) => {
    if (!filename) return undefined;
    return `${req.protocol}://${req.get('host')}/blog_images/${filename}`;
};

const formatBlogWithAuthor = (blog) => {
    if (blog) {
        // Create author name from fname and lname
        blog.author_name = blog.fname && blog.lname ? `${blog.fname} ${blog.lname}` : 'Unknown Author';
        // Remove individual name fields to keep response clean
        delete blog.fname;
        delete blog.lname;
    }
    return blog;
};

const BlogController = {
    async create(req, res) {
        try {
            const blog = req.body;
            if (req.file) {
                blog.image_url = getPublicImageUrl(req, req.file.filename);
            }
            // Get author_id from JWT payload
            const authorId = req.user.id;
            const result = await BlogModel.createBlog(blog, authorId);
            res.status(201).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.category) filters.category = req.query.category;
            const blogs = await BlogModel.getAllBlogs(filters);
            // Ensure public image URLs and format author names
            const blogsWithUrls = blogs.map(blog => {
                if (blog.image_url && !blog.image_url.startsWith('http')) {
                    blog.image_url = `${req.protocol}://${req.get('host')}/blog_images/${path.basename(blog.image_url)}`;
                }
                return formatBlogWithAuthor(blog);
            });
            res.status(200).json({ success: true, blogs: blogsWithUrls });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async getById(req, res) {
        try {
            const blog = await BlogModel.getBlogById(req.params.id);
            if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
            if (blog.image_url && !blog.image_url.startsWith('http')) {
                blog.image_url = `${req.protocol}://${req.get('host')}/blog_images/${path.basename(blog.image_url)}`;
            }
            const formattedBlog = formatBlogWithAuthor(blog);
            res.status(200).json({ success: true, blog: formattedBlog });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async getBySlug(req, res) {
        try {
            const blog = await BlogModel.getBlogBySlug(req.params.slug);
            if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
            if (blog.image_url && !blog.image_url.startsWith('http')) {
                blog.image_url = `${req.protocol}://${req.get('host')}/blog_images/${path.basename(blog.image_url)}`;
            }
            const formattedBlog = formatBlogWithAuthor(blog);
            res.status(200).json({ success: true, blog: formattedBlog });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async update(req, res) {
        try {
            const updateData = req.body;
            if (req.file) {
                updateData.image_url = getPublicImageUrl(req, req.file.filename);
            }
            const updated = await BlogModel.updateBlogById(req.params.id, updateData);
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