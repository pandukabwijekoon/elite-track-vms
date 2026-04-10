const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles for current user
// @route   GET /api/vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    if (vehicle.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: `A vehicle with registration number "${req.body.registrationNumber}" is already registered in the system.` 
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    if (vehicle.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    if (vehicle.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await vehicle.deleteOne();
    res.json({ success: true, message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add fuel log
// @route   POST /api/vehicles/:id/fuel
exports.addFuelLog = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user.id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    vehicle.fuelLogs.push(req.body);
    // Auto-update mileage if log mileage is higher
    if (req.body.mileage > vehicle.mileage) {
      vehicle.mileage = req.body.mileage;
    }
    
    await vehicle.save();
    res.json({ success: true, data: vehicle.fuelLogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add document to glovebox
// @route   POST /api/vehicles/:id/documents
exports.addDocument = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user.id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    vehicle.documents.push(req.body);
    await vehicle.save();
    res.json({ success: true, data: vehicle.documents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get full vehicle profile (History + Mods)
// @route   GET /api/vehicles/:id/profile
exports.getVehicleProfile = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user.id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    const ServiceRecord = require('../models/ServiceRecord');
    const Modification = require('../models/Modification');

    const services = await ServiceRecord.find({ vehicle: vehicle._id }).sort({ serviceDate: -1 });
    const modifications = await Modification.find({ vehicle: vehicle._id }).sort({ installDate: -1 });

    res.json({
      success: true,
      data: {
        vehicle,
        services,
        modifications
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
