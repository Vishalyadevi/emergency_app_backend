const express = require('express');
const router = express.Router();
const helperController = require('../controllers/helperController');
const authMiddleware = require('../middleware/auth');

router.get('/nearby', authMiddleware, helperController.getNearbyHelpers);
router.get('/city', authMiddleware, helperController.getCityHelpers);
router.get('/notifications', authMiddleware, helperController.getNotifications);

module.exports = router;
