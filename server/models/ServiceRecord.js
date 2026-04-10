const mongoose = require('mongoose');

const ServiceRecordSchema = new mongoose.Schema({
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
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: [
      'Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Tune-Up',
      'Air Filter', 'Battery Replacement', 'Transmission Service',
      'Wheel Alignment', 'Coolant Flush', 'Spark Plugs',
      'AC Service', 'Electrical Repair', 'Body Work', 'Other'
    ]
  },
  serviceDate: {
    type: Date,
    required: [true, 'Service date is required'],
    default: Date.now
  },
  mileageAtService: { type: Number, required: true },
  cost: {
    laborCost: { type: Number, default: 0 },
    partsCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 }
  },
  serviceCenter: {
    name: { type: String },
    address: { type: String },
    phone: { type: String }
  },
  technicianName: { type: String },
  description: { type: String },
  nextServiceDue: {
    date: { type: Date },
    mileage: { type: Number }
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Scheduled'],
    default: 'Completed'
  },
  createdAt: { type: Date, default: Date.now }
});

// Auto-calc total cost
ServiceRecordSchema.pre('save', async function () {
  this.cost.totalCost = (this.cost.laborCost || 0) + (this.cost.partsCost || 0);
});

module.exports = mongoose.model('ServiceRecord', ServiceRecordSchema);
