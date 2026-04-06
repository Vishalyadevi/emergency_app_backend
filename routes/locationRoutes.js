const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/auth');

router.post('/update', authMiddleware, locationController.updateLocation);
router.get('/:helperId', authMiddleware, locationController.getHelperLocation);

module.exports = router;
