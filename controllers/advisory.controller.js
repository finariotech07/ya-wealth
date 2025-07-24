const AdvisoryModel = require('../models/advisory.model');

const AdvisoryController = {
    async create(req, res) {
        try {
            const result = await AdvisoryModel.createSignal(req.body);
            res.status(201).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.asset) filters.asset = req.query.asset;
            const signals = await AdvisoryModel.getAllSignals(filters);
            res.status(200).json({ success: true, signals });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async getById(req, res) {
        try {
            const signal = await AdvisoryModel.getSignalById(req.params.id);
            if (!signal) return res.status(404).json({ success: false, message: 'Signal not found' });
            res.status(200).json({ success: true, signal });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async update(req, res) {
        try {
            const updated = await AdvisoryModel.updateSignalById(req.params.id, req.body);
            if (!updated) return res.status(404).json({ success: false, message: 'Signal not found' });
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async remove(req, res) {
        try {
            const deleted = await AdvisoryModel.deleteSignalById(req.params.id);
            if (!deleted) return res.status(404).json({ success: false, message: 'Signal not found' });
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
};

module.exports = AdvisoryController; 