const ServiceRecord = require('../models/ServiceRecord');
const Modification = require('../models/Modification');
const SparePart = require('../models/SparePart');

// @desc    Get cost summary for a user
// @route   GET /api/costs/summary
exports.getCostSummary = async (req, res) => {
  try {
    const serviceRecords = await ServiceRecord.find({ owner: req.user.id })
      .populate('vehicle', 'make model year');

    const modifications = await Modification.find({ owner: req.user.id })
      .populate('vehicle', 'make model year');

    // Service costs by type
    const serviceByType = {};
    const serviceByMonth = {};
    let totalServiceCost = 0;
    let totalModCost = 0;

    serviceRecords.forEach(r => {
      const cost = r.cost.totalCost || 0;
      totalServiceCost += cost;
      
      if (!serviceByType[r.serviceType]) serviceByType[r.serviceType] = 0;
      serviceByType[r.serviceType] += cost;

      const month = new Date(r.serviceDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!serviceByMonth[month]) serviceByMonth[month] = 0;
      serviceByMonth[month] += cost;
    });

    // Mod costs by category
    const modByCategory = {};
    modifications.forEach(m => {
      const cost = m.totalCost || 0;
      totalModCost += cost;
      if (!modByCategory[m.category]) modByCategory[m.category] = 0;
      modByCategory[m.category] += cost;
    });

    res.json({
      success: true,
      data: {
        totalServiceCost,
        totalModCost,
        grandTotal: totalServiceCost + totalModCost,
        serviceByType: Object.entries(serviceByType).map(([name, value]) => ({ name, value })),
        serviceByMonth: Object.entries(serviceByMonth).map(([name, value]) => ({ name, value })),
        modByCategory: Object.entries(modByCategory).map(([name, value]) => ({ name, value })),
        recentServices: serviceRecords.slice(0, 5),
        recentMods: modifications.slice(0, 5)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get costs by vehicle
// @route   GET /api/costs/by-vehicle
exports.getCostByVehicle = async (req, res) => {
  try {
    const serviceAgg = await ServiceRecord.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: '$vehicle', totalService: { $sum: '$cost.totalCost' }, count: { $sum: 1 } } }
    ]);

    const modAgg = await Modification.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: '$vehicle', totalMods: { $sum: '$totalCost' }, count: { $sum: 1 } } }
    ]);

    res.json({ success: true, data: { serviceAgg, modAgg } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
