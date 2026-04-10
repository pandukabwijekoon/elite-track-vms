const express = require('express');
const router = express.Router();
const { getCostSummary, getCostByVehicle } = require('../controllers/costController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/summary', getCostSummary);
router.get('/by-vehicle', getCostByVehicle);

module.exports = router;
