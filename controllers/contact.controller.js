const ContactModel = require('../models/contact.model');

const ContactController = {
    async submit(req, res) {
        try {
            const result = await ContactModel.createSubmission(req.body);
            res.status(201).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async list(req, res) {
        try {
            const submissions = await ContactModel.getAllSubmissions();
            res.status(200).json({ success: true, submissions });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async view(req, res) {
        try {
            const submission = await ContactModel.getSubmissionById(req.params.id);
            if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
            res.status(200).json({ success: true, submission });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async remove(req, res) {
        try {
            const deleted = await ContactModel.deleteSubmissionById(req.params.id);
            if (!deleted) return res.status(404).json({ success: false, message: 'Submission not found' });
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
};

module.exports = ContactController; 