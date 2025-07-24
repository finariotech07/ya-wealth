const AdvisoryModel = require('../models/advisory.model');
const path = require('path');

const getPublicChartUrl = (req, filename) => {
    if (!filename) return undefined;
    return `${req.protocol}://${req.get('host')}/advisory_charts/${filename}`;
};

const AdvisoryController = {
    async create(req, res) {
        try {
            const data = req.body;
            if (req.file) {
                data.chart_url = getPublicChartUrl(req, req.file.filename);
            }
            const result = await AdvisoryModel.createSignal(data);
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
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || 'asc';
            const signals = await AdvisoryModel.getAllSignals(filters, sortBy, sortOrder);
            // Ensure public chart URLs
            const signalsWithUrls = signals.map(signal => {
                if (signal.chart_url && !signal.chart_url.startsWith('http')) {
                    signal.chart_url = `${req.protocol}://${req.get('host')}/advisory_charts/${path.basename(signal.chart_url)}`;
                }
                return signal;
            });
            res.status(200).json({ success: true, signals: signalsWithUrls });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async getById(req, res) {
        try {
            const signal = await AdvisoryModel.getSignalById(req.params.id);
            if (!signal) return res.status(404).json({ success: false, message: 'Signal not found' });
            if (signal.chart_url && !signal.chart_url.startsWith('http')) {
                signal.chart_url = `${req.protocol}://${req.get('host')}/advisory_charts/${path.basename(signal.chart_url)}`;
            }
            res.status(200).json({ success: true, signal });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async update(req, res) {
        try {
            const updateData = req.body;
            if (req.file) {
                updateData.chart_url = getPublicChartUrl(req, req.file.filename);
            }
            const updated = await AdvisoryModel.updateSignalById(req.params.id, updateData);
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
    },
    async countAssets(req, res) {
        try {
            const count = await AdvisoryModel.countDistinctAssets();
            res.status(200).json({ success: true, count });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

module.exports = AdvisoryController; 