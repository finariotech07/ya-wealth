const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contact.controller');
const { validateContactSubmission } = require('../validations/contact.validations');
const  authMiddleware = require('../middlewares/auth.middleware');

// Public submission
router.post('/contact', validateContactSubmission, ContactController.submit);

// Admin/Leads Manager only (role_id 2 or 4)


router.get('/contact', authMiddleware, authMiddleware.adminOnly, ContactController.list);
router.get('/contact/:id', authMiddleware, authMiddleware.adminOnly, ContactController.view);
router.delete('/contact/:id', authMiddleware, authMiddleware.adminOnly, ContactController.remove);

module.exports = router; 