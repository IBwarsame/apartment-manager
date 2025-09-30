const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'ended'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);