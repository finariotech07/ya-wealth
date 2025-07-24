const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contact.controller');
const { validateContactSubmission } = require('../validations/contact.validations');
const authMiddleware = require('../middlewares/auth.middleware');

// Public submission
router.post('/contact', validateContactSubmission, ContactController.submit);

// Admin/Leads Manager only (role_id 2 or 4)
function adminOrLeadsManagerOnly(req, res, next) {
    if (req.user && (req.user.role_id === 2 || req.user.role_id === 4)) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: Admin or Leads Manager only' });
}

router.get('/contact', authMiddleware, adminOrLeadsManagerOnly, ContactController.list);
router.get('/contact/:id', authMiddleware, adminOrLeadsManagerOnly, ContactController.view);
router.delete('/contact/:id', authMiddleware, adminOrLeadsManagerOnly, ContactController.remove);

module.exports = router; 