const NewsModel = require('../models/news.model');

const NewsController = {
    async create(req, res) {
        try {
            const news = req.body;
            const result = await NewsModel.createNews(news);
            res.status(201).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async getAll(req, res) {
        try {
            // Optionally filter by type or status via query params
            const filters = {};
            if (req.query.type) filters.type = req.query.type;
            if (req.query.status) filters.status = req.query.status;
            const news = await NewsModel.getAllNews(filters);
            res.status(200).json({ success: true, news });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async update(req, res) {
        try {
            const updated = await NewsModel.updateNewsById(req.params.id, req.body);
            if (!updated) return res.status(404).json({ success: false, message: 'News not found' });
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async remove(req, res) {
        try {
            const deleted = await NewsModel.deleteNewsById(req.params.id);
            if (!deleted) return res.status(404).json({ success: false, message: 'News not found' });
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
};

module.exports = NewsController; 