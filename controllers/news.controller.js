const NewsModel = require('../models/news.model');
const path = require('path');

const getPublicImageUrl = (req, filename) => {
    if (!filename) return undefined;
    return `${req.protocol}://${req.get('host')}/news_images/${filename}`;
};

const NewsController = {
    async create(req, res) {
        try {
            const news = req.body;
            if (req.file) {
                news.image_url = getPublicImageUrl(req, req.file.filename);
            }
            const result = await NewsModel.createNews(news);
            res.status(201).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.type) filters.type = req.query.type;
            if (req.query.status) filters.status = req.query.status;
            const news = await NewsModel.getAllNews(filters);
            // Ensure public image URLs
            const newsWithUrls = news.map(item => {
                if (item.image_url && !item.image_url.startsWith('http')) {
                    item.image_url = `${req.protocol}://${req.get('host')}/news_images/${path.basename(item.image_url)}`;
                }
                return item;
            });
            res.status(200).json({ success: true, news: newsWithUrls });
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
            const updated = await NewsModel.updateNewsById(req.params.id, updateData);
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