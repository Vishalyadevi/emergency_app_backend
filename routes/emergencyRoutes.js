const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, emergencyController.createEmergency);
router.post('/accept', authMiddleware, emergencyController.acceptEmergency);
router.get('/:id', authMiddleware, emergencyController.getEmergencyStatus);

module.exports = router;
