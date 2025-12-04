const express = require('express');
const { calculateDistance } = require('../controllers/DistanceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/calculate', protect, calculateDistance);

module.exports = router;