const express = require('express');
const router = express.Router();
const { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, getVehicleProfile, addFuelLog, addDocument } = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getVehicles).post(createVehicle);
router.route('/:id').get(getVehicle).put(updateVehicle).delete(deleteVehicle);
router.get('/:id/profile', getVehicleProfile);
router.post('/:id/fuel', addFuelLog);
router.post('/:id/documents', addDocument);

module.exports = router;
