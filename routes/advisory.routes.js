const express = require('express');
const router = express.Router();
const AdvisoryController = require('../controllers/advisory.controller');
const { validateCreateSignal, validateUpdateSignal } = require('../validations/advisory.validations');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/advisory', AdvisoryController.getAll);
router.get('/advisory/:id', AdvisoryController.getById);

// Admin only routes
router.post('/advisory', authMiddleware, authMiddleware.adminOnly, validateCreateSignal, AdvisoryController.create);
router.put('/advisory/:id', authMiddleware, authMiddleware.adminOnly, validateUpdateSignal, AdvisoryController.update);
router.delete('/advisory/:id', authMiddleware, authMiddleware.adminOnly, AdvisoryController.remove);

module.exports = router; 