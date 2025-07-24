const express = require('express');
const router = express.Router();
const AdvisoryController = require('../controllers/advisory.controller');
const { validateCreateSignal, validateUpdateSignal } = require('../validations/advisory.validations');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

// Multer setup for advisory charts
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/advisory_charts'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Public routes
// GET /advisory?sortBy=asset|action|status&sortOrder=asc|desc
router.get('/advisory', AdvisoryController.getAll);
router.get('/advisory/:id', AdvisoryController.getById);
router.get('/advisory/assets/count', AdvisoryController.countAssets);

// Admin only routes
router.post('/advisory', authMiddleware, authMiddleware.adminOnly, upload.single('chart'), validateCreateSignal, AdvisoryController.create);
router.put('/advisory/:id', authMiddleware, authMiddleware.adminOnly, upload.single('chart'), validateUpdateSignal, AdvisoryController.update);
router.delete('/advisory/:id', authMiddleware, authMiddleware.adminOnly, AdvisoryController.remove);

module.exports = router; 