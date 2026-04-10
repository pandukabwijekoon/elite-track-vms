const express = require('express');
const router = express.Router();
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/initiate', initiatePayment);
router.post('/verify', verifyPayment);

module.exports = router;
