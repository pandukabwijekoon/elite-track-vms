const SparePart = require('../models/SparePart');

// @desc    Get all spare parts (with filters)
exports.getSpareParts = async (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, search } = req.query;
    const query = { isAvailable: true };

    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const parts = await SparePart.find(query)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: parts.length, data: parts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single spare part
exports.getSparePart = async (req, res) => {
  try {
    const part = await SparePart.findById(req.params.id).populate('seller', 'name email phone');
    if (!part) return res.status(404).json({ success: false, message: 'Part not found' });
    // Increment views
    part.views += 1;
    await part.save();
    res.json({ success: true, data: part });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create spare part listing
exports.createSparePart = async (req, res) => {
  try {
    const part = await SparePart.create({ ...req.body, seller: req.user.id });
    res.status(201).json({ success: true, data: part });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update spare part
exports.updateSparePart = async (req, res) => {
  try {
    let part = await SparePart.findById(req.params.id);
    if (!part) return res.status(404).json({ success: false, message: 'Part not found' });
    if (part.seller.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    part = await SparePart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: part });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete spare part
exports.deleteSparePart = async (req, res) => {
  try {
    const part = await SparePart.findById(req.params.id);
    if (!part) return res.status(404).json({ success: false, message: 'Part not found' });
    if (part.seller.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await part.deleteOne();
    res.json({ success: true, message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get my listings
exports.getMyListings = async (req, res) => {
  try {
    const parts = await SparePart.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: parts.length, data: parts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
