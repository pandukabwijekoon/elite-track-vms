const mongoose = require('mongoose');

const ModificationSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Modification title is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Engine', 'Suspension', 'Brakes', 'Exhaust', 'Wheels & Tires',
      'Body Kit', 'Interior', 'Lighting', 'Audio', 'Electronics',
      'Turbo/Supercharger', 'Transmission', 'Other'
    ]
  },
  description: { type: String },
  partsUsed: [{
    partName: String,
    brand: String,
    partNumber: String,
    cost: Number
  }],
  laborCost: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  installedBy: {
    type: String,
    enum: ['Self', 'Professional Shop', 'Dealer'],
    default: 'Professional Shop'
  },
  shopName: { type: String },
  installDate: { type: Date, default: Date.now },
  images: [{ type: String }],
  beforeImage: { type: String },
  afterImage: { type: String },
  performanceGain: { type: String },
  notes: { type: String },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Modification', ModificationSchema);
