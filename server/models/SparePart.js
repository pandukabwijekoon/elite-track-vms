const mongoose = require('mongoose');

const SparePartSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Part title is required'],
    trim: true
  },
  description: { type: String },
  category: {
    type: String,
    required: true,
    enum: [
      'Engine Parts', 'Body Parts', 'Electrical', 'Suspension',
      'Brakes', 'Transmission', 'Exhaust', 'Interior', 'Exterior',
      'Wheels & Tires', 'Lighting', 'Filters', 'Other'
    ]
  },
  brand: { type: String, trim: true },
  partNumber: { type: String, trim: true },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'For Parts'],
    required: true
  },
  compatibleVehicles: [{
    make: String,
    model: String,
    yearFrom: Number,
    yearTo: Number
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  currency: { type: String, default: 'LKR' },
  quantity: { type: Number, default: 1 },
  images: [{ type: String }],
  location: { type: String },
  contactPhone: { type: String },
  isAvailable: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SparePart', SparePartSchema);
