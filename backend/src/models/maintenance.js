const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['reported', 'scheduled', 'in-progress', 'completed'], 
    default: 'reported' 
  },
  reportedDate: { type: Date, default: Date.now },
  scheduledDate: { type: Date },
  completedDate: { type: Date },
  cost: { type: Number, default: 0 },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);