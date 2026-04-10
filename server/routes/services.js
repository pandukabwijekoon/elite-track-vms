const express = require('express');
const router = express.Router();
const { getAllServiceRecords, getServiceRecords, createServiceRecord, updateServiceRecord, deleteServiceRecord } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getAllServiceRecords).post(createServiceRecord);
router.route('/vehicle/:vehicleId').get(getServiceRecords);
router.route('/:id').put(updateServiceRecord).delete(deleteServiceRecord);

module.exports = router;
