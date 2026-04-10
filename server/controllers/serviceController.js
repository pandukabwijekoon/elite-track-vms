const Vehicle = require('../models/Vehicle');
const ServiceRecord = require('../models/ServiceRecord');

// @desc    Get all service records for a vehicle
// @route   GET /api/services/vehicle/:vehicleId
exports.getServiceRecords = async (req, res) => {
  try {
    const records = await ServiceRecord.find({
      vehicle: req.params.vehicleId,
      owner: req.user.id
    }).sort({ serviceDate: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all service records for current user
// @route   GET /api/services
exports.getAllServiceRecords = async (req, res) => {
  try {
    const records = await ServiceRecord.find({ owner: req.user.id })
      .populate('vehicle', 'make model year registrationNumber')
      .sort({ serviceDate: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create service record
// @route   POST /api/services
exports.createServiceRecord = async (req, res) => {
  try {
    const record = await ServiceRecord.create({ ...req.body, owner: req.user.id });
    
    // Update vehicle's last service info and reset reminder flag
    await Vehicle.findByIdAndUpdate(req.body.vehicle, {
      lastServiceDate: req.body.serviceDate,
      lastServiceMileage: req.body.mileageAtService || req.body.mileage,
      serviceReminderSent: false
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update service record
// @route   PUT /api/services/:id
exports.updateServiceRecord = async (req, res) => {
  try {
    let record = await ServiceRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    if (record.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    record = await ServiceRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete service record
// @route   DELETE /api/services/:id
exports.deleteServiceRecord = async (req, res) => {
  try {
    const record = await ServiceRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    if (record.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await record.deleteOne();
    res.json({ success: true, message: 'Service record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
