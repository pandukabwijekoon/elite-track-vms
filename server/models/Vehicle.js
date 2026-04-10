const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  make: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Vehicle year is required'],
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  color: { type: String, trim: true },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'Other'],
    default: 'Petrol'
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic', 'CVT', 'Other'],
    default: 'Manual'
  },
  mileage: { type: Number, default: 0 },
  averageMonthlyMileage: { type: Number, default: 1000 },
  lastServiceDate: { type: Date },
  lastServiceMileage: { type: Number, default: 0 },
  serviceInterval: { type: Number, default: 12000 },
  image: { type: String, default: '' },
  fuelLogs: [{
    date: { type: Date, default: Date.now },
    liters: { type: Number, required: true },
    cost: { type: Number, required: true },
    mileage: { type: Number, required: true }
  }],
  documents: [{
    title: { type: String, required: true },
    type: { type: String, enum: ['Insurance', 'Revenue License', 'Emission Test', 'Other'], default: 'Other' },
    expiryDate: { type: Date },
    fileUrl: { type: String }
  }],
  notes: { type: String },
  serviceReminderSent: { type: Boolean, default: false },
  documentRemindersSent: [{ type: String }], // Array of document IDs already notified
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
