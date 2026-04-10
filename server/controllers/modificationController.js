const Modification = require('../models/Modification');

// @desc    Get all modifications for user
exports.getModifications = async (req, res) => {
  try {
    const mods = await Modification.find({ owner: req.user.id })
      .populate('vehicle', 'make model year registrationNumber')
      .sort({ installDate: -1 });
    res.json({ success: true, count: mods.length, data: mods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get public modifications (portfolio)
exports.getPublicModifications = async (req, res) => {
  try {
    const { category, vehicleId } = req.query;
    const query = { isPublic: true };
    if (category) query.category = category;
    if (vehicleId) query.vehicle = vehicleId;

    const mods = await Modification.find(query)
      .populate('vehicle', 'make model year')
      .populate('owner', 'name')
      .sort({ installDate: -1 });
    res.json({ success: true, count: mods.length, data: mods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create modification
exports.createModification = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Process uploaded files
    if (req.files) {
      if (req.files.beforeImage) data.beforeImage = `/uploads/modifications/${req.files.beforeImage[0].filename}`;
      if (req.files.afterImage) data.afterImage = `/uploads/modifications/${req.files.afterImage[0].filename}`;
    }

    // Parse partsUsed if it came as a string (FormData)
    if (typeof data.partsUsed === 'string') {
      try {
        data.partsUsed = JSON.parse(data.partsUsed);
      } catch (e) {
        console.error('Error parsing partsUsed:', e);
      }
    }

    const mod = await Modification.create({ ...data, owner: req.user.id });
    res.status(201).json({ success: true, data: mod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update modification
exports.updateModification = async (req, res) => {
  try {
    let mod = await Modification.findById(req.params.id);
    if (!mod) return res.status(404).json({ success: false, message: 'Modification not found' });
    if (mod.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const data = { ...req.body };

    // Process uploaded files
    if (req.files) {
      if (req.files.beforeImage) data.beforeImage = `/uploads/modifications/${req.files.beforeImage[0].filename}`;
      if (req.files.afterImage) data.afterImage = `/uploads/modifications/${req.files.afterImage[0].filename}`;
    }

    // Parse partsUsed if it came as a string
    if (typeof data.partsUsed === 'string') {
      try {
        data.partsUsed = JSON.parse(data.partsUsed);
      } catch (e) {
        console.error('Error parsing partsUsed:', e);
      }
    }

    mod = await Modification.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, data: mod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete modification
exports.deleteModification = async (req, res) => {
  try {
    const mod = await Modification.findById(req.params.id);
    if (!mod) return res.status(404).json({ success: false, message: 'Modification not found' });
    if (mod.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await mod.deleteOne();
    res.json({ success: true, message: 'Modification deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
